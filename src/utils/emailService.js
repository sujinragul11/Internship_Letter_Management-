import emailjs from 'emailjs-com';
import jsPDF from 'jspdf';

// EmailJS configuration - You'll need to replace these with your actual EmailJS credentials
let EMAILJS_SERVICE_ID = 'your_service_id'; // Replace with your EmailJS service ID
let EMAILJS_TEMPLATE_ID = 'your_template_id'; // Replace with your EmailJS template ID
let EMAILJS_USER_ID = 'your_user_id'; // Replace with your EmailJS user ID

// Initialize EmailJS
emailjs.init(EMAILJS_USER_ID);

const generatePDFBase64 = (letterContent, intern, letterType) => {
  const doc = new jsPDF();
  
  // Set smaller font and styling for single page
  doc.setFont('times', 'normal');
  doc.setFontSize(9);
  
  // Add company header
  doc.setFontSize(12);
  doc.setFont('times', 'bold');
  doc.text('Roriri Software Solution Pvt. Ltd', 20, 20);
  doc.setFontSize(8);
  doc.setFont('times', 'normal');
  doc.text('Nallanathapuram, Kalakad', 20, 28);
  
  // Add a line separator
  doc.line(20, 32, 190, 32);
  
  // Process the letter content
  const lines = letterContent.split('\n');
  let yPosition = 40;
  
  lines.forEach((line) => {
    if (line.trim() === '') {
      yPosition += 3;
      return;
    }
    
    // Handle different text styles
    if (line.includes('[COMPANY LETTERHEAD]')) {
      return; // Skip this line as we already added header
    }
    
    if (line.startsWith('Date:') || line.includes('INTERNSHIP DETAILS:') || 
        line.includes('TERMS AND CONDITIONS:') || line.includes('PERFORMANCE SUMMARY:') ||
        line.includes('PROJECTS AND CONTRIBUTIONS:')) {
      doc.setFont('times', 'bold');
      doc.setFontSize(9);
    } else {
      doc.setFont('times', 'normal');
      doc.setFontSize(8);
    }
    
    // Handle long lines by splitting them
    const maxWidth = 175;
    const splitText = doc.splitTextToSize(line, maxWidth);
    
    splitText.forEach((textLine) => {
      // Ensure we don't exceed page boundaries - compress if needed
      if (yPosition > 280) {
        // Skip adding new page, just compress remaining content
        return;
      }
      doc.text(textLine, 20, yPosition);
      yPosition += 4;
    });
    
    yPosition += 1;
  });
  
  // Return PDF as base64 string
  return doc.output('datauristring').split(',')[1];
};

export const emailService = {
  sendOfferLetter: async (intern, letterContent) => {
    try {
      // Generate PDF as base64
      const pdfBase64 = generatePDFBase64(letterContent, intern, 'offer');
      const filename = `offer-letter-${intern.name.replace(/\s+/g, '-').toLowerCase()}.pdf`;
      
      const emailParams = {
        to_email: intern.email,
        to_name: intern.name,
        from_name: 'Roriri Software Solution Pvt. Ltd',
        subject: `Internship Offer Letter - ${intern.position} Position`,
        message: `Dear ${intern.name},

We are pleased to offer you an internship position as ${intern.position} at Roriri Software Solution Pvt. Ltd.

Please find your detailed offer letter attached to this email.

Internship Details:
• Position: ${intern.position}
• Start Date: ${new Date(intern.startDate).toLocaleDateString()}
• Duration: ${intern.duration}
• Stipend: ${intern.stipend}

We look forward to having you join our team!

Best regards,
HR Team
Roriri Software Solution Pvt. Ltd
Nallanathapuram, Kalakad`,
        attachment: pdfBase64,
        filename: filename
      };

      const response = await emailjs.send(
        EMAILJS_SERVICE_ID,
        EMAILJS_TEMPLATE_ID,
        emailParams
      );

      return {
        success: true,
        messageId: response.text,
        sentAt: new Date().toISOString()
      };
    } catch (error) {
      console.error('Email sending failed:', error);
      throw new Error('Failed to send email: ' + error.message);
    }
  },

  sendCompletionCertificate: async (intern, letterContent) => {
    try {
      // Generate PDF as base64
      const pdfBase64 = generatePDFBase64(letterContent, intern, 'completion');
      const filename = `completion-certificate-${intern.name.replace(/\s+/g, '-').toLowerCase()}.pdf`;
      
      const emailParams = {
        to_email: intern.email,
        to_name: intern.name,
        from_name: 'Roriri Software Solution Pvt. Ltd',
        subject: `Internship Completion Certificate - ${intern.name}`,
        message: `Dear ${intern.name},

Congratulations on successfully completing your internship with us!

We are pleased to provide you with your internship completion certificate attached to this email.

Internship Summary:
• Position: ${intern.position}
• Duration: ${intern.duration}
• Completion Date: ${new Date().toLocaleDateString()}

We wish you all the best in your future endeavors and hope the experience gained during your internship will be valuable for your career growth.

Best regards,
HR Team
Roriri Software Solution Pvt. Ltd
Nallanathapuram, Kalakad`,
        attachment: pdfBase64,
        filename: filename
      };

      const response = await emailjs.send(
        EMAILJS_SERVICE_ID,
        EMAILJS_TEMPLATE_ID,
        emailParams
      );

      return {
        success: true,
        messageId: response.text,
        sentAt: new Date().toISOString()
      };
    } catch (error) {
      console.error('Email sending failed:', error);
      throw new Error('Failed to send email: ' + error.message);
    }
  },

  // Configuration helper
  configure: (serviceId, templateId, userId) => {
    EMAILJS_SERVICE_ID = serviceId;
    EMAILJS_TEMPLATE_ID = templateId;
    EMAILJS_USER_ID = userId;
    emailjs.init(userId);
  }
};