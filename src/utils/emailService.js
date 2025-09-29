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
      
      // Prepare email parameters - simplified for Gmail
      const emailParams = {
        // Basic recipient info
        to_email: intern.email,
        to_name: intern.name,
        
        // Sender info (your Gmail)
        from_email: 'sujinragul728@gmail.com',
        from_name: 'Roriri Software Solution Pvt. Ltd',
        
        // Email content
        subject: `Internship Offer Letter - ${intern.position} Position`,
        message: letterContent, // The entire letter as the message body
        
        // PDF attachment
        attachment: pdfBase64,
        filename: filename,
        
        // Additional info
        intern_name: intern.name,
        intern_position: intern.position,
        company_name: 'Roriri Software Solution Pvt. Ltd'
      };

      console.log('Sending offer letter email to:', intern.email);
      console.log('Email parameters:', {
        to_email: emailParams.to_email,
        subject: emailParams.subject,
        from_email: emailParams.from_email,
        filename: emailParams.filename
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
      
      if (error.message && error.message.includes('not configured')) {
        errorMessage = error.message;
      } else if (error.text) {
        errorMessage = `EmailJS Error: ${error.text}`;
      } else if (error.status === 400) {
        errorMessage = 'Bad Request: Please check your EmailJS template configuration. Make sure all template variables match.';
      } else if (error.status === 401) {
        errorMessage = 'Unauthorized: Please check your EmailJS User ID and Service ID.';
      } else if (error.status === 403) {
        errorMessage = 'Forbidden: Please check your EmailJS configuration and permissions.';
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
      
      // Prepare email parameters - simplified for Gmail
      const emailParams = {
        // Basic recipient info
        to_email: intern.email,
        to_name: intern.name,
        
        // Sender info (your Gmail)
        from_email: 'sujinragul728@gmail.com',
        from_name: 'Roriri Software Solution Pvt. Ltd',
        
        // Email content
        subject: `Internship Completion Certificate - ${intern.name}`,
        message: letterContent, // The entire letter as the message body
        
        // PDF attachment
        attachment: pdfBase64,
        filename: filename,
        
        // Additional info
        intern_name: intern.name,
        intern_position: intern.position,
        company_name: 'Roriri Software Solution Pvt. Ltd'
      };

      console.log('Sending completion certificate email to:', intern.email);
      console.log('Email parameters:', {
        to_email: emailParams.to_email,
        subject: emailParams.subject,
        from_email: emailParams.from_email,
        filename: emailParams.filename
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
      
      if (error.message && error.message.includes('not configured')) {
        errorMessage = error.message;
      } else if (error.text) {
        errorMessage = `EmailJS Error: ${error.text}`;
      } else if (error.status === 400) {
        errorMessage = 'Bad Request: Please check your EmailJS template configuration. Make sure all template variables match.';
      } else if (error.status === 401) {
        errorMessage = 'Unauthorized: Please check your EmailJS User ID and Service ID.';
      } else if (error.status === 403) {
        errorMessage = 'Forbidden: Please check your EmailJS configuration and permissions.';
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
      console.log('Service ID:', serviceId);
      console.log('Template ID:', templateId);
      console.log('User ID:', userId);
    } catch (error) {
      console.error('Failed to initialize EmailJS:', error);
      throw new Error('Failed to configure EmailJS');
    }
  },

  // Test configuration with a simple test email
  testConfiguration: async (testEmail = 'test@example.com') => {
    try {
      validateConfiguration();
      
      // Send a test email with minimal parameters
      const testParams = {
        to_email: testEmail,
        to_name: 'Test User',
        from_email: 'sujinragul728@gmail.com',
        from_name: 'Roriri Software Solution Pvt. Ltd',
        subject: 'EmailJS Configuration Test',
        message: 'This is a test email to verify EmailJS configuration. If you receive this, your setup is working correctly!',
        intern_name: 'Test User',
        intern_position: 'Test Position',
        company_name: 'Roriri Software Solution Pvt. Ltd'
      };

      console.log('Testing configuration with params:', testParams);

      const response = await emailjs.send(
        EMAILJS_SERVICE_ID,
        EMAILJS_TEMPLATE_ID,
        testParams,
        EMAILJS_USER_ID
      );

      console.log('Test email sent successfully:', response);
      return { success: true, message: 'Test email sent successfully!' };
    } catch (error) {
      console.error('Configuration test failed:', error);
      
      let errorMessage = 'Configuration test failed';
      if (error.status === 400) {
        errorMessage = 'Template configuration error. Please check your EmailJS template variables.';
      } else if (error.status === 401) {
        errorMessage = 'Authentication failed. Please check your User ID and Service ID.';
      } else if (error.text) {
        errorMessage = `EmailJS Error: ${error.text}`;
      } else {
        errorMessage = error.message || 'Unknown error occurred';
      }
      
      return { 
        success: false, 
        error: errorMessage 
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