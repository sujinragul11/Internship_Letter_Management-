// Email service simulation
export const emailService = {
  sendOfferLetter: async (internData, letterContent) => {
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    const emailData = {
      to: internData.email,
      subject: `Your Internship Offer Letter – ${getCompanyName()}`,
      body: `Dear ${internData.name},

Please find attached your internship offer letter for the position of ${internData.position}.

We look forward to having you join our team!

Best regards,
HR Team
${getCompanyName()}`,
      attachment: 'offer-letter.pdf',
      sentAt: new Date().toISOString()
    };

    // In a real implementation, this would call an email service API
    console.log('Email sent:', emailData);
    
    return {
      success: true,
      messageId: generateMessageId(),
      sentAt: emailData.sentAt
    };
  },

  sendCompletionCertificate: async (internData, letterContent) => {
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    const emailData = {
      to: internData.email,
      subject: `Internship Completion Certificate – ${getCompanyName()}`,
      body: `Dear ${internData.name},

Congratulations on successfully completing your internship with us!

Please find attached your internship completion certificate.

We wish you all the best in your future endeavors.

Best regards,
HR Team
${getCompanyName()}`,
      attachment: 'completion-certificate.pdf',
      sentAt: new Date().toISOString()
    };

    console.log('Email sent:', emailData);
    
    return {
      success: true,
      messageId: generateMessageId(),
      sentAt: emailData.sentAt
    };
  }
};

const getCompanyName = () => {
  return 'TechCorp Solutions'; // This could be configurable
};

const generateMessageId = () => {
  return `msg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
};