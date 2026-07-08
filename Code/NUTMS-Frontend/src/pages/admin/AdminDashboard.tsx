import { useEffect, useState } from 'react';
import { api, getErrorMessage } from "../../services/client";
import type { AdminDashboardSummary, Booking, Trip } from '../../types';


export default function AdminDashboard() {
  const [summary, setSummary] = useState<AdminDashboardSummary | null>(null);
  const [pendingBookings, setPendingBookings] = useState<Booking[]>([]);
  const [activeTrips, setActiveTrips] = useState<Trip[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    api.get('/admin/dashboard').then((res) => setSummary(res.data)).catch((err) => setError(getErrorMessage(err)));
    api.get('/admin/bookings?status=Pending').then((res) => setPendingBookings(res.data)).catch((err) => setError(getErrorMessage(err)));
    api.get('/trips/active-fleet').then((res) => setActiveTrips(res.data)).catch((err) => setError(getErrorMessage(err)));
  }, []);

  return (
    <div>
      <p className="text-muted" style={{ marginTop: -8 }}>Overview of transport operations</p>

      {error && <div className="alert alert-error">{error}</div>}

      <div className="grid grid-cols-4" style={{ marginBottom: 20 }}>
        <div className="card">
          <div className="feature-icon" style={{ backgroundColor: 'var(--color-primary-light)', color: 'var(--color-primary-dark)' }}>👥</div>
          <p className="card-value">{summary?.Total_Users ?? '—'}</p>
          <p className="card-title">Total Users</p>
        </div>
        <div className="card">
          <div className="feature-icon" style={{ backgroundColor: 'var(--color-accent-light)', color: 'var(--color-accent)' }}>🚌</div>
          <p className="card-value">{summary?.Active_Vehicles ?? '—'}</p>
          <p className="card-title">Active Buses</p>
        </div>
        <div className="card">
          <div className="feature-icon" style={{ backgroundColor: '#fdf2e9', color: '#d97706' }}>📅</div>
          <p className="card-value">{summary?.Trips_Today ?? '—'}</p>
          <p className="card-title">Trips Today</p>
        </div>
        <div className="card">
          <div className="feature-icon" style={{ backgroundColor: 'var(--color-warning-light)', color: 'var(--color-warning)' }}>⏳</div>
          <p className="card-value">{summary?.Pending_Requests ?? '—'}</p>
          <p className="card-title">Pending Requests</p>
        </div>
      </div>

      <div className="grid grid-cols-2">
        <div className="card">
          <h3 style={{ marginTop: 0 }}>Pending Special Trip Requests</h3>
          {pendingBookings.length === 0 ? (
            <div className="empty-state">
              <div className="empty-state-icon">✅</div>
              <p>No pending requests.</p>
            </div>
          ) : (
            <div className="table-wrap">
              <table>
                <thead>
                  <tr><th>Destination</th><th>Date</th><th>Requested By</th><th>Passengers</th></tr>
                </thead>
                <tbody>
                  {pendingBookings.slice(0, 5).map((b) => (
                    <tr key={b.Booking_ID}>
                      <td>{b.Destination}</td>
                      <td>{b.Trip_Date}</td>
                      <td>{b.Requested_By}</td>
                      <td>{b.Passenger_Count}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        <div className="card">
          <h3 style={{ marginTop: 0 }}>Active Trips (Live)</h3>
          {activeTrips.length === 0 ? (
            <div className="empty-state">
              <div className="empty-state-icon">🚌</div>
              <p>No trips currently in progress.</p>
            </div>
          ) : (
            <div className="table-wrap">
              <table>
                <thead>
                  <tr><th>Trip</th><th>From → To</th><th>Vehicle</th><th>GPS Device</th></tr>
                </thead>
                <tbody>
                  {activeTrips.map((t) => (
                    <tr key={t.Trip_ID}>
                      <td>#{t.Trip_ID}</td>
                      <td>{t.Departure_from} → {t.Destination}</td>
                      <td>{t.Registration_Plate}</td>
                      <td>{t.GPS_Device_ID || '—'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
