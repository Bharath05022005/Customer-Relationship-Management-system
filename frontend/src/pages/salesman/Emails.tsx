import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';

const inputStyle: React.CSSProperties = {
  width: '100%', padding: '12px 16px',
  backgroundColor: '#1e293b', background: '#1e293b',
  border: '1px solid rgba(255,255,255,0.12)',
  color: '#f9fafb', borderRadius: '10px', fontSize: '14px',
  outline: 'none', boxSizing: 'border-box',
  transition: 'border-color 0.2s, box-shadow 0.2s', fontFamily: 'inherit',
};

const labelStyle: React.CSSProperties = {
  display: 'block', fontSize: '12px', fontWeight: 700,
  color: 'rgba(255,255,255,0.5)', marginBottom: '8px',
  textTransform: 'uppercase', letterSpacing: '0.06em',
};

export const Emails: React.FC = () => {
  const { token } = useAuth();

  const [to, setTo]           = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [status, setStatus]   = useState<{ type: 'idle' | 'sending' | 'success' | 'error'; message?: string }>({ type: 'idle' });

  const handleSendEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus({ type: 'sending' });
    try {
      const res = await fetch('http://localhost:5000/api/email/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ to, subject, text: message }),
      });
      const data = await res.json();
      if (res.ok) {
        setStatus({ type: 'success', message: '✅ Email sent successfully!' });
        setTo(''); setSubject(''); setMessage('');
        setTimeout(() => setStatus({ type: 'idle' }), 4000);
      } else {
        setStatus({ type: 'error', message: data.error || 'Failed to send email.' });
      }
    } catch (err) {
      console.error(err);
      setStatus({ type: 'error', message: 'An unexpected error occurred.' });
    }
  };

  const templates = [
    { label: '👋 Follow-Up', subject: 'Following up on our conversation', body: 'Hi,\n\nI wanted to follow up on our recent conversation. Please let me know if you have any questions or if there is anything I can help you with.\n\nBest regards,' },
    { label: '📄 Proposal', subject: 'Proposal for your review', body: 'Hi,\n\nPlease find attached our proposal as discussed. I look forward to your feedback.\n\nBest regards,' },
    { label: '🙏 Thank You', subject: 'Thank you for your time!', body: 'Hi,\n\nThank you for taking the time to speak with me. I truly appreciate the opportunity and look forward to working together.\n\nBest regards,' },
  ];

  return (
    <div className="page-container">

      {/* Header */}
      <div style={{ marginBottom: '28px' }}>
        <h1 style={{ fontSize: '24px', fontWeight: 'bold', margin: 0 }}>Email Integration</h1>
        <p style={{ color: 'var(--text-muted)', marginTop: '4px' }}>Compose and send emails directly to your clients from the CRM</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 320px', gap: '24px', alignItems: 'start' }}>

        {/* ── Left: Compose Form ── */}
        <div className="glass-panel" style={{ padding: '28px', borderRadius: '16px' }}>

          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '24px', paddingBottom: '18px', borderBottom: '1px solid rgba(255,255,255,0.07)' }}>
            <div style={{ width: '42px', height: '42px', borderRadius: '10px', background: 'linear-gradient(135deg, #3b82f6, #8b5cf6)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '20px' }}>
              ✉️
            </div>
            <div>
              <h2 style={{ fontSize: '18px', fontWeight: 700, margin: 0 }}>Compose Email</h2>
              <p style={{ fontSize: '13px', color: 'rgba(255,255,255,0.4)', margin: '2px 0 0' }}>Send a message to your client</p>
            </div>
          </div>

          {/* Alert Banner */}
          {status.type === 'success' && (
            <div style={{ background: 'rgba(16,185,129,0.12)', border: '1px solid rgba(16,185,129,0.4)', color: '#10b981', padding: '14px 16px', borderRadius: '10px', marginBottom: '20px', fontWeight: 600, fontSize: '14px' }}>
              {status.message}
            </div>
          )}
          {status.type === 'error' && (
            <div style={{ background: 'rgba(239,68,68,0.12)', border: '1px solid rgba(239,68,68,0.4)', color: '#ef4444', padding: '14px 16px', borderRadius: '10px', marginBottom: '20px', fontWeight: 600, fontSize: '14px' }}>
              ❌ {status.message}
            </div>
          )}

          <form onSubmit={handleSendEmail} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>

            <div>
              <label style={labelStyle}>To <span style={{ color: '#ef4444' }}>*</span></label>
              <input
                type="email" placeholder="client@example.com"
                value={to} onChange={e => setTo(e.target.value)} required style={inputStyle}
                onFocus={e => { e.currentTarget.style.borderColor = '#3b82f6'; e.currentTarget.style.boxShadow = '0 0 0 3px rgba(59,130,246,0.15)'; }}
                onBlur={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.12)'; e.currentTarget.style.boxShadow = 'none'; }}
              />
            </div>

            <div>
              <label style={labelStyle}>Subject <span style={{ color: '#ef4444' }}>*</span></label>
              <input
                type="text" placeholder="e.g. Follow up on our last meeting"
                value={subject} onChange={e => setSubject(e.target.value)} required style={inputStyle}
                onFocus={e => { e.currentTarget.style.borderColor = '#3b82f6'; e.currentTarget.style.boxShadow = '0 0 0 3px rgba(59,130,246,0.15)'; }}
                onBlur={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.12)'; e.currentTarget.style.boxShadow = 'none'; }}
              />
            </div>

            <div>
              <label style={labelStyle}>Message <span style={{ color: '#ef4444' }}>*</span></label>
              <textarea
                placeholder="Type your message here..."
                value={message} onChange={e => setMessage(e.target.value)} required
                rows={9}
                style={{ ...inputStyle, resize: 'vertical', lineHeight: '1.7' }}
                onFocus={e => { e.currentTarget.style.borderColor = '#3b82f6'; e.currentTarget.style.boxShadow = '0 0 0 3px rgba(59,130,246,0.15)'; }}
                onBlur={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.12)'; e.currentTarget.style.boxShadow = 'none'; }}
              />
              <p style={{ textAlign: 'right', fontSize: '12px', color: 'rgba(255,255,255,0.3)', marginTop: '6px' }}>
                {message.length} characters
              </p>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
              <button
                type="submit"
                disabled={status.type === 'sending'}
                style={{
                  padding: '13px 36px', background: status.type === 'sending' ? 'rgba(59,130,246,0.5)' : 'var(--primary-color)',
                  border: 'none', color: 'white', borderRadius: '10px',
                  cursor: status.type === 'sending' ? 'not-allowed' : 'pointer',
                  fontWeight: 700, fontSize: '15px',
                  boxShadow: status.type === 'sending' ? 'none' : '0 4px 16px rgba(59,130,246,0.45)',
                  transition: 'transform 0.2s, box-shadow 0.2s',
                  display: 'flex', alignItems: 'center', gap: '8px',
                }}
                onMouseEnter={e => { if (status.type !== 'sending') { e.currentTarget.style.transform = 'translateY(-1px)'; e.currentTarget.style.boxShadow = '0 8px 24px rgba(59,130,246,0.6)'; } }}
                onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 4px 16px rgba(59,130,246,0.45)'; }}
              >
                {status.type === 'sending' ? (
                  <><span style={{ animation: 'spin 1s linear infinite' }}>⏳</span> Sending...</>
                ) : (
                  <>🚀 Send Email</>
                )}
              </button>
            </div>
          </form>
        </div>

        {/* ── Right: Templates Panel ── */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>

          {/* Templates */}
          <div className="glass-panel" style={{ padding: '20px', borderRadius: '16px' }}>
            <h3 style={{ fontSize: '14px', fontWeight: 700, color: 'rgba(255,255,255,0.6)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '16px' }}>
              ⚡ Quick Templates
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {templates.map(t => (
                <button
                  key={t.label}
                  type="button"
                  onClick={() => { setSubject(t.subject); setMessage(t.body); }}
                  style={{
                    padding: '12px 14px', background: 'rgba(255,255,255,0.04)',
                    border: '1px solid rgba(255,255,255,0.08)', color: '#f9fafb',
                    borderRadius: '8px', cursor: 'pointer', textAlign: 'left',
                    fontSize: '13px', fontWeight: 600, transition: 'background 0.2s, border-color 0.2s',
                  }}
                  onMouseEnter={e => { e.currentTarget.style.background = 'rgba(59,130,246,0.12)'; e.currentTarget.style.borderColor = 'rgba(59,130,246,0.4)'; }}
                  onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.04)'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)'; }}
                >
                  {t.label}
                </button>
              ))}
            </div>
          </div>

          {/* Tips */}
          <div className="glass-panel" style={{ padding: '20px', borderRadius: '16px', borderLeft: '3px solid #f59e0b' }}>
            <h3 style={{ fontSize: '13px', fontWeight: 700, color: '#f59e0b', marginBottom: '12px' }}>💡 Email Tips</h3>
            <ul style={{ paddingLeft: '16px', display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '13px', color: 'rgba(255,255,255,0.55)', lineHeight: '1.5' }}>
              <li>Keep subject lines short and specific</li>
              <li>Personalise with the client's name</li>
              <li>Include a clear call-to-action</li>
              <li>Follow up if no reply in 3 days</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};
