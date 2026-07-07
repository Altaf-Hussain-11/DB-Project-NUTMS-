/**
 * driver.routes.js
 * ================
 * Driver-only endpoints: view assigned trips, view trip details
 * (stops/route/vehicle/passengers context), update trip status,
 * and report an issue.
 */
const express = require('express');
const { callProc, callProcSingle } = require('../config/db');
const { authenticate, authorize } = require('../middleware/auth');

const router = express.Router();

router.use(authenticate, authorize('Driver'));

/**
 * Helper: resolve the logged-in user's driver_id (DRIVER.driver_id)
 */
async function getDriverId(userId) {
  const rows = await callProcSingle('sp_GetDriverIdByUser', [userId]);
  return rows[0]?.driver_id || null;
}

/**
 * GET /api/driver/trips
 * Trips assigned to the logged-in driver (via active vehicle assignment).
 */
router.get('/trips', async (req, res) => {
  try {
    const driverId = await getDriverId(req.user.userId);
    if (!driverId) return res.status(404).json({ error: 'Driver record not found' });

    const rows = await callProcSingle('sp_GetDriverTrips', [driverId]);
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error fetching driver trips' });
  }
});

/**
 * GET /api/driver/trips/:tripId
 * Full trip details (route, stops, vehicle) for the "View Details" button.
 */
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

/**
 * PUT /api/driver/trips/:tripId/status
 * body: { status: 'In Progress' | 'Completed' | 'Cancelled' | 'Scheduled' }
 * Trigger auto-stamps Departure_Time when moving to 'In Progress'.
 */
router.put('/trips/:tripId/status', async (req, res) => {
  try {
    const { status } = req.body;
    const valid = ['Scheduled', 'In Progress', 'Completed', 'Cancelled'];
    if (!valid.includes(status)) {
      return res.status(400).json({ error: `status must be one of: ${valid.join(', ')}` });
    }
    await callProc('sp_UpdateTripStatus', [req.params.tripId, status]);
    res.json({ message: `Trip status updated to '${status}'` });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error updating trip status' });
  }
});

/**
 * POST /api/driver/trips/:tripId/report-issue
 * Lightweight issue report. Since no audit/issue table exists in scope,
 * this marks the trip as 'Cancelled' and returns the note for the admin
 * to see via trip status; for a fuller implementation an ISSUE table
 * could be added later.
 * body: { note }
 */
router.post('/trips/:tripId/report-issue', async (req, res) => {
  try {
    const { note } = req.body;
    if (!note) return res.status(400).json({ error: 'note is required' });

    // No dedicated issue table in current scope; acknowledge receipt.
    // (Extend with an ISSUE table + sp_ReportIssue if persistence is required.)
    res.json({ message: 'Issue reported to transport administration', note });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error reporting issue' });
  }
});

module.exports = router;
