// Backend email service that communicates with Node.js server
const API_BASE_URL = 'http://localhost:3001/api';

export const backendEmailService = {
  // Send offer letter via backend
  sendOfferLetter: async (internData) => {
    try {
      console.log('Sending offer letter via backend for:', internData.name);
      
      const response = await fetch(`${API_BASE_URL}/send-offer-letter`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ internData })
      });

      const result = await response.json();
      
      if (!response.ok) {
        throw new Error(result.error || 'Failed to send offer letter');
      }

      console.log('Offer letter sent successfully:', result);
      
      return {
        success: true,
        messageId: result.messageId,
        sentAt: new Date().toISOString(),
        message: result.message
      };

    } catch (error) {
      console.error('Backend email service error:', error);
      throw new Error(`Failed to send offer letter: ${error.message}`);
    }
  },

  // Send completion certificate via backend
  sendCompletionCertificate: async (internData) => {
    try {
      console.log('Sending completion certificate via backend for:', internData.name);
      
      const response = await fetch(`${API_BASE_URL}/send-completion-certificate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ internData })
      });

      const result = await response.json();
      
      if (!response.ok) {
        throw new Error(result.error || 'Failed to send completion certificate');
      }

      console.log('Completion certificate sent successfully:', result);
      
      return {
        success: true,
        messageId: result.messageId,
        sentAt: new Date().toISOString(),
        message: result.message
      };

    } catch (error) {
      console.error('Backend email service error:', error);
      throw new Error(`Failed to send completion certificate: ${error.message}`);
    }
  },

  // Test email configuration
  testConfiguration: async () => {
    try {
      console.log('Testing email configuration...');
      
      const response = await fetch(`${API_BASE_URL}/test-email`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        }
      });

      const result = await response.json();
      
      if (!response.ok) {
        throw new Error(result.error || 'Email test failed');
      }

      console.log('Email test successful:', result);
      
      return {
        success: true,
        message: result.message
      };

    } catch (error) {
      console.error('Email test failed:', error);
      return {
        success: false,
        error: error.message
      };
    }
  },

  // Check backend health
  checkHealth: async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/health`);
      const result = await response.json();
      
      return {
        success: response.ok,
        status: result.status,
        message: result.message
      };

    } catch (error) {
      console.error('Backend health check failed:', error);
      return {
        success: false,
        error: 'Backend service is not available'
      };
    }
  },

  // Get configuration status
  getConfigurationStatus: () => {
    return {
      isConfigured: true, // Backend handles configuration
      serviceType: 'Node.js Backend Service',
      endpoint: API_BASE_URL
    };
  }
};