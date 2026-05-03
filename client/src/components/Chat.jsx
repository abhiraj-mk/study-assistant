import React, { useState, useRef, useEffect } from 'react';
import { Send, Bot, User, Loader2, MessageSquare } from 'lucide-react';
import { chatWithNotes } from '../services/api';
import { useStudyStore } from '../store/useStudyStore';
import toast from 'react-hot-toast';

export default function Chat() {
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const { extractedText, chatHistory, addChatMessage } = useStudyStore();
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatHistory]);

  const send = async () => {
    if (!input.trim() || loading) return;
    if (!extractedText) return toast.error('Upload a document first');

    const question = input;
    setInput('');
    addChatMessage({ role: 'user', content: question });
    setLoading(true);

    try {
      const apiHistory = chatHistory.map(m => ({ role: m.role, content: m.content }));
      const { data } = await chatWithNotes(extractedText, question, apiHistory);
      addChatMessage({ role: 'assistant', content: data.answer });
    } catch (err) {
      toast.error('Failed to get answer');
    } finally {
      setLoading(false);
    }
  };

  const suggestions = [
    'Give me a quick overview of the main topic',
    'What are the most important concepts?',
    'Explain the key term in simple words',
    'What should I focus on for an exam?'
  ];

  return (
    <div className="flex flex-col h-[500px]">
      {/* Messages */}
      <div className="flex-1 overflow-y-auto space-y-4 pr-1 mb-4">
        {chatHistory.length === 0 ? (
          <div className="space-y-3">
            <div className="text-center py-8">
              <MessageSquare size={32} className="mx-auto mb-3 text-indigo-400 opacity-60" />
              <p className="text-slate-400 text-sm">Ask anything about your study material</p>
            </div>
            <div className="grid grid-cols-1 gap-2">
              {suggestions.map((s, i) => (
                <button key={i} onClick={() => setInput(s)}
                  className="text-left glass rounded-xl px-4 py-3 text-sm text-slate-400 hover:text-white hover:bg-white/10 transition-all">
                  "{s}"
                </button>
              ))}
            </div>
          </div>
        ) : (
          chatHistory.map((msg, i) => (
            <div key={i} className={`flex gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${msg.role === 'user' ? 'bg-indigo-500/30' : 'bg-slate-700'}`}>
                {msg.role === 'user' ? <User size={14} className="text-indigo-400" /> : <Bot size={14} className="text-slate-400" />}
              </div>
              <div className={`max-w-[80%] rounded-2xl px-4 py-3 text-sm leading-relaxed ${msg.role === 'user' ? 'bg-indigo-600/30 text-indigo-100 rounded-tr-sm' : 'glass text-slate-200 rounded-tl-sm'}`}>
                {msg.content}
              </div>
            </div>
          ))
        )}
        {loading && (
          <div className="flex gap-3">
            <div className="w-8 h-8 rounded-full bg-slate-700 flex items-center justify-center">
              <Bot size={14} className="text-slate-400" />
            </div>
            <div className="glass rounded-2xl rounded-tl-sm px-4 py-3">
              <Loader2 size={16} className="animate-spin text-indigo-400" />
            </div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <div className="flex gap-2">
        <input
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && !e.shiftKey && send()}
          placeholder="Ask about your notes..."
          className="flex-1 glass rounded-2xl px-4 py-3 text-sm text-slate-300 placeholder-slate-600 focus:outline-none focus:border-indigo-500 border border-transparent transition-colors"
        />
        <button onClick={send} disabled={!input.trim() || loading}
          className="w-12 h-12 rounded-2xl bg-indigo-600 hover:bg-indigo-500 disabled:opacity-40 flex items-center justify-center transition-all">
          <Send size={16} />
        </button>
      </div>
    </div>
  );
}
