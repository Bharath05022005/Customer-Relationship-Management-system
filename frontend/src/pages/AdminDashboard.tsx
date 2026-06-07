import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { Users, Briefcase, DollarSign, TrendingUp, CheckSquare, Target } from 'lucide-react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend,
  Area, AreaChart,
} from 'recharts';
import API_BASE from '../config/api.js';

/* ── shared ── */
const cardStyle: React.CSSProperties = {
  background: 'rgba(255,255,255,0.04)',
  border: '1px solid rgba(255,255,255,0.08)',
  borderRadius: '16px',
  padding: '24px',
};

const sectionTitle = (title: string, sub?: string) => (
  <div style={{ marginBottom: '20px' }}>
    <h3 style={{ fontSize: '16px', fontWeight: 700, color: '#f9fafb', margin: 0 }}>{title}</h3>
    {sub && <p style={{ fontSize: '12px', color: 'rgba(255,255,255,0.4)', marginTop: '4px' }}>{sub}</p>}
  </div>
);

const COLORS = ['#3b82f6', '#8b5cf6', '#10b981', '#f59e0b', '#ef4444', '#06b6d4'];

const tooltipStyle = {
  contentStyle: {
    backgroundColor: '#1e293b',
    border: '1px solid rgba(255,255,255,0.1)',
    borderRadius: '10px',
    color: '#f9fafb',
    fontSize: '13px',
  },
  cursor: { fill: 'rgba(255,255,255,0.04)' },
};

const axisProps = {
  stroke: 'transparent',
  tick: { fill: 'rgba(255,255,255,0.4)', fontSize: 12 },
  tickLine: false,
  axisLine: false,
};

const inputStyle: React.CSSProperties = {
  width: '100%', padding: '10px 14px',
  backgroundColor: '#1e293b', background: '#1e293b',
  border: '1px solid rgba(255,255,255,0.12)',
  color: '#f9fafb', borderRadius: '8px', fontSize: '14px',
  outline: 'none', boxSizing: 'border-box', fontFamily: 'inherit',
};

export const AdminDashboard: React.FC = () => {
  const { token } = useAuth();

  const [name, setName]       = useState('');
  const [email, setEmail]     = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const [users, setUsers]               = useState<any[]>([]);
  const [unassignedTasks, setUnassignedTasks] = useState<any[]>([]);
  const [totalLeads, setTotalLeads]     = useState(0);
  const [totalDeals, setTotalDeals]     = useState(0);
  const [totalRevenue, setTotalRevenue] = useState(0);
  const [totalContacts, setTotalContacts] = useState(0);

  /* chart data */
  const [sourceChart, setSourceChart]   = useState<any[]>([]);
  const [statusChart, setStatusChart]   = useState<any[]>([]);
  const [stageChart, setStageChart]     = useState<any[]>([]);
  const [dealValueChart, setDealValueChart] = useState<any[]>([]);
  const [taskTypeChart, setTaskTypeChart] = useState<any[]>([]);
  const [conversionRate, setConversionRate] = useState(0);

  const fetchDashboardData = async () => {
    try {
      const [usersRes, leadsRes, tasksRes, dealsRes, contactsRes] = await Promise.all([
        fetch(`${API_BASE}/api/auth/users`,  { headers: { Authorization: `Bearer ${token}` } }),
        fetch(`${API_BASE}/api/leads`,       { headers: { Authorization: `Bearer ${token}` } }),
        fetch(`${API_BASE}/api/tasks`,       { headers: { Authorization: `Bearer ${token}` } }),
        fetch(`${API_BASE}/api/deals`,       { headers: { Authorization: `Bearer ${token}` } }),
        fetch(`${API_BASE}/api/contacts`,    { headers: { Authorization: `Bearer ${token}` } }),
      ]);

      if (usersRes.ok) setUsers(await usersRes.json());

      let leads: any[] = [];
      if (leadsRes.ok) {
        leads = await leadsRes.json();
        setTotalLeads(leads.length);

        /* Chart 1 – Leads by Source (Bar) */
        const src: Record<string, number> = {};
        leads.forEach((l: any) => { src[l.source || 'Other'] = (src[l.source || 'Other'] || 0) + 1; });
        const srcData = Object.entries(src).map(([name, Leads]) => ({ name, Leads }));
        setSourceChart(srcData.length ? srcData : [
          { name: 'Website', Leads: 0 }, { name: 'Referral', Leads: 0 },
          { name: 'Cold Call', Leads: 0 }, { name: 'Social Media', Leads: 0 },
        ]);

        /* Chart 2 – Leads by Status (Donut) */
        const st: Record<string, number> = {};
        leads.forEach((l: any) => { st[l.status || 'New'] = (st[l.status || 'New'] || 0) + 1; });
        setStatusChart(Object.entries(st).map(([name, value]) => ({ name, value })));

        /* Conversion rate: Converted / total */
        const converted = leads.filter((l: any) => l.status === 'Converted').length;
        setConversionRate(leads.length > 0 ? Math.round((converted / leads.length) * 100) : 0);
      }

      let tasks: any[] = [];
      if (tasksRes.ok) {
        tasks = await tasksRes.json();
        setUnassignedTasks(tasks);
        /* Chart 5 – Tasks by Type (Pie) */
        const tt: Record<string, number> = {};
        tasks.forEach((t: any) => { tt[t.type || 'Other'] = (tt[t.type || 'Other'] || 0) + 1; });
        setTaskTypeChart(Object.entries(tt).map(([name, value]) => ({ name, value })));
      }

      let deals: any[] = [];
      if (dealsRes.ok) {
        deals = await dealsRes.json();
        setTotalDeals(deals.length);
        const rev = deals.reduce((a: number, d: any) => a + (parseFloat(d.value) || 0), 0);
        setTotalRevenue(rev);

        /* Chart 3 – Deals by Stage (Horizontal Bar / funnel) */
        const stages = ['Prospect', 'Proposal', 'Negotiation', 'Won'];
        const stageData = stages.map(stage => ({
          name: stage,
          Deals: deals.filter((d: any) => d.stage === stage).length,
          Value: deals.filter((d: any) => d.stage === stage)
            .reduce((a: number, d: any) => a + (parseFloat(d.value) || 0), 0),
        }));
        setStageChart(stageData);

        /* Chart 4 – Deal Value over time (Area) — group by expectedCloseDate month */
        const monthly: Record<string, number> = {};
        deals.forEach((d: any) => {
          if (d.expectedCloseDate) {
            const m = new Date(d.expectedCloseDate).toLocaleString('default', { month: 'short', year: '2-digit' });
            monthly[m] = (monthly[m] || 0) + (parseFloat(d.value) || 0);
          }
        });
        const sorted = Object.entries(monthly)
          .sort((a, b) => new Date('1 ' + a[0]).getTime() - new Date('1 ' + b[0]).getTime())
          .map(([name, Revenue]) => ({ name, Revenue }));
        setDealValueChart(sorted.length ? sorted : [
          { name: 'Jan', Revenue: 0 }, { name: 'Feb', Revenue: 0 },
          { name: 'Mar', Revenue: 0 }, { name: 'Apr', Revenue: 0 },
        ]);
      }

      if (contactsRes.ok) {
        const contacts = await contactsRes.json();
        setTotalContacts(contacts.length);
      }

    } catch (err) { console.error(err); }
  };

  useEffect(() => { fetchDashboardData(); }, []);

  const handleCreateSalesman = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true); setMessage('');
    try {
      const res = await fetch(`${API_BASE}/api/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ name, email, password }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to create user');
      setMessage(`✅ ${data.message}`);
      setName(''); setEmail(''); setPassword('');
      fetchDashboardData();
    } catch (err: any) {
      setMessage(`❌ ${err.message}`);
    } finally { setLoading(false); }
  };

  const assignTask = async (taskId: number, salesmanEmail: string) => {
    if (!salesmanEmail) return;
    try {
      await fetch(`${API_BASE}/api/tasks/${taskId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ assignedTo: salesmanEmail }),
      });
      fetchDashboardData();
    } catch (err) { console.error(err); }
  };

  /* KPI cards config */
  const kpiCards = [
    { label: 'Total Leads',    value: totalLeads,    icon: <Target size={26} />,    color: '#3b82f6' },
    { label: 'Active Deals',   value: totalDeals,    icon: <Briefcase size={26} />, color: '#8b5cf6' },
    { label: 'Total Contacts', value: totalContacts, icon: <Users size={26} />,     color: '#06b6d4' },
    { label: 'Pipeline Value', value: `₹${(totalRevenue/100000).toFixed(1)}L`, icon: <DollarSign size={26} />, color: '#10b981' },
    { label: 'Conversion Rate',value: `${conversionRate}%`,icon: <TrendingUp size={26} />, color: '#f59e0b' },
    { label: 'Salesmen',       value: users.length,  icon: <CheckSquare size={26} />, color: '#ef4444' },
  ];

  /* Custom Donut centre label */

  return (
    <div className="page-container">

      {/* ── Page Header ── */}
      <div style={{ marginBottom: '28px' }}>
        <h1 style={{ fontSize: '26px', fontWeight: 800, color: '#f9fafb', margin: 0 }}>Analytics & Command Center</h1>
        <p style={{ fontSize: '14px', color: 'rgba(255,255,255,0.4)', marginTop: '4px' }}>
          Real-time overview of your CRM performance
        </p>
      </div>

      {/* ── KPI Row (6 cards) ── */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(6, 1fr)', gap: '16px', marginBottom: '28px' }}>
        {kpiCards.map(card => (
          <div key={card.label} style={{
            ...cardStyle,
            borderTop: `3px solid ${card.color}`,
            display: 'flex', flexDirection: 'column', gap: '12px',
            transition: 'transform 0.2s',
          }}
            onMouseEnter={e => (e.currentTarget.style.transform = 'translateY(-2px)')}
            onMouseLeave={e => (e.currentTarget.style.transform = 'translateY(0)')}
          >
            <div style={{
              width: '44px', height: '44px', borderRadius: '10px',
              background: card.color + '18',
              display: 'flex', alignItems: 'center', justifyContent: 'center', color: card.color,
            }}>
              {card.icon}
            </div>
            <div>
              <p style={{ margin: 0, fontSize: '12px', color: 'rgba(255,255,255,0.45)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                {card.label}
              </p>
              <h2 style={{ margin: '4px 0 0', fontSize: '26px', fontWeight: 800, color: '#f9fafb' }}>
                {card.value}
              </h2>
            </div>
          </div>
        ))}
      </div>

      {/* ── Row 1: Leads by Source (Bar) + Lead Status (Donut) ── */}
      <div style={{ display: 'grid', gridTemplateColumns: '1.6fr 1fr', gap: '20px', marginBottom: '20px' }}>

        {/* Chart 1 – Leads by Source */}
        <div style={cardStyle}>
          {sectionTitle('Leads by Source', 'Where your leads are coming from')}
          <ResponsiveContainer width="100%" height={240}>
            <BarChart data={sourceChart} margin={{ top: 4, right: 16, left: -10, bottom: 0 }}>
              <defs>
                <linearGradient id="barGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#3b82f6" />
                  <stop offset="100%" stopColor="#8b5cf6" />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
              <XAxis dataKey="name" {...axisProps} />
              <YAxis {...axisProps} allowDecimals={false} />
              <Tooltip {...tooltipStyle} />
              <Bar dataKey="Leads" fill="url(#barGrad)" radius={[6, 6, 0, 0]} barSize={36} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Chart 2 – Lead Status Donut */}
        <div style={cardStyle}>
          {sectionTitle('Lead Status Breakdown', 'Current pipeline distribution')}
          {statusChart.length === 0 ? (
            <div style={{ height: 240, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'rgba(255,255,255,0.3)', fontSize: '13px' }}>
              No data yet
            </div>
          ) : (
            <ResponsiveContainer width="100%" height={240}>
              <PieChart>
                <Pie
                  data={statusChart} cx="50%" cy="45%"
                  innerRadius={60} outerRadius={90}
                  paddingAngle={3} dataKey="value"
                  labelLine={false}
                >
                  {statusChart.map((_, i) => (
                    <Cell key={i} fill={COLORS[i % COLORS.length]} stroke="transparent" />
                  ))}
                </Pie>
                <Tooltip {...tooltipStyle} />
                <Legend
                  iconType="circle" iconSize={8}
                  formatter={(v) => <span style={{ color: 'rgba(255,255,255,0.7)', fontSize: '12px' }}>{v}</span>}
                />
              </PieChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>

      {/* ── Row 2: Deal Value Area + Sales Pipeline Funnel ── */}
      <div style={{ display: 'grid', gridTemplateColumns: '1.4fr 1fr', gap: '20px', marginBottom: '20px' }}>

        {/* Chart 3 – Pipeline Revenue over time (Area) */}
        <div style={cardStyle}>
          {sectionTitle('Pipeline Revenue Forecast', 'Expected deal value by close date')}
          <ResponsiveContainer width="100%" height={220}>
            <AreaChart data={dealValueChart} margin={{ top: 4, right: 16, left: -10, bottom: 0 }}>
              <defs>
                <linearGradient id="areaGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
              <XAxis dataKey="name" {...axisProps} />
              <YAxis {...axisProps} tickFormatter={v => `₹${(v/1000).toFixed(0)}k`} />
              <Tooltip {...tooltipStyle} formatter={(v: any) => [`₹${Number(v).toLocaleString('en-IN')}`, 'Revenue']} />
              <Area type="monotone" dataKey="Revenue" stroke="#10b981" strokeWidth={2.5} fill="url(#areaGrad)" dot={{ fill: '#10b981', r: 4 }} activeDot={{ r: 6 }} />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Chart 4 – Sales Stage Funnel (Horizontal Bar) */}
        <div style={cardStyle}>
          {sectionTitle('Sales Pipeline Stages', 'Deals at each stage')}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', marginTop: '8px' }}>
            {stageChart.map((s, i) => {
              const maxDeals = Math.max(...stageChart.map(x => x.Deals), 1);
              const pct = Math.round((s.Deals / maxDeals) * 100);
              const stageColors = ['#3b82f6', '#8b5cf6', '#f59e0b', '#10b981'];
              return (
                <div key={s.name}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                    <span style={{ fontSize: '13px', fontWeight: 700, color: '#f9fafb' }}>{s.name}</span>
                    <div style={{ display: 'flex', gap: '12px' }}>
                      <span style={{ fontSize: '12px', color: 'rgba(255,255,255,0.5)' }}>
                        {s.Deals} deal{s.Deals !== 1 ? 's' : ''}
                      </span>
                      <span style={{ fontSize: '12px', fontWeight: 700, color: stageColors[i] }}>
                        ₹{(s.Value / 1000).toFixed(0)}k
                      </span>
                    </div>
                  </div>
                  <div style={{ height: '8px', background: 'rgba(255,255,255,0.07)', borderRadius: '999px', overflow: 'hidden' }}>
                    <div style={{
                      height: '100%', width: `${pct}%`,
                      background: `linear-gradient(90deg, ${stageColors[i]}, ${stageColors[i]}99)`,
                      borderRadius: '999px', transition: 'width 0.8s ease',
                    }} />
                  </div>
                </div>
              );
            })}
          </div>
          {/* Conversion summary */}
          <div style={{
            marginTop: '20px', padding: '12px 16px',
            background: 'rgba(16,185,129,0.08)', borderRadius: '10px',
            border: '1px solid rgba(16,185,129,0.2)',
            display: 'flex', justifyContent: 'space-between', alignItems: 'center',
          }}>
            <span style={{ fontSize: '13px', color: 'rgba(255,255,255,0.6)' }}>Lead Conversion</span>
            <span style={{ fontSize: '20px', fontWeight: 800, color: '#10b981' }}>{conversionRate}%</span>
          </div>
        </div>
      </div>

      {/* ── Row 3: Tasks by Type (Pie) + Tasks Master List ── */}
      <div style={{ display: 'grid', gridTemplateColumns: '320px 1fr', gap: '20px', marginBottom: '20px' }}>

        {/* Chart 5 – Tasks by Type (Pie) */}
        <div style={cardStyle}>
          {sectionTitle('Task Type Distribution', 'Activity mix overview')}
          {taskTypeChart.length === 0 ? (
            <div style={{ height: 200, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'rgba(255,255,255,0.3)', fontSize: '13px' }}>
              No tasks yet
            </div>
          ) : (
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie data={taskTypeChart} cx="50%" cy="50%" outerRadius={75} dataKey="value" paddingAngle={3} labelLine={false}>
                  {taskTypeChart.map((_, i) => (
                    <Cell key={i} fill={COLORS[i % COLORS.length]} stroke="transparent" />
                  ))}
                </Pie>
                <Tooltip {...tooltipStyle} />
                <Legend iconType="circle" iconSize={8} formatter={v => <span style={{ color: 'rgba(255,255,255,0.7)', fontSize: '11px' }}>{v}</span>} />
              </PieChart>
            </ResponsiveContainer>
          )}
        </div>

        {/* Tasks Master List */}
        <div style={cardStyle}>
          {sectionTitle('All Tasks', 'Assign and track system-wide tasks')}
          {unassignedTasks.length === 0 ? (
            <p style={{ color: 'rgba(255,255,255,0.3)', fontSize: '13px' }}>No tasks in system.</p>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', maxHeight: '220px', overflowY: 'auto' }}>
              {unassignedTasks.map(task => (
                <div key={task.id} style={{
                  display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                  background: 'rgba(255,255,255,0.03)', padding: '10px 14px', borderRadius: '10px',
                  border: '1px solid rgba(255,255,255,0.05)',
                }}>
                  <div>
                    <div style={{ fontWeight: 600, fontSize: '13px', textDecoration: task.status === 'Completed' ? 'line-through' : 'none', opacity: task.status === 'Completed' ? 0.5 : 1 }}>
                      {task.title}
                    </div>
                    <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.35)', marginTop: '2px' }}>
                      {task.type} · Due: {task.dueDate ? new Date(task.dueDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' }) : 'N/A'} ·
                      <span style={{ color: task.status === 'Completed' ? '#10b981' : '#f59e0b' }}> {task.status}</span>
                    </div>
                  </div>
                  <select
                    value={task.assignedTo || 'unassigned'}
                    onChange={e => assignTask(task.id, e.target.value)}
                    style={{ ...inputStyle, width: '180px', padding: '6px 10px', fontSize: '12px' }}
                  >
                    <option value="unassigned">Unassigned</option>
                    {users.filter(u => u.Role?.toLowerCase() !== 'admin').map(u => (
                      <option key={u.id} value={u.email}>{u.username}</option>
                    ))}
                  </select>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* ── Row 4: Create Salesman, Overview, and Quick Task ── */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px' }}>

        {/* Create Salesman */}
        <div style={cardStyle}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px', paddingBottom: '16px', borderBottom: '1px solid rgba(255,255,255,0.07)' }}>
            <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: 'rgba(59,130,246,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#3b82f6' }}>
              <Users size={20} />
            </div>
            <div>
              <h3 style={{ margin: 0, fontSize: '16px', fontWeight: 700 }}>Create Salesman</h3>
              <p style={{ margin: 0, fontSize: '12px', color: 'rgba(255,255,255,0.4)' }}>Generate credentials</p>
            </div>
          </div>

          {message && (
            <div style={{
              padding: '12px 14px', borderRadius: '8px', marginBottom: '16px', fontSize: '13px', fontWeight: 600,
              background: message.startsWith('✅') ? 'rgba(16,185,129,0.1)' : 'rgba(239,68,68,0.1)',
              color: message.startsWith('✅') ? '#10b981' : '#ef4444',
              border: `1px solid ${message.startsWith('✅') ? 'rgba(16,185,129,0.3)' : 'rgba(239,68,68,0.3)'}`,
            }}>
              {message}
            </div>
          )}

          <form onSubmit={handleCreateSalesman} autoComplete="off" style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {[
              { ph: 'Full Name', val: name, set: setName, type: 'text', autoComplete: 'off' },
              { ph: 'Email Address', val: email, set: setEmail, type: 'email', autoComplete: 'new-email' },
              { ph: 'Temporary Password', val: password, set: setPassword, type: 'password', autoComplete: 'new-password' },
            ].map(f => (
              <input key={f.ph} type={f.type} placeholder={f.ph} value={f.val} autoComplete={f.autoComplete}
                onChange={e => f.set(e.target.value)} required style={inputStyle} />
            ))}
            <button type="submit" disabled={loading} style={{
              marginTop: '4px', padding: '11px', borderRadius: '8px',
              background: loading ? 'rgba(59,130,246,0.5)' : 'var(--primary-color)',
              color: 'white', border: 'none', fontWeight: 700, fontSize: '14px',
              cursor: loading ? 'not-allowed' : 'pointer',
              boxShadow: loading ? 'none' : '0 4px 14px rgba(59,130,246,0.4)',
            }}>
              {loading ? 'Creating...' : '+ Create Account'}
            </button>
          </form>
        </div>

        {/* Salesmen Table */}
        <div style={cardStyle}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px', paddingBottom: '16px', borderBottom: '1px solid rgba(255,255,255,0.07)' }}>
            <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: 'rgba(139,92,246,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#8b5cf6' }}>
              <Briefcase size={20} />
            </div>
            <div>
              <h3 style={{ margin: 0, fontSize: '16px', fontWeight: 700 }}>Team Overview</h3>
              <p style={{ margin: 0, fontSize: '12px', color: 'rgba(255,255,255,0.4)' }}>{users.length} member{users.length !== 1 ? 's' : ''}</p>
            </div>
          </div>

          {users.length === 0 ? (
            <p style={{ color: 'rgba(255,255,255,0.3)', fontSize: '13px' }}>No salesmen created yet.</p>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', maxHeight: '240px', overflowY: 'auto' }}>
              {users.map((u, i) => (
                <div key={u.id} style={{
                  display: 'flex', alignItems: 'center', gap: '12px',
                  background: 'rgba(255,255,255,0.03)', padding: '10px 14px', borderRadius: '10px',
                  border: '1px solid rgba(255,255,255,0.05)',
                }}>
                  <div style={{
                    width: '34px', height: '34px', borderRadius: '50%', flexShrink: 0,
                    background: `linear-gradient(135deg, ${COLORS[i % COLORS.length]}, ${COLORS[(i + 1) % COLORS.length]})`,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: '13px', fontWeight: 800,
                  }}>
                    {u.username?.charAt(0).toUpperCase()}
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontWeight: 700, fontSize: '13px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{u.username}</div>
                    <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.4)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{u.email}</div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Create Task */}
        <div style={cardStyle}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px', paddingBottom: '16px', borderBottom: '1px solid rgba(255,255,255,0.07)' }}>
            <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: 'rgba(16,185,129,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#10b981' }}>
              <CheckSquare size={20} />
            </div>
            <div>
              <h3 style={{ margin: 0, fontSize: '16px', fontWeight: 700 }}>Quick Assign Task</h3>
              <p style={{ margin: 0, fontSize: '12px', color: 'rgba(255,255,255,0.4)' }}>Assign a task to a salesman</p>
            </div>
          </div>
          
          <form onSubmit={async (e) => {
            e.preventDefault();
            const form = e.target as HTMLFormElement;
            const title = (form.elements.namedItem('taskTitle') as HTMLInputElement).value;
            const salesman = (form.elements.namedItem('taskSalesman') as HTMLSelectElement).value;
            const type = (form.elements.namedItem('taskType') as HTMLSelectElement).value;
            const dueDate = (form.elements.namedItem('taskDueDate') as HTMLInputElement).value;
            
            if (!title || !salesman) return;
            
            try {
              await fetch(`${API_BASE}/api/tasks`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
                body: JSON.stringify({ title, type, assignedTo: salesman, dueDate: dueDate ? new Date(dueDate).toISOString() : new Date().toISOString() })
              });
              form.reset();
              fetchDashboardData();
            } catch (err) {
              console.error(err);
            }
          }} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            
            <input 
              name="taskTitle"
              type="text" 
              placeholder="Task Description" 
              required
              style={inputStyle}
            />
            
            <input 
              name="taskDueDate"
              type="date" 
              required
              style={{ ...inputStyle, colorScheme: 'dark' }}
            />
            
            <select name="taskType" style={inputStyle}>
              <option value="Call">Call</option>
              <option value="Email">Email</option>
              <option value="Meeting">Meeting</option>
              <option value="To-Do">To-Do</option>
            </select>
            
            <select 
              name="taskSalesman"
              required
              style={inputStyle}
            >
              <option value="">Assign to...</option>
              {users.filter(u => u.Role?.toLowerCase() !== 'admin').map(u => (
                <option key={u.id} value={u.email}>{u.username} ({u.email})</option>
              ))}
            </select>
            
            <button 
              type="submit" 
              style={{
                marginTop: '4px', padding: '11px', borderRadius: '8px',
                background: '#10b981', color: 'white', border: 'none', fontWeight: 700, fontSize: '14px',
                cursor: 'pointer', boxShadow: '0 4px 14px rgba(16,185,129,0.3)',
              }}
            >
              + Add Task
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

