import React, { useState } from 'react';
import { ArrowLeft, Download, Mail, Send, FileText } from 'lucide-react';
import { letterTemplates } from '../utils/letterTemplates';
import { storageUtils } from '../utils/storage';
import { backendEmailService } from '../utils/backendEmailService';
import jsPDF from 'jspdf';

function LetterPreview({ intern, letterType, onBack, onLetterGenerated }) {
  const [emailSent, setEmailSent] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [emailStatus, setEmailStatus] = useState('');

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
    
    try {
      const letterContent = generateLetterContent();
      
      // Create PDF using jsPDF
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
      
      // Generate filename
      const filename = `${letterType === 'offer' ? 'offer-letter' : 'completion-certificate'}-${intern.name.replace(/\s+/g, '-').toLowerCase()}.pdf`;
      
      // Save the PDF
      doc.save(filename);
      
      // Save letter record
      const letterData = {
        id: Date.now().toString(),
        internId: intern.id,
        internName: intern.name,
        letterType,
        content: letterContent,
        generatedAt: new Date().toISOString(),
        emailSent: false,
      };

      storageUtils.saveLetter(letterData);
      onLetterGenerated();
      
    } catch (error) {
      console.error('Error generating PDF:', error);
      alert('Error generating PDF. Please try again.');
    }
    
    setIsGenerating(false);
  };

  const handleSendEmail = async () => {
    setIsGenerating(true);
    setEmailStatus('Connecting to email service...');
    
    try {
      // Check if backend service is available
      const healthCheck = await backendEmailService.checkHealth();
      if (!healthCheck.success) {
        throw new Error('Backend email service is not available. Please start the Node.js server.');
      }

      setEmailStatus('Sending email...');
      
      // Send email using backend service
      let emailResult;
      if (letterType === 'offer') {
        emailResult = await backendEmailService.sendOfferLetter(intern);
      } else {
        emailResult = await backendEmailService.sendCompletionCertificate(intern);
      }
      
      // Save letter record with email sent flag
      const letterData = {
        id: Date.now().toString(),
        internId: intern.id,
        internName: intern.name,
        letterType,
        content: generateLetterContent(),
        generatedAt: new Date().toISOString(),
        emailSent: emailResult.success,
        emailSentAt: emailResult.sentAt,
        emailMessageId: emailResult.messageId
      };

      storageUtils.saveLetter(letterData);
      onLetterGenerated();
      
      if (emailResult.success) {
        setEmailSent(true);
        setEmailStatus(`Email sent successfully! ${emailResult.message || ''}`);
      }
      
      setTimeout(() => {
        setEmailSent(false);
        setEmailStatus('');
      }, 3000);
      
    } catch (error) {
      console.error('Error preparing email:', error);
      
      // Show more specific error message
      let errorMessage = 'Error sending email. Please try again.';
      if (error.message.includes('not available')) {
        errorMessage = 'Backend email service is not available. Please start the Node.js server and try again.';
      } else if (error.message.includes('Backend email service error')) {
        errorMessage = error.message + '\n\nPlease check your email configuration in the backend service.';
      } else {
        errorMessage = error.message;
      }
      
      alert(errorMessage);
    }
    
    setEmailStatus('');
    setIsGenerating(false);
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
            className={`px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors ${
              emailSent 
                ? 'bg-green-600 text-white' 
                : isGenerating 
                  ? 'bg-blue-400 text-white cursor-not-allowed'
                  : 'bg-green-600 hover:bg-green-700 text-white'
            }`}
          >
            {emailSent ? (
              <>
                <Send className="h-4 w-4" />
                <span>Email Sent!</span>
              </>
            ) : isGenerating ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                <span>Sending...</span>
              </>
            ) : (
              <>
                <Mail className="h-4 w-4" />
                <span>Send Email</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Email Status */}
      {emailStatus && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-center space-x-2">
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
            <span className="text-blue-800 font-medium">{emailStatus}</span>
          </div>
        </div>
      )}

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