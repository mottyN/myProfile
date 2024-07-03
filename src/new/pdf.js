import React, { useState } from 'react';
import { PDFDocument } from 'pdf-lib';

const MergePdf = () => {
  const [pdf1, setPdf1] = useState(null);
  const [pdf2, setPdf2] = useState(null);
  const [mergedPdfUrl, setMergedPdfUrl] = useState('');

  const handlePdfChange = (event, setPdf) => {
    const file = event.target.files[0];
    if (file && file.type === 'application/pdf') {
      const reader = new FileReader();
      reader.onload = (e) => {
        setPdf(e.target.result);
      };
      reader.readAsArrayBuffer(file);
    } else {
      alert('Please upload a valid PDF file.');
    }
  };

  const mergePdfs = async () => {
    if (pdf1 && pdf2) {
      const pdfDoc1 = await PDFDocument.load(pdf1);
      const pdfDoc2 = await PDFDocument.load(pdf2);
      const mergedPdf = await PDFDocument.create();

      const copiedPages1 = await mergedPdf.copyPages(pdfDoc1, pdfDoc1.getPageIndices());
      copiedPages1.forEach((page) => mergedPdf.addPage(page));

      const copiedPages2 = await mergedPdf.copyPages(pdfDoc2, pdfDoc2.getPageIndices());
      copiedPages2.forEach((page) => mergedPdf.addPage(page));

      const mergedPdfBytes = await mergedPdf.save();
      const mergedPdfBlob = new Blob([mergedPdfBytes], { type: 'application/pdf' });
      const mergedPdfUrl = URL.createObjectURL(mergedPdfBlob);
      setMergedPdfUrl(mergedPdfUrl);
    } else {
      alert('Please upload two PDF files.');
    }
  };

  return (
    <div>
      <h2>Merge PDF Files</h2>
      <input type="file" accept="application/pdf" onChange={(e) => handlePdfChange(e, setPdf1)} />
      <input type="file" accept="application/pdf" onChange={(e) => handlePdfChange(e, setPdf2)} />
      <button onClick={mergePdfs}>Merge PDFs</button>
      {mergedPdfUrl && (
        <div>
          <h3>Merged PDF:</h3>
          <a href={mergedPdfUrl} target="_blank" rel="noopener noreferrer">Download Merged PDF</a>
        </div>
      )}
    </div>
  );
};

export default MergePdf;
