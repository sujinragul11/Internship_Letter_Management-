import React, { useState } from 'react';
import { ArrowLeft, Download, Mail, Send, FileText } from 'lucide-react';
import { letterTemplates } from '../utils/letterTemplates';
import { storageUtils } from '../utils/storage';

function LetterPreview({ intern, letterType, onBack, onLetterGenerated }) {
  const [emailSent, setEmailSent] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);

  const generateLetterContent = () => {
    const template = letterTemplates[letterType];
    return template
      .replace(/\{\{name\}\}/g, intern.name)
      .replace(/\{\{date\}\}/g, new Date(intern.date).toLocaleDateString('en-US', { 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
      }))
      .replace(/\{\{position\}\}/g, intern.position)
      .replace(/\{\{start_date\}\}/g, new Date(intern.startDate).toLocaleDateString('en-US', { 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
      }))
      .replace(/\{\{duration\}\}/g, intern.duration)
      .replace(/\{\{location\}\}/g, intern.location)
      .replace(/\{\{stipend\}\}/g, intern.stipend);
  };

  const handleDownload = async () => {
    setIsGenerating(true);
    
    // Simulate PDF generation
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    const letterData = {
      id: Date.now().toString(),
      internId: intern.id,
      letterType,
      content: generateLetterContent(),
      generatedAt: new Date().toISOString(),
      emailSent: false,
    };

    storageUtils.saveLetter(letterData);
    onLetterGenerated();
    
    // Simulate download
    alert(`${letterType === 'offer' ? 'Offer' : 'Completion'} letter downloaded as PDF!`);
    setIsGenerating(false);
  };

  const handleSendEmail = async () => {
    setIsGenerating(true);
    
    // Simulate email sending
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    const letterData = {
      id: Date.now().toString(),
      internId: intern.id,
      letterType,
      content: generateLetterContent(),
      generatedAt: new Date().toISOString(),
      emailSent: true,
    };

    storageUtils.saveLetter(letterData);
    onLetterGenerated();
    
    setEmailSent(true);
    setIsGenerating(false);
    
    setTimeout(() => setEmailSent(false), 3000);
  };

  const letterContent = generateLetterContent();

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <button
            onClick={onBack}
            className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Back to Dashboard</span>
          </button>
          <div className="h-6 w-px bg-gray-300"></div>
          <h2 className="text-2xl font-bold text-gray-900">
            {letterType === 'offer' ? 'Offer Letter' : 'Completion Letter'} Preview
          </h2>
        </div>
        
        <div className="flex space-x-3">
          <button
            onClick={handleDownload}
            disabled={isGenerating}
            className="bg-slate-600 hover:bg-slate-700 disabled:bg-slate-400 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors"
          >
            <Download className="h-4 w-4" />
            <span>{isGenerating ? 'Generating...' : 'Download PDF'}</span>
          </button>
          
          <button
            onClick={handleSendEmail}
            disabled={isGenerating || emailSent}
            className="bg-green-600 hover:bg-green-700 disabled:bg-green-400 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors"
          >
            {emailSent ? (
              <>
                <Send className="h-4 w-4" />
                <span>Email Sent!</span>
              </>
            ) : (
              <>
                <Mail className="h-4 w-4" />
                <span>{isGenerating ? 'Sending...' : 'Send Email'}</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Letter Preview */}
      <div className="bg-white rounded-lg shadow-lg border border-gray-200 overflow-hidden">
        <div className="bg-gray-50 px-6 py-4 border-b border-gray-200">
          <div className="flex items-center space-x-2">
            <FileText className="h-5 w-5 text-blue-600" />
            <span className="font-medium text-gray-900">
              {letterType === 'offer' ? 'Internship Offer Letter' : 'Internship Completion Letter'}
            </span>
            <span className="text-gray-500">•</span>
            <span className="text-sm text-gray-600">For: {intern.name}</span>
          </div>
        </div>
        
        <div className="p-8">
          <div 
            className="prose max-w-none letter-content"
            style={{
              fontFamily: 'Times, serif',
              lineHeight: '1.6',
              fontSize: '14px',
            }}
          >
            <div dangerouslySetInnerHTML={{ __html: letterContent.replace(/\n/g, '<br />') }} />
          </div>
        </div>
      </div>

      {/* Intern Details Summary */}
      <div className="bg-blue-50 rounded-lg p-6 border border-blue-200">
        <h3 className="text-lg font-semibold text-blue-900 mb-4">Intern Details Summary</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
          <div>
            <span className="font-medium text-blue-800">Name:</span>
            <p className="text-blue-700">{intern.name}</p>
          </div>
          <div>
            <span className="font-medium text-blue-800">Position:</span>
            <p className="text-blue-700">{intern.position}</p>
          </div>
          <div>
            <span className="font-medium text-blue-800">Duration:</span>
            <p className="text-blue-700">{intern.duration}</p>
          </div>
          <div>
            <span className="font-medium text-blue-800">Stipend:</span>
            <p className="text-blue-700">{intern.stipend}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default LetterPreview;