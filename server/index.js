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
app.use(express.json());
app.use(express.static('public'));

// Email transporter configuration
const createTransporter = () => {
  return nodemailer.createTransporter({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS
    }
  });
};

// Generate HTML template for offer letter
const generateOfferLetterHTML = (internData) => {
  return `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Internship Offer Letter</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        
        body {
            font-family: 'Arial', sans-serif;
            line-height: 1.6;
            color: #333;
            background: #f5f5f5;
        }
        
        .letter-container {
            max-width: 800px;
            margin: 20px auto;
            background: white;
            box-shadow: 0 0 20px rgba(0,0,0,0.1);
            position: relative;
            overflow: hidden;
        }
        
        .header {
            background: linear-gradient(135deg, #1e90ff 0%, #0066cc 50%, #003d99 100%);
            height: 120px;
            position: relative;
            overflow: hidden;
        }
        
        .header::before {
            content: '';
            position: absolute;
            top: -50%;
            right: -10%;
            width: 200px;
            height: 200px;
            background: rgba(255,255,255,0.1);
            transform: rotate(45deg);
        }
        
        .header::after {
            content: '';
            position: absolute;
            top: -30%;
            right: 5%;
            width: 150px;
            height: 150px;
            background: rgba(255,255,255,0.05);
            transform: rotate(45deg);
        }
        
        .logo-section {
            position: absolute;
            top: 20px;
            left: 30px;
            z-index: 10;
        }
        
        .company-logo {
            color: white;
            font-size: 24px;
            font-weight: bold;
            margin-bottom: 5px;
        }
        
        .company-tagline {
            color: rgba(255,255,255,0.9);
            font-size: 12px;
            text-transform: uppercase;
            letter-spacing: 1px;
        }
        
        .content {
            padding: 40px;
        }
        
        .letter-title {
            text-align: center;
            color: #0066cc;
            font-size: 28px;
            font-weight: bold;
            margin-bottom: 30px;
            text-transform: uppercase;
            letter-spacing: 2px;
        }
        
        .date-section {
            text-align: right;
            margin-bottom: 30px;
            color: #666;
            font-size: 14px;
        }
        
        .greeting {
            font-size: 16px;
            margin-bottom: 20px;
            color: #333;
        }
        
        .main-content {
            font-size: 15px;
            line-height: 1.8;
            margin-bottom: 30px;
        }
        
        .details-box {
            background: linear-gradient(135deg, #f8f9ff 0%, #e6f2ff 100%);
            border-left: 4px solid #0066cc;
            padding: 25px;
            margin: 25px 0;
            border-radius: 0 8px 8px 0;
        }
        
        .details-title {
            color: #0066cc;
            font-size: 18px;
            font-weight: bold;
            margin-bottom: 15px;
            text-transform: uppercase;
            letter-spacing: 1px;
        }
        
        .detail-item {
            display: flex;
            margin-bottom: 10px;
            align-items: center;
        }
        
        .detail-label {
            font-weight: bold;
            color: #333;
            min-width: 120px;
            position: relative;
        }
        
        .detail-label::after {
            content: ':';
            margin-left: 5px;
        }
        
        .detail-value {
            color: #0066cc;
            font-weight: 600;
            margin-left: 10px;
        }
        
        .opportunities-section {
            background: #f9f9f9;
            padding: 20px;
            border-radius: 8px;
            margin: 20px 0;
        }
        
        .opportunities-title {
            color: #0066cc;
            font-size: 16px;
            font-weight: bold;
            margin-bottom: 15px;
        }
        
        .opportunities-list {
            list-style: none;
            padding: 0;
        }
        
        .opportunities-list li {
            padding: 8px 0;
            padding-left: 20px;
            position: relative;
            color: #555;
        }
        
        .opportunities-list li::before {
            content: '✓';
            position: absolute;
            left: 0;
            color: #0066cc;
            font-weight: bold;
        }
        
        .terms-section {
            background: #fff8f0;
            border: 1px solid #ffd700;
            padding: 20px;
            border-radius: 8px;
            margin: 20px 0;
        }
        
        .terms-title {
            color: #ff8c00;
            font-size: 16px;
            font-weight: bold;
            margin-bottom: 15px;
        }
        
        .terms-list {
            counter-reset: term-counter;
            list-style: none;
            padding: 0;
        }
        
        .terms-list li {
            counter-increment: term-counter;
            padding: 8px 0;
            padding-left: 30px;
            position: relative;
            color: #555;
        }
        
        .terms-list li::before {
            content: counter(term-counter) '.';
            position: absolute;
            left: 0;
            color: #ff8c00;
            font-weight: bold;
        }
        
        .closing {
            margin-top: 30px;
            line-height: 1.8;
        }
        
        .signature-section {
            margin-top: 50px;
            text-align: left;
        }
        
        .signature-line {
            margin-bottom: 8px;
            color: #333;
        }
        
        .footer {
            background: linear-gradient(135deg, #003d99 0%, #0066cc 50%, #1e90ff 100%);
            color: white;
            padding: 30px;
            text-align: center;
            position: relative;
            overflow: hidden;
        }
        
        .footer::before {
            content: '';
            position: absolute;
            bottom: -50%;
            left: -10%;
            width: 200px;
            height: 200px;
            background: rgba(255,255,255,0.1);
            transform: rotate(45deg);
        }
        
        .footer-content {
            position: relative;
            z-index: 10;
        }
        
        .company-name {
            font-size: 20px;
            font-weight: bold;
            margin-bottom: 10px;
        }
        
        .contact-info {
            display: flex;
            justify-content: center;
            gap: 30px;
            flex-wrap: wrap;
            margin-top: 15px;
        }
        
        .contact-item {
            display: flex;
            align-items: center;
            gap: 8px;
            font-size: 14px;
        }
        
        .contact-icon {
            width: 16px;
            height: 16px;
            fill: currentColor;
        }
        
        @media print {
            body {
                background: white;
            }
            
            .letter-container {
                box-shadow: none;
                margin: 0;
            }
        }
        
        @media (max-width: 768px) {
            .content {
                padding: 20px;
            }
            
            .contact-info {
                flex-direction: column;
                gap: 10px;
            }
        }
    </style>
</head>
<body>
    <div class="letter-container">
        <div class="header">
            <div class="logo-section">
                <div class="company-logo">RORIRI</div>
                <div class="company-tagline">SOFTWARE SOLUTIONS PVT. LTD.</div>
            </div>
        </div>
        
        <div class="content">
            <h1 class="letter-title">Internship Offer Letter</h1>
            
            <div class="date-section">
                Date: ${new Date(internData.date).toLocaleDateString('en-US', { 
                    year: 'numeric', 
                    month: 'long', 
                    day: 'numeric' 
                })}
            </div>
            
            <div class="greeting">
                Dear <strong>${internData.name}</strong>,
            </div>
            
            <div class="main-content">
                <p>We are delighted to offer you an internship position at <strong>Roriri Software Solutions Pvt. Ltd</strong>. After careful consideration of your qualifications and potential, we believe you will be a valuable addition to our dynamic team.</p>
            </div>
            
            <div class="details-box">
                <div class="details-title">Internship Details</div>
                <div class="detail-item">
                    <span class="detail-label">Position</span>
                    <span class="detail-value">${internData.position}</span>
                </div>
                <div class="detail-item">
                    <span class="detail-label">Start Date</span>
                    <span class="detail-value">${new Date(internData.startDate).toLocaleDateString('en-US', { 
                        year: 'numeric', 
                        month: 'long', 
                        day: 'numeric' 
                    })}</span>
                </div>
                <div class="detail-item">
                    <span class="detail-label">Duration</span>
                    <span class="detail-value">${internData.duration}</span>
                </div>
                <div class="detail-item">
                    <span class="detail-label">Location</span>
                    <span class="detail-value">${internData.location}</span>
                </div>
                <div class="detail-item">
                    <span class="detail-label">Stipend</span>
                    <span class="detail-value">${internData.stipend}</span>
                </div>
            </div>
            
            <div class="opportunities-section">
                <div class="opportunities-title">What You'll Gain During Your Internship:</div>
                <ul class="opportunities-list">
                    <li>Hands-on experience with cutting-edge technologies and industry best practices</li>
                    <li>Mentorship from experienced professionals and senior developers</li>
                    <li>Opportunity to work on real-world projects and contribute to meaningful solutions</li>
                    <li>Professional development workshops and skill enhancement sessions</li>
                    <li>Networking opportunities within the tech industry</li>
                    <li>Certificate of completion and performance evaluation</li>
                </ul>
            </div>
            
            <div class="terms-section">
                <div class="terms-title">Terms and Conditions:</div>
                <ol class="terms-list">
                    <li>This internship offer is contingent upon successful completion of any pre-joining requirements</li>
                    <li>Maintain strict confidentiality regarding all company information and projects</li>
                    <li>Regular attendance and professional conduct are expected throughout the internship</li>
                    <li>Compliance with company policies, procedures, and code of conduct</li>
                    <li>Participation in assigned projects and completion of deliverables as per timeline</li>
                </ol>
            </div>
            
            <div class="closing">
                <p>We are excited about the opportunity to have you join our team and contribute to our innovative projects. This internship will provide you with valuable industry experience and help accelerate your professional growth.</p>
                
                <p style="margin-top: 20px;">Please confirm your acceptance of this offer by responding to this email within <strong>7 days</strong> from the date of this letter.</p>
                
                <p style="margin-top: 20px;">Should you have any questions or require clarification on any aspect of this offer, please don't hesitate to contact our HR department.</p>
                
                <p style="margin-top: 20px;">We look forward to welcoming you to the Roriri family!</p>
            </div>
            
            <div class="signature-section">
                <div class="signature-line"><strong>Warm regards,</strong></div>
                <div class="signature-line" style="margin-top: 40px;"><strong>HR Department</strong></div>
                <div class="signature-line"><strong>Roriri Software Solutions Pvt. Ltd</strong></div>
                <div class="signature-line">Email: hr@roririsoft.com</div>
                <div class="signature-line">Phone: +91 96770 18421</div>
            </div>
        </div>
        
        <div class="footer">
            <div class="footer-content">
                <div class="company-name">RORIRI IT PARK</div>
                <div class="contact-info">
                    <div class="contact-item">
                        <svg class="contact-icon" viewBox="0 0 24 24">
                            <path d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z"/>
                        </svg>
                        +91 96770 18421
                    </div>
                    <div class="contact-item">
                        <svg class="contact-icon" viewBox="0 0 24 24">
                            <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/>
                        </svg>
                        services@roririsoft.com
                    </div>
                    <div class="contact-item">
                        <svg class="contact-icon" viewBox="0 0 24 24">
                            <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
                        </svg>
                        Nallanathapuram, Kalakad- 627 501
                    </div>
                    <div class="contact-item">
                        <svg class="contact-icon" viewBox="0 0 24 24">
                            <path d="M3.9 12c0-1.71 1.39-3.1 3.1-3.1h4V7H6.9C4.01 7 1.9 9.11 1.9 12s2.11 5 5 5h4v-1.9H6.9c-1.71 0-3.1-1.39-3.1-3.1zM8 13h8v-2H8v2zm9.1-6H13v1.9h4.1c1.71 0 3.1 1.39 3.1 3.1s-1.39 3.1-3.1 3.1H13V17h4.1c2.89 0 5-2.11 5-5s-2.11-5-5-5z"/>
                        </svg>
                        www.roririsoft.com
                    </div>
                </div>
            </div>
        </div>
    </div>
</body>
</html>`;
};

// Generate HTML template for completion certificate
const generateCompletionCertificateHTML = (internData) => {
  return `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Internship Completion Certificate</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        
        body {
            font-family: 'Arial', sans-serif;
            line-height: 1.6;
            color: #333;
            background: #f5f5f5;
        }
        
        .certificate-container {
            max-width: 800px;
            margin: 20px auto;
            background: white;
            box-shadow: 0 0 20px rgba(0,0,0,0.1);
            position: relative;
            overflow: hidden;
        }
        
        .header {
            background: linear-gradient(135deg, #1e90ff 0%, #0066cc 50%, #003d99 100%);
            height: 120px;
            position: relative;
            overflow: hidden;
        }
        
        .header::before {
            content: '';
            position: absolute;
            top: -50%;
            right: -10%;
            width: 200px;
            height: 200px;
            background: rgba(255,255,255,0.1);
            transform: rotate(45deg);
        }
        
        .logo-section {
            position: absolute;
            top: 20px;
            left: 30px;
            z-index: 10;
        }
        
        .company-logo {
            color: white;
            font-size: 24px;
            font-weight: bold;
            margin-bottom: 5px;
        }
        
        .company-tagline {
            color: rgba(255,255,255,0.9);
            font-size: 12px;
            text-transform: uppercase;
            letter-spacing: 1px;
        }
        
        .content {
            padding: 40px;
            text-align: center;
        }
        
        .certificate-title {
            color: #0066cc;
            font-size: 32px;
            font-weight: bold;
            margin-bottom: 20px;
            text-transform: uppercase;
            letter-spacing: 3px;
        }
        
        .certificate-subtitle {
            color: #666;
            font-size: 18px;
            margin-bottom: 40px;
            font-style: italic;
        }
        
        .main-text {
            font-size: 18px;
            line-height: 1.8;
            margin-bottom: 30px;
            color: #333;
        }
        
        .intern-name {
            color: #0066cc;
            font-size: 28px;
            font-weight: bold;
            margin: 20px 0;
            text-decoration: underline;
            text-decoration-color: #ffd700;
            text-underline-offset: 8px;
        }
        
        .details-section {
            background: linear-gradient(135deg, #f8f9ff 0%, #e6f2ff 100%);
            border-radius: 15px;
            padding: 30px;
            margin: 30px 0;
            text-align: left;
        }
        
        .details-grid {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 20px;
            margin-bottom: 20px;
        }
        
        .detail-item {
            display: flex;
            flex-direction: column;
        }
        
        .detail-label {
            font-weight: bold;
            color: #0066cc;
            font-size: 14px;
            margin-bottom: 5px;
            text-transform: uppercase;
            letter-spacing: 1px;
        }
        
        .detail-value {
            color: #333;
            font-size: 16px;
            font-weight: 600;
        }
        
        .achievements-section {
            background: #fff8f0;
            border-radius: 15px;
            padding: 25px;
            margin: 25px 0;
            text-align: left;
        }
        
        .achievements-title {
            color: #ff8c00;
            font-size: 18px;
            font-weight: bold;
            margin-bottom: 15px;
            text-align: center;
        }
        
        .achievements-list {
            list-style: none;
            padding: 0;
        }
        
        .achievements-list li {
            padding: 8px 0;
            padding-left: 25px;
            position: relative;
            color: #555;
        }
        
        .achievements-list li::before {
            content: '🏆';
            position: absolute;
            left: 0;
            font-size: 16px;
        }
        
        .closing-text {
            font-size: 16px;
            line-height: 1.8;
            margin: 30px 0;
            color: #333;
        }
        
        .date-section {
            margin: 40px 0;
            font-size: 16px;
            color: #666;
        }
        
        .signature-section {
            display: flex;
            justify-content: space-between;
            margin-top: 60px;
            text-align: center;
        }
        
        .signature-box {
            flex: 1;
            margin: 0 20px;
        }
        
        .signature-line {
            border-top: 2px solid #0066cc;
            margin-bottom: 10px;
            padding-top: 10px;
        }
        
        .signature-title {
            font-weight: bold;
            color: #0066cc;
        }
        
        .footer {
            background: linear-gradient(135deg, #003d99 0%, #0066cc 50%, #1e90ff 100%);
            color: white;
            padding: 30px;
            text-align: center;
            position: relative;
            overflow: hidden;
        }
        
        .footer-content {
            position: relative;
            z-index: 10;
        }
        
        .company-name {
            font-size: 20px;
            font-weight: bold;
            margin-bottom: 10px;
        }
        
        .contact-info {
            display: flex;
            justify-content: center;
            gap: 30px;
            flex-wrap: wrap;
            margin-top: 15px;
        }
        
        .contact-item {
            display: flex;
            align-items: center;
            gap: 8px;
            font-size: 14px;
        }
        
        @media (max-width: 768px) {
            .details-grid {
                grid-template-columns: 1fr;
            }
            
            .signature-section {
                flex-direction: column;
                gap: 30px;
            }
        }
    </style>
</head>
<body>
    <div class="certificate-container">
        <div class="header">
            <div class="logo-section">
                <div class="company-logo">RORIRI</div>
                <div class="company-tagline">SOFTWARE SOLUTIONS PVT. LTD.</div>
            </div>
        </div>
        
        <div class="content">
            <h1 class="certificate-title">Certificate of Completion</h1>
            <p class="certificate-subtitle">Internship Program</p>
            
            <div class="main-text">
                This is to certify that
            </div>
            
            <div class="intern-name">${internData.name}</div>
            
            <div class="main-text">
                has successfully completed the internship program at<br>
                <strong>Roriri Software Solutions Pvt. Ltd</strong>
            </div>
            
            <div class="details-section">
                <div class="details-grid">
                    <div class="detail-item">
                        <span class="detail-label">Position</span>
                        <span class="detail-value">${internData.position}</span>
                    </div>
                    <div class="detail-item">
                        <span class="detail-label">Duration</span>
                        <span class="detail-value">${internData.duration}</span>
                    </div>
                    <div class="detail-item">
                        <span class="detail-label">Start Date</span>
                        <span class="detail-value">${new Date(internData.startDate).toLocaleDateString('en-US', { 
                            year: 'numeric', 
                            month: 'long', 
                            day: 'numeric' 
                        })}</span>
                    </div>
                    <div class="detail-item">
                        <span class="detail-label">Completion Date</span>
                        <span class="detail-value">${new Date().toLocaleDateString('en-US', { 
                            year: 'numeric', 
                            month: 'long', 
                            day: 'numeric' 
                        })}</span>
                    </div>
                </div>
            </div>
            
            <div class="achievements-section">
                <div class="achievements-title">Performance Highlights</div>
                <ul class="achievements-list">
                    <li>Demonstrated exceptional learning ability and adaptability</li>
                    <li>Successfully completed all assigned projects and tasks</li>
                    <li>Showed excellent teamwork and collaboration skills</li>
                    <li>Maintained professional conduct throughout the internship</li>
                    <li>Contributed valuable insights and innovative solutions</li>
                </ul>
            </div>
            
            <div class="closing-text">
                We commend <strong>${internData.name}</strong> for their dedication, hard work, and positive contribution to our organization. The skills and experience gained during this internship will serve as a strong foundation for future professional endeavors.
            </div>
            
            <div class="date-section">
                Issued on: ${new Date(internData.date).toLocaleDateString('en-US', { 
                    year: 'numeric', 
                    month: 'long', 
                    day: 'numeric' 
                })}
            </div>
            
            <div class="signature-section">
                <div class="signature-box">
                    <div class="signature-line"></div>
                    <div class="signature-title">HR Manager</div>
                    <div>Roriri Software Solutions</div>
                </div>
                <div class="signature-box">
                    <div class="signature-line"></div>
                    <div class="signature-title">Director</div>
                    <div>Roriri Software Solutions</div>
                </div>
            </div>
        </div>
        
        <div class="footer">
            <div class="footer-content">
                <div class="company-name">RORIRI IT PARK</div>
                <div class="contact-info">
                    <div class="contact-item">+91 96770 18421</div>
                    <div class="contact-item">services@roririsoft.com</div>
                    <div class="contact-item">Nallanathapuram, Kalakad- 627 501</div>
                    <div class="contact-item">www.roririsoft.com</div>
                </div>
            </div>
        </div>
    </div>
</body>
</html>`;
};

// API Routes
app.post('/api/send-offer-letter', async (req, res) => {
  try {
    const { internData } = req.body;
    
    if (!internData) {
      return res.status(400).json({ error: 'Intern data is required' });
    }

    const transporter = createTransporter();
    const htmlContent = generateOfferLetterHTML(internData);

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: internData.email,
      subject: `Internship Offer Letter - ${internData.position} Position at Roriri Software Solutions`,
      html: htmlContent,
      attachments: [
        {
          filename: `offer-letter-${internData.name.replace(/\s+/g, '-').toLowerCase()}.html`,
          content: htmlContent,
          contentType: 'text/html'
        }
      ]
    };

    const info = await transporter.sendMail(mailOptions);
    
    res.json({
      success: true,
      messageId: info.messageId,
      message: 'Offer letter sent successfully'
    });

  } catch (error) {
    console.error('Error sending offer letter:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

app.post('/api/send-completion-certificate', async (req, res) => {
  try {
    const { internData } = req.body;
    
    if (!internData) {
      return res.status(400).json({ error: 'Intern data is required' });
    }

    const transporter = createTransporter();
    const htmlContent = generateCompletionCertificateHTML(internData);

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: internData.email,
      subject: `Internship Completion Certificate - ${internData.name}`,
      html: htmlContent,
      attachments: [
        {
          filename: `completion-certificate-${internData.name.replace(/\s+/g, '-').toLowerCase()}.html`,
          content: htmlContent,
          contentType: 'text/html'
        }
      ]
    };

    const info = await transporter.sendMail(mailOptions);
    
    res.json({
      success: true,
      messageId: info.messageId,
      message: 'Completion certificate sent successfully'
    });

  } catch (error) {
    console.error('Error sending completion certificate:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// Test email endpoint
app.post('/api/test-email', async (req, res) => {
  try {
    const transporter = createTransporter();
    
    const testMailOptions = {
      from: process.env.EMAIL_USER,
      to: process.env.EMAIL_USER,
      subject: 'Email Configuration Test - Roriri Internship System',
      html: `
        <div style="font-family: Arial, sans-serif; padding: 20px; background: #f5f5f5;">
          <div style="background: white; padding: 30px; border-radius: 10px; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #0066cc;">Email Configuration Test</h2>
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
    
    res.json({
      success: true,
      messageId: info.messageId,
      message: 'Test email sent successfully'
    });

  } catch (error) {
    console.error('Error sending test email:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'OK',
    message: 'Email service is running',
    timestamp: new Date().toISOString()
  });
});

app.listen(PORT, () => {
  console.log(`Email service running on port ${PORT}`);
  console.log(`Health check: http://localhost:${PORT}/api/health`);
});