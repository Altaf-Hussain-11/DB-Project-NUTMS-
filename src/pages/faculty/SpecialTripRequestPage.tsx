import React, { useEffect, useState } from 'react';
import { api, getErrorMessage } from "../../services/client.ts";
import type { Booking, BookingPassenger } from '../../types';
import StatusBadge from '../../components/StatusBadge';
import Modal from '../../components/Modal';

interface PassengerInput {
  name: string;
  designation: string;
}

export default function SpecialTripRequestPage() {
  const [destination, setDestination] = useState('');
  const [tripDate, setTripDate] = useState('');
  const [departureTime, setDepartureTime] = useState('');
  const [purpose, setPurpose] = useState('');
  const [passengerCount, setPassengerCount] = useState<number>(1);
  const [passengers, setPassengers] = useState<PassengerInput[]>([{ name: '', designation: '' }]);

  const [myBookings, setMyBookings] = useState<Booking[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const [viewBooking, setViewBooking] = useState<Booking | null>(null);
  const [viewPassengers, setViewPassengers] = useState<BookingPassenger[]>([]);

  function loadBookings() {
    api.get('/faculty/bookings')
      .then((res) => setMyBookings(res.data))
      .catch((err) => setError(getErrorMessage(err)));
  }

  useEffect(() => {
    loadBookings();
  }, []);

  function handlePassengerCountChange(value: number) {
    const count = Math.max(1, Math.min(50, value || 1));
    setPassengerCount(count);
    setPassengers((prev) => {
      const next = [...prev];
      while (next.length < count) next.push({ name: '', designation: '' });
      while (next.length > count) next.pop();
      return next;
    });
  }

  function updatePassenger(index: number, field: keyof PassengerInput, value: string) {
    setPassengers((prev) => {
      const next = [...prev];
      next[index] = { ...next[index], [field]: value };
      return next;
    });
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    if (passengers.some((p) => !p.name.trim() || !p.designation.trim())) {
      setError('Please provide a name and designation for every passenger.');
      return;
    }

    setSubmitting(true);
    try {
      await api.post('/faculty/bookings', {
        destination,
        tripDate,
        departureTime,
        purpose,
        passengerCount,
        passengers,
      });
      setSuccess('Special trip request submitted successfully. Awaiting admin approval.');
      // Reset form
      setDestination('');
      setTripDate('');
      setDepartureTime('');
      setPurpose('');
      setPassengerCount(1);
      setPassengers([{ name: '', designation: '' }]);
      loadBookings();
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setSubmitting(false);
    }
  }

  async function openPassengers(booking: Booking) {
    setViewBooking(booking);
    try {
      const res = await api.get(`/faculty/bookings/${booking.Booking_ID}/passengers`);
      setViewPassengers(res.data);
    } catch (err) {
      setError(getErrorMessage(err));
    }
  }

  return (
    <div>
      <h2>Special Trip Request</h2>
      <p className="text-muted" style={{ marginTop: -8 }}>
        Submit a request for a special vehicle for an off-schedule trip. All requests require administrator approval.
      </p>

      {error && <div className="alert alert-error">{error}</div>}
      {success && <div className="alert alert-success">{success}</div>}

      <div className="card" style={{ marginBottom: 24 }}>
        <h3 style={{ marginTop: 0 }}>New Request</h3>
        <form onSubmit={handleSubmit}>
          <div className="form-row">
            <div className="form-group">
              <label>Destination</label>
              <input className="form-control" value={destination} onChange={(e) => setDestination(e.target.value)} required />
            </div>
            <div className="form-group">
              <label>Trip Date</label>
              <input type="date" className="form-control" value={tripDate} onChange={(e) => setTripDate(e.target.value)} required />
            </div>
          </div>
          <div className="form-row">
            <div className="form-group">
              <label>Departure Time</label>
              <input type="time" className="form-control" value={departureTime} onChange={(e) => setDepartureTime(e.target.value)} required />
            </div>
            <div className="form-group">
              <label>Number of Passengers</label>
              <input
                type="number"
                min={1}
                max={50}
                className="form-control"
                value={passengerCount}
                onChange={(e) => handlePassengerCountChange(Number(e.target.value))}
                required
              />
            </div>
          </div>
          <div className="form-group">
            <label>Purpose</label>
            <textarea className="form-control" rows={3} value={purpose} onChange={(e) => setPurpose(e.target.value)} required />
          </div>

          <h4>Passenger Details</h4>
          <p className="text-muted" style={{ marginTop: -8, fontSize: 13 }}>
            Enter the name and designation of each passenger travelling on this trip.
          </p>
          {passengers.map((p, idx) => (
            <div className="passenger-row" key={idx}>
              <div className="form-group" style={{ marginBottom: 0 }}>
                <label>Passenger {idx + 1} Name</label>
                <input
                  className="form-control"
                  value={p.name}
                  onChange={(e) => updatePassenger(idx, 'name', e.target.value)}
                  required
                />
              </div>
              <div className="form-group" style={{ marginBottom: 0 }}>
                <label>Designation</label>
                <input
                  className="form-control"
                  value={p.designation}
                  onChange={(e) => updatePassenger(idx, 'designation', e.target.value)}
                  placeholder="e.g. Lecturer, Research Assistant"
                  required
                />
              </div>
            </div>
          ))}

          <button type="submit" className="btn btn-primary" disabled={submitting} style={{ marginTop: 8 }}>
            {submitting ? 'Submitting...' : 'Submit Request'}
          </button>
        </form>
      </div>

      <h3>My Requests</h3>
      {myBookings.length === 0 ? (
        <div className="card empty-state">
          <div className="empty-state-icon">📝</div>
          <p>You haven't submitted any special trip requests yet.</p>
        </div>
      ) : (
        <div className="card table-wrap">
          <table>
            <thead>
              <tr>
                <th>Destination</th>
                <th>Trip Date</th>
                <th>Departure</th>
                <th>Passengers</th>
                <th>Status</th>
                <th>Admin Comments</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {myBookings.map((b) => (
                <tr key={b.Booking_ID}>
                  <td>{b.Destination}</td>
                  <td>{b.Trip_Date}</td>
                  <td>{b.Departure_Time}</td>
                  <td>{b.Passenger_Count}</td>
                  <td><StatusBadge status={b.Status} /></td>
                  <td>{b.Admin_Comments || '—'}</td>
                  <td>
                    <button className="btn btn-outline btn-sm" onClick={() => openPassengers(b)}>View Passengers</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {viewBooking && (
        <Modal title={`Passengers - ${viewBooking.Destination}`} onClose={() => setViewBooking(null)} footer={
          <button className="btn btn-outline" onClick={() => setViewBooking(null)}>Close</button>
        }>
          <p className="text-muted">Trip Date: {viewBooking.Trip_Date} • Status: <StatusBadge status={viewBooking.Status} /></p>
          <div className="table-wrap">
            <table>
              <thead>
                <tr><th>#</th><th>Name</th><th>Designation</th></tr>
              </thead>
              <tbody>
                {viewPassengers.map((p, idx) => (
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
    </div>
  );
}
