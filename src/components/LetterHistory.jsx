import React, { useState } from 'react';
import { Calendar, Mail, Download, Eye, FileText } from 'lucide-react';
import { storageUtils } from '../utils/storage';
import { formatDate } from '../utils/dateHelpers';
import jsPDF from 'jspdf';

function LetterHistory({ internId }) {
  const [letters] = useState(() => storageUtils.getLettersByIntern(internId));

  const handleDownload = (letter) => {
    const doc = new jsPDF();

    // Add your letter content; assuming letter.content is HTML or text
    doc.html(letter.content, {
      callback: function (doc) {
        const filename = `${letter.letterType === 'offer' ? 'offer-letter' : 'completion-certificate'}-${letter.internName
          .replace(/\s+/g, '-')
          .toLowerCase()}.pdf`;
        doc.save(filename); // triggers the download
      },
      x: 10,
      y: 10,
    });
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
