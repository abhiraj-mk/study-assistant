import React, { useState } from 'react';
import { CheckCircle2, XCircle, Trophy, RefreshCw, HelpCircle } from 'lucide-react';

export default function Quiz({ quiz }) {
  const [answers, setAnswers] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [showResults, setShowResults] = useState(false);

  if (!quiz?.length) return (
    <div className="text-center py-16 text-slate-500">
      <HelpCircle size={40} className="mx-auto mb-3 opacity-40" />
      <p>No quiz yet. Upload a document first.</p>
    </div>
  );

  const score = quiz.reduce((acc, q) => {
    const ans = answers[q.id];
    if (!ans) return acc;
    const correct = q.type === 'mcq'
      ? ans === q.answer
      : ans.trim().toLowerCase().includes(q.answer.toLowerCase().substring(0, 20));
    return acc + (correct ? 1 : 0);
  }, 0);

  const percent = Math.round((score / quiz.length) * 100);
  const answered = Object.keys(answers).length;

  const reset = () => { setAnswers({}); setSubmitted(false); setShowResults(false); };

  const isCorrect = (q) => {
    const ans = answers[q.id];
    if (!ans) return null;
    return q.type === 'mcq'
      ? ans === q.answer
      : ans.trim().toLowerCase().includes(q.answer.toLowerCase().substring(0, 20));
  };

  return (
    <div className="space-y-6 fade-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-slate-400">{quiz.length} questions</p>
        {!submitted && (
          <p className="text-sm text-slate-400">{answered}/{quiz.length} answered</p>
        )}
        {submitted && (
          <div className={`px-4 py-2 rounded-xl text-sm font-bold ${percent >= 70 ? 'bg-green-500/20 text-green-400' : percent >= 50 ? 'bg-yellow-500/20 text-yellow-400' : 'bg-red-500/20 text-red-400'}`}>
            Score: {score}/{quiz.length} ({percent}%)
          </div>
        )}
      </div>

      {/* Score banner */}
      {submitted && (
        <div className={`glass rounded-2xl p-6 text-center border ${percent >= 70 ? 'border-green-500/30' : percent >= 50 ? 'border-yellow-500/30' : 'border-red-500/30'}`}>
          <Trophy size={32} className={`mx-auto mb-2 ${percent >= 70 ? 'text-yellow-400' : 'text-slate-500'}`} />
          <p className="font-display font-bold text-2xl">{percent >= 70 ? '🎉 Great job!' : percent >= 50 ? '👍 Good effort!' : '📚 Keep studying!'}</p>
          <p className="text-slate-400 text-sm mt-1">You scored {score} out of {quiz.length}</p>
        </div>
      )}

      {/* Questions */}
      {quiz.map((q, qi) => {
        const correct = isCorrect(q);
        return (
          <div key={q.id} className={`glass rounded-2xl p-6 transition-all ${submitted && correct === true ? 'border border-green-500/30' : submitted && correct === false ? 'border border-red-500/30' : 'border border-transparent'}`}>
            <div className="flex gap-3 mb-4">
              <span className="flex-shrink-0 w-7 h-7 rounded-full bg-indigo-500/20 text-indigo-400 text-xs flex items-center justify-center font-bold">{qi + 1}</span>
              <p className="text-slate-200 font-semibold leading-snug">{q.question}</p>
              {submitted && (
                correct
                  ? <CheckCircle2 size={20} className="flex-shrink-0 text-green-400 ml-auto" />
                  : <XCircle size={20} className="flex-shrink-0 text-red-400 ml-auto" />
              )}
            </div>

            {q.type === 'mcq' ? (
              <div className="space-y-2 ml-10">
                {q.options.map((opt, oi) => {
                  const letter = opt.charAt(0);
                  const isSelected = answers[q.id] === letter;
                  const isAnswer = submitted && letter === q.answer;
                  const isWrong = submitted && isSelected && letter !== q.answer;

                  return (
                    <button key={oi} disabled={submitted}
                      onClick={() => !submitted && setAnswers(p => ({ ...p, [q.id]: letter }))}
                      className={`w-full text-left px-4 py-3 rounded-xl text-sm transition-all
                        ${isAnswer ? 'bg-green-500/20 border border-green-500/40 text-green-300' :
                          isWrong ? 'bg-red-500/20 border border-red-500/40 text-red-300' :
                          isSelected ? 'bg-indigo-500/20 border border-indigo-500/40 text-indigo-300' :
                          'bg-slate-800/50 border border-transparent hover:bg-slate-700/50 text-slate-300'}`}>
                      {opt}
                    </button>
                  );
                })}
              </div>
            ) : (
              <div className="ml-10">
                <textarea
                  disabled={submitted}
                  value={answers[q.id] || ''}
                  onChange={e => !submitted && setAnswers(p => ({ ...p, [q.id]: e.target.value }))}
                  placeholder="Type your answer..."
                  rows={2}
                  className="w-full bg-slate-800/50 border border-slate-700 rounded-xl px-4 py-3 text-sm text-slate-300 placeholder-slate-600 resize-none focus:outline-none focus:border-indigo-500 transition-colors disabled:opacity-60"
                />
              </div>
            )}

            {submitted && q.explanation && (
              <div className="ml-10 mt-3 p-3 bg-blue-500/10 border border-blue-500/20 rounded-xl text-xs text-blue-300">
                💡 {q.explanation}
              </div>
            )}
          </div>
        );
      })}

      {/* Buttons */}
      <div className="flex gap-3">
        {!submitted ? (
          <button onClick={() => setSubmitted(true)} disabled={answered === 0}
            className="flex-1 py-4 rounded-2xl bg-indigo-600 hover:bg-indigo-500 disabled:opacity-40 font-display font-semibold transition-all">
            Submit Answers
          </button>
        ) : (
          <button onClick={reset} className="flex-1 py-4 rounded-2xl glass hover:bg-white/10 font-display font-semibold flex items-center justify-center gap-2 transition-all">
            <RefreshCw size={16} /> Try Again
          </button>
        )}
      </div>
    </div>
  );
}
