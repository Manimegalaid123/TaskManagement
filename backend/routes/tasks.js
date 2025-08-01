const express = require('express');
const Task = require('../models/Task');
const User = require('../models/User');
const auth = require('../middleware/auth');
const { sendTaskAssignedMail } = require('../utils/mailer'); // Fixed import

const router = express.Router();

// 📥 GET ALL TASKS (Manager gets all, Employee gets only their tasks)
router.get('/', auth, async (req, res) => {
  try {
    let tasks;
    if (req.user.role === 'Manager') {
      tasks = await Task.find()
        .populate('assignedTo', 'name email')
        .populate('assignedBy', 'name email');
    } else {
      tasks = await Task.find({ assignedTo: req.user.userId })
        .populate('assignedBy', 'name email');
    }

    res.json(tasks);
  } catch (err) {
    console.error('❌ Fetch Tasks Error:', err);
    res.status(500).json({ message: 'Error loading tasks' });
  }
});

// ➕ CREATE TASK (Only Manager can assign)
router.post('/', auth, async (req, res) => {
  try {
    if (req.user.role !== 'Manager') {
      return res.status(403).json({ message: 'Only managers can assign tasks' });
    }

    const { title, description, priority, deadline, assignedTo } = req.body;

    if (!title || !assignedTo) {
      return res.status(400).json({ message: 'Title and assignedTo are required' });
    }

    const employee = await User.findById(assignedTo);
    const manager = await User.findById(req.user.userId);

    if (!employee || !manager) {
      return res.status(404).json({ message: 'User not found' });
    }

    const task = new Task({
      title,
      description,
      priority,
      deadline,
      assignedTo: employee._id,
      assignedBy: manager._id,
    });

    await task.save();
    console.log('✅ Task created:', task.title);

    // Send Email
    try {
      const result = await sendTaskAssignedMail(employee.email, title, manager.name);
      if (result.success) {
        console.log('✅ Email sent to:', employee.email);
      } else {
        console.warn('⚠️ Email failed:', result.error);
      }
    } catch (emailErr) {
      console.error('❌ Email Error:', emailErr);
    }

    const populated = await Task.findById(task._id)
      .populate('assignedTo', 'name email')
      .populate('assignedBy', 'name email');

    res.status(201).json(populated);
  } catch (err) {
    console.error('❌ Create Task Error:', err);
    res.status(500).json({ message: 'Server error during task creation' });
  }
});

// 🔁 UPDATE STATUS (Only assigned employee)
router.patch('/:id/status', auth, async (req, res) => {
  try {
    const { status } = req.body;
    const task = await Task.findById(req.params.id);

    if (!task) return res.status(404).json({ message: 'Task not found' });

    if (req.user.role === 'Employee' && task.assignedTo.toString() !== req.user.userId) {
      return res.status(403).json({ message: 'You can only update your own tasks' });
    }

    task.status = status;
    task.updatedAt = new Date();
    await task.save();

    res.json(task);
  } catch (err) {
    console.error('❌ Update Task Status Error:', err);
    res.status(500).json({ message: 'Failed to update status' });
  }
});

// ❌ DELETE TASK (Only Managers)
router.delete('/:id', auth, async (req, res) => {
  try {
    if (req.user.role !== 'Manager') {
      return res.status(403).json({ message: 'Only managers can delete tasks' });
    }

    await Task.findByIdAndDelete(req.params.id);
    res.json({ message: 'Task deleted' });
  } catch (err) {
    console.error('❌ Delete Task Error:', err);
    res.status(500).json({ message: 'Failed to delete task' });
  }
});

module.exports = router;
