import React, { useEffect, useState } from 'react';
import { api, getErrorMessage } from "../../services/client.ts";
import type { RouteItem, Stop } from '../../types';
import Modal from '../../components/Modal';

const EMPTY_ROUTE = { startLocation: '', routeName: '', endLocation: '', distanceKm: '', durationMin: '' };

export default function ManageRoutesPage() {
  const [routes, setRoutes] = useState<RouteItem[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const [showAdd, setShowAdd] = useState(false);
  const [form, setForm] = useState(EMPTY_ROUTE);
  const [submitting, setSubmitting] = useState(false);

  const [editRoute, setEditRoute] = useState<RouteItem | null>(null);
  const [editForm, setEditForm] = useState(EMPTY_ROUTE);

  const [deleteRoute, setDeleteRoute] = useState<RouteItem | null>(null);

  const [stopsRoute, setStopsRoute] = useState<RouteItem | null>(null);
  const [stops, setStops] = useState<Stop[]>([]);

  function loadRoutes() {
    api.get('/routes').then((res) => setRoutes(res.data)).catch((err) => setError(getErrorMessage(err)));
  }

  useEffect(() => { loadRoutes(); }, []);

  function clearMessages() {
    setError(null);
    setSuccess(null);
  }

  async function handleAdd(e: React.FormEvent) {
    e.preventDefault();
    clearMessages();
    setSubmitting(true);
    try {
      await api.post('/admin/routes', {
        ...form,
        distanceKm: Number(form.distanceKm),
        durationMin: Number(form.durationMin),
      });
      setSuccess('Route added successfully.');
      setShowAdd(false);
      setForm(EMPTY_ROUTE);
      loadRoutes();
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setSubmitting(false);
    }
  }

  function openEdit(route: RouteItem) {
    clearMessages();
    setEditRoute(route);
    setEditForm({
      startLocation: route.Start_Location,
      routeName: route.Route_Name,
      endLocation: route.End_Location,
      distanceKm: String(route.Total_Distance_km),
      durationMin: String(route.Estimated_Duration_min),
    });
  }

  async function handleEdit(e: React.FormEvent) {
    e.preventDefault();
    if (!editRoute) return;
    clearMessages();
    setSubmitting(true);
    try {
      await api.put(`/admin/routes/${editRoute.Route_ID}`, {
        ...editForm,
        distanceKm: Number(editForm.distanceKm),
        durationMin: Number(editForm.durationMin),
      });
      setSuccess('Route updated successfully.');
      setEditRoute(null);
      loadRoutes();
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setSubmitting(false);
    }
  }

  async function handleDelete() {
    if (!deleteRoute) return;
    clearMessages();
    try {
      await api.delete(`/admin/routes/${deleteRoute.Route_ID}`);
      setSuccess('Route deleted successfully.');
      setDeleteRoute(null);
      loadRoutes();
    } catch (err) {
      setError(getErrorMessage(err));
    }
  }

  async function openStops(route: RouteItem) {
    setStopsRoute(route);
    try {
      const res = await api.get(`/routes/${route.Route_ID}/stops`);
      setStops(res.data);
    } catch (err) {
      setError(getErrorMessage(err));
    }
  }

  return (
    <div>
      <div className="section-header">
        <h2>Manage Routes</h2>
        <button className="btn btn-primary" onClick={() => { clearMessages(); setShowAdd(true); }}>+ Add New Route</button>
      </div>

      {error && <div className="alert alert-error">{error}</div>}
      {success && <div className="alert alert-success">{success}</div>}

      <div className="card table-wrap">
        <table>
          <thead>
            <tr>
              <th>ID</th><th>Route Name</th><th>Start</th><th>End</th><th>Distance (km)</th><th>Duration (min)</th><th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {routes.map((r) => (
              <tr key={r.Route_ID}>
                <td>{r.Route_ID}</td>
                <td>{r.Route_Name}</td>
                <td>{r.Start_Location}</td>
                <td>{r.End_Location}</td>
                <td>{r.Total_Distance_km}</td>
                <td>{r.Estimated_Duration_min}</td>
                <td>
                  <div className="flex gap-8">
                    <button className="btn btn-outline btn-sm" onClick={() => openStops(r)}>Stops</button>
                    <button className="btn btn-outline btn-sm" onClick={() => openEdit(r)}>Edit</button>
                    <button className="btn btn-danger btn-sm" onClick={() => { clearMessages(); setDeleteRoute(r); }}>Delete</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Add Route Modal */}
      {showAdd && (
        <Modal title="Add New Route" onClose={() => setShowAdd(false)}>
          <form onSubmit={handleAdd}>
            <div className="form-group">
              <label>Route Name</label>
              <input className="form-control" value={form.routeName} onChange={(e) => setForm({ ...form, routeName: e.target.value })} required />
            </div>
            <div className="form-row">
              <div className="form-group">
                <label>Start Location</label>
                <input className="form-control" value={form.startLocation} onChange={(e) => setForm({ ...form, startLocation: e.target.value })} required />
              </div>
              <div className="form-group">
                <label>End Location</label>
                <input className="form-control" value={form.endLocation} onChange={(e) => setForm({ ...form, endLocation: e.target.value })} required />
              </div>
            </div>
            <div className="form-row">
              <div className="form-group">
                <label>Distance (km)</label>
                <input type="number" step="0.1" className="form-control" value={form.distanceKm} onChange={(e) => setForm({ ...form, distanceKm: e.target.value })} required />
              </div>
              <div className="form-group">
                <label>Estimated Duration (min)</label>
                <input type="number" className="form-control" value={form.durationMin} onChange={(e) => setForm({ ...form, durationMin: e.target.value })} required />
              </div>
            </div>
            <div className="modal-actions">
              <button type="button" className="btn btn-outline" onClick={() => setShowAdd(false)}>Cancel</button>
              <button type="submit" className="btn btn-primary" disabled={submitting}>{submitting ? 'Saving...' : 'Add Route'}</button>
            </div>
          </form>
        </Modal>
      )}

      {/* Edit Route Modal */}
      {editRoute && (
        <Modal title={`Edit Route - ${editRoute.Route_Name}`} onClose={() => setEditRoute(null)}>
          <form onSubmit={handleEdit}>
            <div className="form-group">
              <label>Route Name</label>
              <input className="form-control" value={editForm.routeName} onChange={(e) => setEditForm({ ...editForm, routeName: e.target.value })} required />
            </div>
            <div className="form-row">
              <div className="form-group">
                <label>Start Location</label>
                <input className="form-control" value={editForm.startLocation} onChange={(e) => setEditForm({ ...editForm, startLocation: e.target.value })} required />
              </div>
              <div className="form-group">
                <label>End Location</label>
                <input className="form-control" value={editForm.endLocation} onChange={(e) => setEditForm({ ...editForm, endLocation: e.target.value })} required />
              </div>
            </div>
            <div className="form-row">
              <div className="form-group">
                <label>Distance (km)</label>
                <input type="number" step="0.1" className="form-control" value={editForm.distanceKm} onChange={(e) => setEditForm({ ...editForm, distanceKm: e.target.value })} required />
              </div>
              <div className="form-group">
                <label>Estimated Duration (min)</label>
                <input type="number" className="form-control" value={editForm.durationMin} onChange={(e) => setEditForm({ ...editForm, durationMin: e.target.value })} required />
              </div>
            </div>
            <div className="modal-actions">
              <button type="button" className="btn btn-outline" onClick={() => setEditRoute(null)}>Cancel</button>
              <button type="submit" className="btn btn-primary" disabled={submitting}>{submitting ? 'Saving...' : 'Save Changes'}</button>
            </div>
          </form>
        </Modal>
      )}

      {/* Delete Confirmation */}
      {deleteRoute && (
        <Modal title="Confirm Deletion" onClose={() => setDeleteRoute(null)} footer={
          <>
            <button className="btn btn-outline" onClick={() => setDeleteRoute(null)}>Cancel</button>
            <button className="btn btn-danger" onClick={handleDelete}>Delete</button>
          </>
        }>
          <p>Delete route <strong>{deleteRoute.Route_Name}</strong>? This will fail if schedules reference it.</p>
        </Modal>
      )}

      {/* Stops Viewer */}
      {stopsRoute && (
        <Modal title={`Stops - ${stopsRoute.Route_Name}`} onClose={() => setStopsRoute(null)} footer={
          <button className="btn btn-outline" onClick={() => setStopsRoute(null)}>Close</button>
        }>
          {stops.length === 0 ? (
            <p className="text-muted">No stops defined for this route.</p>
          ) : (
            <ol>
              {stops.map((s) => (
                <li key={s.Stop_ID}>{s.Stop_Name} — +{s.Arrival_Offset_min} min</li>
              ))}
            </ol>
          )}
        </Modal>
      )}
    </div>
  );
}
