const OpenAI = require('openai');

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
  baseURL: 'https://api.groq.com/openai/v1'
});

const MODEL = process.env.OPENAI_MODEL || 'llama-3.3-70b-versatile';

const chunkText = (text, maxChars = 6000) => {
  const chunks = [];
  for (let i = 0; i < text.length; i += maxChars) {
    chunks.push(text.slice(i, i + maxChars));
  }
  return chunks;
};

const parseJSON = (text) => {
  console.log('Raw AI response:', text.substring(0, 300));
  try {
    const clean = text.replace(/```json|```/g, '').trim();
    return JSON.parse(clean);
  } catch {
    try {
      const match = text.match(/\{[\s\S]*\}/);
      if (match) return JSON.parse(match[0]);
    } catch {}
    return {};
  }
};

const summarizeText = async (text) => {
  const chunks = chunkText(text);
  const res = await openai.chat.completions.create({
    model: MODEL,
    messages: [
      {
        role: 'system',
        content: 'You are a JSON API. Only output raw valid JSON. No markdown. No explanation. No text before or after JSON.'
      },
      {
        role: 'user',
        content: `Return this JSON with values filled in from the text:
{"short":"summary in 2-3 sentences","detailed":"longer summary in a paragraph","keyPoints":["key point 1","key point 2","key point 3","key point 4","key point 5"]}

TEXT:
${chunks[0]}`
      }
    ],
    max_tokens: 1500,
    temperature: 0.1
  });

  const result = parseJSON(res.choices[0].message.content);
  return {
    short: result.short || 'Summary not available',
    detailed: result.detailed || 'Detailed summary not available',
    keyPoints: result.keyPoints || []
  };
};

const generateQuiz = async (text, count = 10) => {
  const questionCount = Math.min(Math.max(parseInt(count) || 10, 1), 20);
  const chunks = chunkText(text);
  const res = await openai.chat.completions.create({
    model: MODEL,
    messages: [
      {
        role: 'system',
        content: 'You are a JSON API. Only output raw valid JSON. No markdown. No explanation. No text before or after JSON.'
      },
      {
        role: 'user',
        content: `Create ${questionCount} quiz questions from the text. Return this exact JSON:
{"questions":[{"id":1,"type":"mcq","question":"question text","options":["A. option","B. option","C. option","D. option"],"answer":"A","explanation":"why"},{"id":2,"type":"short","question":"question text","answer":"answer text","explanation":"why"}]}

TEXT:
${chunks[0]}`
      }
    ],
    max_tokens: 3000,
    temperature: 0.1
  });

  const result = parseJSON(res.choices[0].message.content);
  return { questions: result.questions || [] };
};

const generateFlashcards = async (text) => {
  const chunks = chunkText(text);
  const res = await openai.chat.completions.create({
    model: MODEL,
    messages: [
      {
        role: 'system',
        content: 'You are a JSON API. Only output raw valid JSON. No markdown. No explanation. No text before or after JSON.'
      },
      {
        role: 'user',
        content: `Create 10 flashcards from the text. Return this exact JSON:
{"flashcards":[{"id":1,"front":"term or question","back":"definition or answer","topic":"topic name"}]}

TEXT:
${chunks[0]}`
      }
    ],
    max_tokens: 2000,
    temperature: 0.1
  });

  const result = parseJSON(res.choices[0].message.content);
  return { flashcards: result.flashcards || [] };
};

const processImages = async (imageBase64Array, prompt = 'summarize') => {
  return {
    extractedText: 'Image processing not supported with Groq. Please use PDF or text.',
    keyPoints: [],
    topics: []
  };
};

const chatWithNotes = async (context, question, history = []) => {
  const res = await openai.chat.completions.create({
    model: MODEL,
    messages: [
      {
        role: 'system',
        content: `You are a helpful study tutor. Answer questions based only on this material:\n\n${context.substring(0, 6000)}`
      },
      ...history.slice(-6),
      { role: 'user', content: question }
    ],
    max_tokens: 800,
    temperature: 0.5
  });
  return res.choices[0].message.content;
};

module.exports = {
  summarizeText,
  generateQuiz,
  generateFlashcards,
  processImages,
  chatWithNotes,
  chunkText
};