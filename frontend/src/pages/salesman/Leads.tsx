import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';

interface Lead {
  id: number;
  name: string;
  email: string;
  phone: string;
  company: string;
  status: string;
  source: string;
  assignedTo: string;
  value?: number;
  title?: string;
  website?: string;
  industry?: string;
  noOfEmployees?: string;
  annualRevenue?: string;
  rating?: string;
  description?: string;
}

/* ── Shared Styles ── */
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
  fontSize: '11px',
  fontWeight: 700,
  color: 'rgba(255,255,255,0.45)',
  marginBottom: '6px',
  textTransform: 'uppercase',
  letterSpacing: '0.06em',
};

const sectionHeadStyle: React.CSSProperties = {
  fontSize: '12px',
  fontWeight: 700,
  color: 'var(--primary-color)',
  textTransform: 'uppercase',
  letterSpacing: '0.08em',
  borderBottom: '1px solid rgba(255,255,255,0.07)',
  paddingBottom: '10px',
  marginBottom: '18px',
  gridColumn: '1 / -1',
};

const gridStyle: React.CSSProperties = {
  display: 'grid',
  gridTemplateColumns: '1fr 1fr',
  gap: '16px',
};

const statusColors: Record<string, { bg: string; text: string }> = {
  New:       { bg: 'rgba(59,130,246,0.15)',  text: '#3b82f6' },
  Contacted: { bg: 'rgba(245,158,11,0.15)',  text: '#f59e0b' },
  Qualified: { bg: 'rgba(139,92,246,0.15)',  text: '#8b5cf6' },
  Converted: { bg: 'rgba(16,185,129,0.15)',  text: '#10b981' },
  Lost:      { bg: 'rgba(239,68,68,0.15)',   text: '#ef4444' },
};

export const Leads: React.FC = () => {
  const { token, isAdmin } = useAuth();
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [users, setUsers] = useState<any[]>([]);

  /* ── Form State ── */
  const [name, setName]               = useState('');
  const [title, setTitle]             = useState('');
  const [email, setEmail]             = useState('');
  const [phone, setPhone]             = useState('');
  const [company, setCompany]         = useState('');
  const [website, setWebsite]         = useState('');
  const [source, setSource]           = useState('Website');
  const [status, setStatus]           = useState('New');
  const [rating, setRating]           = useState('');
  const [industry, setIndustry]       = useState('');
  const [noOfEmployees, setNoOfEmployees] = useState('');
  const [annualRevenue, setAnnualRevenue] = useState('');
  const [value, setValue]             = useState('');
  const [assignedTo, setAssignedTo]   = useState('');
  const [description, setDescription] = useState('');

  const fetchLeads = async () => {
    try {
      const res = await fetch('https://custora-api-dsn4.onrender.com/api/leads', {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (res.ok) setLeads(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const fetchUsers = async () => {
    try {
      const res = await fetch('https://custora-api-dsn4.onrender.com/api/auth/users', {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (res.ok) {
        setUsers(data);
        if (data.length > 0) setAssignedTo(data[0].email);
      }
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchLeads();
    if (isAdmin) fetchUsers();
  }, [isAdmin]);

  const resetForm = () => {
    setName(''); setTitle(''); setEmail(''); setPhone(''); setCompany('');
    setWebsite(''); setSource('Website'); setStatus('New'); setRating('');
    setIndustry(''); setNoOfEmployees(''); setAnnualRevenue('');
    setValue(''); setDescription('');
  };

  const handleAddLead = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const payload = {
        name, title, email, phone, company, website,
        source, status, rating, industry,
        noOfEmployees, annualRevenue,
        value: value ? parseFloat(value) : 0,
        description,
        assignedTo: isAdmin ? assignedTo : undefined,
      };
      const res = await fetch('https://custora-api-dsn4.onrender.com/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify(payload),
      });
      if (res.ok) {
        setShowModal(false);
        fetchLeads();
        resetForm();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const updateStatus = async (id: number, newStatus: string) => {
    try {
      const res = await fetch(`https://custora-api-dsn4.onrender.com/api/leads/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ status: newStatus }),
      });
      if (res.ok) fetchLeads();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="page-container">

      {/* ── Page Header ── */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '28px' }}>
        <div>
          <h1 style={{ fontSize: '24px', fontWeight: 'bold', margin: 0 }}>Lead Management</h1>
          <p style={{ color: 'var(--text-muted)', marginTop: '4px' }}>Capture and track all potential customer leads</p>
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
          + Add Lead
        </button>
      </div>

      {/* ── Leads Table ── */}
      <div className="glass-panel" style={{ overflow: 'hidden', borderRadius: '14px' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.08)', background: 'rgba(255,255,255,0.03)' }}>
              {['Name', 'Company', 'Phone', 'Source', 'Status', 'Value', 'Actions'].map(h => (
                <th key={h} style={{ padding: '14px 16px', fontSize: '12px', fontWeight: 700, color: 'rgba(255,255,255,0.45)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={7} style={{ padding: '40px', textAlign: 'center', color: 'var(--text-muted)' }}>Loading leads...</td></tr>
            ) : leads.length === 0 ? (
              <tr>
                <td colSpan={7} style={{ padding: '50px', textAlign: 'center', color: 'var(--text-muted)' }}>
                  <div style={{ fontSize: '36px', marginBottom: '10px' }}>🎯</div>
                  <p style={{ fontWeight: 600 }}>No leads yet</p>
                  <p style={{ fontSize: '13px' }}>Click "+ Add Lead" to capture your first lead.</p>
                </td>
              </tr>
            ) : (
              leads.map((lead, i) => (
                <tr
                  key={lead.id}
                  style={{
                    borderBottom: '1px solid rgba(255,255,255,0.05)',
                    background: i % 2 === 0 ? 'transparent' : 'rgba(255,255,255,0.015)',
                    transition: 'background 0.15s',
                  }}
                  onMouseEnter={e => (e.currentTarget.style.background = 'rgba(59,130,246,0.06)')}
                  onMouseLeave={e => (e.currentTarget.style.background = i % 2 === 0 ? 'transparent' : 'rgba(255,255,255,0.015)')}
                >
                  {/* Name + Email */}
                  <td style={{ padding: '14px 16px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <div style={{
                        width: '36px', height: '36px', borderRadius: '50%', flexShrink: 0,
                        background: 'linear-gradient(135deg, var(--primary-color), #8b5cf6)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        fontSize: '14px', fontWeight: 800,
                      }}>
                        {lead.name.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <div style={{ fontWeight: 700, fontSize: '14px' }}>{lead.name}</div>
                        <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>{lead.email}</div>
                      </div>
                    </div>
                  </td>
                  {/* Company */}
                  <td style={{ padding: '14px 16px', fontSize: '14px' }}>{lead.company || '—'}</td>
                  {/* Phone */}
                  <td style={{ padding: '14px 16px', fontSize: '13px', color: 'rgba(255,255,255,0.6)' }}>{lead.phone || '—'}</td>
                  {/* Source */}
                  <td style={{ padding: '14px 16px' }}>
                    <span style={{
                      padding: '4px 10px', borderRadius: '999px', fontSize: '12px', fontWeight: 600,
                      background: 'rgba(255,255,255,0.08)', color: 'rgba(255,255,255,0.75)',
                    }}>
                      {lead.source}
                    </span>
                  </td>
                  {/* Status */}
                  <td style={{ padding: '14px 16px' }}>
                    <select
                      value={lead.status}
                      onChange={e => updateStatus(lead.id, e.target.value)}
                      style={{
                        background: statusColors[lead.status]?.bg || 'rgba(255,255,255,0.08)',
                        color: statusColors[lead.status]?.text || 'white',
                        border: `1px solid ${statusColors[lead.status]?.text || 'rgba(255,255,255,0.2)'}`,
                        padding: '5px 10px', borderRadius: '6px', fontSize: '12px',
                        fontWeight: 700, cursor: 'pointer',
                      }}
                    >
                      <option value="New">New</option>
                      <option value="Contacted">Contacted</option>
                      <option value="Qualified">Qualified</option>
                      <option value="Converted">Converted</option>
                      <option value="Lost">Lost</option>
                    </select>
                  </td>
                  {/* Value */}
                  <td style={{ padding: '14px 16px', fontWeight: 700, color: '#10b981' }}>
                    {lead.value ? `₹${Number(lead.value).toLocaleString('en-IN')}` : '—'}
                  </td>
                  {/* Actions */}
                  <td style={{ padding: '14px 16px' }}>
                    <button style={{
                      background: 'transparent', border: '1px solid rgba(59,130,246,0.5)',
                      color: '#3b82f6', padding: '6px 16px', borderRadius: '6px',
                      cursor: 'pointer', fontSize: '13px', fontWeight: 600,
                      transition: 'background 0.2s',
                    }}
                      onMouseEnter={e => (e.currentTarget.style.background = 'rgba(59,130,246,0.12)')}
                      onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
                    >
                      View
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* ══════════════════════════════════════
           NEW LEAD MODAL (ZOHO CRM STYLE)
         ══════════════════════════════════════ */}
      {showModal && (
        <div style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
          background: 'rgba(0,0,0,0.78)', backdropFilter: 'blur(6px)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000,
        }}>
          <div className="glass-panel" style={{
            width: '860px', maxWidth: '95vw', maxHeight: '92vh',
            overflowY: 'auto', borderRadius: '18px',
            boxShadow: '0 30px 80px rgba(0,0,0,0.65)',
          }}>

            {/* Modal Header */}
            <div style={{
              padding: '22px 28px 18px',
              borderBottom: '1px solid rgba(255,255,255,0.07)',
              display: 'flex', justifyContent: 'space-between', alignItems: 'center',
              position: 'sticky', top: 0,
              background: 'var(--card-bg, #0f172a)',
              zIndex: 10, borderRadius: '18px 18px 0 0',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                <div style={{
                  width: '42px', height: '42px', borderRadius: '10px',
                  background: 'linear-gradient(135deg, #3b82f6, #8b5cf6)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '20px',
                }}>
                  🎯
                </div>
                <div>
                  <h2 style={{ fontSize: '20px', fontWeight: 700, margin: 0 }}>Create New Lead</h2>
                  <p style={{ fontSize: '13px', color: 'rgba(255,255,255,0.4)', margin: '3px 0 0' }}>
                    Fill in the details to capture a new potential customer
                  </p>
                </div>
              </div>
              <button
                onClick={() => { setShowModal(false); resetForm(); }}
                style={{
                  background: 'rgba(255,255,255,0.08)', border: 'none', color: 'white',
                  width: '34px', height: '34px', borderRadius: '50%', cursor: 'pointer',
                  fontSize: '18px', display: 'flex', alignItems: 'center', justifyContent: 'center',
                  transition: 'background 0.2s',
                }}
                onMouseEnter={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.15)')}
                onMouseLeave={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.08)')}
              >
                ×
              </button>
            </div>

            <form onSubmit={handleAddLead} style={{ padding: '26px 28px 30px' }}>

              {/* ── Section 1: Lead Information ── */}
              <div style={gridStyle}>
                <div style={sectionHeadStyle}>🎯 Lead Information</div>

                {/* Full Name — full width */}
                <div style={{ gridColumn: '1 / -1' }}>
                  <label style={labelStyle}>Full Name <span style={{ color: '#ef4444' }}>*</span></label>
                  <input
                    type="text" placeholder="e.g. John Smith"
                    value={name} onChange={e => setName(e.target.value)}
                    required style={inputStyle}
                  />
                </div>

                <div>
                  <label style={labelStyle}>Job Title</label>
                  <input
                    type="text" placeholder="e.g. CEO, IT Manager"
                    value={title} onChange={e => setTitle(e.target.value)}
                    style={inputStyle}
                  />
                </div>

                <div>
                  <label style={labelStyle}>Lead Status</label>
                  <select value={status} onChange={e => setStatus(e.target.value)} style={inputStyle}>
                    <option value="New">New</option>
                    <option value="Contacted">Contacted</option>
                    <option value="Qualified">Qualified</option>
                    <option value="Converted">Converted</option>
                    <option value="Lost">Lost</option>
                  </select>
                </div>

                <div>
                  <label style={labelStyle}>Lead Source</label>
                  <select value={source} onChange={e => setSource(e.target.value)} style={inputStyle}>
                    <option value="Website">Website</option>
                    <option value="Referral">Referral</option>
                    <option value="Cold Call">Cold Call</option>
                    <option value="Email Campaign">Email Campaign</option>
                    <option value="Social Media">Social Media</option>
                    <option value="Trade Show">Trade Show</option>
                    <option value="Advertisement">Advertisement</option>
                    <option value="Other">Other</option>
                  </select>
                </div>

                <div>
                  <label style={labelStyle}>Lead Rating</label>
                  <select value={rating} onChange={e => setRating(e.target.value)} style={inputStyle}>
                    <option value="">-- Select Rating --</option>
                    <option value="Hot">🔥 Hot</option>
                    <option value="Warm">🌤 Warm</option>
                    <option value="Cold">❄️ Cold</option>
                  </select>
                </div>

                <div>
                  <label style={labelStyle}>Estimated Deal Value (₹)</label>
                  <input
                    type="number" placeholder="e.g. 50000"
                    value={value} onChange={e => setValue(e.target.value)}
                    style={inputStyle}
                  />
                </div>

                {isAdmin && (
                  <div>
                    <label style={labelStyle}>Assign To Salesman</label>
                    <select value={assignedTo} onChange={e => setAssignedTo(e.target.value)} style={inputStyle}>
                      <option value="">-- Unassigned --</option>
                      {users.map(u => (
                        <option key={u.id} value={u.email}>{u.username} ({u.email})</option>
                      ))}
                    </select>
                  </div>
                )}
              </div>

              <div style={{ height: '24px' }} />

              {/* ── Section 2: Contact Details ── */}
              <div style={gridStyle}>
                <div style={sectionHeadStyle}>📞 Contact Details</div>

                <div>
                  <label style={labelStyle}>Email Address <span style={{ color: '#ef4444' }}>*</span></label>
                  <input
                    type="email" placeholder="e.g. john@example.com"
                    value={email} onChange={e => setEmail(e.target.value)}
                    required style={inputStyle}
                  />
                </div>

                <div>
                  <label style={labelStyle}>Phone Number</label>
                  <input
                    type="text" placeholder="e.g. +91 98765 43210"
                    value={phone} onChange={e => setPhone(e.target.value)}
                    style={inputStyle}
                  />
                </div>
              </div>

              <div style={{ height: '24px' }} />

              {/* ── Section 3: Company Info ── */}
              <div style={gridStyle}>
                <div style={sectionHeadStyle}>🏢 Company Information</div>

                <div>
                  <label style={labelStyle}>Company Name</label>
                  <input
                    type="text" placeholder="e.g. Tech Solutions Inc."
                    value={company} onChange={e => setCompany(e.target.value)}
                    style={inputStyle}
                  />
                </div>

                <div>
                  <label style={labelStyle}>Website</label>
                  <input
                    type="text" placeholder="e.g. https://techsolutions.com"
                    value={website} onChange={e => setWebsite(e.target.value)}
                    style={inputStyle}
                  />
                </div>

                <div>
                  <label style={labelStyle}>Industry</label>
                  <select value={industry} onChange={e => setIndustry(e.target.value)} style={inputStyle}>
                    <option value="">-- Select Industry --</option>
                    <option value="Technology">Technology</option>
                    <option value="Finance">Finance & Banking</option>
                    <option value="Healthcare">Healthcare</option>
                    <option value="Education">Education</option>
                    <option value="Manufacturing">Manufacturing</option>
                    <option value="Retail">Retail & E-commerce</option>
                    <option value="Real Estate">Real Estate</option>
                    <option value="Hospitality">Hospitality</option>
                    <option value="Other">Other</option>
                  </select>
                </div>

                <div>
                  <label style={labelStyle}>No. of Employees</label>
                  <select value={noOfEmployees} onChange={e => setNoOfEmployees(e.target.value)} style={inputStyle}>
                    <option value="">-- Select Size --</option>
                    <option value="1-10">1 – 10</option>
                    <option value="11-50">11 – 50</option>
                    <option value="51-200">51 – 200</option>
                    <option value="201-500">201 – 500</option>
                    <option value="500+">500+</option>
                  </select>
                </div>

                <div>
                  <label style={labelStyle}>Annual Revenue (₹)</label>
                  <input
                    type="text" placeholder="e.g. 10,00,000"
                    value={annualRevenue} onChange={e => setAnnualRevenue(e.target.value)}
                    style={inputStyle}
                  />
                </div>
              </div>

              <div style={{ height: '24px' }} />

              {/* ── Section 4: Description ── */}
              <div>
                <p style={{ ...sectionHeadStyle, display: 'block', gridColumn: 'auto', marginBottom: '14px' }}>
                  📝 Description & Notes
                </p>
                <label style={labelStyle}>Lead Description / Notes</label>
                <textarea
                  placeholder="Add any relevant notes about this lead — their needs, pain points, or key discussion points..."
                  value={description}
                  onChange={e => setDescription(e.target.value)}
                  rows={4}
                  style={{ ...inputStyle, resize: 'vertical', lineHeight: '1.6' }}
                />
              </div>

              {/* ── Footer Buttons ── */}
              <div style={{
                display: 'flex', justifyContent: 'flex-end', gap: '12px',
                marginTop: '28px', paddingTop: '20px',
                borderTop: '1px solid rgba(255,255,255,0.07)',
              }}>
                <button
                  type="button"
                  onClick={() => { setShowModal(false); resetForm(); }}
                  style={{
                    padding: '11px 28px', background: 'transparent',
                    border: '1px solid rgba(255,255,255,0.18)', color: 'white',
                    borderRadius: '8px', cursor: 'pointer', fontWeight: 600, fontSize: '14px',
                    transition: 'background 0.2s',
                  }}
                  onMouseEnter={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.06)')}
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
                  onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-1px)'; e.currentTarget.style.boxShadow = '0 8px 24px rgba(59,130,246,0.6)'; }}
                  onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 4px 16px rgba(59,130,246,0.45)'; }}
                >
                  💾 Save Lead
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
