import { useEffect, useState } from 'react';
import { api, getErrorMessage } from '../../services/client.ts';
import Modal from '../../components/Modal';

interface FuelRecord {
  fuel_id: number;
  fuel_date: string;
  fuel_liters: number;
  fuel_cost_per_liter: number;
  total_cost: number;
  odometer_km: number;
  fuel_station: string;
  notes: string;
  Registration_Plate: string;
  Make_Model: string;
  Trip_ID: number | null;
  Recorded_By: string;
}

interface FuelSummary {
  Vehicle_ID: number;
  Registration_Plate: string;
  Make_Model: string;
  Total_Refuels: number;
  Total_Liters: number;
  Total_Fuel_Cost: number;
  Avg_Liters_Per_Refuel: number;
}

interface Vehicle {
  Vehicle_ID: number;
  Registration_Plate: string;
  Make_Model: string;
}

const EMPTY_FORM = {
  vehicleId: '',
  tripId: '',
  date: '',
  liters: '',
  costPerLiter: '',
  odometer: '',
  station: '',
  notes: '',
};

export default function FuelConsumptionPage() {
  const [records, setRecords] = useState<FuelRecord[]>([]);
  const [summary, setSummary] = useState<FuelSummary[]>([]);
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [showAdd, setShowAdd] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState(EMPTY_FORM);
  const [activeTab, setActiveTab] = useState<'records' | 'summary'>('records');

  function loadData() {
    api.get('/admin/fuel').then((res) => setRecords(res.data)).catch((err) => setError(getErrorMessage(err)));
    api.get('/admin/fuel/summary').then((res) => setSummary(res.data)).catch((err) => setError(getErrorMessage(err)));
    api.get('/vehicles').then((res) => setVehicles(res.data)).catch((err) => setError(getErrorMessage(err)));
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
      await api.post('/admin/fuel', {
        vehicleId: Number(form.vehicleId),
        tripId: form.tripId ? Number(form.tripId) : null,
        date: form.date,
        liters: Number(form.liters),
        costPerLiter: Number(form.costPerLiter),
        odometer: form.odometer ? Number(form.odometer) : null,
        station: form.station,
        notes: form.notes,
      });
      setSuccess('Fuel record added successfully.');
      setShowAdd(false);
      setForm(EMPTY_FORM);
      loadData();
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setSubmitting(false);
    }
  }

  async function handleDelete(fuelId: number) {
    if (!confirm('Delete this fuel record?')) return;
    clearMessages();
    try {
      await api.delete(`/admin/fuel/${fuelId}`);
      setSuccess('Fuel record deleted.');
      loadData();
    } catch (err) {
      setError(getErrorMessage(err));
    }
  }

  const totalCost = records.reduce((sum, r) => sum + Number(r.total_cost), 0);
  const totalLiters = records.reduce((sum, r) => sum + Number(r.fuel_liters), 0);

  return (
    <div>
      <div className="section-header">
        <h2>Fuel Consumption</h2>
        <button className="btn btn-primary" onClick={() => { clearMessages(); setShowAdd(true); }}>+ Log Fuel</button>
      </div>

      {error && <div className="alert alert-error">{error}</div>}
      {success && <div className="alert alert-success">{success}</div>}

      {/* Summary Cards */}
      <div className="grid grid-cols-3" style={{ marginBottom: 20 }}>
        <div className="card">
          <p className="card-title">Total Records</p>
          <p className="card-value">{records.length}</p>
        </div>
        <div className="card">
          <p className="card-title">Total Liters</p>
          <p className="card-value">{totalLiters.toFixed(1)} <span style={{ fontSize: 14 }}>L</span></p>
        </div>
        <div className="card">
          <p className="card-title">Total Fuel Cost</p>
          <p className="card-value" style={{ fontSize: 20 }}>PKR {totalCost.toLocaleString()}</p>
        </div>
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: 8, marginBottom: 16 }}>
        <button className={`btn ${activeTab === 'records' ? 'btn-primary' : 'btn-outline'}`} onClick={() => setActiveTab('records')}>All Records</button>
        <button className={`btn ${activeTab === 'summary' ? 'btn-primary' : 'btn-outline'}`} onClick={() => setActiveTab('summary')}>By Vehicle</button>
      </div>

      {activeTab === 'records' && (
        <div className="card table-wrap">
          <table>
            <thead>
              <tr>
                <th>Date</th>
                <th>Vehicle</th>
                <th>Liters</th>
                <th>Rate (PKR/L)</th>
                <th>Total Cost</th>
                <th>Odometer</th>
                <th>Station</th>
                <th>Trip</th>
                <th>Recorded By</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {records.map((r) => (
                <tr key={r.fuel_id}>
                  <td>{r.fuel_date}</td>
                  <td>{r.Registration_Plate} <span className="text-muted" style={{ fontSize: 12 }}>({r.Make_Model})</span></td>
                  <td>{r.fuel_liters} L</td>
                  <td>{r.fuel_cost_per_liter}</td>
                  <td>PKR {Number(r.total_cost).toLocaleString()}</td>
                  <td>{r.odometer_km ? `${r.odometer_km} km` : '—'}</td>
                  <td>{r.fuel_station || '—'}</td>
                  <td>{r.Trip_ID ? `#${r.Trip_ID}` : '—'}</td>
                  <td>{r.Recorded_By}</td>
                  <td>
                    <button className="btn btn-danger btn-sm" onClick={() => handleDelete(r.fuel_id)}>Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {activeTab === 'summary' && (
        <div className="card table-wrap">
          <table>
            <thead>
              <tr>
                <th>Vehicle</th>
                <th>Make/Model</th>
                <th>Total Refuels</th>
                <th>Total Liters</th>
                <th>Avg Liters/Refuel</th>
                <th>Total Fuel Cost (PKR)</th>
              </tr>
            </thead>
            <tbody>
              {summary.map((s) => (
                <tr key={s.Vehicle_ID}>
                  <td>{s.Registration_Plate}</td>
                  <td>{s.Make_Model}</td>
                  <td>{s.Total_Refuels || 0}</td>
                  <td>{s.Total_Liters || 0} L</td>
                  <td>{s.Avg_Liters_Per_Refuel || 0} L</td>
                  <td>{Number(s.Total_Fuel_Cost || 0).toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Add Fuel Modal */}
      {showAdd && (
        <Modal title="Log Fuel Consumption" onClose={() => setShowAdd(false)}>
          <form onSubmit={handleAdd}>
            <div className="form-row">
              <div className="form-group">
                <label>Vehicle</label>
                <select className="form-control" value={form.vehicleId} onChange={(e) => setForm({ ...form, vehicleId: e.target.value })} required>
                  <option value="">Select vehicle...</option>
                  {vehicles.map((v) => (
                    <option key={v.Vehicle_ID} value={v.Vehicle_ID}>{v.Registration_Plate} ({v.Make_Model})</option>
                  ))}
                </select>
              </div>
              <div className="form-group">
                <label>Date</label>
                <input type="date" className="form-control" value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} required />
              </div>
            </div>
            <div className="form-row">
              <div className="form-group">
                <label>Liters</label>
                <input type="number" step="0.01" className="form-control" value={form.liters} onChange={(e) => setForm({ ...form, liters: e.target.value })} required />
              </div>
              <div className="form-group">
                <label>Cost per Liter (PKR)</label>
                <input type="number" step="0.01" className="form-control" value={form.costPerLiter} onChange={(e) => setForm({ ...form, costPerLiter: e.target.value })} required />
              </div>
            </div>
            <div className="form-row">
              <div className="form-group">
                <label>Odometer (km)</label>
                <input type="number" step="0.01" className="form-control" value={form.odometer} onChange={(e) => setForm({ ...form, odometer: e.target.value })} placeholder="Optional" />
              </div>
              <div className="form-group">
                <label>Trip ID</label>
                <input type="number" className="form-control" value={form.tripId} onChange={(e) => setForm({ ...form, tripId: e.target.value })} placeholder="Optional" />
              </div>
            </div>
            <div className="form-group">
              <label>Fuel Station</label>
              <input className="form-control" value={form.station} onChange={(e) => setForm({ ...form, station: e.target.value })} placeholder="e.g. PSO Mianwali" />
            </div>
            <div className="form-group">
              <label>Notes</label>
              <textarea className="form-control" rows={2} value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} />
            </div>
            <div className="modal-actions">
              <button type="button" className="btn btn-outline" onClick={() => setShowAdd(false)}>Cancel</button>
              <button type="submit" className="btn btn-primary" disabled={submitting}>{submitting ? 'Saving...' : 'Log Fuel'}</button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
}