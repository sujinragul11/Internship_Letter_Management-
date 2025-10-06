const express = require('express');
const nodemailer = require('nodemailer');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.static('public'));

// Email transporter configuration
const createTransporter = () => {
  if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
    throw new Error('Email credentials are not configured in environment variables');
  }

  console.log('Creating email transporter for:', process.env.EMAIL_USER);
  
  return nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS
    }
  });
};

// Generate HTML template for offer letter - YOUR EXACT TEMPLATE
const generateOfferLetterHTML = (internData) => {
  return `
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Internship Offer Letter</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            line-height: 1.6;
            color: #333;
            max-width: 800px;
            margin: 0 auto;
            padding: 20px;
            background: #ffffff;
        }
        .header {
            text-align: center;
            margin-bottom: 30px;
            border-bottom: 2px solid #0066cc;
            padding-bottom: 20px;
        }
        .company-name {
            font-size: 24px;
            font-weight: bold;
            color: #0066cc;
            margin-bottom: 5px;
        }
        .company-tagline {
            font-size: 16px;
            color: #666;
            font-weight: bold;
        }
        .letter-title {
            text-align: center;
            font-size: 20px;
            font-weight: bold;
            margin: 25px 0;
            color: #0066cc;
        }
        .content-section {
            margin: 20px 0;
        }
        .details-section {
            background: #f8f9fa;
            padding: 20px;
            border-radius: 8px;
            margin: 20px 0;
            border-left: 4px solid #0066cc;
        }
        .signature-section {
            margin-top: 40px;
            padding-top: 20px;
            border-top: 1px solid #ddd;
        }
        .footer {
            text-align: center;
            margin-top: 40px;
            padding: 20px;
            background: #f8f9fa;
            border-radius: 8px;
            font-size: 14px;
            color: #666;
        }
        strong {
            color: #0066cc;
        }
    </style>
</head>
<body>
    <div class="header">
        <div class="company-name">Roriri</div>
        <div class="company-tagline">SOFTWARE SOLUTIONS</div>
    </div>

    <div class="letter-title">INTERNSHIP OFFER LETTER</div>

    <div class="content-section">
        <p><strong>Date:</strong> ${new Date(internData.date).toLocaleDateString('en-US', { 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
        })}</p>
        
        <p><strong>Dear ${internData.name},</strong></p>
        
        <p>We are pleased to offer you an <strong>Internship opportunity at RORIRI Software Solutions</strong>. We appreciate your enthusiasm and potential and believe this internship will provide you with valuable industry experience.</p>
    </div>

    <div class="details-section">
        <h3 style="color: #0066cc; margin-top: 0;">Internship Details:</h3>
        <p><strong>Position:</strong> ${internData.position}</p>
        <p><strong>Start Date:</strong> ${new Date(internData.startDate).toLocaleDateString('en-US', { 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
        })}</p>
        <p><strong>Duration:</strong> ${internData.duration}</p>
        <p><strong>Location:</strong> ${internData.location}</p>
        <p><strong>Stipend:</strong> ${internData.stipend}</p>
    </div>

    <div class="content-section">
        <h3 style="color: #0066cc;">Internship Terms & Future Opportunities:</h3>
        <p>- During the internship, you will work on <strong>${internData.position}.</strong></p>
        <p>- Your <strong>performance will be evaluated</strong> during the internship period.</p>
        <p>- Upon successful completion of the internship, based on your performance and company requirements, we may offer you a <strong>full-time position</strong> with a fixed salary.</p>
        
        <p>We are excited to have you as part of our team and look forward to seeing your contributions.</p>
    </div>

    <div class="content-section">
        <hr style="margin: 30px 0; border: none; border-top: 1px solid #ddd;">
        <p style="text-align: center; font-style: italic;"><strong>Congratulations once again, and welcome to Roriri Software Solution Pvt.Ltd,</strong></p>
    </div>

    <div class="signature-section">
        <p><strong>Best regards,</strong></p>
        <p><strong>Ragupathi</strong></p>
        <p><strong>Chief Executive Officer (CEO)</strong></p>
        <p><strong>Roriri Software Solutions.</strong></p>
    </div>

    <div class="footer">
        <hr style="margin: 20px 0;">
        <p><strong>RORIRI IT PARK,</strong></p>
        <p>+91 96770 18421</p>
        <p>services@roririsoft.com</p>
    </div>
</body>
</html>`;
};

// Generate HTML template for completion certificate - YOUR EXACT TEMPLATE
const generateCompletionCertificateHTML = (internData) => {
  // Calculate end date based on start date and duration
  const startDate = new Date(internData.startDate);
  let endDate = new Date(startDate);
  
  // Parse duration to calculate end date
  if (internData.duration.includes('Month')) {
    const months = parseInt(internData.duration);
    endDate.setMonth(startDate.getMonth() + months);
  } else if (internData.duration.includes('Week')) {
    const weeks = parseInt(internData.duration);
    endDate.setDate(startDate.getDate() + (weeks * 7));
  }
  
  return `
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Internship Completion Letter</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            line-height: 1.6;
            color: #333;
            max-width: 800px;
            margin: 0 auto;
            padding: 20px;
            background: #ffffff;
        }
        .header {
            text-align: center;
            margin-bottom: 30px;
            border-bottom: 2px solid #28a745;
            padding-bottom: 20px;
        }
        .company-name {
            font-size: 24px;
            font-weight: bold;
            color: #28a745;
            margin-bottom: 5px;
        }
        .company-tagline {
            font-size: 16px;
            color: #666;
            font-weight: bold;
        }
        .letter-title {
            text-align: center;
            font-size: 20px;
            font-weight: bold;
            margin: 25px 0;
            color: #28a745;
        }
        .content-section {
            margin: 20px 0;
        }
        .highlight {
            background: #f8f9fa;
            padding: 15px;
            border-radius: 8px;
            margin: 15px 0;
            border-left: 4px solid #28a745;
        }
        .signature-section {
            margin-top: 40px;
            padding-top: 20px;
            border-top: 1px solid #ddd;
        }
        .footer {
            text-align: center;
            margin-top: 40px;
            padding: 20px;
            background: #f8f9fa;
            border-radius: 8px;
            font-size: 14px;
            color: #666;
        }
        strong {
            color: #28a745;
        }
        ul {
            padding-left: 20px;
        }
        li {
            margin-bottom: 5px;
        }
    </style>
</head>
<body>
    <div class="header">
        <div class="company-name">Roriri</div>
        <div class="company-tagline">SOFTWARE SOLUTIONS</div>
    </div>

    <div class="letter-title">INTERNSHIP COMPLETION LETTER</div>

    <div class="content-section">
        <p><strong>Dear ${internData.name},</strong></p>
        
        <p>We are Delighted to acknowledge the Successful completion of your Internship with <strong>Roriri Software Solutions Pvt Ltd. Your Internship, which ran from ${new Date(internData.startDate).toLocaleDateString('en-US', { 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
        })} to ${endDate.toLocaleDateString('en-US', { 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
        })} has come to a successful close</strong>, and we are pleased to report that you achieved a perfect attendance record throughout this period.</p>
        
        <p>Your commitment to your role and your consistent presence at the office have been truly commendable. Your contributions to our <strong>${internData.position}</strong> were highly valued, and your dedication and work ethic have not gone unnoticed.</p>
        
        <p>It has been a pleasure having you with us as an intern. You brought a fresh perspective to our team, and we hope that your time here was both insightful and rewarding.</p>
        
        <div class="highlight">
            <p><strong>Thank you once again for your exceptional performance and dedication during this ${internData.duration} of Internship Period.</strong></p>
        </div>
    </div>

    <div class="signature-section">
        <ul style="list-style: none; padding: 0;">
            <li><strong>Best regards,</strong></li>
            <li><strong>Ragupathi R,</strong></li>
            <li><strong>Chief Executive Officer (CEO),</strong></li>
            <li><strong>Roriri Software Solutions Pvt Ltd</strong></li>
        </ul>
    </div>

    <div class="footer">
        <hr style="margin: 20px 0;">
        <p>+91 73389 41579</p>
        <p>+91 96770 18421</p>
        <p>www.roririsoft.com</p>
        <p>services@roririsoft.com</p>
        <p><strong>RORIRI IT PARK</strong></p>
        <p>Kubakod, Tirunehyali - 627502</p>
    </div>
</body>
</html>`;
};

// API Routes with better error handling
app.post('/api/send-offer-letter', async (req, res) => {
  try {
    const { internData } = req.body;
    
    if (!internData || !internData.email) {
      return res.status(400).json({ 
        success: false,
        error: 'Intern data and email are required' 
      });
    }

    console.log('Attempting to send offer letter to:', internData.email);
    
    const transporter = createTransporter();
    const finalHtmlContent = generateOfferLetterHTML(internData);

    const mailOptions = {
      from: {
        name: 'Roriri Software Solutions',
        address: process.env.EMAIL_USER
      },
      to: internData.email,
      subject: `Internship Offer Letter - ${internData.position} Position`,
      html: finalHtmlContent,
    };

    console.log('Sending email...');
    const info = await transporter.sendMail(mailOptions);
    
    console.log(`✅ Offer letter sent successfully to ${internData.email}`);
    
    res.json({
      success: true,
      messageId: info.messageId,
      message: 'Offer letter sent successfully'
    });

  } catch (error) {
    console.error('❌ Error sending offer letter:', error.message);
    res.status(500).json({
      success: false,
      error: `Failed to send email: ${error.message}`
    });
  }
});

app.post('/api/send-completion-certificate', async (req, res) => {
  try {
    const { internData } = req.body;
    
    if (!internData || !internData.email) {
      return res.status(400).json({ 
        success: false,
        error: 'Intern data and email are required' 
      });
    }

    console.log('Attempting to send completion certificate to:', internData.email);
    
    const transporter = createTransporter();
    const finalHtmlContent = generateCompletionCertificateHTML(internData);

    const mailOptions = {
      from: {
        name: 'Roriri Software Solutions',
        address: process.env.EMAIL_USER
      },
      to: internData.email,
      subject: `Internship Completion Letter - ${internData.name}`,
      html: finalHtmlContent,
    };

    console.log('Sending completion certificate...');
    const info = await transporter.sendMail(mailOptions);
    
    console.log(`✅ Completion certificate sent successfully to ${internData.email}`);
    
    res.json({
      success: true,
      messageId: info.messageId,
      message: 'Completion certificate sent successfully'
    });

  } catch (error) {
    console.error('❌ Error sending completion certificate:', error.message);
    res.status(500).json({
      success: false,
      error: `Failed to send email: ${error.message}`
    });
  }
});

// Test email endpoint with better validation
app.post('/api/test-email', async (req, res) => {
  try {
    console.log('Testing email configuration...');
    
    const transporter = createTransporter();
    
    const testMailOptions = {
      from: {
        name: 'Roriri Software Solutions',
        address: process.env.EMAIL_USER
      },
      to: process.env.EMAIL_USER,
      subject: 'Email Configuration Test - Roriri Internship System',
      html: `
        <div style="font-family: Arial, sans-serif; padding: 20px; background: #f5f5f5;">
          <div style="background: white; padding: 30px; border-radius: 10px; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #0066cc;">✅ Email Configuration Test - SUCCESS</h2>
            <p>This is a test email to verify that your email configuration is working correctly.</p>
            <p>If you receive this email, your Node.js email service is properly configured!</p>
            <hr style="margin: 20px 0;">
            <p style="color: #666; font-size: 14px;">
              Sent from Roriri Internship Management System<br>
              ${new Date().toLocaleString()}
            </p>
          </div>
        </div>
      `
    };

    const info = await transporter.sendMail(testMailOptions);
    
    console.log('✅ Test email sent successfully');
    
    res.json({
      success: true,
      messageId: info.messageId,
      message: 'Test email sent successfully'
    });

  } catch (error) {
    console.error('❌ Error sending test email:', error.message);
    res.status(500).json({
      success: false,
      error: `Test email failed: ${error.message}`
    });
  }
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  const emailConfigured = !!(process.env.EMAIL_USER && process.env.EMAIL_PASS);
  
  res.json({
    status: 'OK',
    message: 'Email service is running',
    timestamp: new Date().toISOString(),
    service: 'Roriri Internship Email Service',
    version: '1.0.0',
    emailConfigured: emailConfigured,
    emailUser: emailConfigured ? process.env.EMAIL_USER : 'Not configured'
  });
});

// Error handling middleware
app.use((error, req, res, next) => {
  console.error('Unhandled error:', error);
  res.status(500).json({
    success: false,
    error: 'Internal server error'
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    error: 'Endpoint not found',
    path: req.path,
    method: req.method
  });
});

app.listen(PORT, () => {
  console.log(`🚀 Email service running on port ${PORT}`);
  console.log(`📧 Health check: http://localhost:${PORT}/api/health`);
  
  if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
    console.log('❌ WARNING: Email credentials not configured in .env file');
    console.log('   Please set EMAIL_USER and EMAIL_PASS in your .env file');
  } else {
    console.log(`✅ Email configured for: ${process.env.EMAIL_USER}`);
  }
});