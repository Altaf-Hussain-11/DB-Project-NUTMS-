import React, { useEffect, useState } from 'react';
import { api, getErrorMessage } from "../../services/client.ts";
import type { Schedule } from '../../types';

export default function SchedulesPage() {
  const [schedules, setSchedules] = useState<Schedule[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState('');

  useEffect(() => {
    api.get('/schedules')
      .then((res) => setSchedules(res.data))
      .catch((err) => setError(getErrorMessage(err)));
  }, []);

  const filtered = schedules.filter((s) =>
    `${s.Departure_from} ${s.Destination} ${s.Route_Name}`.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div>
      <div className="section-header">
        <h2>Bus Schedules</h2>
        <input
          className="form-control"
          style={{ width: 260 }}
          placeholder="Search by location or route..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {error && <div className="alert alert-error">{error}</div>}

      {filtered.length === 0 ? (
        <div className="card empty-state">
          <div className="empty-state-icon">📅</div>
          <p>No schedules found.</p>
        </div>
      ) : (
        <div className="card table-wrap">
          <table>
            <thead>
              <tr>
                <th>Route</th>
                <th>From</th>
                <th>To</th>
                <th>Departure Time</th>
                <th>Days</th>
                <th>Effective From</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((s) => (
                <tr key={s.Schedule_ID}>
                  <td>{s.Route_Name}</td>
                  <td>{s.Departure_from}</td>
                  <td>{s.Destination}</td>
                  <td>{s.Departure_Time}</td>
                  <td>{s.Days_Of_Week}</td>
                  <td>{s.Effective_From}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
