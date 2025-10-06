import React, { useState } from 'react';
import { ArrowLeft, Download, Mail, Send, FileText } from 'lucide-react';
import { letterTemplates } from '../utils/letterTemplates';
import { supabaseStorage } from '../utils/supabaseStorage';
import { backendEmailService } from '../utils/backendEmailService';
import jsPDF from 'jspdf';
import NotificationToast from './NotificationToast'; // ADD THIS LINE

function LetterPreview({ intern, letterType, onBack, onLetterGenerated }) {
  const [emailSent, setEmailSent] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [emailStatus, setEmailStatus] = useState('');
  const [notification, setNotification] = useState({ // ADD THIS STATE
    show: false,
    type: '',
    message: ''
  });

  // ADD THIS FUNCTION
  const showNotification = (type, message) => {
    setNotification({
      show: true,
      type,
      message
    });
    
    setTimeout(() => {
      setNotification(prev => ({ ...prev, show: false }));
    }, 5000);
  };

  const internData = {
    id: intern.id,
    name: intern.name,
    email: intern.email,
    position: intern.position,
    startDate: intern.start_date || intern.startDate,
    duration: intern.duration,
    location: intern.location,
    stipend: intern.stipend,
    date: intern.date || new Date().toISOString().split('T')[0],
  };

  const generateLetterContent = () => {
    const template = letterTemplates[letterType];
    return template
      .replace(/\{\{name\}\}/g, internData.name)
      .replace(/\{\{date\}\}/g, new Date(internData.date).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      }))
      .replace(/\{\{position\}\}/g, internData.position)
      .replace(/\{\{start_date\}\}/g, new Date(internData.startDate).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      }))
      .replace(/\{\{duration\}\}/g, internData.duration)
      .replace(/\{\{location\}\}/g, internData.location)
      .replace(/\{\{stipend\}\}/g, internData.stipend);
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
        internId: intern.id,
        type: letterType,
        recipientEmail: intern.email,
        status: 'downloaded',
      };

      await supabaseStorage.saveLetter(letterData);
      onLetterGenerated();
      
      // ADD SUCCESS NOTIFICATION
      showNotification('success', 'PDF downloaded successfully! 📄');
      
    } catch (error) {
      console.error('Error generating PDF:', error);
      showNotification('error', 'Error generating PDF. Please try again.');
    }
    
    setIsGenerating(false);
  };

  const handleSendEmail = async () => {
    setIsGenerating(true);
    setEmailStatus('Preparing to send email...');

    try {
      setEmailStatus('Sending email...');

      let emailResult;
      if (letterType === 'offer') {
        emailResult = await backendEmailService.sendOfferLetter(internData); // REMOVE htmlContent
      } else {
        emailResult = await backendEmailService.sendCompletionCertificate(internData); // REMOVE htmlContent
      }

      const letterData = {
        internId: internData.id,
        type: letterType,
        recipientEmail: internData.email,
        status: emailResult.success ? 'sent' : 'failed',
      };

      await supabaseStorage.saveLetter(letterData);
      onLetterGenerated();

      if (emailResult.success) {
        setEmailSent(true);
        setEmailStatus(`Email sent successfully! ${emailResult.message || ''}`);
        
        // ADD SUCCESS NOTIFICATION
        showNotification('success', 
          letterType === 'offer' 
            ? 'Offer letter sent successfully! 📧' 
            : 'Completion certificate sent successfully! 📜'
        );
      }

      setTimeout(() => {
        setEmailSent(false);
        setEmailStatus('');
      }, 3000);

    } catch (error) {
      console.error('Error sending email:', error);

      let errorMessage = 'Error sending email. Please try again.';
      if (error.message.includes('not configured')) {
        errorMessage = `Email service is not fully configured yet.\n\nTo enable email functionality:\n1. Deploy the Supabase Edge Function using: supabase functions deploy send-email\n2. Configure the RESEND_API_KEY secret in your Supabase project\n3. Get a free API key from resend.com\n\nFor now, you can download the letter as a PDF and send it manually.`;
      } else if (error.message.includes('Failed to fetch') || error.message.includes('NetworkError')) {
        errorMessage = `Email service is not available.\n\nThe Supabase Edge Function needs to be deployed.\n\nFor now, please use the "Download PDF" button to save the letter and send it manually.`;
      } else {
        errorMessage = error.message;
      }

      // CHANGE ALERT TO NOTIFICATION
      showNotification('error', errorMessage);
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

      {/* ADD NOTIFICATION TOAST COMPONENT */}
      <NotificationToast
        show={notification.show}
        type={notification.type}
        message={notification.message}
        onClose={() => setNotification(prev => ({ ...prev, show: false }))}
      />
    </div>
  );
}

export default LetterPreview;