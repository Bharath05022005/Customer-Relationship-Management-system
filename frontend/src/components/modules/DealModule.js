// DealModule.js
import React, { useState, useEffect } from "react";
import axios from "axios";
import { 
  Briefcase, 
  Plus, 
  Calendar, 
  DollarSign, 
  FileText, 
  X, 
  UserCheck,
  Trash2,
  Minus
} from 'lucide-react';

const stages = ["Prospect", "Proposal", "Negotiation", "Won", "Lost"];

const DealModule = ({ role, salesmanId, username }) => {
  const currentRole = role || localStorage.getItem('role') || 'salesman';
  const currentUsername = username || localStorage.getItem('username') || '';

  const [deals, setDeals] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    dealName: "",
    value: "",
    expectedCloseDate: "",
    stage: "Prospect",
    contactName: "",
    company: "",
    assignedTo: currentRole === 'salesman' ? currentUsername : '',
  });

  const fetchDeals = async () => {
    try {
      const res = await axios.get("/api/deals");
      let data = res.data || [];
      
      // Zoho CRM logic: Salesmen only see their assigned deals
      if (currentRole === 'salesman') {
        data = data.filter(d => d.assignedTo === currentUsername);
      }
      setDeals(data);
    } catch (err) {
      console.error("❌ Failed to fetch deals:", err);
    }
  };

  useEffect(() => {
    fetchDeals();
  }, [currentRole, currentUsername]);

  const handleInputChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    if (e) e.preventDefault();
    if (!formData.dealName || !formData.value || !formData.stage) {
      alert("Please fill in all required fields.");
      return;
    }

    const payload = {
      ...formData,
      assignedTo: currentRole === 'salesman' ? currentUsername : formData.assignedTo || 'unassigned'
    };

    try {
      await axios.post("/api/deals", payload);
      setShowModal(false);
      setFormData({
        dealName: "",
        value: "",
        expectedCloseDate: "",
        stage: "Prospect",
        contactName: "",
        company: "",
        assignedTo: currentRole === 'salesman' ? currentUsername : '',
      });
      fetchDeals();
    } catch (err) {
      console.error("❌ Failed to add deal:", err);
      alert("Server error while adding deal");
    }
  };

  const handleAssign = async (dealId, agentName) => {
    try {
      await axios.put(`/api/deals/${dealId}`, { assignedTo: agentName });
      fetchDeals();
    } catch (err) {
      console.error('Failed to assign deal:', err);
    }
  };

  const handleDelete = async (dealId) => {
    if (!window.confirm('Are you sure you want to delete this deal?')) return;
    try {
      await axios.delete(`/api/deals/${dealId}`);
      fetchDeals();
    } catch (err) {
      console.error('Failed to delete deal:', err);
    }
  };

  const handleStageChange = async (dealId, nextStage) => {
    try {
      await axios.put(`/api/deals/${dealId}`, { stage: nextStage });
      fetchDeals();
    } catch (err) {
      console.error('Failed to transition deal stage:', err);
    }
  };

  // Status colors configuration
  const getStageStyle = (stage) => {
    switch (stage) {
      case "Won":
        return {
          bg: "from-emerald-500/10 to-teal-500/5",
          border: "border-emerald-500/30",
          text: "text-emerald-400",
          glow: "shadow-emerald-950/20",
          barColor: "#10b981"
        };
      case "Lost":
        return {
          bg: "from-red-500/10 to-rose-500/5",
          border: "border-red-500/30",
          text: "text-red-400",
          glow: "shadow-red-950/20",
          barColor: "#f43f5e"
        };
      case "Negotiation":
        return {
          bg: "from-amber-500/10 to-orange-500/5",
          border: "border-amber-500/30",
          text: "text-amber-400",
          glow: "shadow-amber-950/20",
          barColor: "#f59e0b"
        };
      case "Proposal":
        return {
          bg: "from-blue-500/10 to-indigo-500/5",
          border: "border-blue-500/30",
          text: "text-blue-400",
          glow: "shadow-blue-950/20",
          barColor: "#3b82f6"
        };
      default: // Prospect
        return {
          bg: "from-slate-500/10 to-slate-700/5",
          border: "border-slate-800",
          text: "text-slate-300",
          glow: "shadow-slate-950/10",
          barColor: "#64748b"
        };
    }
  };

  return (
    <div className="p-4 space-y-6">
      
      {/* Module header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-slate-900/40 border border-slate-800/80 p-6 rounded-2xl backdrop-blur shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/5 blur-[80px] pointer-events-none rounded-full"></div>
        <div>
          <h2 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
            <Briefcase className="w-5 h-5 text-purple-400" />
            Active Sales Pipelines
          </h2>
          <p className="text-slate-400 text-xs mt-1">
            {currentRole === 'admin' 
              ? 'Oversee, assign, and manage global deals across all salesmen.' 
              : 'Add, view, and transition your assigned deals through core pipeline milestones.'}
          </p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white px-5 py-3 rounded-xl font-bold transition duration-200 shadow-lg shadow-indigo-950/30 hover:scale-[1.02] flex items-center gap-2 text-xs uppercase tracking-wider"
        >
          <Plus className="w-4 h-4" />
          Create New Deal
        </button>
      </div>

      {/* Add Deal Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-md flex items-center justify-center z-50 p-4 animate-fade-in">
          <div className="bg-slate-900 border border-slate-800/80 p-8 rounded-3xl w-full max-w-md shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-48 h-48 bg-purple-600/10 blur-[80px] pointer-events-none rounded-full"></div>
            
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <FileText className="w-5 h-5 text-purple-400" />
                Register New Deal
              </h3>
              <button 
                onClick={() => setShowModal(false)}
                className="p-1.5 bg-slate-850 hover:bg-slate-800 border border-slate-800 rounded-lg text-slate-400 hover:text-white transition duration-150"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Deal Name */}
              <div>
                <label className="block text-slate-400 text-xs font-bold uppercase tracking-wider mb-2">Deal Title</label>
                <input
                  type="text"
                  name="dealName"
                  value={formData.dealName}
                  onChange={handleInputChange}
                  placeholder="e.g. Enterprise Cloud License"
                  className="w-full bg-slate-950/50 text-slate-200 text-sm p-3 rounded-xl border border-slate-800 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent focus:bg-slate-950 transition-all placeholder-slate-700"
                  required
                />
              </div>

              {/* Deal Value */}
              <div>
                <label className="block text-slate-400 text-xs font-bold uppercase tracking-wider mb-2">Deal Value (₹)</label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-500">
                    <DollarSign className="w-4 h-4 text-emerald-400" />
                  </span>
                  <input
                    type="number"
                    name="value"
                    value={formData.value}
                    onChange={handleInputChange}
                    placeholder="e.g. 150000"
                    className="w-full bg-slate-950/50 text-slate-200 text-sm pl-11 pr-4 p-3 rounded-xl border border-slate-800 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent focus:bg-slate-950 transition-all placeholder-slate-700 font-mono"
                    required
                  />
                </div>
              </div>

              {/* Expected Close Date */}
              <div>
                <label className="block text-slate-400 text-xs font-bold uppercase tracking-wider mb-2">Expected Close Date</label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-500">
                    <Calendar className="w-4 h-4" />
                  </span>
                  <input
                    type="date"
                    name="expectedCloseDate"
                    value={formData.expectedCloseDate}
                    onChange={handleInputChange}
                    className="w-full bg-slate-950/50 text-slate-300 text-sm pl-11 pr-4 p-3 rounded-xl border border-slate-800 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent focus:bg-slate-950 transition-all"
                  />
                </div>
              </div>

              {/* Contact Name (Zoho Concept) */}
              <div>
                <label className="block text-slate-400 text-xs font-bold uppercase tracking-wider mb-2">Contact Person</label>
                <input
                  type="text"
                  name="contactName"
                  value={formData.contactName}
                  onChange={handleInputChange}
                  placeholder="e.g. John Doe"
                  className="w-full bg-slate-950/50 text-slate-200 text-sm p-3 rounded-xl border border-slate-800 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent focus:bg-slate-950 transition-all placeholder-slate-700"
                />
              </div>

              {/* Company Name (Zoho Concept) */}
              <div>
                <label className="block text-slate-400 text-xs font-bold uppercase tracking-wider mb-2">Account / Company</label>
                <input
                  type="text"
                  name="company"
                  value={formData.company}
                  onChange={handleInputChange}
                  placeholder="e.g. Acme Corp"
                  className="w-full bg-slate-950/50 text-slate-200 text-sm p-3 rounded-xl border border-slate-800 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent focus:bg-slate-950 transition-all placeholder-slate-700"
                />
              </div>

              {/* Pipeline Stage */}
              <div>
                <label className="block text-slate-400 text-xs font-bold uppercase tracking-wider mb-2">Pipeline Milestone</label>
                <select
                  name="stage"
                  value={formData.stage}
                  onChange={handleInputChange}
                  className="w-full bg-slate-950/50 text-slate-300 text-sm p-3 rounded-xl border border-slate-800 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent focus:bg-slate-950 transition-all"
                >
                  {stages.map((s) => (
                    <option key={s} value={s}>
                      {s} Milestone
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="flex-1 bg-slate-950 hover:bg-slate-800 text-slate-400 hover:text-white py-3.5 rounded-xl text-xs font-bold uppercase tracking-wider border border-slate-800 transition duration-150"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white py-3.5 rounded-xl text-xs font-bold uppercase tracking-wider transition duration-150 shadow-lg shadow-indigo-950/20"
                >
                  Add Deal
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Kanban Board Container */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-6">
        {stages.map((stage) => {
          const stageDeals = deals.filter((deal) => deal.stage === stage);
          const stageTotal = stageDeals.reduce((acc, deal) => acc + (deal.value || 0), 0);
          
          return (
            <div 
              key={stage} 
              className="bg-slate-900/20 border border-slate-900 rounded-2xl p-4 flex flex-col min-h-[450px]"
            >
              {/* Kanban Column Title Header */}
              <div className="flex items-center justify-between mb-4 pb-2 border-b border-slate-800/60">
                <div className="space-y-0.5">
                  <h4 className="font-bold text-sm text-white">{stage}</h4>
                  <p className="text-[10px] text-slate-500 font-bold tracking-wider font-mono">₹{stageTotal.toLocaleString()}</p>
                </div>
                <div className="px-2 py-0.5 bg-slate-900 rounded-full text-[10px] font-bold text-slate-400 border border-slate-800">
                  {stageDeals.length}
                </div>
              </div>

              {/* Cards Container */}
              <div className="space-y-3 flex-1 overflow-y-auto max-h-[500px] pr-1">
                {stageDeals.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-12 text-slate-600 border border-dashed border-slate-800/80 rounded-xl">
                    <Minus className="w-5 h-5 opacity-40" />
                    <p className="text-[10px] uppercase font-bold mt-1 tracking-wider">No Active Deals</p>
                  </div>
                ) : (
                  stageDeals.map((deal) => {
                    const cardConfig = getStageStyle(deal.stage);
                    return (
                      <div
                        key={deal.id}
                        className={`bg-gradient-to-br ${cardConfig.bg} ${cardConfig.border} border shadow-xl ${cardConfig.glow} p-4 rounded-2xl transition duration-300 transform hover:-translate-y-1 hover:scale-[1.01] hover:border-purple-500/40 relative overflow-hidden group cursor-pointer`}
                      >
                        {/* Interactive Accent Left Ribbon */}
                        <div 
                          className="absolute left-0 top-0 bottom-0 w-1"
                          style={{ backgroundColor: cardConfig.barColor }}
                        ></div>
                        
                        <div className="space-y-3 pl-1">
                          <div className="font-bold text-sm text-white group-hover:text-purple-300 transition duration-150 tracking-tight leading-tight">{deal.dealName}</div>
                          
                          {/* Value display */}
                          <div className="flex items-center gap-1">
                            <span className="text-xs text-slate-400">Value:</span>
                            <span className="text-sm font-black text-emerald-400 font-mono">₹{(deal.value || 0).toLocaleString()}</span>
                          </div>

                          {/* Close date with lucide icon */}
                          {deal.expectedCloseDate && (
                            <div className="flex items-center gap-1.5 text-[10px] text-slate-500">
                              <Calendar className="w-3.5 h-3.5 opacity-60" />
                              <span>Close: {new Date(deal.expectedCloseDate).toLocaleDateString()}</span>
                            </div>
                          )}

                          {/* Account and Contact */}
                          {(deal.company || deal.contactName) && (
                            <div className="border-t border-slate-800/60 pt-2 space-y-1 text-[10px] text-slate-400">
                              {deal.company && <div className="truncate">🏢 {deal.company}</div>}
                              {deal.contactName && <div className="truncate">👤 {deal.contactName}</div>}
                            </div>
                          )}

                          {/* Assignment Tag or Action (Zoho Concept) */}
                          <div className="border-t border-slate-800/60 pt-2 flex items-center justify-between gap-1 flex-wrap">
                            {deal.assignedTo ? (
                              <span className="text-[9px] px-1.5 py-0.5 bg-slate-850 rounded text-slate-400 border border-slate-800 truncate max-w-[80px]">
                                👤 {deal.assignedTo}
                              </span>
                            ) : (
                              <span className="text-[9px] text-amber-500">Unassigned</span>
                            )}

                            {currentRole === 'admin' ? (
                              <div className="flex items-center gap-1">
                                <select
                                  value={deal.assignedTo || ''}
                                  onChange={(e) => handleAssign(deal.id, e.target.value)}
                                  onClick={(e) => e.stopPropagation()}
                                  className="bg-slate-950 text-slate-300 border border-slate-800 px-1 py-0.5 rounded text-[9px] focus:outline-none"
                                >
                                  <option value="">Assign</option>
                                  <option value="salesman">salesman</option>
                                  <option value="Bharath S">Bharath S</option>
                                </select>
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleDelete(deal.id);
                                  }}
                                  className="p-1 bg-red-500/10 border border-red-500/20 text-red-400 hover:bg-red-500/20 rounded transition"
                                  title="Delete Deal"
                                >
                                  <Trash2 className="w-3 h-3" />
                                </button>
                              </div>
                            ) : (
                              /* Salesman can transition stages directly via dropdown on card */
                              <select
                                value={deal.stage}
                                onChange={(e) => handleStageChange(deal.id, e.target.value)}
                                onClick={(e) => e.stopPropagation()}
                                className="bg-slate-950 text-purple-400 border border-purple-900/40 px-1 py-0.5 rounded text-[9px] focus:outline-none"
                              >
                                {stages.map(s => (
                                  <option key={s} value={s}>{s}</option>
                                ))}
                              </select>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          );
        })}
      </div>

    </div>
  );
};

export default DealModule;