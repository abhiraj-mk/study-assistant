// ─── aiRoutes.js ───
const express = require('express');
const router = express.Router();
const { summarize, quiz, flashcards, processImagesController, chat, processAll } = require('../controllers/aiController');

router.post('/summarize', summarize);
router.post('/quiz', quiz);
router.post('/flashcards', flashcards);
router.post('/process-images', processImagesController);
router.post('/chat', chat);
router.post('/all', processAll);

module.exports = router;
