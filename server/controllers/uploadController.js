const multer = require('multer');
const path = require('path');
const { extractTextFromPDF } = require('../services/pdfParser');

const storage = multer.memoryStorage();

const fileFilter = (req, file, cb) => {
  const allowed = ['.pdf', '.txt', '.jpg', '.jpeg', '.png', '.webp'];
  const ext = path.extname(file.originalname).toLowerCase();
  if (allowed.includes(ext)) cb(null, true);
  else cb(new Error(`File type ${ext} not supported`), false);
};

const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 20 * 1024 * 1024 }
});

const uploadMiddleware = upload.array('files', 10);

// POST /api/upload
const uploadFiles = async (req, res, next) => {
  try {
    const files = req.files;
    if (!files || files.length === 0) {
      return res.status(400).json({ error: 'No files uploaded' });
    }

    const results = [];

    for (const file of files) {
      const ext = path.extname(file.originalname).toLowerCase();
      let extractedText = '';
      let fileType = 'unknown';

      if (ext === '.pdf') {
        fileType = 'pdf';
        const parsed = await extractTextFromPDF(file.buffer);
        extractedText = parsed.text;
      } else if (ext === '.txt') {
        fileType = 'text';
        extractedText = file.buffer.toString('utf-8');
      } else if (['.jpg', '.jpeg', '.png', '.webp'].includes(ext)) {
        fileType = 'image';
        extractedText = '';
      }

      results.push({
        id: Date.now(),
        filename: file.originalname,
        fileType,
        extractedText,
        imageBase64: fileType === 'image' ? file.buffer.toString('base64') : undefined,
        imageMimeType: fileType === 'image' ? file.mimetype : undefined,
        hasText: extractedText.length > 0,
        size: file.size
      });
    }

    res.json({ success: true, files: results });
  } catch (err) {
    next(err);
  }
};

// POST /api/upload/text
const uploadText = async (req, res, next) => {
  try {
    const { text, title = 'Pasted Text' } = req.body;
    if (!text) return res.status(400).json({ error: 'Text is required' });

    res.json({ success: true, file: { id: Date.now(), filename: title, fileType: 'text', extractedText: text } });
  } catch (err) {
    next(err);
  }
};

module.exports = { uploadMiddleware, uploadFiles, uploadText };