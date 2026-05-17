import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { 
  User, 
  Mail, 
  Phone, 
  Building, 
  Bookmark, 
  Globe, 
  Calendar, 
  DollarSign, 
  CheckCircle, 
  XCircle,
  FileText,
  Send,
  Loader2,
  Plus,
  Trash2,
  UserCheck
} from 'lucide-react';

const LeadModule = ({ role, salesmanId, username }) => {
  const currentRole = role || localStorage.getItem('role') || 'salesman';
  const currentUsername = username || localStorage.getItem('username') || '';

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    company: '',
    status: 'New',
    source: 'Website',
    assignedTo: currentRole === 'salesman' ? currentUsername : '',
    lastContact: '',
    value: '',
  });

  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState('success');

  const fetchLeads = async () => {
    try {
      setLoading(true);
      const res = await axios.get('/api/leads');
      let data = res.data || [];
      
      // Zoho CRM logic: Salesman can only see their own assigned leads
      if (currentRole === 'salesman') {
        data = data.filter(lead => lead.assignedTo === currentUsername);
      }
      setLeads(data);
    } catch (err) {
      console.error('Error fetching leads:', err);
      // Fallback data for preview
      const fallback = [
        { id: 1, name: 'John Doe', email: 'john@example.com', company: 'Acme Corp', status: 'New', source: 'Website', value: 5000, assignedTo: 'salesman' },
        { id: 2, name: 'Jane Smith', email: 'jane@example.com', company: 'Global Tech', status: 'Qualified', source: 'Referral', value: 12000, assignedTo: 'salesman' }
      ];
      setLeads(currentRole === 'salesman' ? fallback.filter(l => l.assignedTo === currentUsername) : fallback);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLeads();
  }, [currentRole, currentUsername]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setSaving(true);
      const res = await axios.post('/api/leads', formData);
      if (res.data.success) {
        setMessageType('success');
        setMessage('✅ Lead saved successfully!');
        setFormData({
          name: '',
          email: '',
          phone: '',
          company: '',
          status: 'New',
          source: 'Website',
          assignedTo: currentRole === 'salesman' ? currentUsername : '',
          lastContact: '',
          value: '',
        });
        fetchLeads();
      } else {
        setMessageType('error');
        setMessage('❌ ' + (res.data.message || 'Failed to save lead'));
      }
    } catch (err) {
      console.error('API Error:', err);
      setMessageType('error');
      setMessage('❌ Server connection failed. Lead could not be saved.');
    } finally {
      setSaving(false);
      setTimeout(() => setMessage(''), 4000);
    }
  };

  const handleAssign = async (leadId, agentName) => {
    try {
      await axios.put(`/api/leads/${leadId}`, { assignedTo: agentName });
      setMessageType('success');
      setMessage('✅ Lead assigned successfully!');
      fetchLeads();
    } catch (err) {
      console.error('Failed to assign lead:', err);
      setMessageType('error');
      setMessage('❌ Failed to assign lead.');
    } finally {
      setTimeout(() => setMessage(''), 3000);
    }
  };

  const handleDelete = async (leadId) => {
    if (!window.confirm('Are you sure you want to delete this lead?')) return;
    try {
      await axios.delete(`/api/leads/${leadId}`);
      setMessageType('success');
      setMessage('🗑️ Lead deleted successfully!');
      fetchLeads();
    } catch (err) {
      console.error('Failed to delete lead:', err);
      setMessageType('error');
      setMessage('❌ Failed to delete lead.');
    } finally {
      setTimeout(() => setMessage(''), 3000);
    }
  };

  const inputCls = "w-full bg-slate-950/50 text-slate-200 text-sm pl-11 pr-4 py-3 rounded-xl border border-slate-800 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent focus:bg-slate-950 transition-all duration-200 placeholder-slate-700";

  const getStatusStyle = (status) => {
    switch (status) {
      case 'New': return 'bg-blue-500/10 text-blue-400 border-blue-500/20';
      case 'Contacted': return 'bg-amber-500/10 text-amber-400 border-amber-500/20';
      case 'Qualified': return 'bg-purple-500/10 text-purple-400 border-purple-500/20';
      case 'Converted': return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20';
      default: return 'bg-slate-500/10 text-slate-400 border-slate-500/20';
    }
  };

  return (
    <div className="p-4 space-y-6">
      
      {/* Module Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-slate-900/40 border border-slate-800/80 p-6 rounded-2xl backdrop-blur shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/5 blur-[80px] pointer-events-none rounded-full"></div>
        <div>
          <h2 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
            <User className="w-5 h-5 text-purple-400" />
            Lead Management
          </h2>
          <p className="text-slate-400 text-xs mt-1">
            {currentRole === 'admin' 
              ? 'Monitor, manage, and assign system-wide leads.' 
              : 'Capture, track, and manage your assigned customer leads.'}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* ➕ Lead Form (Only show for Salesman, not Admin - Zoho CRM Concept) */}
        {currentRole !== 'admin' && (
          <div className="p-6 bg-slate-900/30 border border-slate-800/60 backdrop-blur rounded-2xl shadow-lg relative overflow-hidden h-fit">
            <div className="absolute top-0 right-0 w-48 h-48 bg-purple-600/5 blur-[60px] pointer-events-none rounded-full"></div>
            <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-4 flex items-center gap-2">
              <Plus className="w-4 h-4 text-purple-400" />
              Capture New Lead
            </h3>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Name */}
              <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-500">
                  <User className="w-4 h-4" />
                </span>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  placeholder="Full Name *"
                  onChange={handleChange}
                  className={inputCls}
                  required
                />
              </div>

              {/* Email */}
              <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-500">
                  <Mail className="w-4 h-4" />
                </span>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  placeholder="Email Address *"
                  onChange={handleChange}
                  className={inputCls}
                  required
                />
              </div>

              {/* Phone */}
              <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-500">
                  <Phone className="w-4 h-4" />
                </span>
                <input
                  type="text"
                  name="phone"
                  value={formData.phone}
                  placeholder="Phone Number"
                  onChange={handleChange}
                  className={inputCls}
                />
              </div>

              {/* Company */}
              <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-500">
                  <Building className="w-4 h-4" />
                </span>
                <input
                  type="text"
                  name="company"
                  value={formData.company}
                  placeholder="Company Name"
                  onChange={handleChange}
                  className={inputCls}
                />
              </div>

              {/* Status */}
              <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-500">
                  <Bookmark className="w-4 h-4" />
                </span>
                <select
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                  className="w-full bg-slate-950/50 text-slate-300 text-sm pl-11 pr-4 py-3 rounded-xl border border-slate-800 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent focus:bg-slate-950 transition-all duration-200"
                >
                  <option value="New">New</option>
                  <option value="Contacted">Contacted</option>
                  <option value="Qualified">Qualified</option>
                  <option value="Converted">Converted</option>
                </select>
              </div>

              {/* Source */}
              <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-500">
                  <Globe className="w-4 h-4" />
                </span>
                <select
                  name="source"
                  value={formData.source}
                  onChange={handleChange}
                  className="w-full bg-slate-950/50 text-slate-300 text-sm pl-11 pr-4 py-3 rounded-xl border border-slate-800 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent focus:bg-slate-950 transition-all duration-200"
                >
                  <option value="Website">Website</option>
                  <option value="Referral">Referral</option>
                  <option value="Call">Call</option>
                  <option value="Campaign">Campaign</option>
                </select>
              </div>

              {/* Value */}
              <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-500">
                  <DollarSign className="w-4 h-4 text-emerald-400" />
                </span>
                <input
                  type="number"
                  name="value"
                  value={formData.value}
                  placeholder="Estimated Value"
                  onChange={handleChange}
                  className={inputCls}
                />
              </div>

              <button
                type="submit"
                disabled={saving}
                className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-bold py-3 rounded-xl text-xs uppercase tracking-wider transition-all duration-200 shadow-md shadow-indigo-950/20 disabled:opacity-60 flex items-center justify-center gap-2"
              >
                {saving ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4" />
                    Save Lead
                  </>
                )}
              </button>
            </form>
          </div>
        )}

        {/* 📋 Leads List (Full Width for Admin, Split for Salesman) */}
        <div className={`${currentRole === 'admin' ? 'lg:col-span-3' : 'lg:col-span-2'} space-y-4`}>
          <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-2">Registered Leads</h3>
          
          {message && (
            <div className={`p-3 rounded-xl flex items-center gap-3 border text-xs leading-relaxed animate-fade-in ${
              messageType === 'error' 
                ? 'bg-red-500/10 border-red-500/20 text-red-400' 
                : 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400'
            }`}>
              {messageType === 'error' ? (
                <XCircle className="w-4 h-4 shrink-0" />
              ) : (
                <CheckCircle className="w-4 h-4 shrink-0" />
              )}
              <p>{message}</p>
            </div>
          )}

          {loading ? (
            <div className="flex flex-col items-center justify-center py-12 text-slate-500">
              <Loader2 className="w-6 h-6 animate-spin text-purple-400" />
              <span className="text-xs uppercase font-bold tracking-widest mt-2">Loading Leads...</span>
            </div>
          ) : leads.length === 0 ? (
            <div className="p-12 text-center text-slate-600 bg-slate-900/10 border border-slate-800/60 rounded-2xl border-dashed">
              <User className="w-6 h-6 text-slate-700 mx-auto mb-2" />
              <span className="text-xs uppercase font-bold tracking-wider">No leads found.</span>
            </div>
          ) : (
            <div className="space-y-3">
              {leads.map(lead => (
                <div
                  key={lead.id}
                  className="bg-slate-900/40 border border-slate-800/80 rounded-2xl p-4 hover:border-purple-500/30 transition duration-150 relative overflow-hidden flex flex-col md:flex-row justify-between items-start md:items-center gap-4"
                >
                  <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/5 blur-[40px] pointer-events-none rounded-full"></div>
                  
                  <div className="flex-1 space-y-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h4 className="font-bold text-white text-base">{lead.name}</h4>
                      <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider border ${getStatusStyle(lead.status)}`}>
                        {lead.status}
                      </span>
                      {lead.assignedTo && (
                        <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-slate-800 border border-slate-700 text-slate-300 flex items-center gap-1">
                          <UserCheck className="w-3 h-3 text-purple-400" />
                          Assigned: {lead.assignedTo}
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-slate-400 flex items-center gap-1">
                      <Mail className="w-3.5 h-3.5" /> {lead.email}
                    </p>
                    {lead.company && (
                      <p className="text-xs text-slate-500 flex items-center gap-1">
                        <Building className="w-3.5 h-3.5" /> {lead.company}
                      </p>
                    )}
                  </div>

                  <div className="flex flex-wrap gap-2 items-center text-xs w-full md:w-auto md:justify-end">
                    <span className="px-2.5 py-1 bg-slate-800 rounded-lg text-slate-300 flex items-center gap-1">
                      <Globe className="w-3 h-3" /> {lead.source}
                    </span>
                    {lead.value > 0 && (
                      <span className="px-2.5 py-1 bg-emerald-500/10 rounded-lg text-emerald-400 font-semibold flex items-center gap-1">
                        <DollarSign className="w-3 h-3" /> {lead.value}
                      </span>
                    )}

                    {/* Admin Options: Lead Assignment & Cleanup (Zoho CRM Concept) */}
                    {currentRole === 'admin' && (
                      <div className="flex items-center gap-2 ml-2">
                        {/* Assign Lead to Salesman */}
                        <div className="relative">
                          <select
                            value={lead.assignedTo || ''}
                            onChange={(e) => handleAssign(lead.id, e.target.value)}
                            className="bg-slate-950 text-slate-300 border border-slate-800 px-3 py-1.5 rounded-xl text-xs focus:ring-1 focus:ring-purple-500 focus:outline-none"
                          >
                            <option value="">-- Unassigned --</option>
                            <option value="salesman">salesman</option>
                            <option value="Bharath S">Bharath S</option>
                          </select>
                        </div>

                        {/* Admin Delete Lead */}
                        <button
                          onClick={() => handleDelete(lead.id)}
                          className="p-1.5 bg-red-500/10 border border-red-500/20 text-red-400 hover:bg-red-500/20 rounded-xl transition duration-150"
                          title="Delete Lead"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>
    </div>
  );
};

export default LeadModule;
