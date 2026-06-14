import React, { useEffect, useState } from 'react';
import { api, getErrorMessage } from "../../services/client.ts";
import type { Booking, BookingPassenger, BookingStatus } from '../../types';
import StatusBadge from '../../components/StatusBadge';
import Modal from '../../components/Modal';

type StatusFilter = 'All' | BookingStatus;

export default function SpecialRequestsPage() {
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('Pending');
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const [detailBooking, setDetailBooking] = useState<Booking | null>(null);
  const [passengers, setPassengers] = useState<BookingPassenger[]>([]);

  const [rejectBooking, setRejectBooking] = useState<Booking | null>(null);
  const [rejectReason, setRejectReason] = useState('');

  function loadBookings() {
    api.get(`/admin/bookings?status=${statusFilter}`)
      .then((res) => setBookings(res.data))
      .catch((err) => setError(getErrorMessage(err)));
  }

  useEffect(() => {
  api.get(`/admin/bookings?status=${statusFilter}`)
    .then((res) => setBookings(res.data))
    .catch((err) => setError(getErrorMessage(err)));
}, [statusFilter]);

  function clearMessages() {
    setError(null);
    setSuccess(null);
  }

  async function openDetails(b: Booking) {
    setDetailBooking(b);
    try {
      const res = await api.get(`/admin/bookings/${b.Booking_ID}/passengers`);
      setPassengers(res.data);
    } catch (err) {
      setError(getErrorMessage(err));
    }
  }

  async function handleApprove(b: Booking) {
    clearMessages();
    try {
      await api.put(`/admin/bookings/${b.Booking_ID}/resolve`, { status: 'Approved', comments: 'Request approved.' });
      setSuccess(`Request #${b.Booking_ID} approved.`);
      loadBookings();
    } catch (err) {
      setError(getErrorMessage(err));
    }
  }

  async function handleReject(e: React.FormEvent) {
    e.preventDefault();
    if (!rejectBooking) return;
    clearMessages();
    try {
      await api.put(`/admin/bookings/${rejectBooking.Booking_ID}/resolve`, { status: 'Rejected', comments: rejectReason });
      setSuccess(`Request #${rejectBooking.Booking_ID} rejected.`);
      setRejectBooking(null);
      setRejectReason('');
      loadBookings();
    } catch (err) {
      setError(getErrorMessage(err));
    }
  }

  return (
    <div>
      <div className="section-header">
        <h2>Special Trip Requests</h2>
        <select className="form-control" style={{ width: 180 }} value={statusFilter} onChange={(e) => setStatusFilter(e.target.value as StatusFilter)}>
          <option value="All">All</option>
          <option value="Pending">Pending</option>
          <option value="Approved">Approved</option>
          <option value="Rejected">Rejected</option>
        </select>
      </div>

      {error && <div className="alert alert-error">{error}</div>}
      {success && <div className="alert alert-success">{success}</div>}

      {bookings.length === 0 ? (
        <div className="card empty-state">
          <div className="empty-state-icon">📝</div>
          <p>No requests found for this filter.</p>
        </div>
      ) : (
        <div className="card table-wrap">
          <table>
            <thead>
              <tr>
                <th>ID</th><th>Faculty</th><th>Department</th><th>Destination</th><th>Trip Date</th><th>Passengers</th><th>Status</th><th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {bookings.map((b) => (
                <tr key={b.Booking_ID}>
                  <td>#{b.Booking_ID}</td>
                  <td>{b.Requested_By}</td>
                  <td>{b.department}</td>
                  <td>{b.Destination}</td>
                  <td>{b.Trip_Date} {b.Departure_Time}</td>
                  <td>{b.Passenger_Count}</td>
                  <td><StatusBadge status={b.Status} /></td>
                  <td>
                    <div className="flex gap-8" style={{ flexWrap: 'wrap' }}>
                      <button className="btn btn-outline btn-sm" onClick={() => openDetails(b)}>Details</button>
                      {b.Status === 'Pending' && (
                        <>
                          <button className="btn btn-primary btn-sm" onClick={() => handleApprove(b)}>Approve</button>
                          <button className="btn btn-danger btn-sm" onClick={() => { clearMessages(); setRejectBooking(b); }}>Reject</button>
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Detail / Passenger List Modal */}
      {detailBooking && (
        <Modal title={`Request #${detailBooking.Booking_ID} - ${detailBooking.Destination}`} onClose={() => setDetailBooking(null)} footer={
          <button className="btn btn-outline" onClick={() => setDetailBooking(null)}>Close</button>
        }>
          <p><strong>Requested by:</strong> {detailBooking.Requested_By} ({detailBooking.department})</p>
          <p><strong>Trip Date:</strong> {detailBooking.Trip_Date} at {detailBooking.Departure_Time}</p>
          <p><strong>Purpose:</strong> {detailBooking.Purpose}</p>
          <p><strong>Status:</strong> <StatusBadge status={detailBooking.Status} /></p>
          {detailBooking.Admin_Comments && <p><strong>Admin Comments:</strong> {detailBooking.Admin_Comments}</p>}

          <h4>Passengers ({detailBooking.Passenger_Count})</h4>
          <div className="table-wrap">
            <table>
              <thead><tr><th>#</th><th>Name</th><th>Designation</th></tr></thead>
              <tbody>
                {passengers.map((p, idx) => (
                  <tr key={p.Passenger_ID}>
                    <td>{idx + 1}</td>
                    <td>{p.Passenger_Name}</td>
                    <td>{p.Designation}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Modal>
      )}

      {/* Reject Modal */}
      {rejectBooking && (
        <Modal title={`Reject Request #${rejectBooking.Booking_ID}`} onClose={() => setRejectBooking(null)}>
          <form onSubmit={handleReject}>
            <div className="form-group">
              <label>Reason for Rejection</label>
              <textarea className="form-control" rows={3} value={rejectReason} onChange={(e) => setRejectReason(e.target.value)} required />
            </div>
            <div className="modal-actions">
              <button type="button" className="btn btn-outline" onClick={() => setRejectBooking(null)}>Cancel</button>
              <button type="submit" className="btn btn-danger">Reject Request</button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
}
