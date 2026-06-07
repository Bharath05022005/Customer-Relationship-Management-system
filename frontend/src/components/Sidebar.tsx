import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { LayoutDashboard, Users, UserSquare2, LineChart, CheckSquare, ShieldAlert, LogOut, Clock, Filter, FileText, Mail } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import './Sidebar.css';

const adminNavItems = [
  { name: 'Dashboard', path: '/admin', icon: <LayoutDashboard size={20} /> },
  { name: 'Settings', path: '/admin/settings', icon: <ShieldAlert size={20} /> },
];

const salesmanNavItems = [
  { name: 'Dashboard', path: '/salesman', icon: <LayoutDashboard size={20} /> },
  { name: 'Leads', path: '/salesman/leads', icon: <UserSquare2 size={20} /> },
  { name: 'Contacts', path: '/salesman/contacts', icon: <Users size={20} /> },
  { name: 'Pipeline', path: '/salesman/pipeline', icon: <LineChart size={20} /> },
  { name: 'Tasks', path: '/salesman/tasks', icon: <CheckSquare size={20} /> },
  { name: 'Activity Log', path: '/salesman/activity', icon: <Clock size={20} /> },
  { name: 'Segments', path: '/salesman/segments', icon: <Filter size={20} /> },
  { name: 'Proposals', path: '/salesman/proposals', icon: <FileText size={20} /> },
  { name: 'Emails', path: '/salesman/emails', icon: <Mail size={20} /> },
];

export const Sidebar: React.FC = () => {
  const { user, isAdmin, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const navItems = isAdmin ? adminNavItems : salesmanNavItems;

  return (
    <aside className="sidebar glass">
      <div className="sidebar-header">
        <div className="logo-container" style={{ alignItems: 'center', justifyContent: 'flex-start', gap: '10px' }}>
          <img src="/logo-full.svg" alt="CRM Logo" style={{ height: '48px', width: 'auto', maxWidth: '100%', objectFit: 'contain' }} />
        </div>
      </div>
      
      <nav className="sidebar-nav">
        {navItems.map((item) => (
          <NavLink 
            key={item.name} 
            to={item.path}
            end={item.path === '/admin' || item.path === '/salesman'}
            className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
          >
            {item.icon}
            <span>{item.name}</span>
          </NavLink>
        ))}
      </nav>
      
      <div className="sidebar-footer">
        <button onClick={handleLogout} className="nav-link" style={{ background: 'transparent', border: 'none', width: '100%', cursor: 'pointer', marginBottom: '12px', color: 'var(--text-muted)' }}>
          <LogOut size={20} />
          <span>Logout</span>
        </button>
        <div className="user-profile">
          <div className="avatar">{user?.name ? user.name.charAt(0).toUpperCase() : 'U'}</div>
          <div className="user-info">
            <span className="user-name">{user?.name || 'Unknown User'}</span>
            <span className="user-role">{user?.role || 'Guest'}</span>
          </div>
        </div>
      </div>
    </aside>
  );
};
