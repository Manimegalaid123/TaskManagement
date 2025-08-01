const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Connect MongoDB
mongoose.connect(process.env.MONGODB_URI)
  .then(() => {
    console.log('✅ MongoDB connected');
    console.log('📧 Email configuration loaded:');
    console.log('EMAIL_USER:', process.env.EMAIL_USER);
    console.log('EMAIL_PASS:', process.env.EMAIL_PASS ? '✅ Set' : '❌ Not set');
  })
  .catch(err => {
    console.error('❌ MongoDB connection error:', err);
  });

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/tasks', require('./routes/tasks'));
app.use('/api/users', require('./routes/users'));

// Test route for email functionality
app.post('/api/test-email', async (req, res) => {
  try {
    const sendTaskAssignedMail = require('./utils/mailer');
    await sendTaskAssignedMail(
      'test@example.com', 
      'Test User', 
      'Test Task', 
      'Test Manager'
    );
    res.json({ message: 'Test email sent successfully' });
  } catch (error) {
    console.error('❌ Test email failed:', error);
    res.status(500).json({ error: error.message });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
});