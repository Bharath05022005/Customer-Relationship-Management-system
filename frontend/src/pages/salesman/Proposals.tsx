import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import API_BASE from '../../config/api.js';

interface Proposal {
  id: number;
  clientName: string;
  email: string;
  item: string;
  price: number;
  quantity: number;
  createdAt: string;
}

const inputStyle: React.CSSProperties = {
  width: '100%', padding: '10px 14px',
  backgroundColor: '#1e293b', background: '#1e293b',
  border: '1px solid rgba(255,255,255,0.12)',
  color: '#f9fafb', borderRadius: '8px', fontSize: '14px',
  outline: 'none', boxSizing: 'border-box',
  transition: 'border-color 0.2s', fontFamily: 'inherit',
};

const labelStyle: React.CSSProperties = {
  display: 'block', fontSize: '11px', fontWeight: 700,
  color: 'rgba(255,255,255,0.45)', marginBottom: '6px',
  textTransform: 'uppercase', letterSpacing: '0.06em',
};

const sectionHeadStyle: React.CSSProperties = {
  fontSize: '12px', fontWeight: 700,
  color: 'var(--primary-color)', textTransform: 'uppercase',
  letterSpacing: '0.08em', borderBottom: '1px solid rgba(255,255,255,0.07)',
  paddingBottom: '10px', marginBottom: '18px',
};

export const Proposals: React.FC = () => {
  const { token } = useAuth();
  const [proposals, setProposals] = useState<Proposal[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);

  const [clientName, setClientName] = useState('');
  const [email, setEmail]           = useState('');
  const [item, setItem]             = useState('');
  const [price, setPrice]           = useState('');
  const [quantity, setQuantity]     = useState('1');

  const fetchProposals = async () => {
    try {
      const res = await fetch(`${API_BASE}/api/proposals`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (res.ok) setProposals(data);
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchProposals(); }, []);

  const resetForm = () => { setClientName(''); setEmail(''); setItem(''); setPrice(''); setQuantity('1'); };

  const handleCreateProposal = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch(`${API_BASE}/api/proposals`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ clientName, email, item, price: parseFloat(price), quantity: parseInt(quantity) }),
      });
      if (res.ok) { setShowModal(false); fetchProposals(); resetForm(); }
    } catch (err) { console.error(err); }
  };

  const total = (parseFloat(price) || 0) * (parseInt(quantity) || 1);

  return (
    <div className="page-container">

      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '28px' }}>
        <div>
          <h1 style={{ fontSize: '24px', fontWeight: 'bold', margin: 0 }}>Quotation & Proposals</h1>
          <p style={{ color: 'var(--text-muted)', marginTop: '4px' }}>Generate and manage pricing quotes for your clients</p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          style={{
            padding: '11px 22px', background: 'var(--primary-color)', color: 'white',
            border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 700, fontSize: '14px',
            boxShadow: '0 4px 14px rgba(59,130,246,0.4)', transition: 'transform 0.2s',
          }}
          onMouseEnter={e => (e.currentTarget.style.transform = 'scale(1.04)')}
          onMouseLeave={e => (e.currentTarget.style.transform = 'scale(1)')}
        >
          + Create Proposal
        </button>
      </div>

      {/* Table */}
      <div className="glass-panel" style={{ overflow: 'hidden', borderRadius: '14px' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.08)', background: 'rgba(255,255,255,0.03)' }}>
              {['Client', 'Product / Service', 'Unit Price', 'Qty', 'Total Amount', 'Date Issued', 'Actions'].map(h => (
                <th key={h} style={{ padding: '14px 16px', fontSize: '11px', fontWeight: 700, color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={7} style={{ padding: '40px', textAlign: 'center', color: 'var(--text-muted)' }}>Loading proposals...</td></tr>
            ) : proposals.length === 0 ? (
              <tr>
                <td colSpan={7} style={{ padding: '50px', textAlign: 'center', color: 'var(--text-muted)' }}>
                  <div style={{ fontSize: '36px', marginBottom: '10px' }}>📄</div>
                  <p style={{ fontWeight: 600 }}>No proposals yet</p>
                  <p style={{ fontSize: '13px' }}>Click "+ Create Proposal" to generate your first quotation.</p>
                </td>
              </tr>
            ) : (
              proposals.map((p, i) => (
                <tr key={p.id} style={{
                  borderBottom: '1px solid rgba(255,255,255,0.05)',
                  background: i % 2 === 0 ? 'transparent' : 'rgba(255,255,255,0.015)',
                  transition: 'background 0.15s',
                }}
                  onMouseEnter={e => (e.currentTarget.style.background = 'rgba(59,130,246,0.06)')}
                  onMouseLeave={e => (e.currentTarget.style.background = i % 2 === 0 ? 'transparent' : 'rgba(255,255,255,0.015)')}
                >
                  <td style={{ padding: '14px 16px' }}>
                    <div style={{ fontWeight: 700, fontSize: '14px' }}>{p.clientName}</div>
                    <div style={{ fontSize: '12px', color: 'rgba(255,255,255,0.45)' }}>{p.email}</div>
                  </td>
                  <td style={{ padding: '14px 16px', fontSize: '14px' }}>{p.item}</td>
                  <td style={{ padding: '14px 16px', fontSize: '14px', color: 'rgba(255,255,255,0.7)' }}>
                    ₹{Number(p.price).toLocaleString('en-IN')}
                  </td>
                  <td style={{ padding: '14px 16px', fontSize: '14px', color: 'rgba(255,255,255,0.7)' }}>{p.quantity}</td>
                  <td style={{ padding: '14px 16px', fontWeight: 700, color: '#10b981', fontSize: '15px' }}>
                    ₹{(p.price * p.quantity).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                  </td>
                  <td style={{ padding: '14px 16px', fontSize: '13px', color: 'rgba(255,255,255,0.5)' }}>
                    {new Date(p.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                  </td>
                  <td style={{ padding: '14px 16px' }}>
                    <button style={{
                      background: 'transparent', border: '1px solid rgba(59,130,246,0.5)',
                      color: '#3b82f6', padding: '6px 14px', borderRadius: '6px',
                      cursor: 'pointer', fontSize: '12px', fontWeight: 600, transition: 'background 0.2s',
                    }}
                      onMouseEnter={e => (e.currentTarget.style.background = 'rgba(59,130,246,0.12)')}
                      onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
                    >
                      📥 Download
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* ── NEW PROPOSAL MODAL ── */}
      {showModal && (
        <div style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
          background: 'rgba(0,0,0,0.78)', backdropFilter: 'blur(6px)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000,
        }}>
          <div className="glass-panel" style={{
            width: '700px', maxWidth: '95vw', maxHeight: '92vh',
            overflowY: 'auto', borderRadius: '18px',
            boxShadow: '0 30px 80px rgba(0,0,0,0.65)',
          }}>

            {/* Modal Header */}
            <div style={{
              padding: '22px 28px 18px', borderBottom: '1px solid rgba(255,255,255,0.07)',
              display: 'flex', justifyContent: 'space-between', alignItems: 'center',
              position: 'sticky', top: 0, background: 'var(--card-bg, #0f172a)', zIndex: 10, borderRadius: '18px 18px 0 0',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                <div style={{
                  width: '42px', height: '42px', borderRadius: '10px',
                  background: 'linear-gradient(135deg, #10b981, #3b82f6)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '20px',
                }}>📄</div>
                <div>
                  <h2 style={{ fontSize: '20px', fontWeight: 700, margin: 0 }}>Create New Quotation</h2>
                  <p style={{ fontSize: '13px', color: 'rgba(255,255,255,0.4)', margin: '3px 0 0' }}>
                    Generate a pricing quote for a client
                  </p>
                </div>
              </div>
              <button onClick={() => { setShowModal(false); resetForm(); }}
                style={{ background: 'rgba(255,255,255,0.08)', border: 'none', color: 'white', width: '34px', height: '34px', borderRadius: '50%', cursor: 'pointer', fontSize: '18px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>×</button>
            </div>

            <form onSubmit={handleCreateProposal} style={{ padding: '26px 28px 30px' }}>

              {/* Section 1: Client */}
              <p style={sectionHeadStyle}>👤 Client Information</p>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '24px' }}>
                <div>
                  <label style={labelStyle}>Client Name <span style={{ color: '#ef4444' }}>*</span></label>
                  <input type="text" placeholder="e.g. John Smith" value={clientName}
                    onChange={e => setClientName(e.target.value)} required style={inputStyle} />
                </div>
                <div>
                  <label style={labelStyle}>Client Email <span style={{ color: '#ef4444' }}>*</span></label>
                  <input type="email" placeholder="e.g. john@example.com" value={email}
                    onChange={e => setEmail(e.target.value)} required style={inputStyle} />
                </div>
              </div>

              {/* Section 2: Line Item */}
              <p style={sectionHeadStyle}>🛒 Line Item</p>
              <div style={{
                background: 'rgba(255,255,255,0.03)', border: '1px dashed rgba(255,255,255,0.12)',
                borderRadius: '12px', padding: '20px', marginBottom: '24px',
                display: 'flex', flexDirection: 'column', gap: '16px',
              }}>
                <div>
                  <label style={labelStyle}>Product / Service Name <span style={{ color: '#ef4444' }}>*</span></label>
                  <input type="text" placeholder="e.g. CRM Software Annual License" value={item}
                    onChange={e => setItem(e.target.value)} required style={inputStyle} />
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                  <div>
                    <label style={labelStyle}>Unit Price (₹) <span style={{ color: '#ef4444' }}>*</span></label>
                    <input type="number" placeholder="e.g. 50000" value={price}
                      onChange={e => setPrice(e.target.value)} required style={inputStyle} />
                  </div>
                  <div>
                    <label style={labelStyle}>Quantity <span style={{ color: '#ef4444' }}>*</span></label>
                    <input type="number" placeholder="1" value={quantity} min="1"
                      onChange={e => setQuantity(e.target.value)} required style={inputStyle} />
                  </div>
                </div>
              </div>

              {/* Total */}
              <div style={{
                display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                padding: '16px 20px', background: 'rgba(16,185,129,0.08)',
                border: '1px solid rgba(16,185,129,0.25)', borderRadius: '10px', marginBottom: '24px',
              }}>
                <span style={{ fontSize: '16px', fontWeight: 700, color: 'rgba(255,255,255,0.7)' }}>Total Quotation:</span>
                <span style={{ fontSize: '24px', fontWeight: 800, color: '#10b981' }}>
                  ₹{total.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                </span>
              </div>

              {/* Footer */}
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', paddingTop: '16px', borderTop: '1px solid rgba(255,255,255,0.07)' }}>
                <button type="button" onClick={() => { setShowModal(false); resetForm(); }}
                  style={{ padding: '11px 28px', background: 'transparent', border: '1px solid rgba(255,255,255,0.18)', color: 'white', borderRadius: '8px', cursor: 'pointer', fontWeight: 600, fontSize: '14px' }}>
                  Cancel
                </button>
                <button type="submit"
                  style={{ padding: '11px 36px', background: 'var(--primary-color)', border: 'none', color: 'white', borderRadius: '8px', cursor: 'pointer', fontWeight: 700, fontSize: '14px', boxShadow: '0 4px 16px rgba(59,130,246,0.45)' }}>
                  💾 Generate Proposal
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

