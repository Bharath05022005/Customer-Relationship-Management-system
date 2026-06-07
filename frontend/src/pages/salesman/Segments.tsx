import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import API_BASE from '../../config/api.js';

interface Segment {
  id: number;
  name: string;
  region: string;
  industry: string;
  interest: string;
  dealSize: string;
}

interface CustomerMatch {
  id: number;
  name: string;
  email: string;
  phone: string;
  company: string;
  type: 'Lead' | 'Contact';
  detail: string;
  value?: number;
  matchedCriteria: string[];
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

  // States for viewing matching customers
  const [selectedSegment, setSelectedSegment] = useState<Segment | null>(null);
  const [viewCustomersModal, setViewCustomersModal] = useState(false);
  const [matchingCustomers, setMatchingCustomers] = useState<CustomerMatch[]>([]);
  const [loadingCustomers, setLoadingCustomers] = useState(false);
  const [customersSearch, setCustomersSearch] = useState('');

  const fetchSegments = async () => {
    try {
      const res = await fetch(`${API_BASE}/api/segments`, {
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
      const res = await fetch(`${API_BASE}/api/segments`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ name, region, industry, interest, dealSize }),
      });
      if (res.ok) { setShowModal(false); fetchSegments(); resetForm(); }
    } catch (err) { console.error(err); }
  };

  const handleViewCustomers = async (seg: Segment) => {
    setSelectedSegment(seg);
    setViewCustomersModal(true);
    setLoadingCustomers(true);
    setCustomersSearch('');
    try {
      const [leadsRes, contactsRes] = await Promise.all([
        fetch(`${API_BASE}/api/leads`, { headers: { Authorization: `Bearer ${token}` } }),
        fetch(`${API_BASE}/api/contacts`, { headers: { Authorization: `Bearer ${token}` } })
      ]);

      const leads = leadsRes.ok ? await leadsRes.json() : [];
      const contacts = contactsRes.ok ? await contactsRes.json() : [];

      const matches: CustomerMatch[] = [];

      const checkMatch = (item: any, isLead: boolean) => {
        const matched: string[] = [];

        // 1. Region
        if (seg.region) {
          const regionLower = seg.region.toLowerCase().trim();
          const descLower = (item.description || '').toLowerCase();
          const notesLower = (item.notes || '').toLowerCase();
          const nameLower = (item.name || '').toLowerCase();
          const compLower = (item.company || '').toLowerCase();
          const deptLower = (item.department || '').toLowerCase();
          
          if (
            descLower.includes(regionLower) ||
            notesLower.includes(regionLower) ||
            nameLower.includes(regionLower) ||
            compLower.includes(regionLower) ||
            deptLower.includes(regionLower)
          ) {
            matched.push(`Region: ${seg.region}`);
          } else {
            return null;
          }
        }

        // 2. Industry
        if (seg.industry) {
          const indLower = seg.industry.toLowerCase().trim();
          const itemIndLower = (item.industry || '').toLowerCase();
          const descLower = (item.description || '').toLowerCase();
          const notesLower = (item.notes || '').toLowerCase();
          const deptLower = (item.department || '').toLowerCase();

          if (
            itemIndLower.includes(indLower) ||
            descLower.includes(indLower) ||
            notesLower.includes(indLower) ||
            deptLower.includes(indLower)
          ) {
            matched.push(`Industry: ${seg.industry}`);
          } else {
            return null;
          }
        }

        // 3. Product Interest
        if (seg.interest) {
          const intLower = seg.interest.toLowerCase().trim();
          const titleLower = (item.title || '').toLowerCase();
          const descLower = (item.description || '').toLowerCase();
          const notesLower = (item.notes || '').toLowerCase();

          if (
            titleLower.includes(intLower) ||
            descLower.includes(intLower) ||
            notesLower.includes(intLower)
          ) {
            matched.push(`Interest: ${seg.interest}`);
          } else {
            return null;
          }
        }

        // 4. Deal Size
        if (seg.dealSize) {
          if (isLead) {
            const val = Number(item.value) || 0;
            const sizeStr = seg.dealSize;
            let dealMatch = false;
            if (sizeStr.includes('<5L') || sizeStr.includes('< 5L') || sizeStr.includes('<₹5L')) {
              if (val < 500000) dealMatch = true;
            } else if (sizeStr.includes('5L–20L') || sizeStr.includes('5L – 20L') || sizeStr.includes('5L–₹20L') || sizeStr.includes('5L-20L')) {
              if (val >= 500000 && val <= 2000000) dealMatch = true;
            } else if (sizeStr.includes('>20L') || sizeStr.includes('> 20L') || sizeStr.includes('>₹20L')) {
              if (val > 2000000) dealMatch = true;
            }

            if (dealMatch) {
              matched.push(`Deal Size: ${seg.dealSize}`);
            } else {
              return null;
            }
          } else {
            const notesLower = (item.notes || '').toLowerCase();
            const sizeStr = seg.dealSize.toLowerCase();
            if (notesLower.includes(sizeStr) || (notesLower.includes('enterprise') && sizeStr.includes('enterprise'))) {
              matched.push(`Deal Size: ${seg.dealSize}`);
            } else {
              return null;
            }
          }
        }

        if (!seg.region && !seg.industry && !seg.interest && !seg.dealSize) {
          matched.push('General Match');
        }

        return matched;
      };

      leads.forEach((lead: any) => {
        const criteria = checkMatch(lead, true);
        if (criteria) {
          matches.push({
            id: lead.id,
            name: lead.name,
            email: lead.email,
            phone: lead.phone || 'N/A',
            company: lead.company || 'N/A',
            type: 'Lead',
            detail: lead.value ? `Value: ₹${(Number(lead.value) / 100000).toFixed(1)}L` : 'Value: ₹0',
            value: Number(lead.value) || 0,
            matchedCriteria: criteria
          });
        }
      });

      contacts.forEach((contact: any) => {
        const criteria = checkMatch(contact, false);
        if (criteria) {
          matches.push({
            id: contact.id,
            name: contact.name,
            email: contact.email,
            phone: contact.phone || contact.mobile || 'N/A',
            company: contact.company || 'N/A',
            type: 'Contact',
            detail: contact.leadSource ? `Source: ${contact.leadSource}` : 'N/A',
            matchedCriteria: criteria
          });
        }
      });

      setMatchingCustomers(matches);
    } catch (err) {
      console.error('Error fetching matching customers:', err);
    } finally {
      setLoadingCustomers(false);
    }
  };

  const filteredCustomers = matchingCustomers.filter(c => {
    const term = customersSearch.toLowerCase().trim();
    if (!term) return true;
    return c.name.toLowerCase().includes(term) ||
           c.email.toLowerCase().includes(term) ||
           c.company.toLowerCase().includes(term) ||
           c.phone.toLowerCase().includes(term);
  });

  const totalMatches = matchingCustomers.length;
  const leadsCount = matchingCustomers.filter(c => c.type === 'Lead').length;
  const contactsCount = matchingCustomers.filter(c => c.type === 'Contact').length;
  const totalValue = matchingCustomers
    .filter(c => c.type === 'Lead')
    .reduce((sum, c) => sum + (c.value || 0), 0);

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

                <button
                  onClick={() => handleViewCustomers(seg)}
                  style={{
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

      {/* ── VIEW CUSTOMERS MODAL ── */}
      {viewCustomersModal && selectedSegment && (
        <div style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
          background: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(8px)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000,
        }}>
          <div className="glass-panel" style={{
            width: '950px', maxWidth: '95vw', maxHeight: '90vh',
            overflowY: 'auto', borderRadius: '18px',
            boxShadow: '0 30px 80px rgba(0,0,0,0.65)',
            display: 'flex', flexDirection: 'column',
          }}>
            {/* Modal Header */}
            <div style={{
              padding: '24px 28px',
              borderBottom: '1px solid rgba(255,255,255,0.07)',
              display: 'flex', justifyContent: 'space-between', alignItems: 'center',
            }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <span style={{ fontSize: '20px' }}>🎯</span>
                  <h2 style={{ fontSize: '20px', fontWeight: 700, margin: 0 }}>
                    {selectedSegment.name} Customers
                  </h2>
                </div>
                {/* Criteria badging */}
                <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', marginTop: '8px' }}>
                  {[
                    { label: 'Region', val: selectedSegment.region },
                    { label: 'Industry', val: selectedSegment.industry },
                    { label: 'Interest', val: selectedSegment.interest },
                    { label: 'Deal Size', val: selectedSegment.dealSize },
                  ].filter(c => c.val).map(c => (
                    <span key={c.label} style={{
                      fontSize: '11px', background: 'rgba(255,255,255,0.08)',
                      color: 'rgba(255,255,255,0.65)', padding: '2px 8px', borderRadius: '4px',
                      border: '1px solid rgba(255,255,255,0.1)'
                    }}>
                      <strong>{c.label}:</strong> {c.val}
                    </span>
                  ))}
                </div>
              </div>
              <button onClick={() => setViewCustomersModal(false)}
                style={{
                  background: 'rgba(255,255,255,0.08)', border: 'none', color: 'white',
                  width: '34px', height: '34px', borderRadius: '50%', cursor: 'pointer',
                  fontSize: '18px', display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>×</button>
            </div>

            {/* Modal Body */}
            <div style={{ padding: '24px 28px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
              
              {/* Stats Panel */}
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))',
                gap: '14px',
              }}>
                <div style={{ background: 'rgba(255,255,255,0.03)', padding: '14px', borderRadius: '10px', border: '1px solid rgba(255,255,255,0.05)', textAlign: 'center' }}>
                  <div style={{ fontSize: '12px', color: 'rgba(255,255,255,0.4)', fontWeight: 600, textTransform: 'uppercase' }}>Total Matches</div>
                  <div style={{ fontSize: '24px', fontWeight: 800, marginTop: '4px', color: 'var(--primary-color)' }}>
                    {loadingCustomers ? '...' : totalMatches}
                  </div>
                </div>
                <div style={{ background: 'rgba(255,255,255,0.03)', padding: '14px', borderRadius: '10px', border: '1px solid rgba(255,255,255,0.05)', textAlign: 'center' }}>
                  <div style={{ fontSize: '12px', color: 'rgba(255,255,255,0.4)', fontWeight: 600, textTransform: 'uppercase' }}>Leads</div>
                  <div style={{ fontSize: '24px', fontWeight: 800, marginTop: '4px', color: '#3b82f6' }}>
                    {loadingCustomers ? '...' : leadsCount}
                  </div>
                </div>
                <div style={{ background: 'rgba(255,255,255,0.03)', padding: '14px', borderRadius: '10px', border: '1px solid rgba(255,255,255,0.05)', textAlign: 'center' }}>
                  <div style={{ fontSize: '12px', color: 'rgba(255,255,255,0.4)', fontWeight: 600, textTransform: 'uppercase' }}>Contacts</div>
                  <div style={{ fontSize: '24px', fontWeight: 800, marginTop: '4px', color: '#10b981' }}>
                    {loadingCustomers ? '...' : contactsCount}
                  </div>
                </div>
                <div style={{ background: 'rgba(255,255,255,0.03)', padding: '14px', borderRadius: '10px', border: '1px solid rgba(255,255,255,0.05)', textAlign: 'center' }}>
                  <div style={{ fontSize: '12px', color: 'rgba(255,255,255,0.4)', fontWeight: 600, textTransform: 'uppercase' }}>Pipeline Value</div>
                  <div style={{ fontSize: '24px', fontWeight: 800, marginTop: '4px', color: '#f59e0b' }}>
                    {loadingCustomers ? '...' : `₹${(totalValue / 100000).toFixed(1)}L`}
                  </div>
                </div>
              </div>

              {/* Search Control */}
              <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                <input
                  type="text"
                  placeholder="Search by name, company, email..."
                  value={customersSearch}
                  onChange={e => setCustomersSearch(e.target.value)}
                  style={{ ...inputStyle, flex: 1 }}
                />
              </div>

              {/* Customer List Table */}
              <div className="table-responsive" style={{
                maxHeight: '350px',
                overflowY: 'auto',
                border: '1px solid rgba(255,255,255,0.08)',
                borderRadius: '10px',
                background: 'rgba(0,0,0,0.2)',
              }}>
                {loadingCustomers ? (
                  <div style={{ padding: '40px', textAlign: 'center', color: 'rgba(255,255,255,0.4)' }}>
                    <span>🔄 Fetching customers & matching criteria...</span>
                  </div>
                ) : filteredCustomers.length === 0 ? (
                  <div style={{ padding: '40px', textAlign: 'center', color: 'rgba(255,255,255,0.4)' }}>
                    <span>🔍 No matching customers found.</span>
                  </div>
                ) : (
                  <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px' }}>
                    <thead>
                      <tr style={{ background: 'rgba(255,255,255,0.04)', borderBottom: '1px solid rgba(255,255,255,0.08)', textAlign: 'left' }}>
                        <th style={{ padding: '12px 16px', color: 'rgba(255,255,255,0.4)', fontWeight: 600 }}>Name</th>
                        <th style={{ padding: '12px 16px', color: 'rgba(255,255,255,0.4)', fontWeight: 600 }}>Type</th>
                        <th style={{ padding: '12px 16px', color: 'rgba(255,255,255,0.4)', fontWeight: 600 }}>Company</th>
                        <th style={{ padding: '12px 16px', color: 'rgba(255,255,255,0.4)', fontWeight: 600 }}>Contact info</th>
                        <th style={{ padding: '12px 16px', color: 'rgba(255,255,255,0.4)', fontWeight: 600 }}>Matched Filters</th>
                        <th style={{ padding: '12px 16px', color: 'rgba(255,255,255,0.4)', fontWeight: 600 }}>Details</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredCustomers.map(customer => {
                        const isLead = customer.type === 'Lead';
                        return (
                          <tr key={`${customer.type}-${customer.id}`} style={{
                            borderBottom: '1px solid rgba(255,255,255,0.05)',
                            transition: 'background 0.2s',
                          }}
                          onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.02)'}
                          onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                          >
                            <td style={{ padding: '12px 16px', fontWeight: 600, color: '#f9fafb' }}>
                              {customer.name}
                            </td>
                            <td style={{ padding: '12px 16px' }}>
                              <span style={{
                                fontSize: '10px',
                                fontWeight: 700,
                                textTransform: 'uppercase',
                                padding: '2px 8px',
                                borderRadius: '4px',
                                background: isLead ? 'rgba(59,130,246,0.15)' : 'rgba(16,185,129,0.15)',
                                color: isLead ? '#3b82f6' : '#10b981',
                              }}>
                                {customer.type}
                              </span>
                            </td>
                            <td style={{ padding: '12px 16px', color: 'rgba(255,255,255,0.7)' }}>{customer.company}</td>
                            <td style={{ padding: '12px 16px', color: 'rgba(255,255,255,0.6)' }}>
                              <div>{customer.email}</div>
                              <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.4)', marginTop: '2px' }}>{customer.phone}</div>
                            </td>
                            <td style={{ padding: '12px 16px' }}>
                              <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap' }}>
                                {customer.matchedCriteria.map((crit, idx) => (
                                  <span key={idx} style={{
                                    fontSize: '10px',
                                    background: 'rgba(139,92,246,0.15)',
                                    color: '#8b5cf6',
                                    padding: '1px 6px',
                                    borderRadius: '3px',
                                  }}>
                                    {crit}
                                  </span>
                                ))}
                              </div>
                            </td>
                            <td style={{ padding: '12px 16px', color: isLead ? '#f59e0b' : 'rgba(255,255,255,0.5)', fontWeight: isLead ? 600 : 400 }}>
                              {customer.detail}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                )}
              </div>
            </div>

            {/* Modal Footer */}
            <div style={{
              padding: '18px 28px',
              borderTop: '1px solid rgba(255,255,255,0.07)',
              display: 'flex', justifyContent: 'flex-end',
              background: 'rgba(0,0,0,0.1)'
            }}>
              <button onClick={() => setViewCustomersModal(false)}
                style={{
                  padding: '9px 24px', background: 'transparent',
                  border: '1px solid rgba(255,255,255,0.18)', color: 'white',
                  borderRadius: '8px', cursor: 'pointer', fontWeight: 600,
                  fontSize: '13px'
                }}>
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

