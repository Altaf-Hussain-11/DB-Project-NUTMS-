import { useEffect, useState } from 'react';
import { api, getErrorMessage } from "../../services/client.ts";
import type { Schedule, RouteItem } from '../../types';
import Modal from '../../components/Modal';

const DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

const EMPTY_SCHEDULE = {
  departureFrom: '', destination: '', departureTime: '', daysOfWeek: [] as string[],
  effectiveFrom: '', routeId: '',
};

function toggleDay(days: string[], day: string): string[] {
  return days.includes(day) ? days.filter((d) => d !== day) : [...days, day];
}

function DaySelector({ days, onChange }: { days: string[]; onChange: (days: string[]) => void }) {
  return (
    <div className="flex gap-8" style={{ flexWrap: 'wrap' }}>
      {DAYS.map((d) => (
        <div
          key={d}
          className={`role-option${days.includes(d) ? ' active' : ''}`}
          style={{ minWidth: 50, padding: '6px 4px' }}
          onClick={() => onChange(toggleDay(days, d))}
        >
          {d}
        </div>
      ))}
    </div>
  );
}

export default function ManageSchedulesPage() {
  const [schedules, setSchedules] = useState<Schedule[]>([]);
  const [routes, setRoutes] = useState<RouteItem[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [showAdd, setShowAdd] = useState(false);
  const [form, setForm] = useState(EMPTY_SCHEDULE);
  const [submitting, setSubmitting] = useState(false);
  const [editSchedule, setEditSchedule] = useState<Schedule | null>(null);
  const [editForm, setEditForm] = useState(EMPTY_SCHEDULE);
  const [deleteSchedule, setDeleteSchedule] = useState<Schedule | null>(null);

  function loadData() {
    api.get('/schedules').then((res) => setSchedules(res.data)).catch((err) => setError(getErrorMessage(err)));
    api.get('/routes').then((res) => setRoutes(res.data)).catch((err) => setError(getErrorMessage(err)));
  }

  useEffect(() => { loadData(); }, []);

  function clearMessages() { setError(null); setSuccess(null); }

  async function handleAdd(e: React.FormEvent) {
    e.preventDefault();
    clearMessages();
    if (form.daysOfWeek.length === 0) { setError('Select at least one day.'); return; }
    setSubmitting(true);
    try {
      await api.post('/admin/schedules', { ...form, daysOfWeek: form.daysOfWeek.join(','), routeId: Number(form.routeId) });
      setSuccess('Schedule added successfully.');
      setShowAdd(false);
      setForm(EMPTY_SCHEDULE);
      loadData();
    } catch (err) { setError(getErrorMessage(err)); }
    finally { setSubmitting(false); }
  }

  function openEdit(schedule: Schedule) {
    clearMessages();
    setEditSchedule(schedule);
    setEditForm({
      departureFrom: schedule.Departure_from,
      destination: schedule.Destination,
      departureTime: schedule.Departure_Time,
      daysOfWeek: schedule.Days_Of_Week.split(','),
      effectiveFrom: schedule.Effective_From,
      routeId: String(schedule.Route_ID),
    });
  }

  async function handleEdit(e: React.FormEvent) {
    e.preventDefault();
    if (!editSchedule) return;
    clearMessages();
    if (editForm.daysOfWeek.length === 0) { setError('Select at least one day.'); return; }
    setSubmitting(true);
    try {
      await api.put(`/admin/schedules/${editSchedule.Schedule_ID}`, { ...editForm, daysOfWeek: editForm.daysOfWeek.join(','), routeId: Number(editForm.routeId) });
      setSuccess('Schedule updated successfully.');
      setEditSchedule(null);
      loadData();
    } catch (err) { setError(getErrorMessage(err)); }
    finally { setSubmitting(false); }
  }

  async function handleDelete() {
    if (!deleteSchedule) return;
    clearMessages();
    try {
      await api.delete(`/admin/schedules/${deleteSchedule.Schedule_ID}`);
      setSuccess('Schedule deleted.');
      setDeleteSchedule(null);
      loadData();
    } catch (err) { setError(getErrorMessage(err)); }
  }

  return (
    <div>
      <div className="section-header">
        <h2>Manage Schedules</h2>
        <button className="btn btn-primary" onClick={() => { clearMessages(); setShowAdd(true); }}>+ Add New Schedule</button>
      </div>

      {error && <div className="alert alert-error">{error}</div>}
      {success && <div className="alert alert-success">{success}</div>}

      <div className="card table-wrap">
        <table>
          <thead>
            <tr><th>ID</th><th>Route</th><th>From</th><th>To</th><th>Departure</th><th>Days</th><th>Effective From</th><th>Actions</th></tr>
          </thead>
          <tbody>
            {schedules.map((s) => (
              <tr key={s.Schedule_ID}>
                <td>{s.Schedule_ID}</td>
                <td>{s.Route_Name}</td>
                <td>{s.Departure_from}</td>
                <td>{s.Destination}</td>
                <td>{s.Departure_Time}</td>
                <td>{s.Days_Of_Week}</td>
                <td>{s.Effective_From}</td>
                <td>
                  <div className="flex gap-8">
                    <button className="btn btn-outline btn-sm" onClick={() => openEdit(s)}>Edit</button>
                    <button className="btn btn-danger btn-sm" onClick={() => { clearMessages(); setDeleteSchedule(s); }}>Delete</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showAdd && (
        <Modal title="Add New Schedule" onClose={() => setShowAdd(false)}>
          <form onSubmit={handleAdd}>
            <div className="form-group">
              <label>Route</label>
              <select className="form-control" value={form.routeId} onChange={(e) => setForm({ ...form, routeId: e.target.value })} required>
                <option value="">Select a route...</option>
                {routes.map((r) => <option key={r.Route_ID} value={r.Route_ID}>{r.Route_Name}</option>)}
              </select>
            </div>
            <div className="form-row">
              <div className="form-group">
                <label>Departure From</label>
                <input className="form-control" value={form.departureFrom} onChange={(e) => setForm({ ...form, departureFrom: e.target.value })} required />
              </div>
              <div className="form-group">
                <label>Destination</label>
                <input className="form-control" value={form.destination} onChange={(e) => setForm({ ...form, destination: e.target.value })} required />
              </div>
            </div>
            <div className="form-row">
              <div className="form-group">
                <label>Departure Time</label>
                <input type="time" className="form-control" value={form.departureTime} onChange={(e) => setForm({ ...form, departureTime: e.target.value })} required />
              </div>
              <div className="form-group">
                <label>Effective From</label>
                <input type="date" className="form-control" value={form.effectiveFrom} onChange={(e) => setForm({ ...form, effectiveFrom: e.target.value })} required />
              </div>
            </div>
            <div className="form-group">
              <label>Days of Week</label>
              <DaySelector days={form.daysOfWeek} onChange={(days) => setForm({ ...form, daysOfWeek: days })} />
            </div>
            <div className="modal-actions">
              <button type="button" className="btn btn-outline" onClick={() => setShowAdd(false)}>Cancel</button>
              <button type="submit" className="btn btn-primary" disabled={submitting}>{submitting ? 'Saving...' : 'Add Schedule'}</button>
            </div>
          </form>
        </Modal>
      )}

      {editSchedule && (
        <Modal title={`Edit Schedule #${editSchedule.Schedule_ID}`} onClose={() => setEditSchedule(null)}>
          <form onSubmit={handleEdit}>
            <div className="form-group">
              <label>Route</label>
              <select className="form-control" value={editForm.routeId} onChange={(e) => setEditForm({ ...editForm, routeId: e.target.value })} required>
                {routes.map((r) => <option key={r.Route_ID} value={r.Route_ID}>{r.Route_Name}</option>)}
              </select>
            </div>
            <div className="form-row">
              <div className="form-group">
                <label>Departure From</label>
                <input className="form-control" value={editForm.departureFrom} onChange={(e) => setEditForm({ ...editForm, departureFrom: e.target.value })} required />
              </div>
              <div className="form-group">
                <label>Destination</label>
                <input className="form-control" value={editForm.destination} onChange={(e) => setEditForm({ ...editForm, destination: e.target.value })} required />
              </div>
            </div>
            <div className="form-group">
              <label>Departure Time</label>
              <input type="time" className="form-control" value={editForm.departureTime} onChange={(e) => setEditForm({ ...editForm, departureTime: e.target.value })} required />
            </div>
            <div className="form-group">
              <label>Days of Week</label>
              <DaySelector days={editForm.daysOfWeek} onChange={(days) => setEditForm({ ...editForm, daysOfWeek: days })} />
            </div>
            <div className="modal-actions">
              <button type="button" className="btn btn-outline" onClick={() => setEditSchedule(null)}>Cancel</button>
              <button type="submit" className="btn btn-primary" disabled={submitting}>{submitting ? 'Saving...' : 'Save Changes'}</button>
            </div>
          </form>
        </Modal>
      )}

      {deleteSchedule && (
        <Modal title="Confirm Deletion" onClose={() => setDeleteSchedule(null)} footer={
          <><button className="btn btn-outline" onClick={() => setDeleteSchedule(null)}>Cancel</button>
          <button className="btn btn-danger" onClick={handleDelete}>Delete</button></>
        }>
          <p>Delete schedule #{deleteSchedule.Schedule_ID}?</p>
        </Modal>
      )}
    </div>
  );
}