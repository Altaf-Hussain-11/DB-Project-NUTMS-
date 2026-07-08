import { useEffect, useState } from 'react';
import { api, getErrorMessage } from "../../services/client.ts";
import type { RoutePerformance, DriverPerformance, VehicleUtilization, TripsTrendPoint } from '../../types';

export default function ReportsPage() {
  const [routePerf, setRoutePerf] = useState<RoutePerformance[]>([]);
  const [driverPerf, setDriverPerf] = useState<DriverPerformance[]>([]);
  const [vehicleUtil, setVehicleUtil] = useState<VehicleUtilization[]>([]);
  const [tripsTrend, setTripsTrend] = useState<TripsTrendPoint[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    api.get('/admin/reports/route-performance').then((res) => setRoutePerf(res.data)).catch((err) => setError(getErrorMessage(err)));
    api.get('/admin/reports/driver-performance').then((res) => setDriverPerf(res.data)).catch((err) => setError(getErrorMessage(err)));
    api.get('/admin/reports/vehicle-utilization').then((res) => setVehicleUtil(res.data)).catch((err) => setError(getErrorMessage(err)));
    api.get('/admin/reports/trips-trend?days=14').then((res) => setTripsTrend(res.data)).catch((err) => setError(getErrorMessage(err)));
  }, []);

  const statusCounts = vehicleUtil.reduce<Record<string, number>>((acc, v) => {
    acc[v.Operational_Status] = (acc[v.Operational_Status] || 0) + 1;
    return acc;
  }, {});

  const maxTrips = Math.max(...tripsTrend.map((t) => t.Total_Trips), 1);
  const maxRouteRate = Math.max(...routePerf.map((r) => r.Completion_Rate_Pct), 1);
  const maxDriverRate = Math.max(...driverPerf.map((d) => d.Completion_Rate_Pct), 1);

  const STATUS_COLORS: Record<string, string> = {
    Active: '#16a34a',
    'Under Maintenance': '#f59e0b',
    Retired: '#dc2626',
  };

  return (
    <div>
      <h2>Reports &amp; Analytics</h2>
      <p className="text-muted" style={{ marginTop: -8 }}>
        Transport utilization, route efficiency, driver performance, and fleet maintenance overview.
      </p>

      {error && <div className="alert alert-error">{error}</div>}

      {/* Trips Trend */}
      <div className="card" style={{ marginBottom: 20 }}>
        <h3 style={{ marginTop: 0 }}>Trips Trend (Last 14 Days)</h3>
        <div style={{ overflowX: 'auto' }}>
          <div style={{ display: 'flex', alignItems: 'flex-end', gap: 6, height: 200, minWidth: 600, padding: '0 8px' }}>
            {tripsTrend.map((t, i) => (
              <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
                <div style={{ width: '100%', display: 'flex', gap: 2, alignItems: 'flex-end', height: 160 }}>
                  <div title={`Total: ${t.Total_Trips}`} style={{ flex: 1, background: '#0f9d8f', height: `${(t.Total_Trips / maxTrips) * 100}%`, borderRadius: 3 }} />
                  <div title={`Completed: ${t.Completed}`} style={{ flex: 1, background: '#16a34a', height: `${(t.Completed / maxTrips) * 100}%`, borderRadius: 3 }} />
                  <div title={`Cancelled: ${t.Cancelled}`} style={{ flex: 1, background: '#dc2626', height: `${(t.Cancelled / maxTrips) * 100}%`, borderRadius: 3 }} />
                </div>
                <span style={{ fontSize: 10, color: '#666', writingMode: 'vertical-rl', transform: 'rotate(180deg)', height: 36 }}>{t.Trip_Date}</span>
              </div>
            ))}
          </div>
          <div style={{ display: 'flex', gap: 16, marginTop: 8, fontSize: 12 }}>
            <span><span style={{ display: 'inline-block', width: 10, height: 10, background: '#0f9d8f', borderRadius: 2, marginRight: 4 }} />Total Trips</span>
            <span><span style={{ display: 'inline-block', width: 10, height: 10, background: '#16a34a', borderRadius: 2, marginRight: 4 }} />Completed</span>
            <span><span style={{ display: 'inline-block', width: 10, height: 10, background: '#dc2626', borderRadius: 2, marginRight: 4 }} />Cancelled</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2" style={{ marginBottom: 20 }}>
        {/* Fleet Status */}
        <div className="card">
          <h3 style={{ marginTop: 0 }}>Fleet Status Distribution</h3>
          {Object.entries(statusCounts).map(([status, count]) => {
            const total = Object.values(statusCounts).reduce((a, b) => a + b, 0);
            const pct = Math.round((count / total) * 100);
            return (
              <div key={status} style={{ marginBottom: 12 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, marginBottom: 4 }}>
                  <span>{status}</span>
                  <span>{count} ({pct}%)</span>
                </div>
                <div style={{ background: '#e5e7eb', borderRadius: 4, height: 10 }}>
                  <div style={{ width: `${pct}%`, background: STATUS_COLORS[status] || '#9333ea', height: '100%', borderRadius: 4 }} />
                </div>
              </div>
            );
          })}
        </div>

        {/* Route Completion */}
        <div className="card">
          <h3 style={{ marginTop: 0 }}>Route Completion Rate</h3>
          {routePerf.map((r, i) => (
            <div key={i} style={{ marginBottom: 12 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, marginBottom: 4 }}>
                <span>{r.Route_Name}</span>
                <span>{r.Completion_Rate_Pct}%</span>
              </div>
              <div style={{ background: '#e5e7eb', borderRadius: 4, height: 10 }}>
                <div style={{ width: `${(r.Completion_Rate_Pct / maxRouteRate) * 100}%`, background: '#0f9d8f', height: '100%', borderRadius: 4 }} />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Driver Performance */}
      <div className="card" style={{ marginBottom: 20 }}>
        <h3 style={{ marginTop: 0 }}>Driver Trip Completion Rates</h3>
        {driverPerf.map((d, i) => (
          <div key={i} style={{ marginBottom: 12 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, marginBottom: 4 }}>
              <span>{d.Full_Name}</span>
              <span>{d.Completion_Rate_Pct}%</span>
            </div>
            <div style={{ background: '#e5e7eb', borderRadius: 4, height: 10 }}>
              <div style={{ width: `${(d.Completion_Rate_Pct / maxDriverRate) * 100}%`, background: '#16a34a', height: '100%', borderRadius: 4 }} />
            </div>
          </div>
        ))}
      </div>

      {/* Vehicle Utilization Table */}
      <div className="card">
        <h3 style={{ marginTop: 0 }}>Vehicle Utilization &amp; Maintenance Cost</h3>
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Plate</th><th>Status</th><th>Total Trips</th><th>Total Maintenance Cost (PKR)</th>
              </tr>
            </thead>
            <tbody>
              {vehicleUtil.map((v) => (
                <tr key={v.Vehicle_ID}>
                  <td>{v.Registration_Plate}</td>
                  <td>{v.Operational_Status}</td>
                  <td>{v.Total_Trips}</td>
                  <td>{Number(v.Total_Maintenance_Cost).toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}