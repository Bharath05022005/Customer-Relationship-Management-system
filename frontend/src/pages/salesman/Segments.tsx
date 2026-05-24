import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';

interface Segment {
  id: number;
  name: string;
  region: string;
  industry: string;
  interest: string;
  dealSize: string;
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

const segmentColors = ['#3b82f6', '#8b5cf6', '#10b981', '#f59e0b', '#ef4444', '#06b6d4'];

export const Segments: React.FC = () => {
  const { token } = useAuth();
  const [segments, setSegments] = useState<Segment[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);

  const [name, setName]         = useState('');
  const [region, setRegion]     = useState('');
  const [industry, setIndustry] = useState('');
  const [interest, setInterest] = useState('');
  const [dealSize, setDealSize] = useState('');

  const fetchSegments = async () => {
    try {
      const res = await fetch('https://custora-api-dsn4.onrender.com/api/segments', {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (res.ok) setSegments(data);
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchSegments(); }, []);

  const resetForm = () => { setName(''); setRegion(''); setIndustry(''); setInterest(''); setDealSize(''); };

  const handleAddSegment = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch('https://custora-api-dsn4.onrender.com/api/segments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ name, region, industry, interest, dealSize }),
      });
      if (res.ok) { setShowModal(false); fetchSegments(); resetForm(); }
    } catch (err) { console.error(err); }
  };

  return (
    <div className="page-container">

      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '28px' }}>
        <div>
          <h1 style={{ fontSize: '24px', fontWeight: 'bold', margin: 0 }}>Customer Segmentation</h1>
          <p style={{ color: 'var(--text-muted)', marginTop: '4px' }}>Organize contacts into targeted groups for campaigns</p>
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
          + Create Segment
        </button>
      </div>

      {/* Segment Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '20px' }}>
        {loading ? (
          <p style={{ color: 'var(--text-muted)' }}>Loading segments...</p>
        ) : segments.length === 0 ? (
          <div className="glass-panel" style={{ padding: '48px', textAlign: 'center', color: 'var(--text-muted)', gridColumn: '1/-1', borderRadius: '16px' }}>
            <div style={{ fontSize: '40px', marginBottom: '12px' }}>🎯</div>
            <p style={{ fontWeight: 600 }}>No segments yet</p>
            <p style={{ fontSize: '13px' }}>Create your first segment to group customers for targeted campaigns.</p>
          </div>
        ) : (
          segments.map((seg, i) => {
            const color = segmentColors[i % segmentColors.length];
            return (
              <div key={seg.id} className="glass-panel" style={{
                padding: '24px', borderRadius: '16px',
                borderTop: `3px solid ${color}`,
                transition: 'transform 0.2s, box-shadow 0.2s',
              }}
                onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-3px)'; e.currentTarget.style.boxShadow = '0 12px 32px rgba(0,0,0,0.4)'; }}
                onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = 'none'; }}
              >
                {/* Card Header */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '18px' }}>
                  <div style={{
                    width: '40px', height: '40px', borderRadius: '10px',
                    background: color + '22', display: 'flex',
                    alignItems: 'center', justifyContent: 'center', fontSize: '18px',
                  }}>
                    🎯
                  </div>
                  <h3 style={{ margin: 0, fontSize: '17px', fontWeight: 700 }}>{seg.name}</h3>
                </div>

                {/* Card Details */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '13px' }}>
                  {[
                    { label: 'Region', value: seg.region },
                    { label: 'Industry', value: seg.industry },
                    { label: 'Interest', value: seg.interest },
                    { label: 'Deal Size', value: seg.dealSize },
                  ].map(({ label, value }) => (
                    <div key={label} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ color: 'rgba(255,255,255,0.4)', fontWeight: 600 }}>{label}</span>
                      <span style={{
                        background: value ? color + '18' : 'rgba(255,255,255,0.05)',
                        color: value ? color : 'rgba(255,255,255,0.3)',
                        padding: '3px 10px', borderRadius: '999px', fontSize: '12px', fontWeight: 600,
                      }}>
                        {value || 'Any'}
                      </span>
                    </div>
                  ))}
                </div>

                <button style={{
                  width: '100%', marginTop: '20px', padding: '9px',
                  background: color + '15', border: `1px solid ${color}44`,
                  color: color, borderRadius: '8px', cursor: 'pointer',
                  fontWeight: 700, fontSize: '13px', transition: 'background 0.2s',
                }}
                  onMouseEnter={e => (e.currentTarget.style.background = color + '30')}
                  onMouseLeave={e => (e.currentTarget.style.background = color + '15')}
                >
                  View Customers →
                </button>
              </div>
            );
          })
        )}
      </div>

      {/* ── NEW SEGMENT MODAL ── */}
      {showModal && (
        <div style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
          background: 'rgba(0,0,0,0.78)', backdropFilter: 'blur(6px)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000,
        }}>
          <div className="glass-panel" style={{
            width: '640px', maxWidth: '95vw', maxHeight: '90vh',
            overflowY: 'auto', borderRadius: '18px',
            boxShadow: '0 30px 80px rgba(0,0,0,0.65)',
          }}>

            {/* Modal Header */}
            <div style={{
              padding: '22px 28px 18px',
              borderBottom: '1px solid rgba(255,255,255,0.07)',
              display: 'flex', justifyContent: 'space-between', alignItems: 'center',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                <div style={{
                  width: '42px', height: '42px', borderRadius: '10px',
                  background: 'linear-gradient(135deg, #3b82f6, #06b6d4)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '20px',
                }}>
                  🎯
                </div>
                <div>
                  <h2 style={{ fontSize: '20px', fontWeight: 700, margin: 0 }}>Create New Segment</h2>
                  <p style={{ fontSize: '13px', color: 'rgba(255,255,255,0.4)', margin: '3px 0 0' }}>
                    Define a customer group for targeted campaigns
                  </p>
                </div>
              </div>
              <button onClick={() => { setShowModal(false); resetForm(); }}
                style={{
                  background: 'rgba(255,255,255,0.08)', border: 'none', color: 'white',
                  width: '34px', height: '34px', borderRadius: '50%', cursor: 'pointer',
                  fontSize: '18px', display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>×</button>
            </div>

            <form onSubmit={handleAddSegment} style={{ padding: '26px 28px 30px', display: 'flex', flexDirection: 'column', gap: '18px' }}>

              {/* Segment Name */}
              <div>
                <label style={labelStyle}>Segment Name <span style={{ color: '#ef4444' }}>*</span></label>
                <input type="text" placeholder="e.g. Enterprise India – Tech" value={name}
                  onChange={e => setName(e.target.value)} required style={inputStyle} />
              </div>

              {/* 2-col grid */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <div>
                  <label style={labelStyle}>Target Region</label>
                  <input type="text" placeholder="e.g. South India" value={region}
                    onChange={e => setRegion(e.target.value)} style={inputStyle} />
                </div>
                <div>
                  <label style={labelStyle}>Target Industry</label>
                  <select value={industry} onChange={e => setIndustry(e.target.value)} style={inputStyle}>
                    <option value="">-- Any Industry --</option>
                    <option>Technology</option>
                    <option>Finance</option>
                    <option>Healthcare</option>
                    <option>Education</option>
                    <option>Manufacturing</option>
                    <option>Retail</option>
                    <option>Real Estate</option>
                    <option>Other</option>
                  </select>
                </div>
                <div>
                  <label style={labelStyle}>Product Interest</label>
                  <input type="text" placeholder="e.g. CRM Software" value={interest}
                    onChange={e => setInterest(e.target.value)} style={inputStyle} />
                </div>
                <div>
                  <label style={labelStyle}>Deal Size</label>
                  <select value={dealSize} onChange={e => setDealSize(e.target.value)} style={inputStyle}>
                    <option value="">Any Deal Size</option>
                    <option value="Small (<₹5L)">Small (&lt; ₹5L)</option>
                    <option value="Medium (₹5L–₹20L)">Medium (₹5L – ₹20L)</option>
                    <option value="Enterprise (>₹20L)">Enterprise (&gt; ₹20L)</option>
                  </select>
                </div>
              </div>

              {/* Footer */}
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', paddingTop: '12px', borderTop: '1px solid rgba(255,255,255,0.07)' }}>
                <button type="button" onClick={() => { setShowModal(false); resetForm(); }}
                  style={{ padding: '11px 28px', background: 'transparent', border: '1px solid rgba(255,255,255,0.18)', color: 'white', borderRadius: '8px', cursor: 'pointer', fontWeight: 600 }}>
                  Cancel
                </button>
                <button type="submit"
                  style={{ padding: '11px 36px', background: 'var(--primary-color)', border: 'none', color: 'white', borderRadius: '8px', cursor: 'pointer', fontWeight: 700, boxShadow: '0 4px 16px rgba(59,130,246,0.45)' }}>
                  💾 Save Segment
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
