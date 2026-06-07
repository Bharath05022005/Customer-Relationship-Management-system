import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import API_BASE from '../../config/api.js';

interface Task {
  id: number;
  title: string;
  type: string;
  description: string;
  dueDate: string;
  status: string;
}

// ── Shared style constants ──────────────────────────────────────────────────
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
  boxSizing: 'border-box' as const,
  transition: 'border-color 0.2s',
  fontFamily: 'inherit',
};

const labelStyle: React.CSSProperties = {
  display: 'block',
  fontSize: '11px',
  fontWeight: 700,
  color: 'rgba(255,255,255,0.45)',
  marginBottom: '6px',
  textTransform: 'uppercase' as const,
  letterSpacing: '0.06em',
};

// ── Type badge colours ───────────────────────────────────────────────────────
const typeColors: Record<string, { bg: string; color: string }> = {
  Call:    { bg: 'rgba(59,130,246,0.18)',  color: '#60a5fa' },
  Email:   { bg: 'rgba(168,85,247,0.18)', color: '#c084fc' },
  Meeting: { bg: 'rgba(16,185,129,0.18)', color: '#34d399' },
  'To-Do': { bg: 'rgba(245,158,11,0.18)', color: '#fbbf24' },
  Demo:    { bg: 'rgba(236,72,153,0.18)', color: '#f472b6' },
};

function getDueDateColor(dueDate: string, status: string): string {
  if (!dueDate) return '#f9fafb';
  if (status === 'Completed') return 'rgba(255,255,255,0.4)';
  const due = new Date(dueDate);
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const dueDay = new Date(due.getFullYear(), due.getMonth(), due.getDate());
  if (dueDay < today) return '#f87171';   // overdue – red
  if (dueDay.getTime() === today.getTime()) return '#34d399'; // today – green
  return '#f9fafb';
}

export const Tasks: React.FC = () => {
  const { token, isAdmin } = useAuth();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [users, setUsers] = useState<any[]>([]);

  // Form State
  const [title, setTitle] = useState('');
  const [type, setType] = useState('Call');
  const [priority, setPriority] = useState('Medium');
  const [description, setDescription] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [assignedTo, setAssignedTo] = useState('');

  // Row hover state
  const [hoveredRow, setHoveredRow] = useState<number | null>(null);

  const fetchTasks = async () => {
    try {
      const res = await fetch(`${API_BASE}/api/tasks`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (res.ok) setTasks(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const fetchUsers = async () => {
    try {
      const res = await fetch(`${API_BASE}/api/auth/users`, {
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
    fetchTasks();
    if (isAdmin) fetchUsers();
  }, [isAdmin]);

  const handleAddTask = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const payload = {
        title,
        type,
        description,
        dueDate,
        assignedTo: isAdmin ? assignedTo : undefined,
      };
      const res = await fetch(`${API_BASE}/api/tasks`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });
      if (res.ok) {
        setShowModal(false);
        fetchTasks();
        setTitle('');
        setType('Call');
        setPriority('Medium');
        setDescription('');
        setDueDate('');
      }
    } catch (err) {
      console.error(err);
    }
  };

  const updateStatus = async (id: number, newStatus: string) => {
    try {
      const res = await fetch(`http://localhost:5000/api/tasks/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ status: newStatus }),
      });
      if (res.ok) fetchTasks();
    } catch (err) {
      console.error(err);
    }
  };

  // ── Render ────────────────────────────────────────────────────────────────
  return (
    <div className="page-container">
      {/* ── Page Header ── */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '28px' }}>
        <div>
          <h1 style={{ fontSize: '26px', fontWeight: 800, color: '#f9fafb', margin: 0 }}>
            Tasks &amp; Reminders
          </h1>
          <p style={{ color: 'rgba(255,255,255,0.45)', fontSize: '14px', marginTop: '4px' }}>
            Follow-up on your leads and deals
          </p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          style={{
            padding: '10px 20px',
            background: 'linear-gradient(135deg, #3b82f6, #2563eb)',
            color: 'white',
            border: 'none',
            borderRadius: '10px',
            cursor: 'pointer',
            fontWeight: 700,
            fontSize: '14px',
            boxShadow: '0 0 16px rgba(59,130,246,0.45)',
            transition: 'transform 0.15s, box-shadow 0.15s',
            letterSpacing: '0.02em',
          }}
          onMouseEnter={e => {
            (e.currentTarget as HTMLButtonElement).style.transform = 'scale(1.04)';
            (e.currentTarget as HTMLButtonElement).style.boxShadow = '0 0 24px rgba(59,130,246,0.65)';
          }}
          onMouseLeave={e => {
            (e.currentTarget as HTMLButtonElement).style.transform = 'scale(1)';
            (e.currentTarget as HTMLButtonElement).style.boxShadow = '0 0 16px rgba(59,130,246,0.45)';
          }}
        >
          + Add Task
        </button>
      </div>

      {/* ── Table ── */}
      <div className="glass-panel" style={{ overflow: 'hidden', borderRadius: '16px' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
          <thead>
            <tr style={{ background: 'rgba(255,255,255,0.04)', borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
              {['', 'Task', 'Type', 'Due Date', 'Status'].map(h => (
                <th
                  key={h}
                  style={{
                    padding: '14px 18px',
                    fontSize: '11px',
                    fontWeight: 700,
                    color: 'rgba(255,255,255,0.4)',
                    textTransform: 'uppercase',
                    letterSpacing: '0.07em',
                  }}
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={5} style={{ padding: '40px', textAlign: 'center', color: 'rgba(255,255,255,0.4)', fontSize: '14px' }}>
                  Loading tasks…
                </td>
              </tr>
            ) : tasks.length === 0 ? (
              <tr>
                <td colSpan={5}>
                  <div style={{ padding: '60px 24px', textAlign: 'center' }}>
                    <div style={{ fontSize: '40px', marginBottom: '12px' }}>✅</div>
                    <div style={{ fontWeight: 700, fontSize: '16px', color: '#f9fafb', marginBottom: '6px' }}>
                      All caught up!
                    </div>
                    <div style={{ fontSize: '13px', color: 'rgba(255,255,255,0.4)' }}>
                      No tasks found. Create one to get started.
                    </div>
                  </div>
                </td>
              </tr>
            ) : (
              tasks.map(task => {
                const isCompleted = task.status === 'Completed';
                const tc = typeColors[task.type] ?? { bg: 'rgba(255,255,255,0.08)', color: 'rgba(255,255,255,0.7)' };
                const dueDateColor = getDueDateColor(task.dueDate, task.status);
                const isHovered = hoveredRow === task.id;

                return (
                  <tr
                    key={task.id}
                    onMouseEnter={() => setHoveredRow(task.id)}
                    onMouseLeave={() => setHoveredRow(null)}
                    style={{
                      borderBottom: '1px solid rgba(255,255,255,0.05)',
                      background: isHovered ? 'rgba(59,130,246,0.06)' : 'transparent',
                      transition: 'background 0.15s',
                      opacity: isCompleted ? 0.6 : 1,
                    }}
                  >
                    {/* Checkbox */}
                    <td style={{ padding: '16px 18px', width: '48px' }}>
                      <div
                        onClick={() => updateStatus(task.id, isCompleted ? 'Pending' : 'Completed')}
                        style={{
                          width: '22px',
                          height: '22px',
                          borderRadius: '50%',
                          border: isCompleted ? '2px solid #3b82f6' : '2px solid rgba(255,255,255,0.25)',
                          background: isCompleted ? '#3b82f6' : 'transparent',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          cursor: 'pointer',
                          transition: 'border-color 0.2s, background 0.2s',
                          flexShrink: 0,
                        }}
                      >
                        {isCompleted && (
                          <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                            <path d="M2 6l3 3 5-5" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                          </svg>
                        )}
                      </div>
                    </td>

                    {/* Title + description */}
                    <td style={{ padding: '16px 18px' }}>
                      <div
                        style={{
                          fontWeight: 600,
                          fontSize: '14px',
                          color: '#f9fafb',
                          textDecoration: isCompleted ? 'line-through' : 'none',
                          marginBottom: '3px',
                        }}
                      >
                        {task.title}
                      </div>
                      {task.description && (
                        <div style={{ fontSize: '12px', color: 'rgba(255,255,255,0.4)', lineHeight: '1.4' }}>
                          {task.description}
                        </div>
                      )}
                    </td>

                    {/* Type badge */}
                    <td style={{ padding: '16px 18px' }}>
                      <span
                        style={{
                          padding: '4px 10px',
                          background: tc.bg,
                          color: tc.color,
                          borderRadius: '999px',
                          fontSize: '11px',
                          fontWeight: 700,
                          letterSpacing: '0.04em',
                          whiteSpace: 'nowrap',
                        }}
                      >
                        {task.type}
                      </span>
                    </td>

                    {/* Due date */}
                    <td style={{ padding: '16px 18px', fontSize: '13px', fontWeight: 600, color: dueDateColor }}>
                      {task.dueDate ? new Date(task.dueDate).toLocaleDateString(undefined, { day: '2-digit', month: 'short', year: 'numeric' }) : '—'}
                    </td>

                    {/* Status badge */}
                    <td style={{ padding: '16px 18px' }}>
                      <span
                        style={{
                          padding: '4px 10px',
                          background: isCompleted ? 'rgba(16,185,129,0.18)' : 'rgba(245,158,11,0.18)',
                          color: isCompleted ? '#34d399' : '#fbbf24',
                          borderRadius: '999px',
                          fontSize: '11px',
                          fontWeight: 700,
                          letterSpacing: '0.04em',
                          whiteSpace: 'nowrap',
                        }}
                      >
                        {isCompleted ? 'Completed' : 'Pending'}
                      </span>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* ── Modal ── */}
      {showModal && (
        <div
          onClick={e => { if (e.target === e.currentTarget) setShowModal(false); }}
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'rgba(0,0,0,0.65)',
            backdropFilter: 'blur(6px)',
            WebkitBackdropFilter: 'blur(6px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000,
          }}
        >
          <div
            style={{
              width: '700px',
              maxWidth: '95vw',
              maxHeight: '90vh',
              overflowY: 'auto',
              background: '#0f172a',
              border: '1px solid rgba(255,255,255,0.1)',
              borderRadius: '18px',
              boxShadow: '0 24px 60px rgba(0,0,0,0.6)',
              display: 'flex',
              flexDirection: 'column',
            }}
          >
            {/* Sticky header */}
            <div
              style={{
                position: 'sticky',
                top: 0,
                zIndex: 10,
                background: '#0f172a',
                borderBottom: '1px solid rgba(255,255,255,0.08)',
                padding: '20px 28px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                borderRadius: '18px 18px 0 0',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <span style={{ fontSize: '28px' }}>✅</span>
                <div>
                  <div style={{ fontWeight: 800, fontSize: '18px', color: '#f9fafb' }}>Create New Task</div>
                  <div style={{ fontSize: '12px', color: 'rgba(255,255,255,0.4)', marginTop: '2px' }}>
                    Fill in the details below to schedule a new task
                  </div>
                </div>
              </div>
              <button
                onClick={() => setShowModal(false)}
                style={{
                  width: '34px',
                  height: '34px',
                  borderRadius: '50%',
                  background: 'rgba(255,255,255,0.07)',
                  border: '1px solid rgba(255,255,255,0.1)',
                  color: 'rgba(255,255,255,0.6)',
                  fontSize: '18px',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  lineHeight: 1,
                  flexShrink: 0,
                }}
              >
                ×
              </button>
            </div>

            {/* Form body */}
            <form onSubmit={handleAddTask} style={{ padding: '24px 28px', display: 'flex', flexDirection: 'column', gap: '24px' }}>
              {/* Section 1 — Task Information */}
              <div>
                <div style={{ fontSize: '13px', fontWeight: 700, color: 'rgba(255,255,255,0.6)', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span>📋</span> Task Information
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  {/* Title — full width */}
                  <div>
                    <label style={labelStyle}>Task Title</label>
                    <input
                      type="text"
                      placeholder="e.g. Follow up with client"
                      value={title}
                      onChange={e => setTitle(e.target.value)}
                      required
                      style={inputStyle}
                    />
                  </div>

                  {/* 2-col row: Type + Priority */}
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                    <div>
                      <label style={labelStyle}>Task Type</label>
                      <select value={type} onChange={e => setType(e.target.value)} style={inputStyle}>
                        <option value="Call">Call</option>
                        <option value="Email">Email</option>
                        <option value="Meeting">Meeting</option>
                        <option value="To-Do">To-Do</option>
                        <option value="Demo">Demo</option>
                      </select>
                    </div>
                    <div>
                      <label style={labelStyle}>Priority</label>
                      <select value={priority} onChange={e => setPriority(e.target.value)} style={inputStyle}>
                        <option value="High">High</option>
                        <option value="Medium">Medium</option>
                        <option value="Low">Low</option>
                      </select>
                    </div>
                  </div>

                  {/* 2-col row: Due Date + Time */}
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                    <div>
                      <label style={labelStyle}>Due Date</label>
                      <input
                        type="date"
                        value={dueDate}
                        onChange={e => setDueDate(e.target.value)}
                        style={{ ...inputStyle, colorScheme: 'dark' }}
                      />
                    </div>
                    <div>
                      <label style={labelStyle}>Due Time</label>
                      <input
                        type="time"
                        style={{ ...inputStyle, colorScheme: 'dark' }}
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Divider */}
              <div style={{ height: '1px', background: 'rgba(255,255,255,0.07)' }} />

              {/* Section 2 — Description */}
              <div>
                <div style={{ fontSize: '13px', fontWeight: 700, color: 'rgba(255,255,255,0.6)', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span>📝</span> Description
                </div>
                <div>
                  <label style={labelStyle}>Notes / Details</label>
                  <textarea
                    placeholder="Add any additional notes about this task…"
                    value={description}
                    onChange={e => setDescription(e.target.value)}
                    rows={3}
                    style={{ ...inputStyle, resize: 'vertical', minHeight: '80px', lineHeight: '1.5' }}
                  />
                </div>
              </div>

              {/* Section 3 — Assign To (admin only) */}
              {isAdmin && (
                <>
                  <div style={{ height: '1px', background: 'rgba(255,255,255,0.07)' }} />
                  <div>
                    <div style={{ fontSize: '13px', fontWeight: 700, color: 'rgba(255,255,255,0.6)', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span>👤</span> Assignment
                    </div>
                    <div>
                      <label style={labelStyle}>Assign To Salesman</label>
                      <select value={assignedTo} onChange={e => setAssignedTo(e.target.value)} style={inputStyle}>
                        <option value="">Unassigned</option>
                        {users.map(u => (
                          <option key={u.id} value={u.email}>
                            {u.username} ({u.email})
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                </>
              )}

              {/* Footer buttons */}
              <div style={{ height: '1px', background: 'rgba(255,255,255,0.07)' }} />
              <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  style={{
                    padding: '10px 24px',
                    background: 'transparent',
                    border: '1px solid rgba(255,255,255,0.18)',
                    color: 'rgba(255,255,255,0.75)',
                    borderRadius: '8px',
                    cursor: 'pointer',
                    fontWeight: 600,
                    fontSize: '14px',
                    transition: 'border-color 0.2s',
                  }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  style={{
                    padding: '10px 28px',
                    background: 'linear-gradient(135deg, #3b82f6, #2563eb)',
                    border: 'none',
                    color: 'white',
                    borderRadius: '8px',
                    cursor: 'pointer',
                    fontWeight: 700,
                    fontSize: '14px',
                    boxShadow: '0 0 18px rgba(59,130,246,0.5)',
                    letterSpacing: '0.02em',
                  }}
                >
                  💾 Save Task
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

