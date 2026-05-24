import React from 'react';

export const AdminSettings: React.FC = () => {

  return (
    <div className="page-container">
      <div style={{ marginBottom: '32px' }}>
        <h1 style={{ fontSize: '28px', fontWeight: 700 }}>Admin Settings</h1>
        <p style={{ color: 'var(--text-muted)' }}>Configure system preferences and master settings.</p>
      </div>

      <div className="glass-panel" style={{ padding: '24px', borderRadius: '16px', maxWidth: '800px' }}>
        <h2 style={{ fontSize: '18px', marginBottom: '16px' }}>System Configuration</h2>
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          
          <div style={{ borderBottom: '1px solid rgba(255,255,255,0.05)', paddingBottom: '20px' }}>
            <h3 style={{ fontSize: '15px', marginBottom: '8px' }}>Security Settings</h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '13px', marginBottom: '12px' }}>Manage password policies and two-factor authentication.</p>
            <button style={{ padding: '8px 16px', borderRadius: '8px', background: 'rgba(255,255,255,0.1)', color: 'white', border: '1px solid rgba(255,255,255,0.1)', cursor: 'pointer' }}>
              Configure Security
            </button>
          </div>

          <div style={{ borderBottom: '1px solid rgba(255,255,255,0.05)', paddingBottom: '20px' }}>
            <h3 style={{ fontSize: '15px', marginBottom: '8px' }}>Email Integration</h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '13px', marginBottom: '12px' }}>Set up SMTP details for system emails.</p>
            <button style={{ padding: '8px 16px', borderRadius: '8px', background: 'rgba(255,255,255,0.1)', color: 'white', border: '1px solid rgba(255,255,255,0.1)', cursor: 'pointer' }}>
              Manage SMTP
            </button>
          </div>

          <div>
            <h3 style={{ fontSize: '15px', marginBottom: '8px' }}>User Management</h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '13px', marginBottom: '12px' }}>Go to the Admin Dashboard to create new salesman accounts.</p>
          </div>

        </div>
      </div>
    </div>
  );
};
