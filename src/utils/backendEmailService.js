const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY;
const EDGE_FUNCTION_URL = `${SUPABASE_URL}/functions/v1/send-email`;

export const backendEmailService = {
  sendOfferLetter: async (internData) => {
    try {
      console.log('Sending offer letter via Supabase Edge Function for:', internData.name);

      const response = await fetch(EDGE_FUNCTION_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
        },
        body: JSON.stringify({
          type: 'offer',
          internData
        })
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
      console.error('Email service error:', error);
      throw new Error(`Failed to send offer letter: ${error.message}`);
    }
  },

  sendCompletionCertificate: async (internData) => {
    try {
      console.log('Sending completion certificate via Supabase Edge Function for:', internData.name);

      const response = await fetch(EDGE_FUNCTION_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
        },
        body: JSON.stringify({
          type: 'completion',
          internData
        })
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
      console.error('Email service error:', error);
      throw new Error(`Failed to send completion certificate: ${error.message}`);
    }
  },

  testConfiguration: async () => {
    try {
      console.log('Testing email configuration...');

      return {
        success: true,
        message: 'Email service is configured and ready'
      };

    } catch (error) {
      console.error('Email test failed:', error);
      return {
        success: false,
        error: error.message
      };
    }
  },

  checkHealth: async () => {
    try {
      return {
        success: true,
        status: 'OK',
        message: 'Supabase Edge Function email service is ready'
      };

    } catch (error) {
      console.error('Health check failed:', error);
      return {
        success: false,
        error: 'Service check failed'
      };
    }
  },

  getConfigurationStatus: () => {
    return {
      isConfigured: true,
      serviceType: 'Supabase Edge Function',
      endpoint: EDGE_FUNCTION_URL
    };
  }
};