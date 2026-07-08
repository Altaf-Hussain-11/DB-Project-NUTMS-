import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { NotificationProvider } from './context/NotificationContext';
import ProtectedRoute from './components/ProtectedRoute';
import DashboardLayout from './layouts/DashboardLayout.tsx';

import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';

import StudentDashboard from './pages/student/StudentDashboard';
import FacultyDashboard from './pages/faculty/FacultyDashboard';
import SpecialTripRequestPage from './pages/faculty/SpecialTripRequestPage';
import DriverDashboard from './pages/driver/DriverDashboard';
import AdminDashboard from './pages/admin/AdminDashboard';
import FuelConsumptionPage from './pages/admin/FuelConsumptionPage';
import ManageUsersPage from './pages/admin/ManageUsersPage';
import ManageRoutesPage from './pages/admin/ManageRoutesPage';
import ManageSchedulesPage from './pages/admin/ManageSchedulesPage';
import ManageVehiclesPage from './pages/admin/ManageVehiclesPage';
import SpecialRequestsPage from './pages/admin/SpecialRequestsPage';
import ReportsPage from './pages/admin/ReportsPage';

import TrackBus from './pages/shared/TrackBus';
import SchedulesPage from './pages/shared/SchedulesPage';
import NotificationsPage from './pages/shared/NotificationsPage';
import ProfilePage from './pages/shared/ProfilePage';

export default function App() {
  return (
    <AuthProvider>
      <NotificationProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/login" element={<LoginPage />} />

            {/* ---------------- Student ---------------- */}
            <Route
              path="/student"
              element={
                <ProtectedRoute allowedRoles={['Student']}>
                  <DashboardLayout pageTitle="Student Dashboard" pageSubtitle="Track buses, view schedules, and stay updated" />
                </ProtectedRoute>
              }
            >
              <Route path="dashboard" element={<StudentDashboard />} />
              <Route path="track-bus" element={<TrackBus />} />
              <Route path="schedules" element={<SchedulesPage />} />
              <Route path="notifications" element={<NotificationsPage />} />
              <Route path="profile" element={<ProfilePage />} />
              <Route index element={<Navigate to="dashboard" replace />} />
            </Route>

            {/* ---------------- Faculty ---------------- */}
            <Route
              path="/faculty"
              element={
                <ProtectedRoute allowedRoles={['Faculty']}>
                  <DashboardLayout pageTitle="Faculty Dashboard" pageSubtitle="Track buses, view schedules, and manage trip requests" />
                </ProtectedRoute>
              }
            >
              <Route path="dashboard" element={<FacultyDashboard />} />
              <Route path="track-bus" element={<TrackBus />} />
              <Route path="schedules" element={<SchedulesPage />} />
              <Route path="special-trip-request" element={<SpecialTripRequestPage />} />
              <Route path="notifications" element={<NotificationsPage />} />
              <Route path="profile" element={<ProfilePage />} />
              <Route index element={<Navigate to="dashboard" replace />} />
            </Route>

            {/* ---------------- Driver ---------------- */}
            <Route
              path="/driver"
              element={
                <ProtectedRoute allowedRoles={['Driver']}>
                  <DashboardLayout pageTitle="Driver Dashboard" pageSubtitle="Manage your assigned trips" />
                </ProtectedRoute>
              }
            >
              <Route path="dashboard" element={<DriverDashboard />} />
              <Route path="profile" element={<ProfilePage />} />
              <Route index element={<Navigate to="dashboard" replace />} />
            </Route>

           {/* ---------------- Administrator ---------------- */}
            <Route
              path="/admin"
              element={
                <ProtectedRoute allowedRoles={['Administrator']}>
                  <DashboardLayout pageTitle="Admin Dashboard" pageSubtitle="Manage transport operations" />
                </ProtectedRoute>
              }
            >
              <Route path="dashboard" element={<AdminDashboard />} />
              <Route path="users" element={<ManageUsersPage />} />
              <Route path="routes" element={<ManageRoutesPage />} />
              <Route path="schedules" element={<ManageSchedulesPage />} />
              <Route path="vehicles" element={<ManageVehiclesPage />} />
              <Route path="special-requests" element={<SpecialRequestsPage />} />
              <Route path="reports" element={<ReportsPage />} />
              <Route path="fuel" element={<FuelConsumptionPage />} />
              <Route path="profile" element={<ProfilePage />} />
              <Route index element={<Navigate to="dashboard" replace />} />
            </Route>

            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </BrowserRouter>
      </NotificationProvider>
    </AuthProvider>
  );
}
