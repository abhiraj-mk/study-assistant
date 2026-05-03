const { summarizeText, generateQuiz, generateFlashcards, processImages, chatWithNotes } = require('../services/openaiService');
const Document = require('../models/Document');

// POST /api/ai/summarize
const summarize = async (req, res, next) => {
  try {
    const { text, docId } = req.body;
    if (!text) return res.status(400).json({ error: 'Text is required' });

    const result = await summarizeText(text);

    // Optionally save to document
    if (docId) {
      await Document.findByIdAndUpdate(docId, { summary: result });
    }

    res.json({ success: true, data: result });
  } catch (err) {
    next(err);
  }
};

// POST /api/ai/quiz
const quiz = async (req, res, next) => {
  try {
    const { text, count = 10, docId } = req.body;
    if (!text) return res.status(400).json({ error: 'Text is required' });

    if (count > 20) return res.status(400).json({ error: 'Maximum 20 questions allowed' });

    const result = await generateQuiz(text, count);

    if (docId) {
      await Document.findByIdAndUpdate(docId, { quiz: result.questions });
    }

    res.json({ success: true, data: result });
  } catch (err) {
    next(err);
  }
};

// POST /api/ai/flashcards
const flashcards = async (req, res, next) => {
  try {
    const { text, docId } = req.body;
    if (!text) return res.status(400).json({ error: 'Text is required' });

    const result = await generateFlashcards(text);

    if (docId) {
      await Document.findByIdAndUpdate(docId, { flashcards: result.flashcards });
    }

    res.json({ success: true, data: result });
  } catch (err) {
    next(err);
  }
};

// POST /api/ai/process-images
const processImagesController = async (req, res, next) => {
  try {
    const { images, mode = 'summarize' } = req.body;
    // images: array of { base64, mimeType }

    if (!images || !Array.isArray(images) || images.length === 0) {
      return res.status(400).json({ error: 'Images array is required' });
    }
    if (images.length > 10) {
      return res.status(400).json({ error: 'Maximum 10 images at a time' });
    }

    const result = await processImages(images, mode);
    res.json({ success: true, data: result });
  } catch (err) {
    next(err);
  }
};

// POST /api/ai/chat
const chat = async (req, res, next) => {
  try {
    const { context, question, history } = req.body;
    if (!context || !question) {
      return res.status(400).json({ error: 'Context and question are required' });
    }

    const answer = await chatWithNotes(context, question, history || []);
    res.json({ success: true, answer });
  } catch (err) {
    next(err);
  }
};

// POST /api/ai/all  — run all at once (summary + flashcards + quiz)
const processAll = async (req, res, next) => {
  try {
    const { text, quizCount = 10 } = req.body;
    if (!text) return res.status(400).json({ error: 'Text is required' });

    // Run one by one to better catch errors
    let summary, quizData, flashcardsData;

    try {
      summary = await summarizeText(text);
    } catch (e) {
      console.error('Summary error:', e.message);
      summary = { short: 'Summary failed', detailed: 'Summary failed', keyPoints: [] };
    }

    try {
      quizData = await generateQuiz(text, quizCount);
    } catch (e) {
      console.error('Quiz error:', e.message);
      quizData = { questions: [] };
    }

    try {
      flashcardsData = await generateFlashcards(text);
    } catch (e) {
      console.error('Flashcards error:', e.message);
      flashcardsData = { flashcards: [] };
    }

    res.json({
      success: true,
      data: {
        summary,
        quiz: quizData.questions,
        flashcards: flashcardsData.flashcards
      }
    });
  } catch (err) {
    next(err);
  }
};

module.exports = { summarize, quiz, flashcards, processImagesController, chat, processAll };
