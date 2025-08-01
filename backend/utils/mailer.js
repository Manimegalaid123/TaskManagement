const nodemailer = require('nodemailer');

// Create Gmail transporter with App Password
const createGmailTransporter = () => {
  return nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS // This should be an App Password, not your regular password
    }
  });
};

// Backup transporter using SMTP settings
const createBackupTransporter = () => {
  return nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 587,
    secure: false,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS
    },
    tls: {
      rejectUnauthorized: false
    }
  });
};

// Function to get working transporter
async function getTransporter() {
  // Try Gmail service first
  try {
    const transporter = createGmailTransporter();
    await transporter.verify();
    console.log('✅ Gmail transporter connected successfully');
    return transporter;
  } catch (error) {
    console.log('⚠️ Gmail service failed, trying backup SMTP...', error.message);
    
    // Try backup SMTP
    try {
      const backupTransporter = createBackupTransporter();
      await backupTransporter.verify();
      console.log('✅ Backup SMTP transporter connected');
      return backupTransporter;
    } catch (backupError) {
      console.error('❌ Both transporters failed:', backupError.message);
      throw new Error('Email service unavailable');
    }
  }
}

async function sendTaskAssignedMail(to, taskTitle, managerName) {
  try {
    console.log(`📧 Attempting to send email to: ${to}`);
    
    const transporter = await getTransporter();
    
    const mailOptions = {
      from: `"Task Manager System" <${process.env.EMAIL_USER}>`,
      to,
      subject: '📝 New Task Assigned - Action Required',
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <style>
            body { 
              font-family: Arial, sans-serif; 
              margin: 0; 
              padding: 20px; 
              background-color: #f4f4f4; 
            }
            .container { 
              max-width: 600px; 
              margin: 0 auto; 
              background: white; 
              padding: 30px; 
              border-radius: 10px; 
              box-shadow: 0 0 10px rgba(0,0,0,0.1); 
            }
            .header { 
              background: #4CAF50; 
              color: white; 
              padding: 20px; 
              text-align: center; 
              border-radius: 5px; 
              margin-bottom: 20px; 
            }
            .content { 
              line-height: 1.6; 
              color: #333; 
            }
            .task-details { 
              background: #f9f9f9; 
              padding: 15px; 
              border-radius: 5px; 
              margin: 15px 0; 
              border-left: 4px solid #4CAF50;
            }
            .footer { 
              margin-top: 30px; 
              padding-top: 20px; 
              border-top: 1px solid #eee; 
              color: #666; 
              font-size: 12px; 
            }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>📝 New Task Assignment</h1>
            </div>
            <div class="content">
              <h2>Hello!</h2>
              <p>You have been assigned a new task that requires your attention.</p>
              
              <div class="task-details">
                <h3>📋 Task Details:</h3>
                <p><strong>Task Title:</strong> ${taskTitle}</p>
                <p><strong>Assigned by:</strong> ${managerName}</p>
                <p><strong>Date:</strong> ${new Date().toLocaleDateString()}</p>
                <p><strong>Time:</strong> ${new Date().toLocaleTimeString()}</p>
              </div>
              
              <p>🔔 <strong>Action Required:</strong> Please log in to your dashboard to view the complete task details, deadline, and priority level.</p>
              
              <p>Make sure to update the task status as you progress and complete it within the specified deadline.</p>
            </div>
            
            <div class="footer">
              <p>This is an automated message from the Task Management System.</p>
              <p>If you have any questions, please contact your manager.</p>
            </div>
          </div>
        </body>
        </html>
      `,
      text: `
New Task Assignment

Hello!

You have been assigned a new task:

Task: ${taskTitle}
Assigned by: ${managerName}
Date: ${new Date().toLocaleDateString()}

Please check your dashboard for complete details.

Best regards,
Task Management System
      `
    };

    const result = await transporter.sendMail(mailOptions);
    console.log('✅ Email sent successfully to:', to);
    console.log('📧 Message ID:', result.messageId);
    
    return { success: true, messageId: result.messageId };
    
  } catch (error) {
    console.error('❌ Failed to send email to:', to);
    console.error('❌ Error details:', error.message);
    return { success: false, error: error.message };
  }
}

// Test email function
async function sendTestEmail() {
  console.log('🧪 Sending test email...');
  return await sendTaskAssignedMail(
    process.env.EMAIL_USER, // Send to yourself for testing
    'Test Task Assignment',
    'System Administrator'
  );
}

module.exports = { 
  sendTaskAssignedMail,
  sendTestEmail 
};