/**
 * data.routes.js
 * ==============
 * Read-only endpoints accessible to ALL authenticated roles
 * (Student, Faculty, Driver, Administrator):
 * routes, stops, schedules, vehicles, trips, GPS.
 */
const express = require('express');
const { callProc, callProcSingle } = require('../config/db');
const { authenticate } = require('../middleware/auth');

const router = express.Router();

router.use(authenticate);

// Routes
router.get('/routes', async (req, res) => {
  try {
    const rows = await callProcSingle('sp_GetRoutes');
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error fetching routes' });
  }
});

router.get('/routes/:routeId/stops', async (req, res) => {
  try {
    const rows = await callProcSingle('sp_GetRouteStops', [req.params.routeId]);
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error fetching route stops' });
  }
});

// Schedules
router.get('/schedules', async (req, res) => {
  try {
    const rows = await callProcSingle('sp_GetSchedules');
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error fetching schedules' });
  }
});

// Vehicles
router.get('/vehicles', async (req, res) => {
  try {
    const rows = await callProcSingle('sp_GetVehicles');
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error fetching vehicles' });
  }
});

// Trips
router.get('/trips', async (req, res) => {
  try {
    const status = req.query.status || 'All';
    const rows = await callProcSingle('sp_GetTrips', [status]);
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error fetching trips' });
  }
});

router.get('/trips/upcoming', async (req, res) => {
  try {
    const limit = parseInt(req.query.limit, 10) || 5;
    const rows = await callProcSingle('sp_GetUpcomingTrips', [limit]);
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error fetching upcoming trips' });
  }
});

router.get('/trips/active-fleet', async (req, res) => {
  try {
    const rows = await callProcSingle('sp_GetActiveTripsFleet');
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error fetching active fleet' });
  }
});

router.get('/trips/:tripId', async (req, res) => {
  try {
    const resultSets = await callProc('sp_GetTripDetails', [req.params.tripId]);
    const [tripRows, stopRows] = resultSets;
    if (!tripRows || tripRows.length === 0) {
      return res.status(404).json({ error: 'Trip not found' });
    }
    res.json({ trip: tripRows[0], stops: stopRows || [] });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error fetching trip details' });
  }
});

// GPS
router.get('/gps/latest', async (req, res) => {
  try {
    const rows = await callProcSingle('sp_GetLatestGPS');
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error fetching latest GPS data' });
  }
});

router.get('/gps/:vehicleId/latest', async (req, res) => {
  try {
    const rows = await callProcSingle('sp_GetLatestGPSByVehicle', [req.params.vehicleId]);
    res.json(rows[0] || null);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error fetching vehicle GPS data' });
  }
});

router.get('/gps/:vehicleId/track', async (req, res) => {
  try {
    const minutes = parseInt(req.query.minutes, 10) || 60;
    const rows = await callProcSingle('sp_GetGPSTrack', [req.params.vehicleId, minutes]);
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error fetching GPS track' });
  }
});

module.exports = router;
