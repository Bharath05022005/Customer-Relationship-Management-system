import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import API_BASE from '../../config/api.js';

interface Deal {
  id: number;
  dealName: string;
  value: number;
  stage: string;
  expectedCloseDate: string;
  company: string;
  contactName?: string;
  probability?: number;
  description?: string;
  assignedTo?: string;
}

const inputStyle: React.CSSProperties = {
  width: '100%',
  padding: '10px 14px',
  backgroundColor: '#1e293b',
  background: '#1e293b',
  border: '1px solid rgba(255,255,255,0.12)',
  color: '#f9fafb',
  borderRadius: '8px',
  fontSize: '14px',
  outline: 'none',
  boxSizing: 'border-box',
  transition: 'border-color 0.2s',
  fontFamily: 'inherit',
  colorScheme: 'dark' as any,
};

const labelStyle: React.CSSProperties = {
  display: 'block',
  fontSize: '12px',
  fontWeight: 600,
  color: 'rgba(255,255,255,0.55)',
  marginBottom: '6px',
  textTransform: 'uppercase',
  letterSpacing: '0.05em',
};

const sectionTitleStyle: React.CSSProperties = {
  fontSize: '13px',
  fontWeight: 700,
  color: 'var(--primary-color)',
  textTransform: 'uppercase',
  letterSpacing: '0.08em',
  borderBottom: '1px solid rgba(255,255,255,0.08)',
  paddingBottom: '10px',
  marginBottom: '18px',
  gridColumn: '1 / -1',
};

const gridStyle: React.CSSProperties = {
  display: 'grid',
  gridTemplateColumns: '1fr 1fr',
  gap: '18px',
};

export const Pipeline: React.FC = () => {
  const { token } = useAuth();
  const [deals, setDeals] = useState<Deal[]>([]);
  const [showModal, setShowModal] = useState(false);

  // Form State
  const [dealName, setDealName] = useState('');
  const [value, setValue] = useState('');
  const [stage, setStage] = useState('Prospect');
  const [company, setCompany] = useState('');
  const [contactName, setContactName] = useState('');
  const [closeDate, setCloseDate] = useState('');
  const [probability, setProbability] = useState('');
  const [description, setDescription] = useState('');
  const [assignedTo, setAssignedTo] = useState('');

  const fetchDeals = async () => {
    try {
      const res = await fetch(`${API_BASE}/api/deals`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      if (res.ok) setDeals(data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchDeals();
  }, []);

  const resetForm = () => {
    setDealName(''); setValue(''); setStage('Prospect'); setCompany('');
    setContactName(''); setCloseDate(''); setProbability('');
    setDescription(''); setAssignedTo('');
  };

  const handleAddDeal = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch(`${API_BASE}/api/deals`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ dealName, value, stage, company, contactName, closeDate, probability, description, assignedTo })
      });
      if (res.ok) {
        setShowModal(false);
        fetchDeals();
        resetForm();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const updateStage = async (id: number, newStage: string) => {
    try {
      const res = await fetch(`http://localhost:5000/api/deals/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ stage: newStage })
      });
      if (res.ok) fetchDeals();
    } catch (err) {
      console.error(err);
    }
  };

  const stages = ['Prospect', 'Proposal', 'Negotiation', 'Won', 'Lost'];

  const stageColors: Record<string, string> = {
    Prospect: '#3b82f6',
    Proposal: '#8b5cf6',
    Negotiation: '#f59e0b',
    Won: '#10b981',
    Lost: '#ef4444',
  };

  return (
    <div className="page-container">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <div>
          <h1 style={{ fontSize: '24px', fontWeight: 'bold' }}>Sales Pipeline</h1>
          <p style={{ color: 'var(--text-muted)' }}>Visual deal tracking across all stages</p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          style={{
            padding: '10px 20px', background: 'var(--primary-color)', color: 'white',
            border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 600,
            boxShadow: '0 4px 14px rgba(59,130,246,0.4)', transition: 'transform 0.2s',
          }}
          onMouseEnter={e => (e.currentTarget.style.transform = 'scale(1.04)')}
          onMouseLeave={e => (e.currentTarget.style.transform = 'scale(1)')}
        >
          + Add Deal
        </button>
      </div>

      {/* Kanban Board */}
      <div style={{ display: 'flex', gap: '20px', overflowX: 'auto', paddingBottom: '20px' }}>
        {stages.map(stageName => (
          <div key={stageName} className="glass-panel" style={{
            flex: '0 0 280px', padding: '16px', borderRadius: '12px', minHeight: '400px',
            borderTop: `3px solid ${stageColors[stageName]}`,
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <h3 style={{ fontSize: '14px', fontWeight: 700, color: stageColors[stageName], textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                {stageName}
              </h3>
              <span style={{
                background: stageColors[stageName] + '22', color: stageColors[stageName],
                borderRadius: '999px', padding: '2px 10px', fontSize: '12px', fontWeight: 700,
              }}>
                {deals.filter(d => d.stage === stageName).length}
              </span>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {deals.filter(d => d.stage === stageName).map(deal => (
                <div key={deal.id} style={{
                  background: 'rgba(255,255,255,0.05)', padding: '14px', borderRadius: '10px',
                  borderLeft: `3px solid ${stageColors[stageName]}`,
                  transition: 'transform 0.15s, box-shadow 0.15s',
                  cursor: 'default',
                }}
                  onMouseEnter={e => {
                    e.currentTarget.style.transform = 'translateY(-2px)';
                    e.currentTarget.style.boxShadow = '0 6px 20px rgba(0,0,0,0.3)';
                  }}
                  onMouseLeave={e => {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = 'none';
                  }}
                >
                  <h4 style={{ margin: '0 0 4px 0', fontSize: '14px', fontWeight: 600 }}>{deal.dealName}</h4>
                  <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '12px', margin: '0 0 10px 0' }}>
                    {deal.company || 'No Company'}
                  </p>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontWeight: 700, color: '#10b981', fontSize: '15px' }}>
                      ₹{Number(deal.value).toLocaleString('en-IN')}
                    </span>
                    <select
                      value={deal.stage}
                      onChange={(e) => updateStage(deal.id, e.target.value)}
                      style={{
                        background: 'rgba(0,0,0,0.5)', color: 'white', border: '1px solid rgba(255,255,255,0.1)',
                        padding: '4px 6px', borderRadius: '6px', fontSize: '11px', cursor: 'pointer',
                      }}
                    >
                      {stages.map(s => <option key={s} value={s}>{s}</option>)}
                    </select>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* ===================== NEW DEAL MODAL ===================== */}
      {showModal && (
        <div style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
          background: 'rgba(0,0,0,0.75)', display: 'flex',
          alignItems: 'center', justifyContent: 'center', zIndex: 1000,
          backdropFilter: 'blur(4px)',
        }}>
          <div className="glass-panel" style={{
            width: '820px', maxWidth: '95vw', maxHeight: '90vh',
            overflowY: 'auto', borderRadius: '16px',
            boxShadow: '0 24px 64px rgba(0,0,0,0.6)',
          }}>
            {/* Modal Header */}
            <div style={{
              padding: '22px 28px 18px',
              borderBottom: '1px solid rgba(255,255,255,0.08)',
              display: 'flex', justifyContent: 'space-between', alignItems: 'center',
            }}>
              <div>
                <h2 style={{ fontSize: '20px', fontWeight: 700, margin: 0 }}>Create New Deal</h2>
                <p style={{ fontSize: '13px', color: 'rgba(255,255,255,0.45)', margin: '4px 0 0' }}>
                  Fill in the details to add a deal to your sales pipeline
                </p>
              </div>
              <button
                onClick={() => { setShowModal(false); resetForm(); }}
                style={{
                  background: 'rgba(255,255,255,0.08)', border: 'none', color: 'white',
                  width: '32px', height: '32px', borderRadius: '50%', cursor: 'pointer',
                  fontSize: '18px', display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}
              >
                ×
              </button>
            </div>

            {/* Modal Body */}
            <form onSubmit={handleAddDeal} style={{ padding: '24px 28px 28px' }}>

              {/* ── Section 1: Deal Information ── */}
              <div style={gridStyle}>
                <div style={sectionTitleStyle}>📋 Deal Information</div>

                {/* Deal Name – full width */}
                <div style={{ gridColumn: '1 / -1' }}>
                  <label style={labelStyle}>Deal Name <span style={{ color: '#ef4444' }}>*</span></label>
                  <input
                    type="text"
                    placeholder="e.g. Tech Solutions CRM Package"
                    value={dealName}
                    onChange={e => setDealName(e.target.value)}
                    required
                    style={inputStyle}
                  />
                </div>

                <div>
                  <label style={labelStyle}>Deal Value (₹) <span style={{ color: '#ef4444' }}>*</span></label>
                  <input
                    type="number"
                    placeholder="e.g. 50000"
                    value={value}
                    onChange={e => setValue(e.target.value)}
                    required
                    style={inputStyle}
                  />
                </div>

                <div>
                  <label style={labelStyle}>Pipeline Stage</label>
                  <select value={stage} onChange={e => setStage(e.target.value)} style={inputStyle}>
                    {stages.map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                </div>

                <div>
                  <label style={labelStyle}>Probability (%)</label>
                  <input
                    type="number"
                    min="0" max="100"
                    placeholder="e.g. 70"
                    value={probability}
                    onChange={e => setProbability(e.target.value)}
                    style={inputStyle}
                  />
                </div>

                <div>
                  <label style={labelStyle}>Expected Close Date</label>
                  <input
                    type="date"
                    value={closeDate}
                    onChange={e => setCloseDate(e.target.value)}
                    style={{ ...inputStyle, colorScheme: 'dark' }}
                  />
                </div>
              </div>

              {/* Spacer */}
              <div style={{ height: '24px' }} />

              {/* ── Section 2: Contact & Company ── */}
              <div style={gridStyle}>
                <div style={sectionTitleStyle}>🏢 Contact & Company Details</div>

                <div>
                  <label style={labelStyle}>Contact Person</label>
                  <input
                    type="text"
                    placeholder="e.g. John Smith"
                    value={contactName}
                    onChange={e => setContactName(e.target.value)}
                    style={inputStyle}
                  />
                </div>

                <div>
                  <label style={labelStyle}>Company Name</label>
                  <input
                    type="text"
                    placeholder="e.g. Tech Solutions Inc."
                    value={company}
                    onChange={e => setCompany(e.target.value)}
                    style={inputStyle}
                  />
                </div>

                <div>
                  <label style={labelStyle}>Assigned To</label>
                  <input
                    type="text"
                    placeholder="e.g. Bharath (Salesman)"
                    value={assignedTo}
                    onChange={e => setAssignedTo(e.target.value)}
                    style={inputStyle}
                  />
                </div>
              </div>

              {/* Spacer */}
              <div style={{ height: '24px' }} />

              {/* ── Section 3: Description ── */}
              <div>
                <p style={{ ...sectionTitleStyle, gridColumn: 'auto' }}>📝 Additional Notes</p>
                <label style={labelStyle}>Description / Notes</label>
                <textarea
                  placeholder="Add any relevant notes about this deal..."
                  value={description}
                  onChange={e => setDescription(e.target.value)}
                  rows={3}
                  style={{
                    ...inputStyle,
                    resize: 'vertical',
                    fontFamily: 'inherit',
                    lineHeight: '1.5',
                  }}
                />
              </div>

              {/* ── Footer Buttons ── */}
              <div style={{
                display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '28px',
                paddingTop: '20px', borderTop: '1px solid rgba(255,255,255,0.08)',
              }}>
                <button
                  type="button"
                  onClick={() => { setShowModal(false); resetForm(); }}
                  style={{
                    padding: '11px 28px', background: 'transparent',
                    border: '1px solid rgba(255,255,255,0.2)', color: 'white',
                    borderRadius: '8px', cursor: 'pointer', fontWeight: 600, fontSize: '14px',
                    transition: 'background 0.2s',
                  }}
                  onMouseEnter={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.07)')}
                  onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  style={{
                    padding: '11px 36px', background: 'var(--primary-color)',
                    border: 'none', color: 'white', borderRadius: '8px',
                    cursor: 'pointer', fontWeight: 700, fontSize: '14px',
                    boxShadow: '0 4px 16px rgba(59,130,246,0.45)',
                    transition: 'transform 0.2s, box-shadow 0.2s',
                  }}
                  onMouseEnter={e => {
                    e.currentTarget.style.transform = 'translateY(-1px)';
                    e.currentTarget.style.boxShadow = '0 8px 24px rgba(59,130,246,0.55)';
                  }}
                  onMouseLeave={e => {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = '0 4px 16px rgba(59,130,246,0.45)';
                  }}
                >
                  💾 Save Deal
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

