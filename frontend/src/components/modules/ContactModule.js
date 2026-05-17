// src/components/modules/ContactModule.js
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { 
  User, 
  Mail, 
  Phone, 
  Building, 
  FileText, 
  PlusCircle, 
  Edit3, 
  Trash2, 
  X, 
  CheckCircle2, 
  AlertCircle,
  Loader2,
  Users,
  UserCheck
} from 'lucide-react';

const initialForm = { name: '', email: '', phone: '', company: '', notes: '', assignedTo: '' };

const ContactModule = ({ role, salesmanId, username }) => {
  const currentRole = role || localStorage.getItem('role') || 'salesman';
  const currentUsername = username || localStorage.getItem('username') || '';

  const [contacts, setContacts] = useState([]);
  const [form, setForm] = useState({ ...initialForm, assignedTo: currentRole === 'salesman' ? currentUsername : '' });
  const [editId, setEditId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const inputCls =
    'w-full bg-slate-950/50 text-slate-200 text-sm pl-11 pr-4 py-3 rounded-xl border border-slate-800 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent focus:bg-slate-950 transition-all duration-200 placeholder-slate-700';

  const fetchContacts = async () => {
    try {
      setLoading(true);
      const res = await axios.get('/api/contacts');
      let data = res.data || [];
      
      // Zoho CRM logic: Salesmen only see their assigned contacts
      if (currentRole === 'salesman') {
        data = data.filter(c => c.assignedTo === currentUsername);
      }
      setContacts(data);
      setError('');
    } catch (err) {
      console.error('❌ Failed to fetch contacts', err);
      setError('Failed to load contacts. Ensure your database is active.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchContacts();
  }, [currentRole, currentUsername]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
  };

  const showFeedback = (msg, isError = false) => {
    if (isError) {
      setError(msg);
      setSuccessMsg('');
    } else {
      setSuccessMsg(msg);
      setError('');
    }
    setTimeout(() => {
      setSuccessMsg('');
      setError('');
    }, 4000);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    
    const payload = {
      ...form,
      assignedTo: currentRole === 'salesman' ? currentUsername : form.assignedTo || 'unassigned'
    };

    try {
      if (editId) {
        await axios.put(`/api/contacts/${editId}`, payload);
        showFeedback('✅ Contact updated successfully!');
      } else {
        await axios.post('/api/contacts', payload);
        showFeedback('✅ Contact added successfully!');
      }
      setForm({ ...initialForm, assignedTo: currentRole === 'salesman' ? currentUsername : '' });
      setEditId(null);
      fetchContacts();
    } catch (err) {
      console.error(err);
      showFeedback('❌ Failed to save contact', true);
    } finally {
      setSaving(false);
    }
  };

  const handleEdit = (contact) => {
    setForm({
      name: contact.name || '',
      email: contact.email || '',
      phone: contact.phone || '',
      company: contact.company || '',
      notes: contact.notes || '',
      assignedTo: contact.assignedTo || '',
    });
    setEditId(contact.id);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this contact?')) return;
    try {
      await axios.delete(`/api/contacts/${id}`);
      showFeedback('✅ Contact deleted successfully!');
      fetchContacts();
    } catch (err) {
      console.error(err);
      showFeedback('❌ Failed to delete contact', true);
    }
  };

  const handleAssign = async (contactId, agentName) => {
    try {
      await axios.put(`/api/contacts/${contactId}`, { assignedTo: agentName });
      showFeedback('✅ Contact reassigned successfully!');
      fetchContacts();
    } catch (err) {
      console.error('Failed to assign contact:', err);
      showFeedback('❌ Failed to assign contact', true);
    }
  };

  const handleCancelEdit = () => {
    setForm({ ...initialForm, assignedTo: currentRole === 'salesman' ? currentUsername : '' });
    setEditId(null);
  };

  return (
    <div className="p-4 space-y-6">
      
      {/* Module Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-slate-900/40 border border-slate-800/80 p-6 rounded-2xl backdrop-blur shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/5 blur-[80px] pointer-events-none rounded-full"></div>
        <div>
          <h2 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
            <Users className="w-5 h-5 text-purple-400" />
            Contact Directory
          </h2>
          <p className="text-slate-400 text-xs mt-1">
            {currentRole === 'admin' 
              ? 'Oversee, assign, and manage global contacts across all corporate accounts.' 
              : 'Add, view, and organize your assigned customer contacts.'}
          </p>
        </div>
      </div>

      {/* Input Form Panel */}
      <div className="p-6 bg-slate-900/30 border border-slate-800/60 backdrop-blur rounded-2xl shadow-lg">
        <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-4">
          {editId ? '📝 Edit Contact Parameters' : '➕ Register New Contact'}
        </h3>
        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          {/* Contact Name */}
          <div className="relative">
            <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-500">
              <User className="w-4 h-4" />
            </span>
            <input
              name="name"
              value={form.name}
              onChange={handleChange}
              placeholder="Full Name *"
              required
              className={inputCls}
            />
          </div>

          {/* Contact Email */}
          <div className="relative">
            <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-500">
              <Mail className="w-4 h-4" />
            </span>
            <input
              name="email"
              type="email"
              value={form.email}
              onChange={handleChange}
              placeholder="Email Address"
              className={inputCls}
            />
          </div>

          {/* Contact Phone */}
          <div className="relative">
            <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-500">
              <Phone className="w-4 h-4" />
            </span>
            <input
              name="phone"
              value={form.phone}
              onChange={handleChange}
              placeholder="Phone Number"
              className={inputCls}
            />
          </div>

          {/* Contact Company */}
          <div className="relative">
            <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-500">
              <Building className="w-4 h-4" />
            </span>
            <input
              name="company"
              value={form.company}
              onChange={handleChange}
              placeholder="Company Name"
              className={inputCls}
            />
          </div>

          {/* Notes/Comments */}
          <div className="relative">
            <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-500">
              <FileText className="w-4 h-4" />
            </span>
            <input
              name="notes"
              value={form.notes}
              onChange={handleChange}
              placeholder="Internal Notes"
              className={inputCls}
            />
          </div>

          {/* Actions Row */}
          <div className="col-span-full flex items-center justify-end gap-3 pt-2">
            {editId && (
              <button
                type="button"
                onClick={handleCancelEdit}
                className="px-5 py-3 rounded-xl border border-slate-800 bg-slate-950 text-slate-400 hover:text-white hover:bg-slate-900 transition text-xs font-bold uppercase tracking-wider"
              >
                Cancel
              </button>
            )}
            <button
              type="submit"
              disabled={saving}
              className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-bold px-6 py-3 rounded-xl text-xs uppercase tracking-wider transition-all duration-200 shadow-md shadow-indigo-950/20 disabled:opacity-60 flex items-center gap-2"
            >
              {saving ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <PlusCircle className="w-4 h-4" />
                  {editId ? 'Update Record' : 'Register Contact'}
                </>
              )}
            </button>
          </div>
        </form>
      </div>

      {/* DYNAMIC FEEDBACK alerts */}
      {successMsg && (
        <div className="p-4 rounded-xl flex items-center gap-3 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs animate-fade-in">
          <CheckCircle2 className="w-5 h-5 shrink-0" />
          <p>{successMsg}</p>
        </div>
      )}
      {error && (
        <div className="p-4 rounded-xl flex items-center gap-3 bg-red-500/10 border border-red-500/20 text-red-400 text-xs animate-fade-in">
          <AlertCircle className="w-5 h-5 shrink-0" />
          <p>{error}</p>
        </div>
      )}

      {/* TABLE DIRECTORY VIEW */}
      <div className="overflow-x-auto rounded-2xl border border-slate-900 shadow-xl bg-slate-900/10">
        <table className="w-full text-left text-sm text-slate-300">
          <thead className="bg-slate-950/80 text-xs font-bold uppercase tracking-wider text-slate-400 border-b border-slate-900">
            <tr>
              <th className="p-4">Contact Profile</th>
              <th className="p-4">Corporate Company</th>
              <th className="p-4">Owner / Assignee</th>
              <th className="p-4">Communication Notes</th>
              <th className="p-4 w-40 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-900">
            {loading ? (
              <tr>
                <td colSpan="5" className="p-12 text-center text-slate-500">
                  <div className="flex flex-col items-center justify-center gap-2">
                    <Loader2 className="w-6 h-6 animate-spin text-purple-400" />
                    <span className="text-xs uppercase font-bold tracking-widest mt-1">Loading Directory...</span>
                  </div>
                </td>
              </tr>
            ) : contacts.length === 0 ? (
              <tr>
                <td colSpan="5" className="p-12 text-center text-slate-600">
                  <div className="flex flex-col items-center justify-center gap-2">
                    <AlertCircle className="w-6 h-6 text-slate-700" />
                    <span className="text-xs uppercase font-bold tracking-wider">No contacts available inside database</span>
                  </div>
                </td>
              </tr>
            ) : (
              contacts.map((c) => (
                <tr key={c.id} className="hover:bg-slate-950/40 transition duration-150">
                  {/* Name, Email, Phone combined */}
                  <td className="p-4">
                    <div className="space-y-1">
                      <div className="font-bold text-white text-base">{c.name}</div>
                      <div className="flex flex-col sm:flex-row sm:items-center gap-x-3 gap-y-0.5 text-xs text-slate-500">
                        {c.email && <span className="hover:text-slate-300 transition duration-150">{c.email}</span>}
                        {c.phone && <span className="text-slate-600 hidden sm:inline">•</span>}
                        {c.phone && <span className="hover:text-slate-300 transition duration-150">{c.phone}</span>}
                      </div>
                    </div>
                  </td>
                  
                  {/* Company */}
                  <td className="p-4">
                    {c.company ? (
                      <span className="px-3 py-1 bg-indigo-500/5 border border-indigo-500/20 rounded-lg text-xs font-semibold text-indigo-400">
                        {c.company}
                      </span>
                    ) : (
                      <span className="text-xs text-slate-600">—</span>
                    )}
                  </td>

                  {/* Owner / Assignee (Zoho Concept) */}
                  <td className="p-4">
                    {currentRole === 'admin' ? (
                      <select
                        value={c.assignedTo || ''}
                        onChange={(e) => handleAssign(c.id, e.target.value)}
                        className="bg-slate-950 text-slate-300 border border-slate-800 px-2 py-1 rounded text-xs focus:outline-none"
                      >
                        <option value="">-- Unassigned --</option>
                        <option value="salesman">salesman</option>
                        <option value="Bharath S">Bharath S</option>
                      </select>
                    ) : (
                      <span className="text-xs text-slate-400 flex items-center gap-1">
                        <UserCheck className="w-3.5 h-3.5 text-purple-400" />
                        {c.assignedTo || 'Unassigned'}
                      </span>
                    )}
                  </td>

                  {/* Notes */}
                  <td className="p-4 text-xs text-slate-400 font-medium max-w-xs truncate">
                    {c.notes || <span className="text-slate-600 italic">No notes</span>}
                  </td>

                  {/* Edit/Delete Actions */}
                  <td className="p-4 text-right">
                    <div className="flex justify-end gap-2">
                      <button
                        onClick={() => handleEdit(c)}
                        className="p-2 bg-slate-900 hover:bg-slate-800 border border-slate-800 hover:border-purple-500/30 text-slate-300 hover:text-purple-400 rounded-lg transition duration-150"
                        title="Edit Contact"
                      >
                        <Edit3 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(c.id)}
                        className="p-2 bg-slate-900 hover:bg-slate-800 border border-slate-800 hover:border-red-500/30 text-slate-300 hover:text-red-400 rounded-lg transition duration-150"
                        title="Delete Contact"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ContactModule;
