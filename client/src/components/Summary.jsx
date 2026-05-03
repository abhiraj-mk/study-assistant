import React, { useState } from 'react';
import { BookOpen, Lightbulb, ChevronDown, ChevronUp } from 'lucide-react';

export default function Summary({ summary }) {
  const [showDetailed, setShowDetailed] = useState(false);

  if (!summary) return (
    <div className="text-center py-16 text-slate-500">
      <BookOpen size={40} className="mx-auto mb-3 opacity-40" />
      <p>No summary yet. Upload a document to get started.</p>
    </div>
  );

  return (
    <div className="space-y-4 fade-in">
      {/* Short summary */}
      <div className="glass rounded-2xl p-6 border-l-4 border-indigo-500">
        <h3 className="text-xs font-semibold text-indigo-400 uppercase tracking-widest mb-3">TL;DR</h3>
        <p className="text-slate-200 text-lg leading-relaxed font-display">{summary.short}</p>
      </div>

      {/* Key points */}
      {summary.keyPoints?.length > 0 && (
        <div className="glass rounded-2xl p-6">
          <h3 className="flex items-center gap-2 text-sm font-semibold text-slate-300 mb-4">
            <Lightbulb size={16} className="text-yellow-400" />
            Key Points
          </h3>
          <ul className="space-y-3">
            {summary.keyPoints.map((point, i) => (
              <li key={i} className="flex gap-3 text-slate-300 text-sm">
                <span className="flex-shrink-0 w-6 h-6 rounded-full bg-indigo-500/20 text-indigo-400 text-xs flex items-center justify-center font-bold">
                  {i + 1}
                </span>
                <span className="leading-relaxed">{point}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Detailed summary toggle */}
      <button
        onClick={() => setShowDetailed(!showDetailed)}
        className="w-full glass rounded-2xl p-4 text-left flex items-center justify-between hover:bg-white/10 transition-colors"
      >
        <span className="text-sm font-semibold text-slate-300">Detailed Summary</span>
        {showDetailed ? <ChevronUp size={16} className="text-slate-400" /> : <ChevronDown size={16} className="text-slate-400" />}
      </button>

      {showDetailed && (
        <div className="glass rounded-2xl p-6 fade-in">
          <p className="text-slate-300 text-sm leading-relaxed whitespace-pre-line">{summary.detailed}</p>
        </div>
      )}
    </div>
  );
}
