import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import Dashboard from './pages/Dashboard';
import DocumentView from './pages/DocumentView';
import Navbar from './components/Navbar';

export default function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-gray-950 text-white font-body">
        <Navbar />
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/doc/:id" element={<DocumentView />} />
        </Routes>
        <Toaster
          position="bottom-right"
          toastOptions={{
            style: { background: '#1e293b', color: '#f1f5f9', border: '1px solid #334155' },
            success: { iconTheme: { primary: '#6366f1', secondary: '#fff' } }
          }}
        />
      </div>
    </BrowserRouter>
  );
}
