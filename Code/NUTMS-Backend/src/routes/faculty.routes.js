/**
 * faculty.routes.js
 * =================
 * Faculty-only endpoints: submit Special Trip Requests (with passenger
 * names/designations) and view status of their own requests.
 */
const express = require('express');
const { callProc, callProcSingle } = require('../config/db');
const { authenticate, authorize } = require('../middleware/auth');

const router = express.Router();

router.use(authenticate, authorize('Faculty'));

/**
 * Helper: resolve the logged-in user's employee_id (FACULTY.employee_id)
 */
async function getEmployeeId(userId) {
  const rows = await callProcSingle('sp_GetEmployeeIdByUser', [userId]);
  return rows[0]?.employee_id || null;
}

/**
 * GET /api/faculty/bookings
 * List the logged-in faculty member's own special trip requests.
 */
router.get('/bookings', async (req, res) => {
  try {
    const employeeId = await getEmployeeId(req.user.userId);
    if (!employeeId) return res.status(404).json({ error: 'Faculty record not found' });

    const rows = await callProcSingle('sp_GetBookingsByFaculty', [employeeId]);
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error fetching bookings' });
  }
});

/**
 * GET /api/faculty/bookings/:bookingId/passengers
 */
router.get('/bookings/:bookingId/passengers', async (req, res) => {
  try {
    const rows = await callProcSingle('sp_GetBookingPassengers', [req.params.bookingId]);
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error fetching passengers' });
  }
});

/**
 * POST /api/faculty/bookings
 * body: {
 *   destination, tripDate, departureTime, purpose, passengerCount,
 *   passengers: [{ name, designation }, ...]   // length must equal passengerCount
 * }
 */
router.post('/bookings', async (req, res) => {
  try {
    const { destination, tripDate, departureTime, purpose, passengerCount, passengers } = req.body;

    if (!destination || !tripDate || !departureTime || !purpose || !passengerCount) {
      return res.status(400).json({ error: 'destination, tripDate, departureTime, purpose, and passengerCount are required' });
    }
    if (!Array.isArray(passengers) || passengers.length !== Number(passengerCount)) {
      return res.status(400).json({ error: `passengers array must contain exactly ${passengerCount} entries` });
    }
    for (const p of passengers) {
      if (!p.name || !p.designation) {
        return res.status(400).json({ error: 'Each passenger requires a name and designation' });
      }
    }

    const employeeId = await getEmployeeId(req.user.userId);
    if (!employeeId) return res.status(404).json({ error: 'Faculty record not found' });

    const passengersJson = JSON.stringify(
      passengers.map((p) => ({ name: p.name, designation: p.designation }))
    );

    const rows = await callProcSingle('sp_AddBookingWithPassengers', [
      destination, tripDate, departureTime, purpose, passengerCount, employeeId, passengersJson,
    ]);

    res.status(201).json({ message: 'Special trip request submitted successfully', bookingId: rows[0]?.New_Booking_ID });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error submitting special trip request' });
  }
});

module.exports = router;
