/**
 * gpsSimulator.js
 * ===============
 * Simulates real-time GPS movement for "Active" vehicles along their
 * assigned route's stop coordinates. Designed to stand in for a real
 * GPS hardware API (Section 0.5.4 of the proposal: "GPS access will be
 * given for real time location ... captured through API integration
 * with GPS tracking hardware and web application").
 *
 * Swap-out point: replace `pollHardwareAndInsert()` with a real call to
 * your GPS provider's API, then call insertReading() with the result.
 *
 * Since the STOP table does not store latitude/longitude, this simulator
 * interpolates between a small set of reference points around the
 * Namal Campus / Mianwali area for each Active vehicle, producing
 * smooth, realistic movement for demo purposes.
 */
const { callProc, callProcSingle } = require('../config/db');

// Reference waypoints (lat, lng) roughly spanning Namal Campus -> Mianwali City
const ROUTE_WAYPOINTS = [
  { lat: 32.6480, lng: 71.4780 }, // Campus
  { lat: 32.6540, lng: 71.4845 },
  { lat: 32.6610, lng: 71.4910 },
  { lat: 32.6700, lng: 71.5050 },
  { lat: 32.6800, lng: 71.5200 },
  { lat: 32.5900, lng: 71.5450 }, // toward Mianwali City
  { lat: 32.5401, lng: 71.3200 }, // alternate branch (Isa Khel direction)
];

// In-memory simulation state per vehicle: { waypointIndex, progress }
const simState = new Map();

function lerp(a, b, t) {
  return a + (b - a) * t;
}

function nextPosition(vehicleId) {
  let state = simState.get(vehicleId);
  if (!state) {
    state = { waypointIndex: Math.floor(Math.random() * (ROUTE_WAYPOINTS.length - 1)), progress: 0 };
    simState.set(vehicleId, state);
  }

  const from = ROUTE_WAYPOINTS[state.waypointIndex];
  const to = ROUTE_WAYPOINTS[(state.waypointIndex + 1) % ROUTE_WAYPOINTS.length];

  const lat = lerp(from.lat, to.lat, state.progress);
  const lng = lerp(from.lng, to.lng, state.progress);

  // Advance progress; wrap to next waypoint when reaching the end
  state.progress += 0.08;
  if (state.progress >= 1) {
    state.progress = 0;
    state.waypointIndex = (state.waypointIndex + 1) % ROUTE_WAYPOINTS.length;
  }

  const speed = 30 + Math.floor(Math.random() * 30); // 30-60 km/h
  return { lat: Number(lat.toFixed(6)), lng: Number(lng.toFixed(6)), speed };
}

/**
 * Insert a GPS reading via stored procedure.
 */
async function insertReading(vehicleId, lat, lng, speed) {
  await callProc('sp_AddGPSLog', [lat, lng, speed, vehicleId]);
}

/**
 * One simulation tick: for every Active vehicle, compute next position
 * and insert a GPS log row.
 */
async function tick() {
  try {
    const vehicles = await callProcSingle('sp_GetVehicles');
    const activeVehicles = vehicles.filter((v) => v.Operational_Status === 'Active');

    for (const v of activeVehicles) {
      const { lat, lng, speed } = nextPosition(v.Vehicle_ID);
      await insertReading(v.Vehicle_ID, lat, lng, speed);
    }
  } catch (err) {
    console.error('GPS simulator tick failed:', err.message);
  }
}

/**
 * Start the simulator, ticking every `intervalMs` milliseconds.
 * Proposal target: location updates every 10-15 seconds per bus.
 */
function startSimulator(intervalMs = 12000) {
  console.log(`[GPS Simulator] Started - updating active vehicle positions every ${intervalMs / 1000}s`);
  // Run once immediately, then on interval
  tick();
  return setInterval(tick, intervalMs);
}

module.exports = { startSimulator, tick };
