import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { 
  Users, 
  Globe, 
  Building, 
  Heart, 
  DollarSign, 
  Plus, 
  Loader2,
  AlertCircle,
  CheckCircle,
  Tag
} from 'lucide-react';

const CustomerSegmentModule = () => {
  const [segments, setSegments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    region: '',
    industry: '',
    interest: '',
    dealSize: ''
  });
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState('success');

  const fetchSegments = async () => {
    try {
      setLoading(true);
      const res = await axios.get('/api/segments');
      setSegments(res.data || []);
    } catch (err) {
      console.error('Error fetching segments:', err);
      // Fallback data for preview
      setSegments([
        { id: 1, name: 'Enterprise Tech', region: 'North America', industry: 'Technology', interest: 'Cloud', dealSize: 'High' },
        { id: 2, name: 'SME Retail', region: 'Europe', industry: 'Retail', interest: 'POS', dealSize: 'Medium' }
      ]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSegments();
  }, []);

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setSaving(true);
      await axios.post('/api/segments', formData);
      setMessageType('success');
      setMessage('✅ Segment added successfully!');
      fetchSegments();
      setFormData({ name: '', region: '', industry: '', interest: '', dealSize: '' });
    } catch (err) {
      console.error('Error adding segment:', err);
      setMessageType('error');
      setMessage('❌ Failed to add segment.');
    } finally {
      setSaving(false);
      setTimeout(() => setMessage(''), 4000);
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
            <Users className="w-5 h-5 text-purple-400" />
            Customer Segmentation
          </h2>
          <p className="text-slate-400 text-xs mt-1">Filter and group based on behavior or profile for targeted campaigns.</p>
        </div>
      </div>

      {/* ➕ Segment Form */}
      <div className="p-6 bg-slate-900/30 border border-slate-800/60 backdrop-blur rounded-2xl shadow-lg relative overflow-hidden">
        <div className="absolute top-0 right-0 w-48 h-48 bg-purple-600/5 blur-[60px] pointer-events-none rounded-full"></div>
        <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-4 flex items-center gap-2">
          <Plus className="w-4 h-4 text-purple-400" />
          Create New Segment
        </h3>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {/* Name */}
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-500">
                <Users className="w-4 h-4" />
              </span>
              <input
                type="text"
                name="name"
                placeholder="Segment Name *"
                value={formData.name}
                onChange={handleChange}
                required
                className={inputCls}
              />
            </div>

            {/* Region */}
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-500">
                <Globe className="w-4 h-4" />
              </span>
              <input
                type="text"
                name="region"
                placeholder="Region"
                value={formData.region}
                onChange={handleChange}
                className={inputCls}
              />
            </div>

            {/* Industry */}
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-500">
                <Building className="w-4 h-4" />
              </span>
              <input
                type="text"
                name="industry"
                placeholder="Industry"
                value={formData.industry}
                onChange={handleChange}
                className={inputCls}
              />
            </div>

            {/* Interest */}
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-500">
                <Heart className="w-4 h-4" />
              </span>
              <input
                type="text"
                name="interest"
                placeholder="Interest / Behavior"
                value={formData.interest}
                onChange={handleChange}
                className={inputCls}
              />
            </div>

            {/* Deal Size */}
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-500">
                <DollarSign className="w-4 h-4 text-emerald-400" />
              </span>
              <input
                type="text"
                name="dealSize"
                placeholder="Deal Size (High/Med/Low)"
                value={formData.dealSize}
                onChange={handleChange}
                className={inputCls}
              />
            </div>

            {/* Submit Button */}
            <div className="flex items-end">
              <button
                type="submit"
                disabled={saving}
                className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-bold px-6 py-3 rounded-xl text-xs uppercase tracking-wider transition-all duration-200 shadow-md shadow-indigo-950/20 disabled:opacity-60 flex items-center justify-center gap-2"
              >
                {saving ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Adding...
                  </>
                ) : (
                  <>
                    <Plus className="w-4 h-4" />
                    Add Segment
                  </>
                )}
              </button>
            </div>
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

      {/* 🧾 Segment List */}
      <div className="space-y-4">
        <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-2">Customer Segments</h3>
        
        {loading ? (
          <div className="flex flex-col items-center justify-center py-12 text-slate-500">
            <Loader2 className="w-6 h-6 animate-spin text-purple-400" />
            <span className="text-xs uppercase font-bold tracking-widest mt-2">Loading Segments...</span>
          </div>
        ) : segments.length === 0 ? (
          <div className="p-12 text-center text-slate-600 bg-slate-900/10 border border-slate-800/60 rounded-2xl border-dashed">
            <Users className="w-6 h-6 text-slate-700 mx-auto mb-2" />
            <span className="text-xs uppercase font-bold tracking-wider">No customer segments found.</span>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {segments.map((seg) => (
              <div key={seg.id} className="bg-slate-900/40 border border-slate-800/80 rounded-2xl p-5 hover:border-purple-500/30 transition duration-150 group relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/5 blur-[40px] pointer-events-none rounded-full"></div>
                
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <h4 className="font-bold text-white text-base group-hover:text-purple-300 transition duration-150">{seg.name}</h4>
                    <p className="text-xs text-slate-500">Segment Profile</p>
                  </div>
                  <span className="px-3 py-1 bg-purple-500/10 border border-purple-500/20 rounded-lg text-xs font-semibold text-purple-400">
                    Active
                  </span>
                </div>

                <div className="space-y-1">
                  <div className="flex justify-between text-xs">
                    <span className="text-slate-500 flex items-center gap-1"><Globe className="w-3.5 h-3.5" /> Region:</span>
                    <span className="text-slate-300 font-medium">{seg.region || 'N/A'}</span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span className="text-slate-500 flex items-center gap-1"><Building className="w-3.5 h-3.5" /> Industry:</span>
                    <span className="text-slate-300 font-medium">{seg.industry || 'N/A'}</span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span className="text-slate-500 flex items-center gap-1"><Heart className="w-3.5 h-3.5" /> Interest:</span>
                    <span className="text-slate-300 font-medium">{seg.interest || 'N/A'}</span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span className="text-slate-500 flex items-center gap-1"><DollarSign className="w-3.5 h-3.5" /> Deal Size:</span>
                    <span className="text-slate-300 font-medium">{seg.dealSize || 'N/A'}</span>
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

export default CustomerSegmentModule;
