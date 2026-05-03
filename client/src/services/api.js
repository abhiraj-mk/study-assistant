import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '/api',  // ✅ Change this line
  timeout: 120000
});

// Attach JWT token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// ─── Upload ───
export const uploadFiles = (formData, onProgress) =>
  api.post('/upload', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
    onUploadProgress: (e) => onProgress && onProgress(Math.round((e.loaded * 100) / e.total))
  });

export const uploadText = (text, title) =>
  api.post('/upload/text', { text, title });

// ─── AI ───
export const summarize = (text) =>
  api.post('/ai/summarize', { text });

export const generateQuiz = (text, count) =>
  api.post('/ai/quiz', { text, count });

export const generateFlashcards = (text) =>
  api.post('/ai/flashcards', { text });

export const processImages = (images, mode = 'summarize') =>
  api.post('/ai/process-images', { images, mode });

export const processAll = (text, quizCount) =>
  api.post('/ai/all', { text, quizCount });

export const chatWithNotes = (context, question, history) =>
  api.post('/ai/chat', { context, question, history });

// ─── Docs ───
export const getDocs = () => api.get('/docs');
export const getDoc = (id) => api.get(`/docs/${id}`);
export const deleteDoc = (id) => api.delete(`/docs/${id}`);

// ─── Auth ───
export const login = (email, password) =>
  api.post('/users/login', { email, password });

export const register = (name, email, password) =>
  api.post('/users/register', { name, email, password });

export default api;
