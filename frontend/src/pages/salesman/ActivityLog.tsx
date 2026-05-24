import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';

interface Activity {
  id: number;
  type: string;
  subject: string;
  description: string;
  dateTime: string;
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

// ── Type configuration ───────────────────────────────────────────────────────
const typeConfig: Record<string, { icon: string; dotColor: string; badgeBg: string; badgeColor: string }> = {
  Call:    { icon: '📞', dotColor: '#3b82f6', badgeBg: 'rgba(59,130,246,0.18)',  badgeColor: '#60a5fa' },
  Email:   { icon: '📧', dotColor: '#a855f7', badgeBg: 'rgba(168,85,247,0.18)', badgeColor: '#c084fc' },
  Meeting: { icon: '🤝', dotColor: '#10b981', badgeBg: 'rgba(16,185,129,0.18)', badgeColor: '#34d399' },
};

function getTypeConfig(type: string) {
  return typeConfig[type] ?? {
    icon: '📋',
    dotColor: '#6b7280',
    badgeBg: 'rgba(107,114,128,0.18)',
    badgeColor: '#9ca3af',
  };
}

function formatDateTime(dateTime: string): string {
  const d = new Date(dateTime);
  return d.toLocaleString(undefined, {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

export const ActivityLog: React.FC = () => {
  const { token } = useAuth();
  const [activities, setActivities] = useState<Activity[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchActivities = async () => {
    try {
      const res = await fetch('http://localhost:5000/api/activity', {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (res.ok) setActivities(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchActivities();
  }, []);

  // ── Render ────────────────────────────────────────────────────────────────
  return (
    <div className="page-container">
      {/* ── Page Header ── */}
      <div style={{ marginBottom: '32px' }}>
        <h1 style={{ fontSize: '26px', fontWeight: 800, color: '#f9fafb', margin: 0 }}>
          Activity Log
        </h1>
        <p style={{ color: 'rgba(255,255,255,0.45)', fontSize: '14px', marginTop: '6px' }}>
          Chronological history of all customer interactions
        </p>
      </div>

      {/* ── Timeline ── */}
      {loading ? (
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '80px 0', gap: '12px' }}>
          {/* Spinner */}
          <div
            style={{
              width: '22px',
              height: '22px',
              borderRadius: '50%',
              border: '3px solid rgba(59,130,246,0.25)',
              borderTopColor: '#3b82f6',
              animation: 'spin 0.8s linear infinite',
            }}
          />
          <span style={{ color: 'rgba(255,255,255,0.45)', fontSize: '14px' }}>Loading activity log…</span>
          <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
        </div>
      ) : activities.length === 0 ? (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '80px 0' }}>
          <div style={{ fontSize: '48px', marginBottom: '16px' }}>🗂️</div>
          <div style={{ fontWeight: 700, fontSize: '17px', color: '#f9fafb', marginBottom: '6px' }}>
            No activities recorded yet
          </div>
          <div style={{ fontSize: '13px', color: 'rgba(255,255,255,0.4)' }}>
            Customer interactions will appear here as they happen.
          </div>
        </div>
      ) : (
        <div style={{ position: 'relative', paddingLeft: '36px' }}>
          {/* Vertical spine line */}
          <div
            style={{
              position: 'absolute',
              left: '10px',
              top: '16px',
              bottom: '16px',
              width: '2px',
              background: 'linear-gradient(to bottom, rgba(59,130,246,0.5), rgba(59,130,246,0.05))',
            }}
          />

          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            {activities.map((activity, index) => {
              const cfg = getTypeConfig(activity.type);
              return (
                <div key={activity.id} style={{ position: 'relative', display: 'flex', alignItems: 'flex-start', gap: '20px' }}>
                  {/* Dot on timeline */}
                  <div
                    style={{
                      position: 'absolute',
                      left: '-30px',
                      top: '18px',
                      width: '14px',
                      height: '14px',
                      borderRadius: '50%',
                      background: cfg.dotColor,
                      boxShadow: `0 0 10px ${cfg.dotColor}80`,
                      border: '2px solid #0f172a',
                      flexShrink: 0,
                      zIndex: 1,
                    }}
                  />

                  {/* Card */}
                  <div
                    style={{
                      flexGrow: 1,
                      background: 'rgba(255,255,255,0.035)',
                      border: '1px solid rgba(255,255,255,0.08)',
                      borderRadius: '14px',
                      padding: '18px 22px',
                      backdropFilter: 'blur(4px)',
                      WebkitBackdropFilter: 'blur(4px)',
                      transition: 'border-color 0.2s',
                    }}
                    onMouseEnter={e => (e.currentTarget.style.borderColor = 'rgba(255,255,255,0.15)')}
                    onMouseLeave={e => (e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)')}
                  >
                    {/* Card top row */}
                    <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '12px', marginBottom: '10px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
                        {/* Type badge */}
                        <span
                          style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '5px',
                            padding: '3px 10px',
                            background: cfg.badgeBg,
                            color: cfg.badgeColor,
                            borderRadius: '999px',
                            fontSize: '11px',
                            fontWeight: 700,
                            letterSpacing: '0.04em',
                          }}
                        >
                          <span>{cfg.icon}</span>
                          {activity.type}
                        </span>
                        {/* Subject */}
                        <span style={{ fontWeight: 700, fontSize: '15px', color: '#f9fafb' }}>
                          {activity.subject}
                        </span>
                      </div>

                      {/* Date/time */}
                      <span
                        style={{
                          fontSize: '12px',
                          color: 'rgba(255,255,255,0.35)',
                          whiteSpace: 'nowrap',
                          flexShrink: 0,
                          paddingTop: '2px',
                        }}
                      >
                        {formatDateTime(activity.dateTime)}
                      </span>
                    </div>

                    {/* Description */}
                    {activity.description && (
                      <p
                        style={{
                          margin: 0,
                          fontSize: '13px',
                          color: 'rgba(255,255,255,0.55)',
                          lineHeight: '1.6',
                        }}
                      >
                        {activity.description}
                      </p>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
