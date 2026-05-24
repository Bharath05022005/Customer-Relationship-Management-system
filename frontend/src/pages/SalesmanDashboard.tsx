import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { Users, Briefcase, IndianRupee, CheckSquare } from 'lucide-react';

export const SalesmanDashboard: React.FC = () => {
  const { user, token } = useAuth();
  
  const [myLeads, setMyLeads] = useState<any[]>([]);
  const [myTasks, setMyTasks] = useState<any[]>([]);
  const [myDeals, setMyDeals] = useState<any[]>([]);
  
  const [totalRevenue, setTotalRevenue] = useState(0);

  const fetchDashboardData = async () => {
    try {
      const [leadsRes, tasksRes, dealsRes] = await Promise.all([
        fetch('http://localhost:5000/api/leads', { headers: { Authorization: `Bearer ${token}` } }),
        fetch('http://localhost:5000/api/tasks', { headers: { Authorization: `Bearer ${token}` } }),
        fetch('http://localhost:5000/api/deals', { headers: { Authorization: `Bearer ${token}` } })
      ]);

      if (leadsRes.ok) {
        const leads = await leadsRes.json();
        setMyLeads(leads);
      }
      
      if (tasksRes.ok) {
        const tasks = await tasksRes.json();
        setMyTasks(tasks);
      }
      
      if (dealsRes.ok) {
        const deals = await dealsRes.json();
        // Assuming deals don't have assignedTo yet or they do, if they do filter them:
        // const mine = deals.filter((d: any) => d.assignedTo === user?.email);
        setMyDeals(deals);
        const revenue = deals.reduce((acc: number, deal: any) => acc + (parseFloat(deal.value) || 0), 0);
        setTotalRevenue(revenue);
      }
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    if (user && token) {
      fetchDashboardData();
    }
  }, [user, token]);

  return (
    <div className="page-container">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
        <div>
          <h1 style={{ fontSize: '28px', fontWeight: 700 }}>Salesman Dashboard</h1>
          <p style={{ color: 'var(--text-muted)' }}>Welcome back, {user?.name}</p>
        </div>
      </div>

      {/* KPI Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '20px', marginBottom: '32px' }}>
        <div className="glass-panel" style={{ padding: '24px', borderRadius: '16px', display: 'flex', alignItems: 'center', gap: '16px', borderTop: '4px solid #3b82f6' }}>
          <div style={{ padding: '16px', background: 'rgba(59, 130, 246, 0.1)', borderRadius: '12px', color: '#3b82f6' }}>
            <Users size={32} />
          </div>
          <div>
            <p style={{ margin: 0, color: 'var(--text-muted)', fontSize: '14px', fontWeight: 500 }}>My Leads</p>
            <h2 style={{ margin: 0, fontSize: '28px', fontWeight: 'bold' }}>{myLeads.length}</h2>
          </div>
        </div>

        <div className="glass-panel" style={{ padding: '24px', borderRadius: '16px', display: 'flex', alignItems: 'center', gap: '16px', borderTop: '4px solid #8b5cf6' }}>
          <div style={{ padding: '16px', background: 'rgba(139, 92, 246, 0.1)', borderRadius: '12px', color: '#8b5cf6' }}>
            <Briefcase size={32} />
          </div>
          <div>
            <p style={{ margin: 0, color: 'var(--text-muted)', fontSize: '14px', fontWeight: 500 }}>Active Deals</p>
            <h2 style={{ margin: 0, fontSize: '28px', fontWeight: 'bold' }}>{myDeals.length}</h2>
          </div>
        </div>

        <div className="glass-panel" style={{ padding: '24px', borderRadius: '16px', display: 'flex', alignItems: 'center', gap: '16px', borderTop: '4px solid #10b981' }}>
          <div style={{ padding: '16px', background: 'rgba(16, 185, 129, 0.1)', borderRadius: '12px', color: '#10b981' }}>
            <IndianRupee size={32} />
          </div>
          <div>
            <p style={{ margin: 0, color: 'var(--text-muted)', fontSize: '14px', fontWeight: 500 }}>Expected Pipeline</p>
            <h2 style={{ margin: 0, fontSize: '28px', fontWeight: 'bold' }}>₹{totalRevenue.toLocaleString(undefined, {minimumFractionDigits: 0, maximumFractionDigits: 0})}</h2>
          </div>
        </div>

        <div className="glass-panel" style={{ padding: '24px', borderRadius: '16px', display: 'flex', alignItems: 'center', gap: '16px', borderTop: '4px solid #f59e0b' }}>
          <div style={{ padding: '16px', background: 'rgba(245, 158, 11, 0.1)', borderRadius: '12px', color: '#f59e0b' }}>
            <CheckSquare size={32} />
          </div>
          <div>
            <p style={{ margin: 0, color: 'var(--text-muted)', fontSize: '14px', fontWeight: 500 }}>My Tasks</p>
            <h2 style={{ margin: 0, fontSize: '28px', fontWeight: 'bold' }}>{myTasks.length}</h2>
          </div>
        </div>
      </div>
      
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
        {/* My Leads Queue */}
        <div className="glass-panel" style={{ padding: '24px', borderRadius: '16px' }}>
          <h2 style={{ marginBottom: '16px', fontSize: '20px', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '12px' }}>
            My Active Leads
          </h2>
          {myLeads.length === 0 ? (
            <p style={{ color: 'var(--text-muted)' }}>You have no assigned leads.</p>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {myLeads.map(lead => (
                <div key={lead.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'rgba(255,255,255,0.02)', padding: '12px', borderRadius: '8px' }}>
                  <div>
                    <div style={{ fontWeight: 'bold' }}>{lead.name}</div>
                    <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>{lead.company || lead.source}</div>
                  </div>
                  <div style={{ padding: '4px 12px', borderRadius: '12px', fontSize: '12px', fontWeight: 'bold', background: 'rgba(59, 130, 246, 0.2)', color: '#3b82f6' }}>
                    {lead.stage || 'New'}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* My Tasks Queue */}
        <div className="glass-panel" style={{ padding: '24px', borderRadius: '16px' }}>
          <h2 style={{ marginBottom: '16px', fontSize: '20px', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '12px' }}>
            My Upcoming Tasks
          </h2>
          {myTasks.length === 0 ? (
            <p style={{ color: 'var(--text-muted)' }}>You have no pending tasks.</p>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {myTasks.map(task => (
                <div key={task.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'rgba(255,255,255,0.02)', padding: '12px', borderRadius: '8px' }}>
                  <div>
                    <div style={{ fontWeight: 'bold', textDecoration: task.status === 'Completed' ? 'line-through' : 'none' }}>{task.title}</div>
                    <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Due: {task.dueDate ? new Date(task.dueDate).toLocaleDateString() : 'N/A'}</div>
                  </div>
                  <div style={{ padding: '4px 12px', borderRadius: '12px', fontSize: '12px', fontWeight: 'bold', background: task.status === 'Completed' ? 'rgba(16, 185, 129, 0.2)' : 'rgba(245, 158, 11, 0.2)', color: task.status === 'Completed' ? '#10b981' : '#f59e0b' }}>
                    {task.status}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
