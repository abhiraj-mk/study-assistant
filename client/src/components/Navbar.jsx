import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Brain, Zap } from 'lucide-react';

export default function Navbar() {
  return (
    <nav className="border-b border-white/10 glass sticky top-0 z-50 px-6 py-4">
      <div className="max-w-6xl mx-auto flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2 group">
          <div className="w-8 h-8 rounded-lg bg-indigo-500/20 flex items-center justify-center glow">
            <Brain size={18} className="text-indigo-400" />
          </div>
          <span className="font-display font-bold text-xl tracking-tight">
            Study<span className="text-indigo-400">AI</span>
          </span>
        </Link>
        <div className="flex items-center gap-2 text-xs text-slate-400">
          <Zap size={12} className="text-yellow-400" />
          Powered by GPT-4o Vision
        </div>
      </div>
    </nav>
  );
}
