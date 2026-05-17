import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { 
  ClipboardCheck, 
  ThumbsUp, 
  ThumbsDown, 
  Loader2,
  AlertCircle,
  CheckCircle
} from 'lucide-react';

const ApprovalsModule = () => {
  const [approvals, setApprovals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(null); // Stores ID of approval being processed

  useEffect(() => {
    fetchApprovals();
  }, []);

  const fetchApprovals = async () => {
    try {
      setLoading(true);
      const res = await axios.get('/api/approvals');
      setApprovals(res.data || []);
    } catch (err) {
      console.error('Failed to fetch approvals:', err);
      // Fallback data for preview
      setApprovals([
        { ApprovalID: 1, Type: 'Discount', Description: 'Requesting 15% discount on Enterprise Deal' },
        { ApprovalID: 2, Type: 'Proposal', Description: 'Approve custom proposal for Acme Corp' }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (id) => {
    try {
      setActionLoading(id);
      await axios.post(`/api/approvals/${id}/approve`);
      fetchApprovals();
    } catch (err) {
      console.error('Failed to approve:', err);
      alert('Failed to approve request.');
    } finally {
      setActionLoading(null);
    }
  };

  const handleReject = async (id) => {
    try {
      setActionLoading(id);
      await axios.post(`/api/approvals/${id}/reject`);
      fetchApprovals();
    } catch (err) {
      console.error('Failed to reject:', err);
      alert('Failed to reject request.');
    } finally {
      setActionLoading(null);
    }
  };

  return (
    <div className="p-4 space-y-6">
      
      {/* Module Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-slate-900/40 border border-slate-800/80 p-6 rounded-2xl backdrop-blur shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/5 blur-[80px] pointer-events-none rounded-full"></div>
        <div>
          <h2 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
            <ClipboardCheck className="w-5 h-5 text-purple-400" />
            Pending Approvals
          </h2>
          <p className="text-slate-400 text-xs mt-1">Review and action pending authorization requests from the team.</p>
        </div>
      </div>

      {/* Approvals List */}
      <div className="space-y-4">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-12 text-slate-500">
            <Loader2 className="w-6 h-6 animate-spin text-purple-400" />
            <span className="text-xs uppercase font-bold tracking-widest mt-2">Loading Approvals...</span>
          </div>
        ) : approvals.length === 0 ? (
          <div className="p-12 text-center text-slate-600 bg-slate-900/10 border border-slate-800/60 rounded-2xl border-dashed">
            <CheckCircle className="w-6 h-6 text-slate-700 mx-auto mb-2" />
            <span className="text-xs uppercase font-bold tracking-wider">No pending approvals.</span>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4">
            {approvals.map(item => (
              <div key={item.ApprovalID} className="bg-slate-900/40 border border-slate-800/80 rounded-2xl p-5 hover:border-purple-500/30 transition duration-150 group relative overflow-hidden flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/5 blur-[40px] pointer-events-none rounded-full"></div>
                
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="px-2.5 py-1 bg-purple-500/10 border border-purple-500/20 rounded-lg text-xs font-semibold text-purple-400">
                      {item.Type}
                    </span>
                    <span className="text-xs text-slate-500">ID: #{item.ApprovalID}</span>
                  </div>
                  <p className="text-sm text-slate-300 font-medium">{item.Description}</p>
                </div>

                <div className="flex gap-2 shrink-0">
                  <button 
                    onClick={() => handleApprove(item.ApprovalID)} 
                    disabled={actionLoading === item.ApprovalID}
                    className="bg-emerald-600 hover:bg-emerald-500 text-white px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition duration-150 shadow-lg shadow-emerald-900/20 flex items-center gap-1.5 disabled:opacity-50"
                  >
                    {actionLoading === item.ApprovalID ? (
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    ) : (
                      <ThumbsUp className="w-3.5 h-3.5" />
                    )}
                    Approve
                  </button>
                  <button 
                    onClick={() => handleReject(item.ApprovalID)} 
                    disabled={actionLoading === item.ApprovalID}
                    className="bg-red-600 hover:bg-red-500 text-white px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition duration-150 shadow-lg shadow-red-900/20 flex items-center gap-1.5 disabled:opacity-50"
                  >
                    {actionLoading === item.ApprovalID ? (
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    ) : (
                      <ThumbsDown className="w-3.5 h-3.5" />
                    )}
                    Reject
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

export default ApprovalsModule;

