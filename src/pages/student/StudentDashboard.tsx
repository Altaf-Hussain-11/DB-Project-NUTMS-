import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { api, getErrorMessage } from "../../services/client.ts";
import type { Trip } from '../../types';
import StatusBadge from '../../components/StatusBadge';
import { useNotifications } from '../../context/NotificationContext';

export default function StudentDashboard() {
  const [upcoming, setUpcoming] = useState<Trip[]>([]);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const { addNotification } = useNotifications();

  useEffect(() => {
    api.get('/trips/upcoming?limit=5')
      .then((res) => {
        setUpcoming(res.data);
        // Generate a dynamic "next bus" notification
        if (res.data.length > 0) {
          const next = res.data[0];
          addNotification({
            title: 'Upcoming Bus',
            message: `${next.Route_Name} departs at ${next.Scheduled_Time} from ${next.Departure_from}.`,
            type: 'info',
          });
        }
      })
      .catch((err) => setError(getErrorMessage(err)));
  }, [addNotification]);

  const nextBus = upcoming[0];
  const totalTripsThisMonth = upcoming.length; // illustrative metric from upcoming trips
  const favoriteRoutesCount = new Set(upcoming.map((t) => t.Route_Name)).size;

  return (
    <div>
      <p className="text-muted" style={{ marginTop: -8 }}>Here's an overview of your transport activity</p>

      <div className="grid grid-cols-3" style={{ marginBottom: 20 }}>
        <div className="card">
          <div className="feature-icon" style={{ backgroundColor: 'var(--color-accent-light)', color: 'var(--color-accent)' }}>✅</div>
          <p className="card-value">{totalTripsThisMonth}</p>
          <p className="card-title">Upcoming Trips</p>
        </div>
        <div className="card">
          <div className="feature-icon" style={{ backgroundColor: '#fdf2e9', color: '#d97706' }}>📍</div>
          <p className="card-value">{favoriteRoutesCount}</p>
          <p className="card-title">Active Routes</p>
        </div>
        <div className="card">
          <div className="feature-icon" style={{ backgroundColor: 'var(--color-primary-light)', color: 'var(--color-primary-dark)' }}>🔔</div>
          <p className="card-value">{upcoming.length}</p>
          <p className="card-title">New Notifications</p>
        </div>
      </div>

      {error && <div className="alert alert-error">{error}</div>}

      <div className="card" style={{ marginBottom: 20 }}>
        <h3 style={{ marginTop: 0 }}>Next Bus Arrival</h3>
        {nextBus ? (
          <div style={{ backgroundColor: 'var(--color-accent-light)', borderRadius: 'var(--radius-md)', padding: 16 }}>
            <div className="flex-between">
              <strong>{nextBus.Route_Name}</strong>
              <StatusBadge status={nextBus.Trip_Status === 'In Progress' ? 'On Time' : nextBus.Trip_Status} />
            </div>
            <p style={{ margin: '8px 0 4px' }}>📍 {nextBus.Departure_from} → {nextBus.Destination}</p>
            <p style={{ margin: 0 }}>🕒 Scheduled: {nextBus.Scheduled_Time}</p>
            <div style={{ backgroundColor: '#ffffff', borderRadius: 'var(--radius-md)', padding: 12, marginTop: 12 }}>
              <p className="text-muted" style={{ margin: 0, fontSize: 12 }}>Estimated Arrival</p>
              <p style={{ margin: 0, fontSize: 22, fontWeight: 700, color: 'var(--color-accent)' }}>15 minutes</p>
            </div>
          </div>
        ) : (
          <div className="empty-state">
            <div className="empty-state-icon">🚌</div>
            <p>No upcoming trips scheduled right now.</p>
          </div>
        )}
      </div>

      <div className="grid grid-cols-3">
        <button className="btn btn-primary" onClick={() => navigate('/student/track-bus')} style={{ padding: 16 }}>
          📍 Track Bus Live
        </button>
        <button className="btn btn-outline" onClick={() => navigate('/student/schedules')} style={{ padding: 16 }}>
          📅 View Schedule
        </button>
        <button className="btn btn-outline" onClick={() => navigate('/student/notifications')} style={{ padding: 16 }}>
          🔔 Notifications
        </button>
      </div>
    </div>
  );
}
