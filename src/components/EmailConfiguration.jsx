import React, { useState, useEffect } from 'react';
import { Settings, Save, Mail, Key, CheckCircle } from 'lucide-react';
import { emailService } from '../utils/emailService';

function EmailConfiguration() {
  const [config, setConfig] = useState({
    serviceId: '',
    templateId: '',
    userId: ''
  });
  const [isConfigured, setIsConfigured] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    // Load saved configuration from localStorage
    const savedConfig = localStorage.getItem('emailjs_config');
    if (savedConfig) {
      const parsedConfig = JSON.parse(savedConfig);
      setConfig(parsedConfig);
      setIsConfigured(true);
      emailService.configure(parsedConfig.serviceId, parsedConfig.templateId, parsedConfig.userId);
    }
  }, []);

  const handleSave = async () => {
    setIsSaving(true);
    
    try {
      // Save configuration to localStorage
      localStorage.setItem('emailjs_config', JSON.stringify(config));
      
      // Configure the email service
      emailService.configure(config.serviceId, config.templateId, config.userId);
      
      setIsConfigured(true);
      
      // Show success message
      setTimeout(() => {
        alert('Email configuration saved successfully!');
      }, 500);
      
    } catch (error) {
      console.error('Error saving configuration:', error);
      alert('Error saving configuration. Please try again.');
    }
    
    setIsSaving(false);
  };

  const handleInputChange = (field, value) => {
    setConfig(prev => ({ ...prev, [field]: value }));
    setIsConfigured(false);
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="px-6 py-4 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <Settings className="h-6 w-6 text-blue-600" />
            <div>
              <h2 className="text-xl font-semibold text-gray-900">Email Configuration</h2>
              <p className="text-gray-600 mt-1">Configure EmailJS to send emails automatically</p>
            </div>
            {isConfigured && (
              <CheckCircle className="h-6 w-6 text-green-600" />
            )}
          </div>
        </div>

        <div className="p-6 space-y-6">
          {/* Instructions */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h3 className="font-semibold text-blue-900 mb-2">Setup Instructions:</h3>
            <ol className="text-sm text-blue-800 space-y-1 list-decimal list-inside">
              <li>Create a free account at <a href="https://www.emailjs.com/" target="_blank" rel="noopener noreferrer" className="underline">EmailJS.com</a></li>
              <li>Create an email service (Gmail, Outlook, etc.)</li>
              <li>Create an email template with variables: to_email, to_name, from_name, subject, message, attachment, filename</li>
              <li>Copy your Service ID, Template ID, and User ID below</li>
            </ol>
          </div>

          {/* Configuration Form */}
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Service ID *
              </label>
              <input
                type="text"
                value={config.serviceId}
                onChange={(e) => handleInputChange('serviceId', e.target.value)}
                placeholder="service_xxxxxxx"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Template ID *
              </label>
              <input
                type="text"
                value={config.templateId}
                onChange={(e) => handleInputChange('templateId', e.target.value)}
                placeholder="template_xxxxxxx"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                User ID *
              </label>
              <input
                type="text"
                value={config.userId}
                onChange={(e) => handleInputChange('userId', e.target.value)}
                placeholder="user_xxxxxxxxxxxxxxx"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>

          {/* Save Button */}
          <div className="flex justify-end">
            <button
              onClick={handleSave}
              disabled={isSaving || !config.serviceId || !config.templateId || !config.userId}
              className="bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white px-6 py-2 rounded-lg flex items-center space-x-2 transition-colors"
            >
              <Save className="h-4 w-4" />
              <span>{isSaving ? 'Saving...' : 'Save Configuration'}</span>
            </button>
          </div>

          {/* Status */}
          {isConfigured && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <div className="flex items-center space-x-2">
                <CheckCircle className="h-5 w-5 text-green-600" />
                <span className="text-green-800 font-medium">Email service is configured and ready!</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default EmailConfiguration;