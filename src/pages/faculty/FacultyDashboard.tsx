import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { api, getErrorMessage } from "../../services/client.ts";
import type { Trip, Booking } from '../../types';
import StatusBadge from '../../components/StatusBadge';
import { useNotifications } from '../../context/NotificationContext';

export default function FacultyDashboard() {
  const [upcoming, setUpcoming] = useState<Trip[]>([]);
  const [myBookings, setMyBookings] = useState<Booking[]>([]);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const { addNotification } = useNotifications();

  useEffect(() => {
    api.get('/trips/upcoming?limit=5')
      .then((res) => setUpcoming(res.data))
      .catch((err) => setError(getErrorMessage(err)));

    api.get('/faculty/bookings')
      .then((res) => {
        setMyBookings(res.data);
        // Dynamic notifications for resolved requests
        (res.data as Booking[]).forEach((b) => {
          if (b.Status === 'Approved' || b.Status === 'Rejected') {
            addNotification({
              title: `Special Trip Request ${b.Status}`,
              message: `Your request to ${b.Destination} on ${b.Trip_Date} was ${b.Status.toLowerCase()}.${b.Admin_Comments ? ' Note: ' + b.Admin_Comments : ''}`,
              type: b.Status === 'Approved' ? 'success' : 'danger',
            });
          }
        });
      })
      .catch((err) => setError(getErrorMessage(err)));
  }, [addNotification]);

  const nextBus = upcoming[0];
  const pendingCount = myBookings.filter((b) => b.Status === 'Pending').length;

  return (
    <div>
      <p className="text-muted" style={{ marginTop: -8 }}>Here's an overview of your transport activity</p>

      <div className="grid grid-cols-3" style={{ marginBottom: 20 }}>
        <div className="card">
          <div className="feature-icon" style={{ backgroundColor: 'var(--color-accent-light)', color: 'var(--color-accent)' }}>✅</div>
          <p className="card-value">{upcoming.length}</p>
          <p className="card-title">Upcoming Trips</p>
        </div>
        <div className="card">
          <div className="feature-icon" style={{ backgroundColor: '#f3e8ff', color: '#9333ea' }}>🚐</div>
          <p className="card-value">{myBookings.length}</p>
          <p className="card-title">My Special Requests</p>
        </div>
        <div className="card">
          <div className="feature-icon" style={{ backgroundColor: 'var(--color-warning-light)', color: 'var(--color-warning)' }}>⏳</div>
          <p className="card-value">{pendingCount}</p>
          <p className="card-title">Pending Approvals</p>
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
          </div>
        ) : (
          <div className="empty-state">
            <div className="empty-state-icon">🚌</div>
            <p>No upcoming trips scheduled right now.</p>
          </div>
        )}
      </div>

      <div className="grid grid-cols-4">
        <button className="btn btn-primary" onClick={() => navigate('/faculty/track-bus')} style={{ padding: 16 }}>
          📍 Track Bus Live
        </button>
        <button className="btn btn-outline" onClick={() => navigate('/faculty/schedules')} style={{ padding: 16 }}>
          📅 View Schedule
        </button>
        <button className="btn btn-outline" onClick={() => navigate('/faculty/special-trip-request')} style={{ padding: 16 }}>
          🚐 Special Trip Request
        </button>
        <button className="btn btn-outline" onClick={() => navigate('/faculty/notifications')} style={{ padding: 16 }}>
          🔔 Notifications
        </button>
      </div>
    </div>
  );
}
