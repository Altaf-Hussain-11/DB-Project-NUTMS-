import { useState } from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useNotifications } from '../context/NotificationContext';
import { NAV_LINKS } from '../components/navLinks';

interface DashboardLayoutProps {
  pageTitle: string;
  pageSubtitle?: string;
}

function timeAgo(ts: number) {
  const now = new Date().getTime();
  const diffMin = Math.floor((now - ts) / 60000);
  if (diffMin < 1) return 'just now';
  if (diffMin < 60) return `${diffMin}m ago`;
  return `${Math.floor(diffMin / 60)}h ago`;
}

export default function DashboardLayout({ pageTitle, pageSubtitle }: DashboardLayoutProps) {
  const { user, logout } = useAuth();
  const { notifications, unreadCount, markAllRead, markRead } = useNotifications();
  const navigate = useNavigate();
  const [showNotifs, setShowNotifs] = useState(false);

  if (!user) return null;

  const links = NAV_LINKS[user.role];

  function handleLogout() {
    logout();
    navigate('/login');
  }

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <div className="sidebar-brand">
          <div className="sidebar-brand-icon">🚌</div>
          <div className="sidebar-brand-text">
            <strong>Namal University</strong>
            <span>Transport Management</span>
          </div>
        </div>
        <nav className="sidebar-nav">
          {links.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              className={({ isActive }) => `sidebar-link${isActive ? ' active' : ''}`}
            >
              <span className="sidebar-icon">{link.icon}</span>
              {link.label}
            </NavLink>
          ))}
          <button className="sidebar-link logout" onClick={handleLogout} style={{ border: 'none', background: 'none', textAlign: 'left', width: '100%' }}>
            <span className="sidebar-icon">⏏️</span>
            Logout
          </button>
        </nav>
      </aside>

      <div className="main-content">
        <header className="topbar">
          <div className="topbar-title">
            <h1>{pageTitle}</h1>
            {pageSubtitle && <p>{pageSubtitle}</p>}
          </div>
          <div className="topbar-actions">
            <div style={{ position: 'relative' }}>
              <button className="icon-btn" onClick={() => { setShowNotifs(s => !s); if (!showNotifs) markAllRead(); }} title="Notifications">
                🔔
                {unreadCount > 0 && <span className="badge-dot" />}
              </button>
              {showNotifs && (
                <div className="notif-dropdown">
                  <div className="notif-dropdown-header">
                    <span>Notifications</span>
                    <button className="btn btn-sm btn-outline" onClick={() => setShowNotifs(false)}>Close</button>
                  </div>
                  {notifications.length === 0 ? (
                    <div className="empty-state">
                      <div className="empty-state-icon">🔔</div>
                      <p>No notifications right now.</p>
                    </div>
                  ) : (
                    notifications.map((n) => (
                      <div key={n.id} className="notif-item" onClick={() => markRead(n.id)}>
                        <p className="notif-item-title">{n.title}</p>
                        <p style={{ margin: '2px 0' }}>{n.message}</p>
                        <p className="notif-item-meta">{timeAgo(n.createdAt)}</p>
                      </div>
                    ))
                  )}
                </div>
              )}
            </div>
            <div style={{ fontSize: 14 }}>
              <strong>{user.fullName}</strong>
              <div className="text-muted" style={{ fontSize: 12 }}>{user.role}</div>
            </div>
          </div>
        </header>
        <main className="page-content">
          <Outlet />
        </main>
      </div>
    </div>
  );
}