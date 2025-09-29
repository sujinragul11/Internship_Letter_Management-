import React, { useState } from 'react';
import { Calendar, Mail, Download, Eye, FileText } from 'lucide-react';
import { storageUtils } from '../utils/storage';
import { formatDate } from '../utils/dateHelpers';
import jsPDF from 'jspdf';

function LetterHistory({ internId }) {
  const [letters] = useState(() => storageUtils.getLettersByIntern(internId));

  const handleDownload = (letter) => {
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
      doc.text('Nallanathapuram, Kalakad', 20, 26);
      
      // Add a line separator
      doc.line(20, 32, 190, 32);
      
      // Process the letter content
      const lines = letter.content.split('\n');
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
      const filename = `${letter.letterType === 'offer' ? 'offer-letter' : 'completion-certificate'}-${letter.internName
        .replace(/\s+/g, '-')
        .toLowerCase()}.pdf`;
      
      // Save the PDF
      doc.save(filename);
      
    } catch (error) {
      console.error('Error generating PDF:', error);
      alert('Error generating PDF. Please try again.');
    }
  };

  if (letters.length === 0) {
    return (
      <div className="bg-gray-50 rounded-lg p-8 text-center">
        <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
        <p className="text-gray-600">No letters generated yet for this intern</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-gray-900">Letter History</h3>

      <div className="space-y-3">
        {letters.map((letter) => (
          <div
            key={letter.id}
            className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-sm transition-shadow"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className={`p-2 rounded-lg ${
                  letter.letterType === 'offer' ? 'bg-blue-100' : 'bg-green-100'
                }`}>
                  <FileText className={`h-4 w-4 ${letter.letterType === 'offer' ? 'text-blue-600' : 'text-green-600'}`} />
                </div>

                <div>
                  <h4 className="font-medium text-gray-900">
                    {letter.letterType === 'offer' ? 'Offer Letter' : 'Completion Certificate'}
                  </h4>
                  <div className="flex items-center space-x-4 text-sm text-gray-600">
                    <span className="flex items-center space-x-1">
                      <Calendar className="h-3 w-3" />
                      <span>Generated: {formatDate(letter.generatedAt, 'short')}</span>
                    </span>
                    {letter.emailSent && (
                      <span className="flex items-center space-x-1 text-green-600">
                        <Mail className="h-3 w-3" />
                        <span>Email Sent</span>
                      </span>
                    )}
                  </div>
                </div>
              </div>

              <div className="flex space-x-2">
                <button
                  onClick={() => alert('Preview functionality would open letter content')}
                  className="text-gray-600 hover:text-gray-900 p-1 transition-colors"
                  title="Preview Letter"
                >
                  <Eye className="h-4 w-4" />
                </button>
                <button
                  onClick={() => handleDownload(letter)}
                  className="text-gray-600 hover:text-gray-900 p-1 transition-colors"
                  title="Download PDF"
                >
                  <Download className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default LetterHistory;
