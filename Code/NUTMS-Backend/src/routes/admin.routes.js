/**
 * admin.routes.js
 * ===============
 * Administrator-only endpoints: manage users (students/faculty/drivers),
 * vehicles, routes, schedules, dashboard summary, and reports.
 */
const express = require('express');
const bcrypt = require('bcryptjs');
const { callProc, callProcSingle } = require('../config/db');
const { authenticate, authorize } = require('../middleware/auth');

const router = express.Router();

// All admin routes require authentication + Administrator role
router.use(authenticate, authorize('Administrator'));

// ---------------------------------------------------------------------
// Dashboard summary
// ---------------------------------------------------------------------
router.get('/dashboard', async (req, res) => {
  try {
    const rows = await callProcSingle('sp_AdminDashboardSummary');
    res.json(rows[0] || {});
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error fetching dashboard summary' });
  }
});

// ---------------------------------------------------------------------
// User management
// ---------------------------------------------------------------------

// GET /api/admin/users?role=Student|Faculty|Driver|Administrator|All
router.get('/users', async (req, res) => {
  try {
    const role = req.query.role || 'All';
    const rows = await callProcSingle('sp_AdminListUsers', [role]);
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error fetching users' });
  }
});

// POST /api/admin/users/student
router.post('/users/student', async (req, res) => {
  try {
    const { fullName, email, password, registrationNo, residentialType } = req.body;
    if (!fullName || !email || !password || !registrationNo || !residentialType) {
      return res.status(400).json({ error: 'All fields are required' });
    }
    const hash = await bcrypt.hash(password, 10);
    const rows = await callProcSingle('sp_AdminAddStudent', [fullName, email, hash, registrationNo, residentialType]);
    res.status(201).json({ message: 'Student added successfully', userId: rows[0]?.New_User_ID });
  } catch (err) {
    console.error(err);
    if (err.code === 'ER_DUP_ENTRY') return res.status(409).json({ error: 'Email or registration number already exists' });
    res.status(500).json({ error: 'Server error adding student' });
  }
});

// POST /api/admin/users/faculty
router.post('/users/faculty', async (req, res) => {
  try {
    const { fullName, email, password, employeeId, department, designation } = req.body;
    if (!fullName || !email || !password || !employeeId || !department || !designation) {
      return res.status(400).json({ error: 'All fields are required' });
    }
    const hash = await bcrypt.hash(password, 10);
    const rows = await callProcSingle('sp_AdminAddFaculty', [fullName, email, hash, employeeId, department, designation]);
    res.status(201).json({ message: 'Faculty added successfully', userId: rows[0]?.New_User_ID });
  } catch (err) {
    console.error(err);
    if (err.code === 'ER_DUP_ENTRY') return res.status(409).json({ error: 'Email or employee ID already exists' });
    res.status(500).json({ error: 'Server error adding faculty' });
  }
});

// POST /api/admin/users/driver
router.post('/users/driver', async (req, res) => {
  try {
    const {
      fullName, email, password, driverId, licenseNumber,
      licenseExpiry, hireDate, emergencyContact, salary,
    } = req.body;
    if (!fullName || !email || !password || !driverId || !licenseNumber || !licenseExpiry || !hireDate || !emergencyContact || salary == null) {
      return res.status(400).json({ error: 'All fields are required' });
    }
    const hash = await bcrypt.hash(password, 10);
    const rows = await callProcSingle('sp_AdminAddDriver', [
      fullName, email, hash, driverId, licenseNumber, licenseExpiry, hireDate, emergencyContact, salary,
    ]);
    res.status(201).json({ message: 'Driver added successfully', userId: rows[0]?.New_User_ID });
  } catch (err) {
    console.error(err);
    if (err.code === 'ER_DUP_ENTRY') return res.status(409).json({ error: 'Email, driver ID, or license number already exists' });
    res.status(500).json({ error: 'Server error adding driver' });
  }
});

// PUT /api/admin/users/student/:userId
router.put('/users/student/:userId', async (req, res) => {
  try {
    const { fullName, email, registrationNo, residentialType } = req.body;
    await callProc('sp_AdminUpdateStudent', [req.params.userId, fullName, email, registrationNo, residentialType]);
    res.json({ message: 'Student updated successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error updating student' });
  }
});

// PUT /api/admin/users/faculty/:userId
router.put('/users/faculty/:userId', async (req, res) => {
  try {
    const { fullName, email, department, designation } = req.body;
    await callProc('sp_AdminUpdateFaculty', [req.params.userId, fullName, email, department, designation]);
    res.json({ message: 'Faculty updated successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error updating faculty' });
  }
});

// PUT /api/admin/users/driver/:userId
router.put('/users/driver/:userId', async (req, res) => {
  try {
    const { fullName, email, licenseNumber, licenseExpiry, salary, status } = req.body;
    await callProc('sp_AdminUpdateDriver', [req.params.userId, fullName, email, licenseNumber, licenseExpiry, salary, status]);
    res.json({ message: 'Driver updated successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error updating driver' });
  }
});

// DELETE /api/admin/users/:userId
router.delete('/users/:userId', async (req, res) => {
  try {
    await callProc('sp_AdminDeleteUser', [req.params.userId]);
    res.json({ message: 'User deleted successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error deleting user' });
  }
});

// ---------------------------------------------------------------------
// Vehicles
// ---------------------------------------------------------------------

router.post('/vehicles', async (req, res) => {
  try {
    const { plate, capacity, makeModel, status, gpsDeviceId } = req.body;
    if (!plate || !capacity || !makeModel || !status) {
      return res.status(400).json({ error: 'plate, capacity, makeModel, and status are required' });
    }
    const rows = await callProcSingle('sp_AddVehicle', [plate, capacity, makeModel, status, gpsDeviceId || null]);
    res.status(201).json({ message: 'Vehicle added successfully', vehicleId: rows[0]?.New_Vehicle_ID });
  } catch (err) {
    console.error(err);
    if (err.code === 'ER_DUP_ENTRY') return res.status(409).json({ error: 'Plate or GPS device ID already exists' });
    res.status(500).json({ error: 'Server error adding vehicle' });
  }
});

router.put('/vehicles/:vehicleId', async (req, res) => {
  try {
    const { plate, capacity, makeModel, status, gpsDeviceId } = req.body;
    await callProc('sp_UpdateVehicle', [req.params.vehicleId, plate, capacity, makeModel, status, gpsDeviceId || null]);
    res.json({ message: 'Vehicle updated successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error updating vehicle' });
  }
});

router.delete('/vehicles/:vehicleId', async (req, res) => {
  try {
    await callProc('sp_DeleteVehicle', [req.params.vehicleId]);
    res.json({ message: 'Vehicle deleted successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error deleting vehicle' });
  }
});

// ---------------------------------------------------------------------
// Routes
// ---------------------------------------------------------------------

router.post('/routes', async (req, res) => {
  try {
    const { startLocation, routeName, endLocation, distanceKm, durationMin } = req.body;
    if (!startLocation || !routeName || !endLocation || !distanceKm || !durationMin) {
      return res.status(400).json({ error: 'All fields are required' });
    }
    const rows = await callProcSingle('sp_AddRoute', [startLocation, routeName, endLocation, distanceKm, durationMin]);
    res.status(201).json({ message: 'Route added successfully', routeId: rows[0]?.New_Route_ID });
  } catch (err) {
    console.error(err);
    if (err.code === 'ER_DUP_ENTRY') return res.status(409).json({ error: 'Route name already exists' });
    res.status(500).json({ error: 'Server error adding route' });
  }
});

router.put('/routes/:routeId', async (req, res) => {
  try {
    const { startLocation, routeName, endLocation, distanceKm, durationMin } = req.body;
    await callProc('sp_UpdateRoute', [req.params.routeId, startLocation, routeName, endLocation, distanceKm, durationMin]);
    res.json({ message: 'Route updated successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error updating route' });
  }
});

router.delete('/routes/:routeId', async (req, res) => {
  try {
    await callProc('sp_DeleteRoute', [req.params.routeId]);
    res.json({ message: 'Route deleted successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error deleting route (it may be referenced by a schedule)' });
  }
});

// ---------------------------------------------------------------------
// Schedules
// ---------------------------------------------------------------------

router.post('/schedules', async (req, res) => {
  try {
    const { departureFrom, destination, departureTime, daysOfWeek, effectiveFrom, routeId } = req.body;
    if (!departureFrom || !destination || !departureTime || !daysOfWeek || !effectiveFrom || !routeId) {
      return res.status(400).json({ error: 'All fields are required' });
    }
    const rows = await callProcSingle('sp_AddSchedule', [
      departureFrom, destination, departureTime, daysOfWeek, effectiveFrom, routeId, req.user.userId,
    ]);
    res.status(201).json({ message: 'Schedule added successfully', scheduleId: rows[0]?.New_Schedule_ID });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error adding schedule' });
  }
});

router.put('/schedules/:scheduleId', async (req, res) => {
  try {
    const { departureFrom, destination, departureTime, daysOfWeek, routeId } = req.body;
    await callProc('sp_UpdateSchedule', [req.params.scheduleId, departureFrom, destination, departureTime, daysOfWeek, routeId]);
    res.json({ message: 'Schedule updated successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error updating schedule' });
  }
});

router.delete('/schedules/:scheduleId', async (req, res) => {
  try {
    await callProc('sp_DeleteSchedule', [req.params.scheduleId]);
    res.json({ message: 'Schedule deleted successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error deleting schedule (it may have linked trips)' });
  }
});

// ---------------------------------------------------------------------
// Trips
// ---------------------------------------------------------------------

router.post('/trips', async (req, res) => {
  try {
    const { tripDate, scheduleId, vehicleId } = req.body;
    if (!tripDate || !scheduleId || !vehicleId) {
      return res.status(400).json({ error: 'tripDate, scheduleId, and vehicleId are required' });
    }
    const rows = await callProcSingle('sp_AddTrip', [tripDate, scheduleId, vehicleId]);
    res.status(201).json({ message: 'Trip added successfully', tripId: rows[0]?.New_Trip_ID });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error adding trip' });
  }
});

router.delete('/trips/:tripId', async (req, res) => {
  try {
    await callProc('sp_DeleteTrip', [req.params.tripId]);
    res.json({ message: 'Trip deleted successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error deleting trip' });
  }
});

// ---------------------------------------------------------------------
// Driver-Vehicle assignments
// ---------------------------------------------------------------------

router.get('/assignments', async (req, res) => {
  try {
    const rows = await callProcSingle('sp_GetAssignments');
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error fetching assignments' });
  }
});

router.post('/assignments', async (req, res) => {
  try {
    const { driverId, vehicleId } = req.body;
    if (!driverId || !vehicleId) {
      return res.status(400).json({ error: 'driverId and vehicleId are required' });
    }
    await callProc('sp_AssignDriverToVehicle', [driverId, vehicleId, req.user.userId]);
    res.status(201).json({ message: 'Driver assigned successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error assigning driver' });
  }
});

router.put('/assignments/:assignmentId/end', async (req, res) => {
  try {
    await callProc('sp_EndAssignment', [req.params.assignmentId]);
    res.json({ message: 'Assignment ended successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error ending assignment' });
  }
});

// ---------------------------------------------------------------------
// Special Trip Requests (Booking) approval
// ---------------------------------------------------------------------

router.get('/bookings', async (req, res) => {
  try {
    const status = req.query.status || 'All';
    const rows = await callProcSingle('sp_GetBookings', [status]);
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error fetching bookings' });
  }
});

router.get('/bookings/:bookingId/passengers', async (req, res) => {
  try {
    const rows = await callProcSingle('sp_GetBookingPassengers', [req.params.bookingId]);
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error fetching passengers' });
  }
});

router.put('/bookings/:bookingId/resolve', async (req, res) => {
  try {
    const { status, comments } = req.body; // status: 'Approved' | 'Rejected'
    if (!['Approved', 'Rejected', 'Pending'].includes(status)) {
      return res.status(400).json({ error: 'status must be Approved, Rejected, or Pending' });
    }
    await callProc('sp_ResolveBooking', [req.params.bookingId, status, comments || null]);
    res.json({ message: `Booking ${status.toLowerCase()} successfully` });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error resolving booking' });
  }
});

// ---------------------------------------------------------------------
// Maintenance
// ---------------------------------------------------------------------

router.post('/maintenance', async (req, res) => {
  try {
    const { type, description, date, cost, vehicleId } = req.body;
    if (!type || !date || cost == null || !vehicleId) {
      return res.status(400).json({ error: 'type, date, cost, and vehicleId are required' });
    }
    await callProc('sp_AddMaintenance', [type, description || null, date, cost, vehicleId]);
    res.status(201).json({ message: 'Maintenance record added; vehicle marked Under Maintenance' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error adding maintenance record' });
  }
});

router.get('/maintenance/:vehicleId', async (req, res) => {
  try {
    const rows = await callProcSingle('sp_GetMaintenanceByVehicle', [req.params.vehicleId]);
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error fetching maintenance records' });
  }
});

// ---------------------------------------------------------------------
// Reports & Analytics
// ---------------------------------------------------------------------

router.get('/reports/route-performance', async (req, res) => {
  try {
    const rows = await callProcSingle('sp_ReportRoutePerformance');
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error fetching route performance report' });
  }
});

router.get('/reports/driver-performance', async (req, res) => {
  try {
    const rows = await callProcSingle('sp_ReportDriverPerformance');
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error fetching driver performance report' });
  }
});

router.get('/reports/vehicle-utilization', async (req, res) => {
  try {
    const rows = await callProcSingle('sp_ReportVehicleUtilization');
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error fetching vehicle utilization report' });
  }
});

router.get('/reports/trips-trend', async (req, res) => {
  try {
    const days = parseInt(req.query.days, 10) || 14;
    const rows = await callProcSingle('sp_ReportTripsTrend', [days]);
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error fetching trips trend report' });
  }
});
// ---------------------------------------------------------------------
// Fuel Consumption
// ---------------------------------------------------------------------

router.get('/fuel', async (req, res) => {
  try {
    const rows = await callProcSingle('sp_GetFuelRecords');
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error fetching fuel records' });
  }
});

router.get('/fuel/summary', async (req, res) => {
  try {
    const rows = await callProcSingle('sp_GetFuelSummary');
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error fetching fuel summary' });
  }
});

router.get('/fuel/vehicle/:vehicleId', async (req, res) => {
  try {
    const rows = await callProcSingle('sp_GetFuelByVehicle', [req.params.vehicleId]);
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error fetching fuel by vehicle' });
  }
});

router.post('/fuel', async (req, res) => {
  try {
    const { vehicleId, tripId, date, liters, costPerLiter, odometer, station, notes } = req.body;
    if (!vehicleId || !date || !liters || !costPerLiter) {
      return res.status(400).json({ error: 'vehicleId, date, liters, and costPerLiter are required' });
    }
    await callProc('sp_AddFuelRecord', [
      vehicleId, tripId || null, date, liters, costPerLiter,
      odometer || null, station || null, notes || null, req.user.userId,
    ]);
    res.status(201).json({ message: 'Fuel record added successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error adding fuel record' });
  }
});

router.delete('/fuel/:fuelId', async (req, res) => {
  try {
    await callProc('sp_DeleteFuelRecord', [req.params.fuelId]);
    res.json({ message: 'Fuel record deleted successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error deleting fuel record' });
  }
});

module.exports = router;
