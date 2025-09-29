import emailjs from 'emailjs-com';
import jsPDF from 'jspdf';

// EmailJS configuration - These will be set from the configuration page
let EMAILJS_SERVICE_ID = '';
let EMAILJS_TEMPLATE_ID = '';
let EMAILJS_USER_ID = '';

const generatePDFBase64 = (letterContent, intern, letterType) => {
  try {
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
  } catch (error) {
    console.error('Error generating PDF:', error);
    throw new Error('Failed to generate PDF attachment');
  }
};

const validateConfiguration = () => {
  if (!EMAILJS_SERVICE_ID || !EMAILJS_TEMPLATE_ID || !EMAILJS_USER_ID) {
    throw new Error('EmailJS is not configured. Please configure EmailJS in the Email Setup section.');
  }
};

export const emailService = {
  sendOfferLetter: async (intern, letterContent) => {
    try {
      validateConfiguration();
      
      // Generate PDF as base64
      const pdfBase64 = generatePDFBase64(letterContent, intern, 'offer');
      const filename = `offer-letter-${intern.name.replace(/\s+/g, '-').toLowerCase()}.pdf`;
      
      // Prepare email parameters with all required fields
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
        filename: filename,
        // Additional template variables that might be expected
        company_name: 'Roriri Software Solution Pvt. Ltd',
        position: intern.position,
        start_date: new Date(intern.startDate).toLocaleDateString(),
        duration: intern.duration,
        stipend: intern.stipend
      };

      console.log('Sending email with params:', {
        ...emailParams,
        attachment: '[PDF_DATA]' // Don't log the actual PDF data
      });

      const response = await emailjs.send(
        EMAILJS_SERVICE_ID,
        EMAILJS_TEMPLATE_ID,
        emailParams,
        EMAILJS_USER_ID
      );

      console.log('Email sent successfully:', response);

      return {
        success: true,
        messageId: response.text,
        sentAt: new Date().toISOString()
      };
    } catch (error) {
      console.error('Email sending failed:', error);
      
      // Provide more specific error messages
      let errorMessage = 'Failed to send email';
      
      if (error.message.includes('not configured')) {
        errorMessage = error.message;
      } else if (error.text) {
        errorMessage = `EmailJS Error: ${error.text}`;
      } else if (error.status) {
        errorMessage = `Email service error (${error.status}): Please check your EmailJS configuration`;
      } else {
        errorMessage = `Email sending failed: ${error.message || 'Unknown error'}`;
      }
      
      throw new Error(errorMessage);
    }
  },

  sendCompletionCertificate: async (intern, letterContent) => {
    try {
      validateConfiguration();
      
      // Generate PDF as base64
      const pdfBase64 = generatePDFBase64(letterContent, intern, 'completion');
      const filename = `completion-certificate-${intern.name.replace(/\s+/g, '-').toLowerCase()}.pdf`;
      
      // Prepare email parameters with all required fields
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
        filename: filename,
        // Additional template variables that might be expected
        company_name: 'Roriri Software Solution Pvt. Ltd',
        position: intern.position,
        duration: intern.duration,
        completion_date: new Date().toLocaleDateString()
      };

      console.log('Sending completion certificate with params:', {
        ...emailParams,
        attachment: '[PDF_DATA]' // Don't log the actual PDF data
      });

      const response = await emailjs.send(
        EMAILJS_SERVICE_ID,
        EMAILJS_TEMPLATE_ID,
        emailParams,
        EMAILJS_USER_ID
      );

      console.log('Completion certificate sent successfully:', response);

      return {
        success: true,
        messageId: response.text,
        sentAt: new Date().toISOString()
      };
    } catch (error) {
      console.error('Email sending failed:', error);
      
      // Provide more specific error messages
      let errorMessage = 'Failed to send email';
      
      if (error.message.includes('not configured')) {
        errorMessage = error.message;
      } else if (error.text) {
        errorMessage = `EmailJS Error: ${error.text}`;
      } else if (error.status) {
        errorMessage = `Email service error (${error.status}): Please check your EmailJS configuration`;
      } else {
        errorMessage = `Email sending failed: ${error.message || 'Unknown error'}`;
      }
      
      throw new Error(errorMessage);
    }
  },

  // Configuration helper
  configure: (serviceId, templateId, userId) => {
    EMAILJS_SERVICE_ID = serviceId;
    EMAILJS_TEMPLATE_ID = templateId;
    EMAILJS_USER_ID = userId;
    
    // Initialize EmailJS with the user ID
    try {
      emailjs.init(userId);
      console.log('EmailJS configured successfully');
    } catch (error) {
      console.error('Failed to initialize EmailJS:', error);
      throw new Error('Failed to configure EmailJS');
    }
  },

  // Test configuration
  testConfiguration: async () => {
    try {
      validateConfiguration();
      
      // Send a test email with minimal parameters
      const testParams = {
        to_email: 'test@example.com',
        to_name: 'Test User',
        from_name: 'Roriri Software Solution Pvt. Ltd',
        subject: 'EmailJS Configuration Test',
        message: 'This is a test email to verify EmailJS configuration.',
        company_name: 'Roriri Software Solution Pvt. Ltd'
      };

      // This will fail but help us understand what parameters are expected
      await emailjs.send(
        EMAILJS_SERVICE_ID,
        EMAILJS_TEMPLATE_ID,
        testParams,
        EMAILJS_USER_ID
      );

      return { success: true };
    } catch (error) {
      console.error('Configuration test failed:', error);
      return { 
        success: false, 
        error: error.message || 'Configuration test failed' 
      };
    }
  },

  // Get current configuration status
  getConfigurationStatus: () => {
    return {
      isConfigured: !!(EMAILJS_SERVICE_ID && EMAILJS_TEMPLATE_ID && EMAILJS_USER_ID),
      serviceId: EMAILJS_SERVICE_ID ? '***' + EMAILJS_SERVICE_ID.slice(-4) : '',
      templateId: EMAILJS_TEMPLATE_ID ? '***' + EMAILJS_TEMPLATE_ID.slice(-4) : '',
      userId: EMAILJS_USER_ID ? '***' + EMAILJS_USER_ID.slice(-4) : ''
    };
  }
};