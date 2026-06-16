import React, { useEffect, useState } from 'react';
import { api, getErrorMessage } from "../../services/client.ts";
import type { Vehicle, Driver, Assignment } from '../../types';
import StatusBadge from '../../components/StatusBadge';
import Modal from '../../components/Modal';

const EMPTY_VEHICLE = { plate: '', capacity: '', makeModel: '', status: 'Active' as Vehicle['Operational_Status'], gpsDeviceId: '' };
const EMPTY_MAINTENANCE = { type: '', description: '', date: '', cost: '' };

export default function ManageVehiclesPage() {
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [drivers, setDrivers] = useState<Driver[]>([]);
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const [showAdd, setShowAdd] = useState(false);
  const [form, setForm] = useState(EMPTY_VEHICLE);
  const [submitting, setSubmitting] = useState(false);

  const [editVehicle, setEditVehicle] = useState<Vehicle | null>(null);
  const [editForm, setEditForm] = useState(EMPTY_VEHICLE);

  const [deleteVehicle, setDeleteVehicle] = useState<Vehicle | null>(null);

  const [maintenanceVehicle, setMaintenanceVehicle] = useState<Vehicle | null>(null);
  const [maintenanceForm, setMaintenanceForm] = useState(EMPTY_MAINTENANCE);

  const [assignVehicle, setAssignVehicle] = useState<Vehicle | null>(null);
  const [assignDriverId, setAssignDriverId] = useState('');

  function loadData() {
    api.get('/vehicles').then((res) => setVehicles(res.data)).catch((err) => setError(getErrorMessage(err)));
    api.get('/admin/assignments').then((res) => setAssignments(res.data)).catch((err) => setError(getErrorMessage(err)));
    // Drivers list comes from admin users endpoint filtered by role
    api.get('/admin/users?role=Driver').then((res) => setDrivers(res.data)).catch((err) => setError(getErrorMessage(err)));
  }

  useEffect(() => { loadData(); }, []);

  function clearMessages() {
    setError(null);
    setSuccess(null);
  }

  async function handleAdd(e: React.FormEvent) {
    e.preventDefault();
    clearMessages();
    setSubmitting(true);
    try {
      await api.post('/admin/vehicles', {
        ...form,
        capacity: Number(form.capacity),
        gpsDeviceId: form.gpsDeviceId || null,
      });
      setSuccess('Bus added successfully.');
      setShowAdd(false);
      setForm(EMPTY_VEHICLE);
      loadData();
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setSubmitting(false);
    }
  }

  function openEdit(v: Vehicle) {
    clearMessages();
    setEditVehicle(v);
    setEditForm({
      plate: v.Registration_Plate, capacity: String(v.Seating_Capacity),
      makeModel: v.Make_Model, status: v.Operational_Status, gpsDeviceId: v.GPS_Device_ID || '',
    });
  }

  async function handleEdit(e: React.FormEvent) {
    e.preventDefault();
    if (!editVehicle) return;
    clearMessages();
    setSubmitting(true);
    try {
      await api.put(`/admin/vehicles/${editVehicle.Vehicle_ID}`, {
        ...editForm,
        capacity: Number(editForm.capacity),
        gpsDeviceId: editForm.gpsDeviceId || null,
      });
      setSuccess('Bus updated successfully.');
      setEditVehicle(null);
      loadData();
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setSubmitting(false);
    }
  }

  async function handleDelete() {
    if (!deleteVehicle) return;
    clearMessages();
    try {
      await api.delete(`/admin/vehicles/${deleteVehicle.Vehicle_ID}`);
      setSuccess('Bus deleted successfully.');
      setDeleteVehicle(null);
      loadData();
    } catch (err) {
      setError(getErrorMessage(err));
    }
  }

  async function handleAddMaintenance(e: React.FormEvent) {
    e.preventDefault();
    if (!maintenanceVehicle) return;
    clearMessages();
    setSubmitting(true);
    try {
      await api.post('/admin/maintenance', {
        ...maintenanceForm,
        cost: Number(maintenanceForm.cost),
        vehicleId: maintenanceVehicle.Vehicle_ID,
      });
      setSuccess('Maintenance logged. Vehicle marked "Under Maintenance".');
      setMaintenanceVehicle(null);
      setMaintenanceForm(EMPTY_MAINTENANCE);
      loadData();
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setSubmitting(false);
    }
  }

  async function handleAssignDriver(e: React.FormEvent) {
    e.preventDefault();
    if (!assignVehicle || !assignDriverId) return;
    clearMessages();
    setSubmitting(true);
    try {
      await api.post('/admin/assignments', { driverId: assignDriverId, vehicleId: assignVehicle.Vehicle_ID });
      setSuccess('Driver assigned successfully.');
      setAssignVehicle(null);
      setAssignDriverId('');
      loadData();
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setSubmitting(false);
    }
  }

  function currentDriver(vehicleId: number): Assignment | undefined {
    return assignments.find((a) => a.Vehicle_ID === vehicleId && a.Assignment_status === 'Active');
  }

  return (
    <div>
      <div className="section-header">
        <h2>Manage Buses</h2>
        <button className="btn btn-primary" onClick={() => { clearMessages(); setShowAdd(true); }}>+ Add New Bus</button>
      </div>

      {error && <div className="alert alert-error">{error}</div>}
      {success && <div className="alert alert-success">{success}</div>}

      <div className="card table-wrap">
        <table>
          <thead>
            <tr>
              <th>ID</th><th>Plate</th><th>Make/Model</th><th>Capacity</th><th>GPS Device</th><th>Status</th><th>Assigned Driver</th><th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {vehicles.map((v) => {
              const driverAssign = currentDriver(v.Vehicle_ID);
              return (
                <tr key={v.Vehicle_ID}>
                  <td>{v.Vehicle_ID}</td>
                  <td>{v.Registration_Plate}</td>
                  <td>{v.Make_Model}</td>
                  <td>{v.Seating_Capacity}</td>
                  <td>{v.GPS_Device_ID || '—'}</td>
                  <td><StatusBadge status={v.Operational_Status} /></td>
                  <td>{driverAssign ? driverAssign.Driver_Name : '—'}</td>
                  <td>
                    <div className="flex gap-8" style={{ flexWrap: 'wrap' }}>
                      <button className="btn btn-outline btn-sm" onClick={() => openEdit(v)}>Edit</button>
                      <button className="btn btn-outline btn-sm" onClick={() => { clearMessages(); setMaintenanceVehicle(v); }}>Maintenance</button>
                      <button className="btn btn-outline btn-sm" onClick={() => { clearMessages(); setAssignVehicle(v); }}>Assign Driver</button>
                      <button className="btn btn-danger btn-sm" onClick={() => { clearMessages(); setDeleteVehicle(v); }}>Delete</button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Add Bus Modal */}
      {showAdd && (
        <Modal title="Add New Bus" onClose={() => setShowAdd(false)}>
          <form onSubmit={handleAdd}>
            <div className="form-row">
              <div className="form-group">
                <label>Registration Plate</label>
                <input className="form-control" value={form.plate} onChange={(e) => setForm({ ...form, plate: e.target.value })} placeholder="MWM-X123" required />
              </div>
              <div className="form-group">
                <label>Seating Capacity</label>
                <input type="number" className="form-control" value={form.capacity} onChange={(e) => setForm({ ...form, capacity: e.target.value })} required />
              </div>
            </div>
            <div className="form-row">
              <div className="form-group">
                <label>Make / Model</label>
                <input className="form-control" value={form.makeModel} onChange={(e) => setForm({ ...form, makeModel: e.target.value })} required />
              </div>
              <div className="form-group">
                <label>GPS Device ID</label>
                <input className="form-control" value={form.gpsDeviceId} onChange={(e) => setForm({ ...form, gpsDeviceId: e.target.value })} placeholder="GPS-XX (optional)" />
              </div>
            </div>
            <div className="form-group">
              <label>Status</label>
              <select className="form-control" value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value as any })}>
                <option value="Active">Active</option>
                <option value="Under Maintenance">Under Maintenance</option>
                <option value="Retired">Retired</option>
              </select>
            </div>
            <div className="modal-actions">
              <button type="button" className="btn btn-outline" onClick={() => setShowAdd(false)}>Cancel</button>
              <button type="submit" className="btn btn-primary" disabled={submitting}>{submitting ? 'Saving...' : 'Add Bus'}</button>
            </div>
          </form>
        </Modal>
      )}

      {/* Edit Bus Modal */}
      {editVehicle && (
        <Modal title={`Edit Bus - ${editVehicle.Registration_Plate}`} onClose={() => setEditVehicle(null)}>
          <form onSubmit={handleEdit}>
            <div className="form-row">
              <div className="form-group">
                <label>Registration Plate</label>
                <input className="form-control" value={editForm.plate} onChange={(e) => setEditForm({ ...editForm, plate: e.target.value })} required />
              </div>
              <div className="form-group">
                <label>Seating Capacity</label>
                <input type="number" className="form-control" value={editForm.capacity} onChange={(e) => setEditForm({ ...editForm, capacity: e.target.value })} required />
              </div>
            </div>
            <div className="form-row">
              <div className="form-group">
                <label>Make / Model</label>
                <input className="form-control" value={editForm.makeModel} onChange={(e) => setEditForm({ ...editForm, makeModel: e.target.value })} required />
              </div>
              <div className="form-group">
                <label>GPS Device ID</label>
                <input className="form-control" value={editForm.gpsDeviceId} onChange={(e) => setEditForm({ ...editForm, gpsDeviceId: e.target.value })} />
              </div>
            </div>
            <div className="form-group">
              <label>Status</label>
              <select className="form-control" value={editForm.status} onChange={(e) => setEditForm({ ...editForm, status: e.target.value as any })}>
                <option value="Active">Active</option>
                <option value="Under Maintenance">Under Maintenance</option>
                <option value="Retired">Retired</option>
              </select>
            </div>
            <div className="modal-actions">
              <button type="button" className="btn btn-outline" onClick={() => setEditVehicle(null)}>Cancel</button>
              <button type="submit" className="btn btn-primary" disabled={submitting}>{submitting ? 'Saving...' : 'Save Changes'}</button>
            </div>
          </form>
        </Modal>
      )}

      {/* Delete Confirmation */}
      {deleteVehicle && (
        <Modal title="Confirm Deletion" onClose={() => setDeleteVehicle(null)} footer={
          <>
            <button className="btn btn-outline" onClick={() => setDeleteVehicle(null)}>Cancel</button>
            <button className="btn btn-danger" onClick={handleDelete}>Delete</button>
          </>
        }>
          <p>Delete bus <strong>{deleteVehicle.Registration_Plate}</strong>? This removes all related maintenance and GPS history.</p>
        </Modal>
      )}

      {/* Maintenance Modal */}
      {maintenanceVehicle && (
        <Modal title={`Log Maintenance - ${maintenanceVehicle.Registration_Plate}`} onClose={() => setMaintenanceVehicle(null)}>
          <form onSubmit={handleAddMaintenance}>
            <div className="form-row">
              <div className="form-group">
                <label>Maintenance Type</label>
                <input className="form-control" value={maintenanceForm.type} onChange={(e) => setMaintenanceForm({ ...maintenanceForm, type: e.target.value })} required />
              </div>
              <div className="form-group">
                <label>Date</label>
                <input type="date" className="form-control" value={maintenanceForm.date} onChange={(e) => setMaintenanceForm({ ...maintenanceForm, date: e.target.value })} required />
              </div>
            </div>
            <div className="form-group">
              <label>Description</label>
              <textarea className="form-control" rows={2} value={maintenanceForm.description} onChange={(e) => setMaintenanceForm({ ...maintenanceForm, description: e.target.value })} />
            </div>
            <div className="form-group">
              <label>Cost</label>
              <input type="number" className="form-control" value={maintenanceForm.cost} onChange={(e) => setMaintenanceForm({ ...maintenanceForm, cost: e.target.value })} required />
            </div>
            <p className="text-muted" style={{ fontSize: 13 }}>Logging this will automatically set the bus status to "Under Maintenance".</p>
            <div className="modal-actions">
              <button type="button" className="btn btn-outline" onClick={() => setMaintenanceVehicle(null)}>Cancel</button>
              <button type="submit" className="btn btn-primary" disabled={submitting}>{submitting ? 'Saving...' : 'Log Maintenance'}</button>
            </div>
          </form>
        </Modal>
      )}

      {/* Assign Driver Modal */}
      {assignVehicle && (
        <Modal title={`Assign Driver - ${assignVehicle.Registration_Plate}`} onClose={() => setAssignVehicle(null)}>
          <form onSubmit={handleAssignDriver}>
            <div className="form-group">
              <label>Driver</label>
              <select className="form-control" value={assignDriverId} onChange={(e) => setAssignDriverId(e.target.value)} required>
                <option value="">Select a driver...</option>
                {drivers.map((d) => (
                  <option key={d.driver_id} value={d.driver_id}>{d.Full_Name} ({d.driver_id})</option>
                ))}
              </select>
            </div>
            <p className="text-muted" style={{ fontSize: 13 }}>
              Assigning a new driver will automatically end any existing active assignment for this bus.
            </p>
            <div className="modal-actions">
              <button type="button" className="btn btn-outline" onClick={() => setAssignVehicle(null)}>Cancel</button>
              <button type="submit" className="btn btn-primary" disabled={submitting}>{submitting ? 'Saving...' : 'Assign'}</button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
}
