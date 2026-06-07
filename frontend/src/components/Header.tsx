import React, { useState } from 'react';
import { LogOut, Menu } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import './Header.css';

interface HeaderProps {
  onMenuClick?: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onMenuClick }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [showDropdown, setShowDropdown] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header className="header glass" style={{ 
      display: 'flex', 
      justifyContent: 'space-between', 
      alignItems: 'center',
      padding: '0 24px',
      minHeight: '64px',
      borderBottom: '1px solid rgba(255,255,255,0.05)',
      zIndex: 50
    }}>
      
      {/* Mobile Menu Button (Hamburger) */}
      <button 
        onClick={onMenuClick}
        className="mobile-menu-btn"
        style={{
          display: 'none', // Hidden on desktop, shown via CSS on mobile
          alignItems: 'center',
          justifyContent: 'center',
          padding: '8px',
          color: 'var(--text-primary)',
          cursor: 'pointer',
          borderRadius: '8px',
          background: 'rgba(255,255,255,0.05)',
          border: 'none'
        }}
      >
        <Menu size={22} />
      </button>
      
      {/* Right Actions */}
      <div style={{ display: 'flex', alignItems: 'center' }}>
        
        {/* Profile Dropdown */}
        <div style={{ position: 'relative' }}>
          <div 
            onClick={() => setShowDropdown(!showDropdown)}
            style={{ 
              display: 'flex', alignItems: 'center', gap: '10px', 
              cursor: 'pointer', padding: '6px', borderRadius: '10px',
              background: showDropdown ? 'rgba(255,255,255,0.05)' : 'transparent',
              transition: 'background 0.2s'
            }}
            onMouseEnter={e => !showDropdown && (e.currentTarget.style.background = 'rgba(255,255,255,0.03)')}
            onMouseLeave={e => !showDropdown && (e.currentTarget.style.background = 'transparent')}
          >
            <div style={{
              width: '34px', height: '34px', borderRadius: '50%',
              background: 'linear-gradient(135deg, #8b5cf6, #3b82f6)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontWeight: 800, fontSize: '14px', color: '#fff',
              boxShadow: '0 2px 8px rgba(0,0,0,0.2)'
            }}>
              {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
            </div>
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <span style={{ fontSize: '13px', fontWeight: 700, color: '#f9fafb' }}>{user?.name || 'User'}</span>
              <span style={{ fontSize: '11px', color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                {user?.role === 'Salesman' ? 'Sales Employee' : (user?.role || 'Role')}
              </span>
            </div>
          </div>

          {/* Dropdown Menu */}
          {showDropdown && (
            <div style={{
              position: 'absolute', top: '100%', right: '0', marginTop: '12px',
              background: '#1e293b', border: '1px solid rgba(255,255,255,0.1)',
              borderRadius: '12px', width: '220px', padding: '8px',
              boxShadow: '0 10px 40px rgba(0,0,0,0.6)', zIndex: 100
            }}>
              <div style={{ padding: '10px 12px', borderBottom: '1px solid rgba(255,255,255,0.05)', marginBottom: '8px' }}>
                <div style={{ fontSize: '12px', color: 'rgba(255,255,255,0.4)' }}>Signed in as</div>
                <div style={{ fontSize: '13px', fontWeight: 600, color: '#f9fafb', overflow: 'hidden', textOverflow: 'ellipsis', marginTop: '2px' }}>
                  {user?.email || 'user@example.com'}
                </div>
              </div>
              
              <button 
                onClick={handleLogout}
                style={{
                  width: '100%', display: 'flex', alignItems: 'center', gap: '10px',
                  padding: '10px 12px', background: 'transparent', border: 'none',
                  color: '#ef4444', fontSize: '13px', fontWeight: 600, cursor: 'pointer',
                  borderRadius: '8px', textAlign: 'left', transition: 'background 0.2s'
                }}
                onMouseEnter={e => e.currentTarget.style.background = 'rgba(239,68,68,0.1)'}
                onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
              >
                <LogOut size={16} />
                Sign Out
              </button>
            </div>
          )}
        </div>

      </div>
    </header>
  );
};
