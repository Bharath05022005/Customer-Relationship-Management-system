import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { 
  ClipboardList, 
  Mail, 
  Phone, 
  Users, 
  FileText, 
  Plus, 
  Loader2,
  AlertCircle,
  CheckCircle,
  Clock,
  Video,
  Tag
} from 'lucide-react';

const ActivityLogModule = () => {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    type: 'Email',
    subject: '',
    description: '',
    relatedTo: ''
  });
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState('success');

  const fetchLogs = async () => {
    try {
      setLoading(true);
      const res = await axios.get('/api/activities');
      setLogs(res.data || []);
    } catch (err) {
      console.error('Error fetching activity logs:', err);
      // Fallback data for preview
      setLogs([
        { id: 1, type: 'Email', subject: 'Follow up on proposal', description: 'Sent email to Acme Corp', relatedTo: 'Acme Corp', dateTime: '2026-05-17T10:00:00Z' },
        { id: 2, type: 'Call', subject: 'Initial Discovery Call', description: 'Discussed requirements with John', relatedTo: 'John Doe', dateTime: '2026-05-16T14:30:00Z' }
      ]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLogs();
  }, []);

  const handleChange = (e) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setSaving(true);
      await axios.post('/api/activities', formData);
      setMessageType('success');
      setMessage('✅ Activity logged successfully!');
      fetchLogs();
      setFormData({ type: 'Email', subject: '', description: '', relatedTo: '' });
    } catch (err) {
      console.error('Error adding activity log:', err);
      setMessageType('error');
      setMessage('❌ Failed to log activity.');
    } finally {
      setSaving(false);
      setTimeout(() => setMessage(''), 4000);
    }
  };

  const inputCls = "w-full bg-slate-950/50 text-slate-200 text-sm pl-11 pr-4 py-3 rounded-xl border border-slate-800 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent focus:bg-slate-950 transition-all duration-200 placeholder-slate-700";

  const getTypeIcon = (type) => {
    switch (type) {
      case 'Email': return <Mail className="w-4 h-4" />;
      case 'Call': return <Phone className="w-4 h-4" />;
      case 'Meeting': return <Video className="w-4 h-4" />;
      case 'Note': return <FileText className="w-4 h-4" />;
      default: return <Tag className="w-4 h-4" />;
    }
  };

  return (
    <div className="p-4 space-y-6">
      
      {/* Module Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-slate-900/40 border border-slate-800/80 p-6 rounded-2xl backdrop-blur shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/5 blur-[80px] pointer-events-none rounded-full"></div>
        <div>
          <h2 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
            <ClipboardList className="w-5 h-5 text-purple-400" />
            Activity Log & Timeline
          </h2>
          <p className="text-slate-400 text-xs mt-1">Audit trail of customer engagement and internal notes.</p>
        </div>
      </div>

      {/* ➕ Form */}
      <div className="p-6 bg-slate-900/30 border border-slate-800/60 backdrop-blur rounded-2xl shadow-lg relative overflow-hidden">
        <div className="absolute top-0 right-0 w-48 h-48 bg-purple-600/5 blur-[60px] pointer-events-none rounded-full"></div>
        <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-4 flex items-center gap-2">
          <Plus className="w-4 h-4 text-purple-400" />
          Log New Activity
        </h3>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Type */}
            <div className="relative">
              <label className="block text-slate-400 text-xs font-bold uppercase tracking-wider mb-2">Activity Type</label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-500">
                  <Tag className="w-4 h-4" />
                </span>
                <select
                  name="type"
                  value={formData.type}
                  onChange={handleChange}
                  className="w-full bg-slate-950/50 text-slate-300 text-sm pl-11 pr-4 py-3 rounded-xl border border-slate-800 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent focus:bg-slate-950 transition-all duration-200"
                >
                  <option>Email</option>
                  <option>Call</option>
                  <option>Meeting</option>
                  <option>Deal Update</option>
                  <option>Note</option>
                </select>
              </div>
            </div>

            {/* Related To */}
            <div className="relative">
              <label className="block text-slate-400 text-xs font-bold uppercase tracking-wider mb-2">Related To (Customer)</label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-500">
                  <Users className="w-4 h-4" />
                </span>
                <input
                  type="text"
                  name="relatedTo"
                  value={formData.relatedTo}
                  onChange={handleChange}
                  placeholder="e.g. Acme Corp"
                  className={inputCls}
                />
              </div>
            </div>
          </div>

          {/* Subject */}
          <div className="relative">
            <label className="block text-slate-400 text-xs font-bold uppercase tracking-wider mb-2">Subject</label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-500">
                <FileText className="w-4 h-4" />
              </span>
              <input
                type="text"
                name="subject"
                value={formData.subject}
                onChange={handleChange}
                placeholder="Enter subject"
                className={inputCls}
                required
              />
            </div>
          </div>

          {/* Description */}
          <div className="relative">
            <label className="block text-slate-400 text-xs font-bold uppercase tracking-wider mb-2">Description</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Describe the activity..."
              rows="3"
              className="w-full bg-slate-950/50 text-slate-200 text-sm p-4 rounded-xl border border-slate-800 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent focus:bg-slate-950 transition-all duration-200 placeholder-slate-700"
              required
            />
          </div>

          <div className="flex justify-end pt-2">
            <button
              type="submit"
              disabled={saving}
              className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-bold px-6 py-3 rounded-xl text-xs uppercase tracking-wider transition-all duration-200 shadow-md shadow-indigo-950/20 disabled:opacity-60 flex items-center gap-2"
            >
              {saving ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Logging...
                </>
              ) : (
                <>
                  <ClipboardList className="w-4 h-4" />
                  Add Activity
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

      {/* 📅 Activity Timeline */}
      <div className="space-y-4">
        <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-2">Activity Timeline</h3>
        
        {loading ? (
          <div className="flex flex-col items-center justify-center py-12 text-slate-500">
            <Loader2 className="w-6 h-6 animate-spin text-purple-400" />
            <span className="text-xs uppercase font-bold tracking-widest mt-2">Loading Timeline...</span>
          </div>
        ) : logs.length === 0 ? (
          <div className="p-12 text-center text-slate-600 bg-slate-900/10 border border-slate-800/60 rounded-2xl border-dashed">
            <ClipboardList className="w-6 h-6 text-slate-700 mx-auto mb-2" />
            <span className="text-xs uppercase font-bold tracking-wider">No activities logged yet.</span>
          </div>
        ) : (
          <div className="relative before:absolute before:inset-y-0 before:left-6 before:w-0.5 before:bg-slate-800">
            {logs.map((log) => (
              <div key={log.id} className="relative pl-16 mb-6 last:mb-0">
                {/* Timeline Node */}
                <div className="absolute left-4 top-1 w-4 h-4 bg-purple-500 border-2 border-slate-950 rounded-full z-10"></div>
                
                <div className="bg-slate-900/40 border border-slate-800/80 rounded-2xl p-5 hover:border-purple-500/30 transition duration-150 relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/5 blur-[40px] pointer-events-none rounded-full"></div>
                  
                  <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-2 mb-2">
                    <div className="flex items-center gap-2">
                      <div className="p-1.5 bg-purple-500/10 text-purple-400 rounded-lg">
                        {getTypeIcon(log.type)}
                      </div>
                      <h4 className="font-bold text-white text-base">{log.subject}</h4>
                      <span className="px-2 py-0.5 bg-slate-800 text-slate-400 rounded-md text-[10px] font-bold uppercase tracking-wider">
                        {log.type}
                      </span>
                    </div>
                    <div className="flex items-center gap-1 text-xs text-slate-500">
                      <Clock className="w-3.5 h-3.5" />
                      <span>{new Date(log.dateTime).toLocaleString()}</span>
                    </div>
                  </div>

                  <p className="text-sm text-slate-400 mb-2">{log.description}</p>
                  
                  <div className="flex items-center gap-1 text-xs text-slate-600">
                    <Users className="w-3.5 h-3.5" />
                    <span>Customer: <strong className="text-slate-400">{log.relatedTo || 'N/A'}</strong></span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ActivityLogModule;
