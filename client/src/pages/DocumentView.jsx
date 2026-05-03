import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, BookOpen, Layers, HelpCircle, MessageSquare } from 'lucide-react';
import { useStudyStore } from '../store/useStudyStore';
import Summary from '../components/Summary';
import Flashcards from '../components/Flashcards';
import Quiz from '../components/Quiz';
import Chat from '../components/Chat';

const TABS = [
  { id: 'summary', label: 'Summary', icon: BookOpen },
  { id: 'flashcards', label: 'Flashcards', icon: Layers },
  { id: 'quiz', label: 'Quiz', icon: HelpCircle },
  { id: 'chat', label: 'Chat', icon: MessageSquare },
];

export default function DocumentView() {
  const navigate = useNavigate();
  const { summary, flashcards, quiz, activeTab, setActiveTab } = useStudyStore();

  const counts = {
    flashcards: flashcards?.length || 0,
    quiz: quiz?.length || 0,
  };

  return (
    <div className="max-w-4xl mx-auto px-6 py-8">
      {/* Back */}
      <button onClick={() => navigate('/')}
        className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors mb-8 text-sm">
        <ArrowLeft size={16} />
        Back to Dashboard
      </button>

      {/* Tabs */}
      <div className="flex gap-1 glass rounded-2xl p-1.5 mb-8">
        {TABS.map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            onClick={() => setActiveTab(id)}
            className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-semibold transition-all
              ${activeTab === id
                ? 'bg-indigo-600 text-white shadow-lg'
                : 'text-slate-400 hover:text-white hover:bg-white/5'
              }`}
          >
            <Icon size={15} />
            <span className="hidden sm:inline">{label}</span>
            {counts[id] ? (
              <span className={`text-xs px-1.5 py-0.5 rounded-full ${activeTab === id ? 'bg-white/20' : 'bg-slate-700'}`}>
                {counts[id]}
              </span>
            ) : null}
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="glass rounded-3xl p-8">
        {activeTab === 'summary' && <Summary summary={summary} />}
        {activeTab === 'flashcards' && <Flashcards flashcards={flashcards} />}
        {activeTab === 'quiz' && <Quiz quiz={quiz} />}
        {activeTab === 'chat' && <Chat />}
      </div>
    </div>
  );
}
