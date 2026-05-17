import React, { useState } from 'react';
import axios from 'axios';
import { 
  Mail, 
  User, 
  PenSquare, 
  Paperclip, 
  Send, 
  Loader2,
  CheckCircle,
  AlertCircle
} from 'lucide-react';

const EmailIntegrationModule = () => {
  const [formData, setFormData] = useState({
    to: '',
    subject: '',
    text: ''
  });
  const [file, setFile] = useState(null);
  const [sending, setSending] = useState(false);
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState('success');

  const handleChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const sendEmail = async (e) => {
    e.preventDefault();
    setSending(true);
    setMessage('');
    
    const data = new FormData();
    Object.entries(formData).forEach(([key, value]) => data.append(key, value));
    if (file) data.append('attachment', file);

    try {
      const res = await axios.post('/api/email/send', data);
      setMessageType('success');
      setMessage(res.data.message || '✅ Email sent successfully!');
      setFormData({ to: '', subject: '', text: '' });
      setFile(null);
    } catch (err) {
      console.error('Send Error:', err);
      setMessageType('error');
      setMessage('❌ Email failed to send. Please check your connection.');
    } finally {
      setSending(false);
      setTimeout(() => setMessage(''), 5000);
    }
  };

  const inputCls = "w-full bg-slate-950/50 text-slate-200 text-sm pl-11 pr-4 py-3 rounded-xl border border-slate-800 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent focus:bg-slate-950 transition-all duration-200 placeholder-slate-700";

  return (
    <div className="p-4 space-y-6">
      
      {/* Module Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-slate-900/40 border border-slate-800/80 p-6 rounded-2xl backdrop-blur shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/5 blur-[80px] pointer-events-none rounded-full"></div>
        <div>
          <h2 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
            <Mail className="w-5 h-5 text-purple-400" />
            Email Integration
          </h2>
          <p className="text-slate-400 text-xs mt-1">Compose, track, and reply to leads directly from the dashboard.</p>
        </div>
      </div>

      {/* 📧 Compose Form */}
      <div className="p-6 bg-slate-900/30 border border-slate-800/60 backdrop-blur rounded-2xl shadow-lg relative overflow-hidden max-w-4xl mx-auto">
        <div className="absolute top-0 right-0 w-48 h-48 bg-purple-600/5 blur-[60px] pointer-events-none rounded-full"></div>
        
        <form onSubmit={sendEmail} className="space-y-4">
          
          {/* Recipient */}
          <div className="relative">
            <label className="block text-slate-400 text-xs font-bold uppercase tracking-wider mb-2">Recipient Email</label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-500">
                <User className="w-4 h-4" />
              </span>
              <input 
                type="email" 
                name="to" 
                value={formData.to} 
                onChange={handleChange} 
                placeholder="e.g. client@example.com" 
                required 
                className={inputCls} 
              />
            </div>
          </div>

          {/* Subject */}
          <div className="relative">
            <label className="block text-slate-400 text-xs font-bold uppercase tracking-wider mb-2">Subject</label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-500">
                <PenSquare className="w-4 h-4" />
              </span>
              <input 
                type="text" 
                name="subject" 
                value={formData.subject} 
                onChange={handleChange} 
                placeholder="Enter email subject" 
                required 
                className={inputCls} 
              />
            </div>
          </div>

          {/* Message */}
          <div className="relative">
            <label className="block text-slate-400 text-xs font-bold uppercase tracking-wider mb-2">Message</label>
            <textarea 
              name="text" 
              value={formData.text} 
              onChange={handleChange} 
              placeholder="Write your message here..." 
              rows="6" 
              className="w-full bg-slate-950/50 text-slate-200 text-sm p-4 rounded-xl border border-slate-800 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent focus:bg-slate-950 transition-all duration-200 placeholder-slate-700" 
              required 
            />
          </div>

          {/* Attachment */}
          <div className="relative">
            <label className="block text-slate-400 text-xs font-bold uppercase tracking-wider mb-2">Attachment</label>
            <div className="flex items-center gap-3">
              <label className="flex items-center gap-2 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white px-4 py-2.5 rounded-xl text-xs font-semibold transition duration-150 border border-slate-700 cursor-pointer">
                <Paperclip className="w-4 h-4" />
                {file ? 'Change File' : 'Attach File'}
                <input type="file" onChange={handleFileChange} className="hidden" />
              </label>
              {file && (
                <span className="text-xs text-slate-400 truncate max-w-xs">
                  {file.name}
                </span>
              )}
            </div>
          </div>

          {/* Submit Button */}
          <div className="pt-2">
            <button
              type="submit"
              disabled={sending}
              className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-bold px-6 py-3.5 rounded-xl text-xs uppercase tracking-wider transition-all duration-200 shadow-md shadow-indigo-950/20 disabled:opacity-60 flex items-center justify-center gap-2"
            >
              {sending ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Sending Email...
                </>
              ) : (
                <>
                  <Send className="w-4 h-4" />
                  Send Email
                </>
              )}
            </button>
          </div>
        </form>

        {/* Feedback Message */}
        {message && (
          <div className={`mt-4 p-3 rounded-xl flex items-center gap-3 border text-xs leading-relaxed animate-fade-in ${
            messageType === 'error' 
              ? 'bg-red-500/10 border-red-500/20 text-red-400' 
              : 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400'
          }`}>
            {messageType === 'error' ? (
              <AlertCircle className="w-4 h-4 shrink-0" />
            ) : (
              <CheckCircle className="w-4 h-4 shrink-0" />
            )}
            <p>{message}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default EmailIntegrationModule;

