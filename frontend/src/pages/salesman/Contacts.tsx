import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';

interface Contact {
  id: number;
  name: string;
  email: string;
  phone: string;
  company: string;
  notes: string;
  title?: string;
  department?: string;
  leadSource?: string;
  secondaryEmail?: string;
  mobile?: string;
  website?: string;
  assignedTo?: string;
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

export const Contacts: React.FC = () => {
  const { token } = useAuth();
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);

  /* Form State */
  const [name, setName] = useState('');
  const [title, setTitle] = useState('');
  const [email, setEmail] = useState('');
  const [secondaryEmail, setSecondaryEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [mobile, setMobile] = useState('');
  const [company, setCompany] = useState('');
  const [department, setDepartment] = useState('');
  const [website, setWebsite] = useState('');
  const [leadSource, setLeadSource] = useState('');
  const [assignedTo, setAssignedTo] = useState('');
  const [notes, setNotes] = useState('');

  const fetchContacts = async () => {
    try {
      const res = await fetch('http://localhost:5000/api/contacts', {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (res.ok) setContacts(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchContacts(); }, []);

  const resetForm = () => {
    setName(''); setTitle(''); setEmail(''); setSecondaryEmail('');
    setPhone(''); setMobile(''); setCompany(''); setDepartment('');
    setWebsite(''); setLeadSource(''); setAssignedTo(''); setNotes('');
  };

  const handleAddContact = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch('http://localhost:5000/api/contacts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ name, title, email, secondaryEmail, phone, mobile, company, department, website, leadSource, assignedTo, notes }),
      });
      if (res.ok) {
        setShowModal(false);
        fetchContacts();
        resetForm();
      }
    } catch (err) {
      console.error(err);
    }
  };

  /* Avatar gradient colors based on first letter */
  const avatarColors = ['#3b82f6','#8b5cf6','#10b981','#f59e0b','#ef4444','#06b6d4','#ec4899'];
  const getAvatarColor = (name: string) =>
    avatarColors[name.charCodeAt(0) % avatarColors.length];

  return (
    <div className="page-container">

      {/* ── Page Header ── */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '28px' }}>
        <div>
          <h1 style={{ fontSize: '24px', fontWeight: 'bold', margin: 0 }}>Contact Directory</h1>
          <p style={{ color: 'var(--text-muted)', marginTop: '4px' }}>Store and manage all customer contact details</p>
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
          + Add Contact
        </button>
      </div>

      {/* ── Contact Cards Grid ── */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(310px, 1fr))', gap: '20px' }}>
        {loading ? (
          <p style={{ color: 'var(--text-muted)' }}>Loading contacts...</p>
        ) : contacts.length === 0 ? (
          <div className="glass-panel" style={{ padding: '40px', textAlign: 'center', color: 'var(--text-muted)', gridColumn: '1/-1', borderRadius: '16px' }}>
            <div style={{ fontSize: '40px', marginBottom: '12px' }}>👤</div>
            <p style={{ fontWeight: 600 }}>No contacts yet</p>
            <p style={{ fontSize: '13px' }}>Click "+ Add Contact" to create your first contact.</p>
          </div>
        ) : (
          contacts.map(contact => (
            <div key={contact.id} className="glass-panel" style={{
              padding: '20px', borderRadius: '16px',
              transition: 'transform 0.2s, box-shadow 0.2s',
              cursor: 'default',
            }}
              onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-3px)'; e.currentTarget.style.boxShadow = '0 10px 30px rgba(0,0,0,0.4)'; }}
              onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = 'none'; }}
            >
              {/* Card Header */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '16px' }}>
                <div style={{
                  width: '50px', height: '50px', borderRadius: '50%', flexShrink: 0,
                  background: `linear-gradient(135deg, ${getAvatarColor(contact.name)}, ${getAvatarColor(contact.name)}99)`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: '20px', fontWeight: 800, boxShadow: `0 4px 12px ${getAvatarColor(contact.name)}55`,
                }}>
                  {contact.name.charAt(0).toUpperCase()}
                </div>
                <div style={{ overflow: 'hidden' }}>
                  <h3 style={{ fontSize: '16px', fontWeight: 700, margin: 0, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    {contact.name}
                  </h3>
                  {contact.title && (
                    <p style={{ fontSize: '12px', color: 'rgba(255,255,255,0.45)', margin: '2px 0 0' }}>{contact.title}</p>
                  )}
                  <p style={{ color: 'var(--primary-color)', margin: '2px 0 0', fontSize: '13px', fontWeight: 600 }}>
                    {contact.company || 'Independent'}
                  </p>
                </div>
              </div>

              {/* Card Details */}
              <div style={{ fontSize: '13px', color: 'rgba(255,255,255,0.65)', display: 'flex', flexDirection: 'column', gap: '7px' }}>
                {contact.email && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span>📧</span>
                    <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{contact.email}</span>
                  </div>
                )}
                {contact.phone && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span>📞</span><span>{contact.phone}</span>
                  </div>
                )}
                {contact.department && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span>🏢</span><span>{contact.department}</span>
                  </div>
                )}
              </div>

              {/* Notes */}
              {contact.notes && (
                <div style={{
                  marginTop: '14px', paddingTop: '14px',
                  borderTop: '1px solid rgba(255,255,255,0.06)',
                  fontSize: '12px', color: 'rgba(255,255,255,0.4)',
                  lineHeight: '1.5',
                  display: '-webkit-box', WebkitLineClamp: 2,
                  WebkitBoxOrient: 'vertical', overflow: 'hidden',
                }}>
                  {contact.notes}
                </div>
              )}
            </div>
          ))
        )}
      </div>

      {/* ══════════════════════════════════════
           NEW CONTACT MODAL (ZOHO CRM STYLE)
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
              position: 'sticky', top: 0, background: 'var(--card-bg, #0f172a)', zIndex: 10,
              borderRadius: '18px 18px 0 0',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                <div style={{
                  width: '42px', height: '42px', borderRadius: '10px',
                  background: 'linear-gradient(135deg, var(--primary-color), #8b5cf6)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '20px',
                }}>
                  👤
                </div>
                <div>
                  <h2 style={{ fontSize: '20px', fontWeight: 700, margin: 0 }}>Create New Contact</h2>
                  <p style={{ fontSize: '13px', color: 'rgba(255,255,255,0.4)', margin: '3px 0 0' }}>
                    Fill in the details to add a new contact to your CRM
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

            <form onSubmit={handleAddContact} style={{ padding: '26px 28px 30px' }}>

              {/* ── Section 1: Personal Info ── */}
              <div style={gridStyle}>
                <div style={sectionHeadStyle}>👤 Contact Information</div>

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
                    type="text" placeholder="e.g. IT Manager"
                    value={title} onChange={e => setTitle(e.target.value)}
                    style={inputStyle}
                  />
                </div>

                <div>
                  <label style={labelStyle}>Department</label>
                  <input
                    type="text" placeholder="e.g. Engineering"
                    value={department} onChange={e => setDepartment(e.target.value)}
                    style={inputStyle}
                  />
                </div>

                <div>
                  <label style={labelStyle}>Email Address <span style={{ color: '#ef4444' }}>*</span></label>
                  <input
                    type="email" placeholder="e.g. john@example.com"
                    value={email} onChange={e => setEmail(e.target.value)}
                    required style={inputStyle}
                  />
                </div>

                <div>
                  <label style={labelStyle}>Secondary Email</label>
                  <input
                    type="email" placeholder="e.g. john.personal@gmail.com"
                    value={secondaryEmail} onChange={e => setSecondaryEmail(e.target.value)}
                    style={inputStyle}
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

                <div>
                  <label style={labelStyle}>Mobile</label>
                  <input
                    type="text" placeholder="e.g. +91 91234 56789"
                    value={mobile} onChange={e => setMobile(e.target.value)}
                    style={inputStyle}
                  />
                </div>
              </div>

              <div style={{ height: '24px' }} />

              {/* ── Section 2: Company Details ── */}
              <div style={gridStyle}>
                <div style={sectionHeadStyle}>🏢 Company Details</div>

                <div>
                  <label style={labelStyle}>Company / Account Name</label>
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
                  <label style={labelStyle}>Lead Source</label>
                  <select value={leadSource} onChange={e => setLeadSource(e.target.value)} style={inputStyle}>
                    <option value="">-- Select Source --</option>
                    <option value="Advertisement">Advertisement</option>
                    <option value="Cold Call">Cold Call</option>
                    <option value="Email Campaign">Email Campaign</option>
                    <option value="Referral">Referral</option>
                    <option value="Website">Website</option>
                    <option value="Social Media">Social Media</option>
                    <option value="Trade Show">Trade Show</option>
                    <option value="Other">Other</option>
                  </select>
                </div>

                <div>
                  <label style={labelStyle}>Assigned To</label>
                  <input
                    type="text" placeholder="e.g. Bharath (Salesman)"
                    value={assignedTo} onChange={e => setAssignedTo(e.target.value)}
                    style={inputStyle}
                  />
                </div>
              </div>

              <div style={{ height: '24px' }} />

              {/* ── Section 3: Notes ── */}
              <div>
                <p style={{ ...sectionHeadStyle, display: 'block', gridColumn: 'auto', marginBottom: '14px' }}>
                  📝 Description & Notes
                </p>
                <label style={labelStyle}>Internal Notes</label>
                <textarea
                  placeholder="Add any background details, purchase history, preferences, or important reminders about this contact..."
                  value={notes}
                  onChange={e => setNotes(e.target.value)}
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
                  💾 Save Contact
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

