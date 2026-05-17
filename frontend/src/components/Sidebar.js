import React from 'react';
import { 
  LayoutDashboard, 
  Target, 
  Users, 
  Handshake, 
  Calendar, 
  History, 
  LineChart, 
  FileText, 
  Mail, 
  Lock, 
  CheckSquare,
  LogOut,
  Sparkles
} from 'lucide-react';

const Sidebar = ({ activeTab, setActiveTab, role, username, onLogout }) => {
  const adminLinks = [
    { name: 'Dashboard', tab: 'dashboard', icon: LayoutDashboard },
    { name: 'Leads', tab: 'leads', icon: Target },
    { name: 'Contacts', tab: 'contacts', icon: Users },
    { name: 'Deals', tab: 'deals', icon: Handshake },
    { name: 'Follow-ups', tab: 'followups', icon: Calendar },
    { name: 'Activity Log', tab: 'activity', icon: History },
    { name: 'Segments', tab: 'segments', icon: LineChart },
    { name: 'Quotes', tab: 'quotes', icon: FileText },
    { name: 'Email Integration', tab: 'emailIntegration', icon: Mail },
    { name: 'Role Access', tab: 'roles', icon: Lock },
    { name: 'Approvals', tab: 'approvals', icon: CheckSquare },
  ];

  const salesmanLinks = [
    { name: 'Dashboard Overview', tab: 'overview', icon: LayoutDashboard },
    { name: 'Leads', tab: 'leads', icon: Target },
    { name: 'Contacts', tab: 'contacts', icon: Users },
    { name: 'Deals', tab: 'deals', icon: Handshake },
    { name: 'Follow-ups', tab: 'followups', icon: Calendar },
    { name: 'Activities', tab: 'activity', icon: History },
    { name: 'Segments', tab: 'segments', icon: LineChart },
    { name: 'Quotations', tab: 'quotes', icon: FileText },
    { name: 'Email', tab: 'email', icon: Mail },
  ];

  const links = role === 'Admin' ? adminLinks : salesmanLinks;

  return (
    <div className="w-72 h-screen bg-slate-900 border-r border-slate-800 flex flex-col justify-between text-slate-300 font-inter select-none shadow-2xl">
      
      {/* Brand Header */}
      <div>
        <div className="p-6 border-b border-slate-800/80 bg-slate-950/30 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-purple-600 to-indigo-600 flex items-center justify-center text-white shadow-lg shadow-indigo-500/20">
              <Sparkles className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <h2 className="text-lg font-black text-white tracking-wider leading-none">VAALTIC</h2>
              <span className="text-[10px] font-bold text-indigo-400 tracking-widest uppercase">CRM Suite</span>
            </div>
          </div>
          <div className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-indigo-500/10 border border-indigo-500/20 text-indigo-400">
            {role === 'Admin' ? 'ADMIN' : 'AGENT'}
          </div>
        </div>

        {/* Navigation Items */}
        <div className="p-4 overflow-y-auto max-h-[calc(100vh-180px)] space-y-1">
          <p className="px-4 text-[10px] font-semibold text-slate-500 uppercase tracking-widest mb-3">Main Menu</p>
          <ul className="space-y-1.5">
            {links.map((link) => {
              const IconComponent = link.icon;
              const isActive = activeTab === link.tab;

              return (
                <li key={link.tab}>
                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      if (setActiveTab) setActiveTab(link.tab);
                    }}
                    className={`w-full flex items-center gap-3.5 px-4 py-3 rounded-xl transition duration-200 text-sm font-medium ${
                      isActive 
                        ? 'bg-gradient-to-r from-purple-600/90 to-indigo-600/90 text-white shadow-lg shadow-indigo-900/30 font-semibold' 
                        : 'hover:bg-slate-800/60 hover:text-white text-slate-400'
                    }`}
                  >
                    <IconComponent className={`w-4.5 h-4.5 transition duration-200 ${isActive ? 'text-white' : 'text-slate-400 group-hover:text-white'}`} />
                    <span>{link.name}</span>
                    {isActive && (
                      <span className="ml-auto w-1.5 h-1.5 bg-white rounded-full"></span>
                    )}
                  </button>
                </li>
              );
            })}
          </ul>
        </div>
      </div>

      {/* User Session Profile & Logout Card */}
      <div className="p-4 border-t border-slate-800/80 bg-slate-950/20">
        <div className="bg-slate-800/40 border border-slate-700/30 rounded-xl p-4 flex items-center justify-between">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-10 h-10 rounded-lg bg-slate-800 border border-slate-700/50 flex items-center justify-center font-bold text-white text-sm shrink-0 uppercase">
              {username ? username.substring(0, 2) : 'CR'}
            </div>
            <div className="min-w-0 text-left">
              <p className="text-xs font-semibold text-white truncate">{username || 'Active User'}</p>
              <p className="text-[10px] text-slate-400 font-medium truncate capitalize">{role || 'Sales Representative'}</p>
            </div>
          </div>

          <button
            onClick={onLogout}
            title="Log Out Session"
            className="w-9 h-9 rounded-lg hover:bg-red-500/10 border border-transparent hover:border-red-500/20 text-slate-400 hover:text-red-400 flex items-center justify-center transition duration-200 cursor-pointer shrink-0"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>

    </div>
  );
};

export default Sidebar;
