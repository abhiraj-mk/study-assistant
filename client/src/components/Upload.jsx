import React, { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload, FileText, Image, X, Loader2, Sparkles, ChevronDown, ChevronUp } from 'lucide-react';
import toast from 'react-hot-toast';
import { uploadFiles, uploadText, processAll, processImages } from '../services/api';
import { useStudyStore } from '../store/useStudyStore';
import { useNavigate } from 'react-router-dom';

export default function UploadZone() {
  const [files, setFiles] = useState([]);
  const [pastedText, setPastedText] = useState('');
  const [showPaste, setShowPaste] = useState(false);
  const [quizCount, setQuizCount] = useState(10);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const navigate = useNavigate();
  const { setSummary, setQuiz, setFlashcards, setExtractedText } = useStudyStore();

  const onDrop = useCallback((accepted) => {
    const valid = accepted.filter(f => {
      const ok = f.size <= 20 * 1024 * 1024;
      if (!ok) toast.error(`${f.name} exceeds 20MB`);
      return ok;
    });
    setFiles(prev => [...prev, ...valid].slice(0, 10));
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf'],
      'text/plain': ['.txt'],
      'image/jpeg': ['.jpg', '.jpeg'],
      'image/png': ['.png'],
      'image/webp': ['.webp']
    },
    maxFiles: 10
  });

  const removeFile = (i) => setFiles(prev => prev.filter((_, idx) => idx !== i));

  const processUpload = async () => {
    if (files.length === 0 && !pastedText.trim()) {
      return toast.error('Add files or paste some text first!');
    }
    if (quizCount < 1 || quizCount > 20) {
      return toast.error('Quiz count must be between 1 and 20');
    }

    setUploading(true);
    setProgress(0);

    try {
      let extractedText = '';
      const imageFiles = files.filter(f => f.type.startsWith('image/'));
      const nonImageFiles = files.filter(f => !f.type.startsWith('image/'));

      // 1. Upload PDFs/text files
      if (nonImageFiles.length > 0) {
        const formData = new FormData();
        nonImageFiles.forEach(f => formData.append('files', f));
        const { data } = await uploadFiles(formData, setProgress);
        // Get extracted text directly from upload response
        if (data.files && data.files.length > 0) {
          extractedText += data.files.map(f => f.extractedText || '').join('\n');
        }
        toast.success(`${data.files.length} file(s) uploaded`);
      }

      // 2. Process images via vision API
      if (imageFiles.length > 0) {
        toast.loading(`Processing ${imageFiles.length} image(s) with AI Vision...`, { id: 'img' });
        const imageData = await Promise.all(
          imageFiles.map(async (f) => {
            const base64 = await fileToBase64(f);
            return { base64, mimeType: f.type };
          })
        );
        const { data: imgResult } = await processImages(imageData, 'summarize');
        extractedText += '\n' + (imgResult.data?.extractedText || '');
        toast.success('Images processed!', { id: 'img' });
      }

      // 3. Add pasted text
      if (pastedText.trim()) {
        extractedText += '\n' + pastedText;
      }

      if (!extractedText.trim()) {
        setUploading(false);
        return toast.error('Could not extract text from files. Try a different PDF or paste text directly.');
      }

      setExtractedText(extractedText);
      setProgress(50);

      // 4. Run all AI processing
      toast.loading('Running AI analysis...', { id: 'ai' });
      const { data: aiResult } = await processAll(extractedText, quizCount);
      toast.success('AI done!', { id: 'ai' });

      setSummary(aiResult.data.summary);
      setQuiz(aiResult.data.quiz);
      setFlashcards(aiResult.data.flashcards);

      setProgress(100);
      toast.success('🎉 Everything ready!');
      navigate('/doc/local');

    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.error || 'Something went wrong');
    } finally {
      setUploading(false);
    }
  };

  const fileToBase64 = (file) => new Promise((res, rej) => {
    const r = new FileReader();
    r.onload = () => res(r.result.split(',')[1]);
    r.onerror = rej;
    r.readAsDataURL(file);
  });

  const fileIcon = (f) => f.type.startsWith('image/') ? Image : FileText;
  const fileColor = (f) => f.type.startsWith('image/') ? 'text-pink-400' : 'text-indigo-400';

  return (
    <div className="space-y-4">
      {/* Dropzone */}
      <div
        {...getRootProps()}
        className={`relative border-2 border-dashed rounded-2xl p-10 text-center cursor-pointer transition-all duration-300
          ${isDragActive
            ? 'border-indigo-500 bg-indigo-500/10 scale-[1.01]'
            : 'border-white/20 hover:border-indigo-500/50 hover:bg-white/5'
          }`}
      >
        <input {...getInputProps()} />
        <div className="flex flex-col items-center gap-3">
          <div className="w-14 h-14 rounded-2xl bg-indigo-500/20 flex items-center justify-center">
            <Upload size={26} className="text-indigo-400" />
          </div>
          <div>
            <p className="text-white font-semibold font-display text-lg">
              {isDragActive ? 'Drop it here!' : 'Drop your study material'}
            </p>
            <p className="text-slate-400 text-sm mt-1">
              PDFs, TXT, or <span className="text-pink-400">up to 10 JPEG/PNG images</span>
            </p>
            <p className="text-slate-500 text-xs mt-1">Max 20MB per file</p>
          </div>
        </div>
      </div>

      {/* File list */}
      {files.length > 0 && (
        <div className="space-y-2">
          {files.map((f, i) => {
            const Icon = fileIcon(f);
            return (
              <div key={i} className="glass rounded-xl px-4 py-3 flex items-center gap-3">
                <Icon size={16} className={fileColor(f)} />
                <span className="text-sm text-slate-300 flex-1 truncate">{f.name}</span>
                <span className="text-xs text-slate-500">{(f.size / 1024).toFixed(0)}KB</span>
                <button onClick={() => removeFile(i)} className="text-slate-500 hover:text-red-400 transition-colors">
                  <X size={14} />
                </button>
              </div>
            );
          })}
        </div>
      )}

      {/* Paste text toggle */}
      <button
        onClick={() => setShowPaste(!showPaste)}
        className="flex items-center gap-2 text-sm text-slate-400 hover:text-indigo-400 transition-colors"
      >
        <FileText size={14} />
        Or paste text directly
        {showPaste ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
      </button>

      {showPaste && (
        <textarea
          value={pastedText}
          onChange={e => setPastedText(e.target.value)}
          placeholder="Paste your notes, article, or any study material here..."
          rows={5}
          className="w-full glass rounded-xl p-4 text-sm text-slate-300 placeholder-slate-600 resize-none focus:outline-none focus:border-indigo-500 border border-transparent transition-colors"
        />
      )}

      {/* Quiz count selector */}
      <div className="glass rounded-xl px-4 py-3 flex items-center justify-between">
        <label className="text-sm text-slate-400">Number of quiz questions</label>
        <div className="flex items-center gap-3">
          <input
            type="range"
            min={5}
            max={20}
            value={quizCount}
            onChange={e => setQuizCount(Number(e.target.value))}
            className="w-32 accent-indigo-500"
          />
          <span className="text-indigo-400 font-bold font-display w-6 text-center">{quizCount}</span>
        </div>
      </div>

      {/* Progress bar */}
      {uploading && (
        <div className="glass rounded-xl p-4">
          <div className="flex justify-between text-xs text-slate-400 mb-2">
            <span>Processing...</span>
            <span>{progress}%</span>
          </div>
          <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full transition-all duration-500"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      )}

      {/* Submit */}
      <button
        onClick={processUpload}
        disabled={uploading || (files.length === 0 && !pastedText.trim())}
        className="w-full py-4 rounded-2xl bg-indigo-600 hover:bg-indigo-500 disabled:opacity-40 disabled:cursor-not-allowed
          font-display font-semibold text-white transition-all duration-200 flex items-center justify-center gap-2 glow"
      >
        {uploading ? (
          <><Loader2 size={18} className="animate-spin" /> Analyzing with AI...</>
        ) : (
          <><Sparkles size={18} /> Generate Summary, Flashcards & Quiz</>
        )}
      </button>
    </div>
  );
}