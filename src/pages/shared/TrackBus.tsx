import { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polyline } from 'react-leaflet';
import L from 'leaflet';
import { api, getErrorMessage } from "../../services/client.ts";
import type { GPSReading, Vehicle } from '../../types';
import { useNotifications } from '../../context/NotificationContext';

// Custom bus icon (data URI to avoid bundling image assets)
const busIcon = new L.Icon({
  iconUrl:
    'data:image/svg+xml;base64,' +
    btoa('<svg xmlns="http://www.w3.org/2000/svg" width="36" height="36" viewBox="0 0 36 36"><circle cx="18" cy="18" r="17" fill="#0f9d8f" stroke="white" stroke-width="2"/><rect x="9" y="11" width="18" height="14" rx="2" fill="white"/><rect x="11" y="13" width="6" height="5" rx="1" fill="#0f9d8f"/><rect x="19" y="13" width="6" height="5" rx="1" fill="#0f9d8f"/><circle cx="13" cy="26" r="2" fill="#0f9d8f"/><circle cx="23" cy="26" r="2" fill="#0f9d8f"/></svg>'),
  iconSize: [36, 36],
  iconAnchor: [18, 18],
});

const DEFAULT_CENTER: [number, number] = [32.65, 71.48]; // Namal Campus area

export default function TrackBus() {
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [selectedVehicleId, setSelectedVehicleId] = useState<number | null>(null);
  const [latest, setLatest] = useState<GPSReading[]>([]);
  const [track, setTrack] = useState<{ Latitude: number; Longitude: number }[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [gpsSignalLost, setGpsSignalLost] = useState(false);
  const { addNotification } = useNotifications();

  // Load vehicle list once
  useEffect(() => {
    api.get('/vehicles').then((res) => {
      const active = (res.data as Vehicle[]).filter((v) => v.Operational_Status === 'Active');
      setVehicles(active);
      if (active.length > 0) setSelectedVehicleId(active[0].Vehicle_ID);
    }).catch((err) => setError(getErrorMessage(err)));
  }, []);

  // Poll latest GPS for all vehicles
  useEffect(() => {
    let cancelled = false;

    async function poll() {
      try {
        const res = await api.get('/gps/latest');
        if (!cancelled) {
          setLatest(res.data);
          setGpsSignalLost(res.data.length === 0);
        }
      } catch (err) {
        if (!cancelled) setError(getErrorMessage(err));
      }
    }

    poll();
    const interval = setInterval(poll, 10000);
    return () => {
      cancelled = true;
      clearInterval(interval);
    };
  }, []);

  // Poll track (path) for selected vehicle
  useEffect(() => {
    if (!selectedVehicleId) return;
    let cancelled = false;

    async function pollTrack() {
      try {
        const res = await api.get(`/gps/${selectedVehicleId}/track?minutes=30`);
        if (!cancelled) {
          setTrack(res.data.map((p: { Latitude: number; Longitude: number }) => ({ Latitude: p.Latitude, Longitude: p.Longitude })));
        }
      } catch {
        // ignore
      }
    }

    pollTrack();
    const interval = setInterval(pollTrack, 10000);
    return () => {
      cancelled = true;
      clearInterval(interval);
    };
  }, [selectedVehicleId]);

  const selectedReading = latest.find((g) => g.Vehicle_ID === selectedVehicleId);

  // Notify if signal lost
  useEffect(() => {
    if (gpsSignalLost) {
      addNotification({
        title: 'GPS Signal Lost',
        message: 'Live location data is currently unavailable. Showing last known positions.',
        type: 'warning',
      });
    }
  }, [gpsSignalLost, addNotification]);

  const center = selectedReading
    ? ([selectedReading.Latitude, selectedReading.Longitude] as [number, number])
    : DEFAULT_CENTER;

  // ETA estimation (simple distance-based mock since no destination coordinates exist)
  const eta = selectedReading ? Math.max(2, Math.round(15 - (selectedReading.Speed_kmph || 0) / 5)) : null;

  return (
    <div>
      {error && <div className="alert alert-error">{error}</div>}
      {gpsSignalLost && (
        <div className="alert alert-warning" style={{ backgroundColor: 'var(--color-warning-light)', color: 'var(--color-warning)' }}>
          ⚠️ GPS signal lost — unable to retrieve live bus locations at this time.
        </div>
      )}

      <div className="section-header">
        <h2>Live Bus Tracking</h2>
        <select
          className="form-control"
          style={{ width: 220 }}
          value={selectedVehicleId ?? ''}
          onChange={(e) => setSelectedVehicleId(Number(e.target.value))}
        >
          {vehicles.map((v) => (
            <option key={v.Vehicle_ID} value={v.Vehicle_ID}>
              {v.Registration_Plate} ({v.Make_Model})
            </option>
          ))}
        </select>
      </div>

      <div className="map-container" style={{ marginBottom: 20 }}>
        <MapContainer center={center} zoom={13} style={{ height: '100%', width: '100%' }}>
          <TileLayer
            attribution='&copy; OpenStreetMap contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          {track.length > 1 && (
            <Polyline positions={track.map((p) => [p.Latitude, p.Longitude])} color="#0f9d8f" weight={4} opacity={0.6} />
          )}
          {latest.map((g) => (
            <Marker key={g.Vehicle_ID} position={[g.Latitude, g.Longitude]} icon={busIcon}>
              <Popup>
                <strong>{g.Registration_Plate}</strong>
                <br />
                Speed: {g.Speed_kmph ?? '—'} km/h
                <br />
                Updated: {new Date(g.Timestamp).toLocaleTimeString()}
              </Popup>
            </Marker>
          ))}
        </MapContainer>
      </div>

      <div className="grid grid-cols-3">
        <div className="card">
          <p className="card-title">Selected Bus</p>
          <p className="card-value" style={{ fontSize: 20 }}>{selectedReading?.Registration_Plate ?? '—'}</p>
        </div>
        <div className="card">
          <p className="card-title">Current Speed</p>
          <p className="card-value">{selectedReading?.Speed_kmph ?? '—'} <span style={{ fontSize: 14 }}>km/h</span></p>
        </div>
        <div className="card">
          <p className="card-title">Estimated Arrival</p>
          <p className="card-value" style={{ color: 'var(--color-accent)' }}>{eta ?? '—'} <span style={{ fontSize: 14 }}>min</span></p>
        </div>
      </div>
    </div>
  );
}
