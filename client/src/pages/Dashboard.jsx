import React from 'react';
import Upload from '../components/Upload';
import { Brain, Layers, HelpCircle, MessageSquare, Zap, Image } from 'lucide-react';

const features = [
  { icon: Brain, label: 'Smart Summary', desc: 'TL;DR + key points', color: 'text-indigo-400' },
  { icon: Layers, label: 'Flashcards', desc: 'Flip-card study mode', color: 'text-purple-400' },
  { icon: HelpCircle, label: 'Quiz Generator', desc: 'Up to 20 MCQs', color: 'text-pink-400' },
  { icon: Image, label: 'Image OCR', desc: 'Up to 10 JPEGs', color: 'text-yellow-400' },
  { icon: MessageSquare, label: 'Chat with Notes', desc: 'Ask AI anything', color: 'text-green-400' },
  { icon: Zap, label: 'Instant Results', desc: 'GPT-4o powered', color: 'text-orange-400' },
];

export default function Dashboard() {
  return (
    <div className="max-w-4xl mx-auto px-6 py-12">
      {/* Hero */}
      <div className="text-center mb-12">
        <div className="inline-flex items-center gap-2 bg-indigo-500/10 border border-indigo-500/20 rounded-full px-4 py-2 text-xs text-indigo-400 font-semibold mb-6 uppercase tracking-wider">
          <Zap size={12} /> AI-Powered Study Assistant
        </div>
        <h1 className="font-display font-extrabold text-5xl text-white mb-4 leading-tight">
          Study smarter,<br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-400">
            not harder
          </span>
        </h1>
        <p className="text-slate-400 text-lg max-w-xl mx-auto">
          Upload PDFs, images, or paste text — get instant summaries, flashcards, and quizzes powered by GPT-4o.
        </p>
      </div>

      {/* Feature pills */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-10">
        {features.map(({ icon: Icon, label, desc, color }) => (
          <div key={label} className="glass rounded-xl p-4 flex items-center gap-3">
            <Icon size={20} className={color} />
            <div>
              <p className="text-sm font-semibold text-white">{label}</p>
              <p className="text-xs text-slate-500">{desc}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Upload area */}
      <div className="glass rounded-3xl p-8">
        <Upload />
      </div>
    </div>
  );
}
