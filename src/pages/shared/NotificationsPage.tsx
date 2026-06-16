import { useNotifications } from '../../context/NotificationContext';

function timeAgo(ts: number) {
  const diffMin = Math.floor((Date.now() - ts) / 60000);
  if (diffMin < 1) return 'just now';
  if (diffMin < 60) return `${diffMin} minute${diffMin === 1 ? '' : 's'} ago`;
  const diffHr = Math.floor(diffMin / 60);
  return `${diffHr} hour${diffHr === 1 ? '' : 's'} ago`;
}

const TYPE_COLORS: Record<string, string> = {
  info: 'badge-primary',
  success: 'badge-success',
  warning: 'badge-warning',
  danger: 'badge-danger',
};

export default function NotificationsPage() {
  const { notifications, markRead, markAllRead } = useNotifications();

  return (
    <div>
      <div className="section-header">
        <h2>Notifications</h2>
        {notifications.length > 0 && (
          <button className="btn btn-outline btn-sm" onClick={markAllRead}>Mark all as read</button>
        )}
      </div>

      <p className="text-muted" style={{ marginTop: -8, marginBottom: 16, fontSize: 13 }}>
        Notifications are generated in real time and are not stored permanently — read notifications
        are automatically cleared after 24 hours.
      </p>

      {notifications.length === 0 ? (
        <div className="card empty-state">
          <div className="empty-state-icon">🔔</div>
          <p>You're all caught up! No new notifications.</p>
        </div>
      ) : (
        <div className="card" style={{ padding: 0 }}>
          {notifications.map((n) => (
            <div
              key={n.id}
              className="notif-item"
              style={{ cursor: 'pointer', backgroundColor: n.read ? 'transparent' : 'var(--color-primary-light)' }}
              onClick={() => markRead(n.id)}
            >
              <div className="flex-between">
                <p className="notif-item-title">{n.title}</p>
                <span className={`badge ${TYPE_COLORS[n.type]}`}>{n.type}</span>
              </div>
              <p style={{ margin: '4px 0' }}>{n.message}</p>
              <p className="notif-item-meta">{timeAgo(n.createdAt)}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
