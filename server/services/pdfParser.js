const pdfParse = require('pdf-parse');
const fs = require('fs');

// Extract text from PDF buffer
const extractTextFromPDF = async (buffer) => {
  try {
    const data = await pdfParse(buffer);
    return {
      text: data.text,
      pages: data.numpages,
      info: data.info
    };
  } catch (err) {
    throw new Error(`PDF parsing failed: ${err.message}`);
  }
};

// Extract text from PDF file path
const extractTextFromPDFPath = async (filePath) => {
  const buffer = fs.readFileSync(filePath);
  return extractTextFromPDF(buffer);
};

module.exports = { extractTextFromPDF, extractTextFromPDFPath };
