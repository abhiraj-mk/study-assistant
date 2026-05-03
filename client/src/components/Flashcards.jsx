import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, RotateCcw, Layers } from 'lucide-react';

export default function Flashcards({ flashcards }) {
  const [current, setCurrent] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [known, setKnown] = useState(new Set());

  if (!flashcards?.length) return (
    <div className="text-center py-16 text-slate-500">
      <Layers size={40} className="mx-auto mb-3 opacity-40" />
      <p>No flashcards yet. Upload a document first.</p>
    </div>
  );

  const card = flashcards[current];
  const progress = ((current + 1) / flashcards.length) * 100;

  const goNext = () => { setFlipped(false); setCurrent(p => Math.min(p + 1, flashcards.length - 1)); };
  const goPrev = () => { setFlipped(false); setCurrent(p => Math.max(p - 1, 0)); };
  const toggleKnown = () => setKnown(prev => { const n = new Set(prev); n.has(current) ? n.delete(current) : n.add(current); return n; });
  const reset = () => { setCurrent(0); setFlipped(false); setKnown(new Set()); };

  return (
    <div className="space-y-6 fade-in">
      {/* Progress */}
      <div className="flex items-center justify-between text-sm text-slate-400">
        <span>{current + 1} / {flashcards.length}</span>
        <span className="text-green-400">{known.size} known ✓</span>
      </div>
      <div className="h-1.5 bg-slate-800 rounded-full">
        <div className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full transition-all duration-500" style={{ width: `${progress}%` }} />
      </div>

      {/* Card */}
      <div
        onClick={() => setFlipped(!flipped)}
        className="relative cursor-pointer"
        style={{ perspective: '1000px', height: '280px' }}
      >
        <div
          className="w-full h-full transition-transform duration-500 relative"
          style={{ transformStyle: 'preserve-3d', transform: flipped ? 'rotateY(180deg)' : 'rotateY(0deg)' }}
        >
          {/* Front */}
          <div className="absolute inset-0 glass rounded-2xl p-8 flex flex-col items-center justify-center text-center"
            style={{ backfaceVisibility: 'hidden' }}>
            <p className="text-xs text-indigo-400 uppercase tracking-widest mb-4 font-semibold">Question</p>
            <p className="text-white text-xl font-display font-semibold leading-relaxed">{card.front}</p>
            {card.topic && <span className="mt-4 text-xs text-slate-500 bg-slate-800 px-3 py-1 rounded-full">{card.topic}</span>}
            <p className="absolute bottom-4 text-xs text-slate-600">Tap to reveal answer</p>
          </div>

          {/* Back */}
          <div className="absolute inset-0 bg-indigo-950/80 border border-indigo-500/30 rounded-2xl p-8 flex flex-col items-center justify-center text-center"
            style={{ backfaceVisibility: 'hidden', transform: 'rotateY(180deg)' }}>
            <p className="text-xs text-green-400 uppercase tracking-widest mb-4 font-semibold">Answer</p>
            <p className="text-white text-lg leading-relaxed">{card.back}</p>
          </div>
        </div>
      </div>

      {/* Controls */}
      <div className="flex items-center justify-between">
        <button onClick={goPrev} disabled={current === 0}
          className="glass rounded-xl p-3 disabled:opacity-30 hover:bg-white/10 transition-colors">
          <ChevronLeft size={20} />
        </button>

        <div className="flex gap-3">
          <button onClick={toggleKnown}
            className={`px-5 py-2.5 rounded-xl text-sm font-semibold transition-all ${known.has(current) ? 'bg-green-500/20 text-green-400 border border-green-500/30' : 'glass text-slate-400 hover:text-green-400'}`}>
            {known.has(current) ? '✓ Known' : 'Mark Known'}
          </button>
          <button onClick={reset} className="glass rounded-xl p-2.5 text-slate-400 hover:text-white transition-colors">
            <RotateCcw size={16} />
          </button>
        </div>

        <button onClick={goNext} disabled={current === flashcards.length - 1}
          className="glass rounded-xl p-3 disabled:opacity-30 hover:bg-white/10 transition-colors">
          <ChevronRight size={20} />
        </button>
      </div>
    </div>
  );
}
