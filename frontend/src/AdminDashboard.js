import React from 'react';
import { Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import Sidebar from './components/Sidebar';

import LeadModule from './components/modules/LeadModule';
import FollowUpModule from './components/modules/FollowUpModule';
import EmailIntegrationModule from './components/modules/EmailIntegrationModule';
import DashboardAnalyticsModule from './components/modules/DashboardAnalyticsModule';
import ContactModule from './components/modules/ContactModule';
import DealModule from './components/modules/DealModule';
import ActivityLogModule from './components/modules/ActivityLogModule';
import CustomerSegmentModule from './components/modules/CustomerSegmentModule';
import QuotationBuilderModule from './components/modules/QuotationBuilderModule';
import RoleAccessModule from './components/modules/RoleAccessModule';
import ApprovalsModule from './components/modules/ApprovalsModule';

const AdminDashboard = ({ onLogout }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const currentPath = location.pathname;

  // Map path to active tab in Sidebar
  let activeTab = 'dashboard';
  if (currentPath.includes('/leads')) activeTab = 'leads';
  else if (currentPath.includes('/contacts')) activeTab = 'contacts';
  else if (currentPath.includes('/deals')) activeTab = 'deals';
  else if (currentPath.includes('/followups')) activeTab = 'followups';
  else if (currentPath.includes('/activitylogs')) activeTab = 'activity';
  else if (currentPath.includes('/segments')) activeTab = 'segments';
  else if (currentPath.includes('/quotation')) activeTab = 'quotes';
  else if (currentPath.includes('/emailIntegration')) activeTab = 'emailIntegration';
  else if (currentPath.includes('/roleaccess')) activeTab = 'roles';
  else if (currentPath.includes('/approvals')) activeTab = 'approvals';

  // Handle active tab change by routing to nested sub-routes
  const handleTabChange = (tabName) => {
    const paths = {
      dashboard: '/admin/dashboard',
      leads: '/admin/leads',
      contacts: '/admin/contacts',
      deals: '/admin/deals',
      followups: '/admin/followups',
      activity: '/admin/activitylogs',
      segments: '/admin/segments',
      quotes: '/admin/quotation',
      emailIntegration: '/admin/emailIntegration',
      roles: '/admin/roleaccess',
      approvals: '/admin/approvals'
    };
    navigate(paths[tabName] || '/admin');
  };

  const getPageTitle = () => {
    switch (activeTab) {
      case 'dashboard': return 'Dashboard & Analytics';
      case 'leads': return 'Lead Management';
      case 'contacts': return 'Contacts Database';
      case 'deals': return 'Deals & Pipelines';
      case 'followups': return 'Follow-ups Calendar';
      case 'activity': return 'System Activity Log';
      case 'segments': return 'Customer Segments';
      case 'quotes': return 'Quotation Builder';
      case 'emailIntegration': return 'Email Integration';
      case 'roles': return 'Role Access Control';
      case 'approvals': return 'Approval Requests';
      default: return 'Admin Dashboard';
    }
  };

  const handleAdminLogout = () => {
    if (onLogout) {
      onLogout();
    } else {
      localStorage.clear();
      navigate('/');
    }
  };

  return (
    <div className="flex min-h-screen bg-slate-900 text-slate-100 font-inter overflow-hidden">
      {/* Premium Sidebar with matching tabs */}
      <Sidebar 
        activeTab={activeTab} 
        setActiveTab={handleTabChange} 
        role="Admin" 
        username="System Administrator"
        onLogout={handleAdminLogout}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col h-screen overflow-hidden bg-slate-950/60 backdrop-blur-md">
        {/* Top Header Bar */}
        <header className="flex justify-between items-center px-8 py-5 border-b border-slate-800 bg-slate-900/40 backdrop-blur-md z-10">
          <div>
            <span className="text-xs font-semibold uppercase tracking-wider text-purple-400">Control Panel</span>
            <h1 className="text-2xl font-bold text-white mt-0.5 tracking-tight">{getPageTitle()}</h1>
          </div>

          <div className="flex items-center gap-6">
            <div className="flex items-center gap-3 bg-slate-800/40 px-4 py-2 rounded-xl border border-slate-700/50">
              <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse"></div>
              <span className="text-xs font-medium text-slate-300">Live Server Connected</span>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-purple-600 to-indigo-600 flex items-center justify-center text-white font-bold text-sm shadow-md shadow-indigo-900/30">
                AD
              </div>
              <div className="text-left hidden md:block">
                <p className="text-sm font-semibold text-white leading-tight">Admin User</p>
                <p className="text-xs text-slate-400">crm@company.com</p>
              </div>
            </div>
          </div>
        </header>

        {/* Nested Module Container */}
        <main className="flex-1 overflow-y-auto p-8 bg-gradient-to-b from-slate-950 to-slate-900/60">
          <div className="max-w-7xl mx-auto animate-fade-in">
            <Routes>
              <Route path="/" element={
                <div className="p-8 bg-slate-900/40 border border-slate-800/80 rounded-2xl text-center max-w-lg mx-auto mt-12 shadow-2xl">
                  <div className="w-16 h-16 bg-purple-500/10 border border-purple-500/20 text-purple-400 rounded-2xl flex items-center justify-center text-3xl mx-auto mb-6">
                    🛡️
                  </div>
                  <h2 className="text-2xl font-extrabold text-white mb-3">Welcome, Administrator</h2>
                  <p className="text-slate-400 text-sm leading-relaxed mb-6">
                    Access modules, manage user permission configurations, build dynamic quotations, and monitor live deals pipeline analytics in real time.
                  </p>
                  <button 
                    onClick={() => handleTabChange('dashboard')} 
                    className="bg-purple-600 hover:bg-purple-500 text-white font-medium px-6 py-2.5 rounded-xl transition duration-300 shadow-lg shadow-purple-900/30 text-sm"
                  >
                    Go to Analytics Summary
                  </button>
                </div>
              } />
              <Route path="/leads" element={<LeadModule role="admin" username="Admin User" />} />
              <Route path="/followups" element={<FollowUpModule role="admin" username="Admin User" />} />
              <Route path="/emailIntegration" element={<EmailIntegrationModule role="admin" username="Admin User" />} />
              <Route path="/dashboard" element={<DashboardAnalyticsModule role="admin" />} />
              <Route path="/contacts" element={<ContactModule role="admin" username="Admin User" />} />
              <Route path="/deals" element={<DealModule role="admin" username="Admin User" />} />
              <Route path="/activitylogs" element={<ActivityLogModule role="admin" />} />
              <Route path="/segments" element={<CustomerSegmentModule role="admin" />} />
              <Route path="/quotation" element={<QuotationBuilderModule role="admin" />} />
              <Route path="/roleaccess" element={<RoleAccessModule role="admin" />} />
              <Route path="/approvals" element={<ApprovalsModule role="admin" />} />
            </Routes>
          </div>
        </main>
      </div>
    </div>
  );
};

export default AdminDashboard;
