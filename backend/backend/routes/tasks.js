const express = require('express');
const Task = require('../models/Task');
const auth = require('../middleware/auth');

const router = express.Router();

// 📥 Get Tasks (Manager: All, Employee: Own)
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
    res.status(500).json({ message: 'Server error' });
  }
});

// ➕ Create Task (Only for Manager)
router.post('/', auth, async (req, res) => {
  try {
    if (req.user.role !== 'Manager') {
      return res.status(403).json({ message: 'Access denied' });
    }

    const { title, description, priority, deadline, assignedTo } = req.body;

    const task = new Task({
      title,
      description,
      priority,
      deadline,
      assignedTo,
      assignedBy: req.user.userId
    });

    await task.save();

    res.json(task);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// 🔄 Update Task Status (Employee)
router.patch('/:id/status', auth, async (req, res) => {
  try {
    const { status } = req.body;

    const task = await Task.findById(req.params.id);

    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    // Employee can only update their own task
    if (req.user.role === 'Employee' && task.assignedTo.toString() !== req.user.userId) {
      return res.status(403).json({ message: 'Access denied' });
    }

    task.status = status;
    task.updatedAt = new Date();

    await task.save();
    res.json(task);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// ❌ Delete Task (Only Manager)
router.delete('/:id', auth, async (req, res) => {
  try {
    if (req.user.role !== 'Manager') {
      return res.status(403).json({ message: 'Access denied' });
    }

    await Task.findByIdAndDelete(req.params.id);
    res.json({ message: 'Task deleted' });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
