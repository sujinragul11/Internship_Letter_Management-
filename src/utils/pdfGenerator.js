// PDF generation simulation
export const pdfGenerator = {
  generateOfferLetter: async (internData, letterContent) => {
    // Simulate PDF generation delay
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    const pdfData = {
      filename: `offer-letter-${internData.name.replace(/\s+/g, '-').toLowerCase()}.pdf`,
      content: letterContent,
      metadata: {
        title: 'Internship Offer Letter',
        author: 'HR Department',
        subject: `Offer Letter for ${internData.name}`,
        creator: 'Internship Management System',
        createdAt: new Date().toISOString()
      },
      size: '8.5x11', // Letter size
      orientation: 'portrait'
    };

    // In a real implementation, this would use a PDF library like PDFKit or Puppeteer
    console.log('PDF generated:', pdfData);
    
    return {
      success: true,
      filename: pdfData.filename,
      size: calculateFileSize(letterContent),
      downloadUrl: `data:application/pdf;base64,${btoa(letterContent)}`
    };
  },

  generateCompletionCertificate: async (internData, letterContent) => {
    // Simulate PDF generation delay
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    const pdfData = {
      filename: `completion-certificate-${internData.name.replace(/\s+/g, '-').toLowerCase()}.pdf`,
      content: letterContent,
      metadata: {
        title: 'Internship Completion Certificate',
        author: 'HR Department',
        subject: `Completion Certificate for ${internData.name}`,
        creator: 'Internship Management System',
        createdAt: new Date().toISOString()
      },
      size: '8.5x11',
      orientation: 'portrait'
    };

    console.log('PDF generated:', pdfData);
    
    return {
      success: true,
      filename: pdfData.filename,
      size: calculateFileSize(letterContent),
      downloadUrl: `data:application/pdf;base64,${btoa(letterContent)}`
    };
  }
};

const calculateFileSize = (content) => {
  const bytes = new Blob([content]).size;
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
};