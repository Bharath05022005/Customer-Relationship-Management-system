// SalesmanDashboard.js
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './index.css';

import Sidebar from './components/Sidebar';

// Module imports
import LeadModule from './components/modules/LeadModule';
import ContactModule from './components/modules/ContactModule';
import DealModule from './components/modules/DealModule';
import FollowUpModule from './components/modules/FollowUpModule';
import ActivityLogModule from './components/modules/ActivityLogModule';
import CustomerSegmentModule from './components/modules/CustomerSegmentModule';
import QuotationBuilderModule from './components/modules/QuotationBuilderModule';
import EmailIntegrationModule from './components/modules/EmailIntegrationModule';

const SalesmanDashboard = ({ onLogout }) => {
  const [activeTab, setActiveTab] = useState('overview');
  const [salesmanId, setSalesmanId] = useState(null);
  const [username, setUsername] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const storedId = localStorage.getItem('userId');
    const storedUsername = localStorage.getItem('username');
    const storedRole = localStorage.getItem('role');

    if (!storedId || storedRole !== 'salesman') {
      console.warn('Unauthorized access or incorrect role. Redirecting to login.');
      localStorage.clear();
      navigate('/');
    } else {
      setSalesmanId(parseInt(storedId, 10));
      setUsername(storedUsername);
    }
  }, [navigate]);

  const getPageTitle = () => {
    switch (activeTab) {
      case 'overview': return 'Agent Console Overview';
      case 'leads': return 'Leads & Conversions';
      case 'contacts': return 'My Contacts';
      case 'deals': return 'Active Pipelines';
      case 'followups': return 'Follow-ups Calendar';
      case 'activity': return 'My Sales Activities';
      case 'segments': return 'Customer Segments';
      case 'quotes': return 'Quotation Builder';
      case 'email': return 'Email Integration';
      default: return 'Sales Console';
    }
  };

  const renderModule = () => {
    if (!salesmanId) return <div className="text-slate-400">Loading dashboard...</div>;

    switch (activeTab) {
      case 'leads':
        return <LeadModule role="salesman" salesmanId={salesmanId} username={username} />;
      case 'contacts':
        return <ContactModule role="salesman" salesmanId={salesmanId} username={username} />;
      case 'deals':
        return <DealModule role="salesman" salesmanId={salesmanId} username={username} />;
      case 'followups':
        return <FollowUpModule role="salesman" salesmanId={salesmanId} username={username} />;
      case 'activity':
      case 'activities':
        return <ActivityLogModule role="salesman" salesmanId={salesmanId} username={username} />;
      case 'segments':
        return <CustomerSegmentModule role="salesman" salesmanId={salesmanId} username={username} />;
      case 'quotes':
        return <QuotationBuilderModule role="salesman" salesmanId={salesmanId} username={username} />;
      case 'email':
        return <EmailIntegrationModule role="salesman" salesmanId={salesmanId} username={username} />;
      default:
        return (
          <div className="p-8 bg-slate-900/40 border border-slate-800/80 rounded-2xl text-center max-w-lg mx-auto mt-12 shadow-2xl">
            <div className="w-16 h-16 bg-purple-500/10 border border-purple-500/20 text-purple-400 rounded-2xl flex items-center justify-center text-3xl mx-auto mb-6">
              📊
            </div>
            <h2 className="text-2xl font-extrabold text-white mb-3">Welcome Back, {username}!</h2>
            <p className="text-slate-400 text-sm leading-relaxed mb-6">
              This is your primary salesman sales-agent terminal. Use the sidebar menu options to easily input lead forms, record updates, schedule next followups, and drafts beautiful proposals.
            </p>
            <button 
              onClick={() => setActiveTab('leads')} 
              className="bg-purple-600 hover:bg-purple-500 text-white font-medium px-6 py-2.5 rounded-xl transition duration-300 shadow-lg shadow-purple-900/30 text-sm"
            >
              Add New Lead Entry
            </button>
          </div>
        );
    }
  };

  const handleSalesmanLogout = () => {
    if (onLogout) {
      onLogout();
    } else {
      localStorage.clear();
      navigate('/');
    }
  };

  return (
    <div className="flex h-screen bg-slate-900 text-slate-100 font-inter overflow-hidden">
      {/* Sidebar with dynamic active Tab tracking */}
      <Sidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        role="salesman"
        username={username || 'Sales Rep'}
        onLogout={handleSalesmanLogout}
      />
      
      {/* Main View Area */}
      <div className="flex-1 flex flex-col h-screen overflow-hidden bg-slate-950/60 backdrop-blur-md">
        {/* Top Header Bar */}
        <header className="flex justify-between items-center px-8 py-5 border-b border-slate-800 bg-slate-900/40 backdrop-blur-md z-10">
          <div>
            <span className="text-xs font-semibold uppercase tracking-wider text-indigo-400">Agent Console</span>
            <h1 className="text-2xl font-bold text-white mt-0.5 tracking-tight">{getPageTitle()}</h1>
          </div>

          <div className="flex items-center gap-6">
            <div className="flex items-center gap-3 bg-slate-800/40 px-4 py-2 rounded-xl border border-slate-700/50">
              <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse"></div>
              <span className="text-xs font-medium text-slate-300">Live Backend Connected</span>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-purple-600 to-indigo-600 flex items-center justify-center text-white font-bold text-sm shadow-md shadow-indigo-900/30 uppercase">
                {username ? username.substring(0, 2) : 'CR'}
              </div>
              <div className="text-left hidden md:block">
                <p className="text-sm font-semibold text-white leading-tight">{username || 'Sales Representative'}</p>
                <p className="text-xs text-slate-400">Sales Department</p>
              </div>
            </div>
          </div>
        </header>

        {/* Content Box */}
        <main className="flex-1 overflow-y-auto p-8 bg-gradient-to-b from-slate-950 to-slate-900/60">
          <div className="max-w-7xl mx-auto animate-fade-in">
            {renderModule()}
          </div>
        </main>
      </div>
    </div>
  );
};

export default SalesmanDashboard;
