import React, { useEffect, useState } from 'react';
import { api, getErrorMessage } from "../../services/client.ts";
import type { Trip, TripStop, TripStatus } from '../../types';
import StatusBadge from '../../components/StatusBadge';
import Modal from '../../components/Modal';
import { useNotifications } from '../../context/NotificationContext';

const NEXT_STATUS: Record<TripStatus, TripStatus | null> = {
  Scheduled: 'In Progress',
  'In Progress': 'Completed',
  Completed: null,
  Cancelled: null,
};

const ACTION_LABEL: Record<string, string> = {
  'In Progress': 'Start Trip',
  Completed: 'End Trip',
};

export default function DriverDashboard() {
  const [trips, setTrips] = useState<Trip[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const [detailsTrip, setDetailsTrip] = useState<Trip | null>(null);
  const [detailsStops, setDetailsStops] = useState<TripStop[]>([]);
  const [loadingDetails, setLoadingDetails] = useState(false);

  const [issueTrip, setIssueTrip] = useState<Trip | null>(null);
  const [issueNote, setIssueNote] = useState('');

  const { addNotification } = useNotifications();

  function loadTrips() {
    api.get('/driver/trips')
      .then((res) => setTrips(res.data))
      .catch((err) => setError(getErrorMessage(err)));
  }

  useEffect(() => {
    loadTrips();
  }, []);

  async function openDetails(trip: Trip) {
    setDetailsTrip(trip);
    setLoadingDetails(true);
    try {
      const res = await api.get(`/driver/trips/${trip.Trip_ID}`);
      setDetailsStops(res.data.stops || []);
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setLoadingDetails(false);
    }
  }

  async function updateStatus(trip: Trip, status: TripStatus) {
    setError(null);
    setSuccess(null);
    try {
      await api.put(`/driver/trips/${trip.Trip_ID}/status`, { status });
      setSuccess(`Trip #${trip.Trip_ID} marked as "${status}".`);
      addNotification({
        title: 'Trip Status Updated',
        message: `${trip.Route_Name} is now "${status}".`,
        type: status === 'Completed' ? 'success' : 'info',
      });
      loadTrips();
    } catch (err) {
      setError(getErrorMessage(err));
    }
  }

  async function submitIssue(e: React.FormEvent) {
    e.preventDefault();
    if (!issueTrip) return;
    try {
      await api.post(`/driver/trips/${issueTrip.Trip_ID}/report-issue`, { note: issueNote });
      addNotification({
        title: 'Issue Reported',
        message: `Issue for trip #${issueTrip.Trip_ID} sent to transport administration.`,
        type: 'warning',
      });
      setIssueTrip(null);
      setIssueNote('');
    } catch (err) {
      setError(getErrorMessage(err));
    }
  }

  const todayTrips = trips.filter((t) => t.Trip_Status !== 'Completed' && t.Trip_Status !== 'Cancelled');

  return (
    <div>
      <p className="text-muted" style={{ marginTop: -8 }}>Your assigned trips for today and upcoming days</p>

      {error && <div className="alert alert-error">{error}</div>}
      {success && <div className="alert alert-success">{success}</div>}

      <div className="grid grid-cols-3" style={{ marginBottom: 20 }}>
        <div className="card">
          <p className="card-title">Active Trips</p>
          <p className="card-value">{todayTrips.length}</p>
        </div>
        <div className="card">
          <p className="card-title">Total Assigned</p>
          <p className="card-value">{trips.length}</p>
        </div>
        <div className="card">
          <p className="card-title">Completed Today</p>
          <p className="card-value">{trips.filter((t) => t.Trip_Status === 'Completed').length}</p>
        </div>
      </div>

      <h3>Bus Trip Dashboard</h3>
      {trips.length === 0 ? (
        <div className="card empty-state">
          <div className="empty-state-icon">🚌</div>
          <p>No trips assigned to you right now.</p>
        </div>
      ) : (
        <div className="card table-wrap">
          <table>
            <thead>
              <tr>
                <th>Trip ID</th>
                <th>Date</th>
                <th>Route</th>
                <th>From → To</th>
                <th>Departure</th>
                <th>Vehicle</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {trips.map((t) => {
                const next = NEXT_STATUS[t.Trip_Status];
                return (
                  <tr key={t.Trip_ID}>
                    <td>#{t.Trip_ID}</td>
                    <td>{t.Trip_Date}</td>
                    <td>{t.Route_Name}</td>
                    <td>{t.Departure_from} → {t.Destination}</td>
                    <td>{t.Scheduled_Time}</td>
                    <td>{t.Registration_Plate}</td>
                    <td><StatusBadge status={t.Trip_Status} /></td>
                    <td>
                      <div className="flex gap-8">
                        <button className="btn btn-outline btn-sm" onClick={() => openDetails(t)}>View Details</button>
                        {next && (
                          <button className="btn btn-primary btn-sm" onClick={() => updateStatus(t, next)}>
                            {ACTION_LABEL[next] || `Mark ${next}`}
                          </button>
                        )}
                        {t.Trip_Status !== 'Completed' && t.Trip_Status !== 'Cancelled' && (
                          <button className="btn btn-danger btn-sm" onClick={() => setIssueTrip(t)}>Report Issue</button>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* View Details Modal */}
      {detailsTrip && (
        <Modal title={`Trip #${detailsTrip.Trip_ID} Details`} onClose={() => setDetailsTrip(null)} footer={
          <button className="btn btn-outline" onClick={() => setDetailsTrip(null)}>Close</button>
        }>
          {loadingDetails ? (
            <p>Loading details...</p>
          ) : (
            <>
              <p><strong>Route:</strong> {detailsTrip.Route_Name}</p>
              <p><strong>From:</strong> {detailsTrip.Departure_from} &nbsp; <strong>To:</strong> {detailsTrip.Destination}</p>
              <p><strong>Scheduled Departure:</strong> {detailsTrip.Scheduled_Time}</p>
              <p><strong>Vehicle:</strong> {detailsTrip.Registration_Plate} (Capacity: {detailsTrip.Seating_Capacity})</p>
              <p><strong>Distance:</strong> {detailsTrip.Total_Distance_km} km &nbsp; <strong>Est. Duration:</strong> {detailsTrip.Estimated_Duration_min} min</p>
              <p><strong>Status:</strong> <StatusBadge status={detailsTrip.Trip_Status} /></p>

              <h4>Stops</h4>
              {detailsStops.length === 0 ? (
                <p className="text-muted">No stop information available for this route.</p>
              ) : (
                <ol>
                  {detailsStops.map((s) => (
                    <li key={s.Sequence_Number}>{s.Stop_Name} — +{s.Arrival_Offset_min} min</li>
                  ))}
                </ol>
              )}
            </>
          )}
        </Modal>
      )}

      {/* Report Issue Modal */}
      {issueTrip && (
        <Modal title={`Report Issue - Trip #${issueTrip.Trip_ID}`} onClose={() => setIssueTrip(null)} footer={
          <>
            <button className="btn btn-outline" onClick={() => setIssueTrip(null)}>Cancel</button>
            <button className="btn btn-danger" onClick={submitIssue}>Submit Report</button>
          </>
        }>
          <form onSubmit={submitIssue}>
            <div className="form-group">
              <label>Describe the issue</label>
              <textarea
                className="form-control"
                rows={4}
                value={issueNote}
                onChange={(e) => setIssueNote(e.target.value)}
                placeholder="e.g. Vehicle breakdown, traffic delay, passenger emergency..."
                required
              />
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
}
