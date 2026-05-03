import { create } from 'zustand';

export const useStudyStore = create((set, get) => ({
  // Current document
  currentDoc: null,
  extractedText: '',
  uploadedFiles: [],

  // AI results
  summary: null,
  flashcards: [],
  quiz: [],
  chatHistory: [],

  // UI state
  activeTab: 'summary',
  isLoading: false,
  loadingMessage: '',
  error: null,

  // Actions
  setCurrentDoc: (doc) => set({ currentDoc: doc }),
  setExtractedText: (text) => set({ extractedText: text }),
  setUploadedFiles: (files) => set({ uploadedFiles: files }),

  setSummary: (summary) => set({ summary }),
  setFlashcards: (flashcards) => set({ flashcards }),
  setQuiz: (quiz) => set({ quiz }),
  setActiveTab: (tab) => set({ activeTab: tab }),

  setLoading: (isLoading, message = '') => set({ isLoading, loadingMessage: message }),
  setError: (error) => set({ error }),

  addChatMessage: (msg) => set((state) => ({
    chatHistory: [...state.chatHistory, msg]
  })),
  clearChat: () => set({ chatHistory: [] }),

  reset: () => set({
    currentDoc: null,
    extractedText: '',
    summary: null,
    flashcards: [],
    quiz: [],
    chatHistory: [],
    activeTab: 'summary',
    error: null
  })
}));
