import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { 
  Clock, 
  Phone, 
  Users, 
  Mail, 
  Calendar, 
  Loader2, 
  CheckCircle, 
  Plus,
  AlertCircle,
  Video,
  Bell
} from 'lucide-react';

const FollowUpModule = ({ role, salesmanId, username }) => {
  const currentRole = role || localStorage.getItem('role') || 'salesman';
  const currentUsername = username || localStorage.getItem('username') || '';

  const [followUps, setFollowUps] = useState([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    title: '',
    type: 'Call',
    description: '',
    dueDate: '',
    assignedTo: currentRole === 'salesman' ? currentUsername : '',
    contactId: ''
  });
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState('success');

  const fetchFollowUps = async () => {
    try {
      setLoading(true);
      const res = await axios.get('/api/followups');
      let data = res.data || [];
      
      // Zoho CRM logic: Salesmen only see their assigned follow-ups
      if (currentRole === 'salesman') {
        data = data.filter(f => f.assignedTo === currentUsername);
      }
      setFollowUps(data);
    } catch (error) {
      console.error("Error fetching follow-ups:", error);
      // Fallback data for preview
      const fallback = [
        { id: 1, title: 'Call with John', type: 'Call', description: 'Discuss proposal', dueDate: '2026-05-20T10:00', assignedTo: 'salesman', status: 'Pending' },
        { id: 2, title: 'Meeting with Acme', type: 'Meeting', description: 'Finalize contract', dueDate: '2026-05-21T14:00', assignedTo: 'salesman', status: 'Pending' }
      ];
      setFollowUps(currentRole === 'salesman' ? fallback.filter(f => f.assignedTo === currentUsername) : fallback);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const payload = {
      ...form,
      assignedTo: currentRole === 'salesman' ? currentUsername : form.assignedTo || 'unassigned'
    };

    try {
      if (!payload.title || !payload.type || !payload.dueDate || !payload.assignedTo) {
          setMessageType('error');
          setMessage('Please fill in all required fields.');
          return;
      }

      setSaving(true);
      await axios.post('/api/followups', payload);
      setForm({ 
        title: '', 
        type: 'Call', 
        description: '', 
        dueDate: '', 
        assignedTo: currentRole === 'salesman' ? currentUsername : '', 
        contactId: '' 
      });
      setMessageType('success');
      setMessage('✅ Follow-up scheduled successfully!');
      fetchFollowUps();
    } catch (error) {
      console.error("Error adding follow-up:", error);
      setMessageType('error');
      setMessage('❌ Failed to schedule follow-up. Please try again.');
    } finally {
      setSaving(false);
      setTimeout(() => setMessage(''), 4000);
    }
  };

  const markComplete = async (id) => {
    try {
      await axios.put(`/api/followups/${id}/complete`);
      fetchFollowUps();
    } catch (error) {
      console.error("Error marking follow-up complete:", error);
      alert('Failed to mark follow-up as complete.');
    }
  };

  useEffect(() => {
    fetchFollowUps();
  }, [currentRole, currentUsername]);

  const inputCls = "w-full bg-slate-950/50 text-slate-200 text-sm pl-11 pr-4 py-3 rounded-xl border border-slate-800 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent focus:bg-slate-950 transition-all duration-200 placeholder-slate-700";

  const getTypeIcon = (type) => {
    switch (type) {
      case 'Call': return <Phone className="w-4 h-4" />;
      case 'Meeting': return <Video className="w-4 h-4" />;
      case 'Email': return <Mail className="w-4 h-4" />;
      default: return <Bell className="w-4 h-4" />;
    }
  };

  return (
    <div className="p-4 space-y-6">
      
      {/* Module Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-slate-900/40 border border-slate-800/80 p-6 rounded-2xl backdrop-blur shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/5 blur-[80px] pointer-events-none rounded-full"></div>
        <div>
          <h2 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
            <Clock className="w-5 h-5 text-purple-400" />
            Follow-up & Reminders
          </h2>
          <p className="text-slate-400 text-xs mt-1">
            {currentRole === 'admin' 
              ? 'Oversee and schedule call, meeting, and email follow-ups system-wide.' 
              : 'Track, manage, and schedule your sales follow-ups and client reminders.'}
          </p>
        </div>
      </div>

      {/* ➕ Form for scheduling follow-ups */}
      <div className="p-6 bg-slate-900/30 border border-slate-800/60 backdrop-blur rounded-2xl shadow-lg relative overflow-hidden">
        <div className="absolute top-0 right-0 w-48 h-48 bg-purple-600/5 blur-[60px] pointer-events-none rounded-full"></div>
        <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-4 flex items-center gap-2">
          <Plus className="w-4 h-4 text-purple-400" />
          Schedule New Follow-up
        </h3>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Title */}
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-500">
                <Clock className="w-4 h-4" />
              </span>
              <input
                type="text"
                name="title"
                value={form.title}
                onChange={handleChange}
                placeholder="Title *"
                className={inputCls}
                required
              />
            </div>

            {/* Type */}
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-500">
                <Bell className="w-4 h-4" />
              </span>
              <select
                name="type"
                value={form.type}
                onChange={handleChange}
                className="w-full bg-slate-950/50 text-slate-300 text-sm pl-11 pr-4 py-3 rounded-xl border border-slate-800 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent focus:bg-slate-950 transition-all duration-200"
              >
                <option value="Call">Call</option>
                <option value="Meeting">Meeting</option>
                <option value="Reminder">Reminder</option>
                <option value="Email">Email</option>
              </select>
            </div>
          </div>

          {/* Description */}
          <div className="relative">
            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              placeholder="Description"
              rows="3"
              className="w-full bg-slate-950/50 text-slate-200 text-sm p-4 rounded-xl border border-slate-800 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent focus:bg-slate-950 transition-all duration-200 placeholder-slate-700"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Due Date */}
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-500">
                <Calendar className="w-4 h-4" />
              </span>
              <input
                type="datetime-local"
                name="dueDate"
                value={form.dueDate}
                onChange={handleChange}
                className="w-full bg-slate-950/50 text-slate-300 text-sm pl-11 pr-4 py-3 rounded-xl border border-slate-800 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent focus:bg-slate-950 transition-all duration-200"
                required
              />
            </div>

            {/* Assigned To */}
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-500">
                <Users className="w-4 h-4" />
              </span>
              {currentRole === 'admin' ? (
                <select
                  name="assignedTo"
                  value={form.assignedTo}
                  onChange={handleChange}
                  className="w-full bg-slate-950/50 text-slate-300 text-sm pl-11 pr-4 py-3 rounded-xl border border-slate-800 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent focus:bg-slate-950 transition-all duration-200"
                  required
                >
                  <option value="">-- Choose Agent --</option>
                  <option value="salesman">salesman</option>
                  <option value="Bharath S">Bharath S</option>
                </select>
              ) : (
                <input
                  type="text"
                  name="assignedTo"
                  value={form.assignedTo}
                  readOnly
                  placeholder="Assigned To *"
                  className={`${inputCls} bg-slate-950/80 border-purple-950/50 text-purple-400 font-bold cursor-not-allowed`}
                  required
                />
              )}
            </div>

            {/* Contact ID */}
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-500">
                <Plus className="w-4 h-4" />
              </span>
              <input
                type="text"
                name="contactId"
                value={form.contactId}
                onChange={handleChange}
                placeholder="Contact ID (Optional)"
                className={inputCls}
              />
            </div>
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
                  Scheduling...
                </>
              ) : (
                <>
                  <Clock className="w-4 h-4" />
                  Schedule Follow-up
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

      {/* 📅 Follow-up List */}
      <div className="space-y-4">
        <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-2">Upcoming Follow-ups</h3>
        
        {loading ? (
          <div className="flex flex-col items-center justify-center py-12 text-slate-500">
            <Loader2 className="w-6 h-6 animate-spin text-purple-400" />
            <span className="text-xs uppercase font-bold tracking-widest mt-2">Loading Follow-ups...</span>
          </div>
        ) : followUps.length === 0 ? (
          <div className="p-12 text-center text-slate-600 bg-slate-900/10 border border-slate-800/60 rounded-2xl border-dashed">
            <Clock className="w-6 h-6 text-slate-700 mx-auto mb-2" />
            <span className="text-xs uppercase font-bold tracking-wider">No follow-ups scheduled.</span>
          </div>
        ) : (
          <div className="space-y-3">
            {followUps.map(f => (
              <div
                key={f.id}
                className={`bg-slate-900/40 border ${f.status === 'Completed' ? 'border-slate-800 opacity-60' : 'border-slate-800/80 hover:border-purple-500/30'} rounded-2xl p-5 transition duration-150 relative overflow-hidden flex flex-col md:flex-row justify-between items-start md:items-center gap-4`}
              >
                <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/5 blur-[40px] pointer-events-none rounded-full"></div>
                
                <div className="flex-1 space-y-1">
                  <div className="flex items-center gap-2">
                    <div className={`p-1.5 rounded-lg ${f.status === 'Completed' ? 'bg-slate-800 text-slate-500' : 'bg-purple-500/10 text-purple-400'}`}>
                      {getTypeIcon(f.type)}
                    </div>
                    <h4 className={`font-bold text-base ${f.status === 'Completed' ? 'text-slate-500 line-through' : 'text-white'}`}>
                      {f.title}
                    </h4>
                    <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider ${f.status === 'Completed' ? 'bg-slate-800 text-slate-500' : 'bg-blue-500/10 text-blue-400'}`}>
                      {f.type}
                    </span>
                  </div>
                  <p className={`text-sm ${f.status === 'Completed' ? 'text-slate-600' : 'text-slate-400'}`}>
                    {f.description || 'No description provided.'}
                  </p>
                  <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-slate-500">
                    <div className="flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5" />
                      <span>{new Date(f.dueDate).toLocaleString()}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Users className="w-3.5 h-3.5" />
                      <span>Assigned: {f.assignedTo}</span>
                    </div>
                    {f.contactId && (
                      <div className="flex items-center gap-1">
                        <Plus className="w-3.5 h-3.5" />
                        <span>Contact ID: {f.contactId}</span>
                      </div>
                    )}
                  </div>
                </div>

                <div className="shrink-0">
                  <button
                    onClick={() => markComplete(f.id)}
                    disabled={f.status === 'Completed'}
                    className={`px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition duration-150 flex items-center gap-1.5 ${
                      f.status === 'Completed'
                        ? 'bg-slate-800 text-slate-600 cursor-not-allowed border border-slate-700'
                        : 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-lg shadow-emerald-900/20'
                    }`}
                  >
                    {f.status === 'Completed' ? (
                      <>
                        <CheckCircle className="w-3.5 h-3.5" />
                        Completed
                      </>
                    ) : (
                      <>
                        <CheckCircle className="w-3.5 h-3.5" />
                        Mark Complete
                      </>
                    )}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default FollowUpModule;