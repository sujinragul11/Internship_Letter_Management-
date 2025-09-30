import React, { useState, useEffect } from 'react';
import { Settings, Server, CheckCircle, AlertTriangle, TestTube, Play, Stop } from 'lucide-react';
import { backendEmailService } from '../utils/backendEmailService';

function BackendEmailConfiguration() {
  const [backendStatus, setBackendStatus] = useState('checking');
  const [isTestingEmail, setIsTestingEmail] = useState(false);
  const [testResult, setTestResult] = useState(null);
  const [lastHealthCheck, setLastHealthCheck] = useState(null);

  useEffect(() => {
    checkBackendHealth();
    // Check health every 30 seconds
    const interval = setInterval(checkBackendHealth, 30000);
    return () => clearInterval(interval);
  }, []);

  const checkBackendHealth = async () => {
    try {
      const health = await backendEmailService.checkHealth();
      setBackendStatus(health.success ? 'online' : 'offline');
      setLastHealthCheck(new Date().toLocaleTimeString());
    } catch (error) {
      setBackendStatus('offline');
      setLastHealthCheck(new Date().toLocaleTimeString());
    }
  };

  const handleTestEmail = async () => {
    setIsTestingEmail(true);
    setTestResult(null);

    try {
      const result = await backendEmailService.testConfiguration();
      setTestResult(result);
      
      if (result.success) {
        alert('Test email sent successfully! Check your inbox.');
      } else {
        alert(`Test failed: ${result.error}`);
      }
    } catch (error) {
      console.error('Test failed:', error);
      setTestResult({ success: false, error: error.message });
      alert(`Test failed: ${error.message}`);
    }
    
    setIsTestingEmail(false);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'online': return 'text-green-600';
      case 'offline': return 'text-red-600';
      case 'checking': return 'text-yellow-600';
      default: return 'text-gray-600';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'online': return <CheckCircle className="h-5 w-5 text-green-600" />;
      case 'offline': return <AlertTriangle className="h-5 w-5 text-red-600" />;
      case 'checking': return <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-yellow-600"></div>;
      default: return <Server className="h-5 w-5 text-gray-600" />;
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="px-6 py-4 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <Server className="h-6 w-6 text-blue-600" />
            <div>
              <h2 className="text-xl font-semibold text-gray-900">Backend Email Service</h2>
              <p className="text-gray-600 mt-1">Node.js email service with professional letter templates</p>
            </div>
            {getStatusIcon(backendStatus)}
          </div>
        </div>

        <div className="p-6 space-y-6">
          {/* Service Status */}
          <div className="bg-gray-50 rounded-lg p-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Service Status</h3>
              <button
                onClick={checkBackendHealth}
                className="text-blue-600 hover:text-blue-700 text-sm font-medium"
              >
                Refresh
              </button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-white p-4 rounded-lg border">
                <div className="flex items-center space-x-2">
                  {getStatusIcon(backendStatus)}
                  <span className={`font-medium ${getStatusColor(backendStatus)}`}>
                    {backendStatus === 'online' ? 'Online' : 
                     backendStatus === 'offline' ? 'Offline' : 'Checking...'}
                  </span>
                </div>
                <p className="text-sm text-gray-600 mt-1">Backend Service</p>
              </div>
              
              <div className="bg-white p-4 rounded-lg border">
                <div className="flex items-center space-x-2">
                  <Server className="h-5 w-5 text-blue-600" />
                  <span className="font-medium text-gray-900">localhost:3001</span>
                </div>
                <p className="text-sm text-gray-600 mt-1">Service Endpoint</p>
              </div>
              
              <div className="bg-white p-4 rounded-lg border">
                <div className="flex items-center space-x-2">
                  <CheckCircle className="h-5 w-5 text-green-600" />
                  <span className="font-medium text-gray-900">{lastHealthCheck || 'Never'}</span>
                </div>
                <p className="text-sm text-gray-600 mt-1">Last Health Check</p>
              </div>
            </div>
          </div>

          {/* Setup Instructions */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
            <h3 className="font-semibold text-blue-900 mb-4 flex items-center">
              <Settings className="h-5 w-5 mr-2" />
              Backend Setup Instructions
            </h3>
            <div className="space-y-4 text-sm text-blue-800">
              <div>
                <h4 className="font-semibold mb-2">1. Navigate to Server Directory:</h4>
                <code className="bg-blue-100 px-2 py-1 rounded">cd server</code>
              </div>
              
              <div>
                <h4 className="font-semibold mb-2">2. Install Dependencies:</h4>
                <code className="bg-blue-100 px-2 py-1 rounded">npm install</code>
              </div>
              
              <div>
                <h4 className="font-semibold mb-2">3. Configure Environment:</h4>
                <div className="bg-blue-100 p-3 rounded mt-2">
                  <p>Copy <code>.env.example</code> to <code>.env</code> and configure:</p>
                  <ul className="list-disc list-inside mt-2 space-y-1">
                    <li><code>EMAIL_USER</code> - Your Gmail address</li>
                    <li><code>EMAIL_PASS</code> - Your Gmail App Password</li>
                    <li><code>PORT</code> - Server port (default: 3001)</li>
                  </ul>
                </div>
              </div>
              
              <div>
                <h4 className="font-semibold mb-2">4. Start the Server:</h4>
                <code className="bg-blue-100 px-2 py-1 rounded">npm start</code>
              </div>
            </div>
          </div>

          {/* Gmail App Password Instructions */}
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
            <h3 className="font-semibold text-yellow-900 mb-4 flex items-center">
              <AlertTriangle className="h-5 w-5 mr-2" />
              Gmail App Password Setup
            </h3>
            <ol className="text-sm text-yellow-800 space-y-2 list-decimal list-inside">
              <li>Go to your Google Account settings</li>
              <li>Enable 2-Factor Authentication if not already enabled</li>
              <li>Go to Security → App passwords</li>
              <li>Generate a new app password for "Mail"</li>
              <li>Use the 16-character password in your .env file</li>
              <li><strong>Never use your regular Gmail password!</strong></li>
            </ol>
          </div>

          {/* Features */}
          <div className="bg-green-50 border border-green-200 rounded-lg p-6">
            <h3 className="font-semibold text-green-900 mb-4">✨ Features</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-green-800">
              <ul className="space-y-2">
                <li className="flex items-center">
                  <CheckCircle className="h-4 w-4 mr-2 text-green-600" />
                  Professional branded email templates
                </li>
                <li className="flex items-center">
                  <CheckCircle className="h-4 w-4 mr-2 text-green-600" />
                  Responsive HTML email design
                </li>
                <li className="flex items-center">
                  <CheckCircle className="h-4 w-4 mr-2 text-green-600" />
                  Automatic PDF attachment generation
                </li>
              </ul>
              <ul className="space-y-2">
                <li className="flex items-center">
                  <CheckCircle className="h-4 w-4 mr-2 text-green-600" />
                  Company branding and styling
                </li>
                <li className="flex items-center">
                  <CheckCircle className="h-4 w-4 mr-2 text-green-600" />
                  Reliable email delivery
                </li>
                <li className="flex items-center">
                  <CheckCircle className="h-4 w-4 mr-2 text-green-600" />
                  Error handling and logging
                </li>
              </ul>
            </div>
          </div>

          {/* Test Email */}
          <div className="flex justify-end space-x-3">
            <button
              onClick={handleTestEmail}
              disabled={isTestingEmail || backendStatus !== 'online'}
              className="bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white px-6 py-2 rounded-lg flex items-center space-x-2 transition-colors"
            >
              <TestTube className="h-4 w-4" />
              <span>{isTestingEmail ? 'Testing...' : 'Test Email Service'}</span>
            </button>
          </div>

          {/* Test Result */}
          {testResult && (
            <div className={`border rounded-lg p-4 ${
              testResult.success 
                ? 'bg-green-50 border-green-200' 
                : 'bg-red-50 border-red-200'
            }`}>
              <div className="flex items-center space-x-2">
                {testResult.success ? (
                  <CheckCircle className="h-5 w-5 text-green-600" />
                ) : (
                  <AlertTriangle className="h-5 w-5 text-red-600" />
                )}
                <span className={`font-medium ${
                  testResult.success ? 'text-green-800' : 'text-red-800'
                }`}>
                  {testResult.success ? 'Email Test Successful!' : 'Email Test Failed'}
                </span>
              </div>
              {testResult.message && (
                <p className={`text-sm mt-2 ${
                  testResult.success ? 'text-green-700' : 'text-red-700'
                }`}>
                  {testResult.message}
                </p>
              )}
              {!testResult.success && testResult.error && (
                <p className="text-red-700 text-sm mt-2">{testResult.error}</p>
              )}
            </div>
          )}

          {/* Status Messages */}
          {backendStatus === 'offline' && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <div className="flex items-center space-x-2">
                <AlertTriangle className="h-5 w-5 text-red-600" />
                <span className="text-red-800 font-medium">Backend Service Offline</span>
              </div>
              <p className="text-red-700 text-sm mt-2">
                Please start the Node.js backend server to enable email functionality.
              </p>
            </div>
          )}

          {backendStatus === 'online' && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <div className="flex items-center space-x-2">
                <CheckCircle className="h-5 w-5 text-green-600" />
                <span className="text-green-800 font-medium">Backend Service Online</span>
              </div>
              <p className="text-green-700 text-sm mt-2">
                Email service is ready to send professional letters with your company branding.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default BackendEmailConfiguration;