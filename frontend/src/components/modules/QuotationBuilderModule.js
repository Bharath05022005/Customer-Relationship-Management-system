import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { 
  FileText, 
  User, 
  Mail, 
  Package, 
  DollarSign, 
  Hash, 
  Download, 
  Plus,
  Loader2,
  AlertCircle,
  CheckCircle
} from 'lucide-react';

const QuotationBuilderModule = ({ role, salesmanId, username }) => {
  const currentRole = role || localStorage.getItem('role') || 'salesman';
  const currentUsername = username || localStorage.getItem('username') || '';

  const [quotations, setQuotations] = useState([]);
  const [formData, setFormData] = useState({
    clientName: '',
    email: '',
    item: '',
    price: '',
    quantity: '',
  });
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState('success');

  // 🔁 Fetch all quotations on mount
  useEffect(() => {
    fetchQuotations();
  }, [currentRole, currentUsername]);

  const fetchQuotations = async () => {
    try {
      setLoading(true);
      const res = await axios.get('/api/quotes');
      let data = Array.isArray(res.data) ? res.data : [];
      
      // Zoho CRM logic: Salesmen only see their created quotations
      if (currentRole === 'salesman') {
        data = data.filter(q => q.assignedTo === currentUsername);
      }
      setQuotations(data);
    } catch (err) {
      console.error('❌ Error fetching quotations:', err);
    } finally {
      setLoading(false);
    }
  };

  // 📝 Input change handler
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // ✅ Submit new quotation
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate
    const { clientName, email, item, price, quantity } = formData;
    if (!clientName || !email || !item || !price || !quantity) {
      setMessageType('error');
      setMessage('Please fill in all fields');
      return;
    }

    try {
      setSaving(true);
      const res = await axios.post('/api/quotes', {
        clientName,
        email,
        item,
        price: parseFloat(price),
        quantity: parseInt(quantity),
        assignedTo: currentUsername || 'System Administrator',
      });

      if (res.data.success) {
        setMessageType('success');
        setMessage('✅ Quotation saved successfully!');
        setFormData({
          clientName: '',
          email: '',
          item: '',
          price: '',
          quantity: '',
        });
        fetchQuotations(); // Refresh list
      } else {
        setMessageType('error');
        setMessage('❌ Failed to save quotation.');
      }
    } catch (err) {
      console.error('❌ Error saving quotation:', err);
      setMessageType('error');
      setMessage('❌ Server error: Failed to save quotation.');
    } finally {
      setSaving(false);
      setTimeout(() => setMessage(''), 4000);
    }
  };

  // 📄 Download PDF
  const downloadPDF = (id) => {
    window.open(`${axios.defaults.baseURL || ''}/api/quotes/generate-pdf/${id}`, '_blank');
  };

  const inputCls = "w-full bg-slate-950/50 text-slate-200 text-sm pl-11 pr-4 py-3 rounded-xl border border-slate-800 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent focus:bg-slate-950 transition-all duration-200 placeholder-slate-700";

  return (
    <div className="p-4 space-y-6">
      
      {/* Module Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-slate-900/40 border border-slate-800/80 p-6 rounded-2xl backdrop-blur shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/5 blur-[80px] pointer-events-none rounded-full"></div>
        <div>
          <h2 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
            <FileText className="w-5 h-5 text-purple-400" />
            Quotation & Proposal Builder
          </h2>
          <p className="text-slate-400 text-xs mt-1">
            {currentRole === 'admin' 
              ? 'Oversee and view dynamic corporate quotations structured across the enterprise.' 
              : 'Generate, manage, and download professional PDF quotations for your clients.'}
          </p>
        </div>
      </div>

      {/* ➕ Quotation Form */}
      <div className="p-6 bg-slate-900/30 border border-slate-800/60 backdrop-blur rounded-2xl shadow-lg relative overflow-hidden">
        <div className="absolute top-0 right-0 w-48 h-48 bg-purple-600/5 blur-[60px] pointer-events-none rounded-full"></div>
        <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-4 flex items-center gap-2">
          <Plus className="w-4 h-4 text-purple-400" />
          Create New Quotation
        </h3>
        
        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {/* Client Name */}
          <div className="relative">
            <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-500">
              <User className="w-4 h-4" />
            </span>
            <input
              type="text"
              name="clientName"
              placeholder="Client Name"
              value={formData.clientName}
              onChange={handleChange}
              className={inputCls}
              required
            />
          </div>

          {/* Client Email */}
          <div className="relative">
            <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-500">
              <Mail className="w-4 h-4" />
            </span>
            <input
              type="email"
              name="email"
              placeholder="Client Email"
              value={formData.email}
              onChange={handleChange}
              className={inputCls}
              required
            />
          </div>

          {/* Item / Service */}
          <div className="relative">
            <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-500">
              <Package className="w-4 h-4" />
            </span>
            <input
              type="text"
              name="item"
              placeholder="Item / Service"
              value={formData.item}
              onChange={handleChange}
              className={inputCls}
              required
            />
          </div>

          {/* Price */}
          <div className="relative">
            <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-500">
              <DollarSign className="w-4 h-4 text-emerald-400" />
            </span>
            <input
              type="number"
              name="price"
              placeholder="Price"
              value={formData.price}
              onChange={handleChange}
              className={inputCls}
              required
            />
          </div>

          {/* Quantity */}
          <div className="relative">
            <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-500">
              <Hash className="w-4 h-4" />
            </span>
            <input
              type="number"
              name="quantity"
              placeholder="Quantity"
              value={formData.quantity}
              onChange={handleChange}
              className={inputCls}
              required
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
                  Saving...
                </>
              ) : (
                <>
                  <FileText className="w-4 h-4" />
                  Save Quotation
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

      {/* 🧾 Quotations List */}
      <div className="space-y-4">
        <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-2">Generated Quotations</h3>
        
        {loading ? (
          <div className="flex flex-col items-center justify-center py-12 text-slate-500">
            <Loader2 className="w-6 h-6 animate-spin text-purple-400" />
            <span className="text-xs uppercase font-bold tracking-widest mt-2">Loading Quotations...</span>
          </div>
        ) : quotations.length === 0 ? (
          <div className="p-12 text-center text-slate-600 bg-slate-900/10 border border-slate-800/60 rounded-2xl border-dashed">
            <FileText className="w-6 h-6 text-slate-700 mx-auto mb-2" />
            <span className="text-xs uppercase font-bold tracking-wider">No quotations found.</span>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {quotations.map((quote) => (
              <div key={quote.id} className="bg-slate-900/40 border border-slate-800/80 rounded-2xl p-5 hover:border-purple-500/30 transition duration-150 group relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/5 blur-[40px] pointer-events-none rounded-full"></div>
                
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <h4 className="font-bold text-white text-base group-hover:text-purple-300 transition duration-150">{quote.clientName}</h4>
                    <p className="text-xs text-slate-500">{quote.email}</p>
                  </div>
                  <span className="px-3 py-1 bg-emerald-500/10 border border-emerald-500/20 rounded-lg text-xs font-semibold text-emerald-400">
                    Active
                  </span>
                </div>

                <div className="space-y-1 mb-4">
                  <div className="flex justify-between text-xs">
                    <span className="text-slate-500">Item:</span>
                    <span className="text-slate-300 font-medium">{quote.item}</span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span className="text-slate-500">Price:</span>
                    <span className="text-slate-300 font-mono">₹{quote.price.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span className="text-slate-500">Quantity:</span>
                    <span className="text-slate-300">{quote.quantity}</span>
                  </div>
                  {quote.assignedTo && (
                    <div className="flex justify-between text-xs">
                      <span className="text-slate-500">Agent:</span>
                      <span className="text-slate-300 font-medium">{quote.assignedTo}</span>
                    </div>
                  )}
                  <div className="flex justify-between text-sm border-t border-slate-800/60 pt-1 mt-1">
                    <span className="font-bold text-slate-400">Total:</span>
                    <span className="font-bold text-emerald-400 font-mono">₹{(quote.price * quote.quantity).toLocaleString()}</span>
                  </div>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-[10px] text-slate-600 font-medium">
                    {new Date(quote.createdAt).toLocaleDateString()}
                  </span>
                  <button
                    onClick={() => downloadPDF(quote.id)}
                    className="flex items-center gap-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white px-3 py-1.5 rounded-lg text-xs font-semibold transition duration-150 border border-slate-700"
                  >
                    <Download className="w-3.5 h-3.5" />
                    PDF
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

export default QuotationBuilderModule;
