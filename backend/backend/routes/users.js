const express = require('express');
const User = require('../models/User');
const auth = require('../middleware/auth');

const router = express.Router();

// 👥 Get all employees (Manager only)
router.get('/employees', auth, async (req, res) => {
  try {
    if (req.user.role !== 'Manager') {
      return res.status(403).json({ message: 'Access denied' });
    }

    const employees = await User.find({ role: 'Employee' }).select('-password');
    res.json(employees);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
