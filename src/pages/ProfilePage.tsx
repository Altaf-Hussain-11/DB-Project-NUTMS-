import React, { useEffect, useState } from 'react';
import { api, getErrorMessage } from "../services/client.ts";
import { useAuth } from '../context/AuthContext';
import type { Profile } from '../types';

export default function ProfilePage() {
  useAuth();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    api.get('/auth/profile').then((res) => {
      setProfile(res.data);
      setFullName(res.data.Full_Name);
      setEmail(res.data.Email);
    }).catch((err) => setMessage({ type: 'error', text: getErrorMessage(err) }));
  }, []);

  async function handleSaveProfile(e: React.FormEvent) {
    e.preventDefault();
    setMessage(null);
    setLoading(true);
    try {
      await api.put('/auth/profile', { fullName, email });
      setMessage({ type: 'success', text: 'Profile updated successfully.' });
    } catch (err) {
      setMessage({ type: 'error', text: getErrorMessage(err) });
    } finally {
      setLoading(false);
    }
  }

  async function handleChangePassword(e: React.FormEvent) {
    e.preventDefault();
    setMessage(null);
    if (newPassword !== confirmPassword) {
      setMessage({ type: 'error', text: 'Passwords do not match.' });
      return;
    }
    setLoading(true);
    try {
      await api.put('/auth/password', { newPassword });
      setMessage({ type: 'success', text: 'Password changed successfully.' });
      setNewPassword('');
      setConfirmPassword('');
    } catch (err) {
      setMessage({ type: 'error', text: getErrorMessage(err) });
    } finally {
      setLoading(false);
    }
  }

  if (!profile) return <p>Loading profile...</p>;

  return (
    <div>
      <h2>My Profile</h2>
      {message && <div className={`alert alert-${message.type === 'success' ? 'success' : 'error'}`}>{message.text}</div>}

      <div className="grid grid-cols-2">
        <div className="card">
          <h3 style={{ marginTop: 0 }}>Account Information</h3>
          <form onSubmit={handleSaveProfile}>
            <div className="form-group">
              <label>Full Name</label>
              <input className="form-control" value={fullName} onChange={(e) => setFullName(e.target.value)} required />
            </div>
            <div className="form-group">
              <label>Email</label>
              <input type="email" className="form-control" value={email} onChange={(e) => setEmail(e.target.value)} required />
            </div>
            <div className="form-group">
              <label>Role</label>
              <input className="form-control" value={profile.role_id} disabled />
            </div>

            {profile.role_id === 'Student' && (
              <>
                <div className="form-group">
                  <label>Registration No</label>
                  <input className="form-control" value={profile.Registration_No || ''} disabled />
                </div>
                <div className="form-group">
                  <label>Residential Type</label>
                  <input className="form-control" value={profile.Residential_Type || ''} disabled />
                </div>
              </>
            )}

            {profile.role_id === 'Faculty' && (
              <>
                <div className="form-group">
                  <label>Employee ID</label>
                  <input className="form-control" value={profile.employee_id || ''} disabled />
                </div>
                <div className="form-row">
                  <div className="form-group">
                    <label>Department</label>
                    <input className="form-control" value={profile.department || ''} disabled />
                  </div>
                  <div className="form-group">
                    <label>Designation</label>
                    <input className="form-control" value={profile.designation || ''} disabled />
                  </div>
                </div>
              </>
            )}

            {profile.role_id === 'Driver' && (
              <>
                <div className="form-row">
                  <div className="form-group">
                    <label>Driver ID</label>
                    <input className="form-control" value={profile.driver_id || ''} disabled />
                  </div>
                  <div className="form-group">
                    <label>License Number</label>
                    <input className="form-control" value={profile.license_number || ''} disabled />
                  </div>
                </div>
                <div className="form-group">
                  <label>Status</label>
                  <input className="form-control" value={profile.driver_status || ''} disabled />
                </div>
              </>
            )}

            {profile.role_id === 'Administrator' && (
              <div className="form-group">
                <label>Admin Level</label>
                <input className="form-control" value={profile.Admin_Level || ''} disabled />
              </div>
            )}

            <button type="submit" className="btn btn-primary" disabled={loading}>Save Changes</button>
          </form>
        </div>

        <div className="card">
          <h3 style={{ marginTop: 0 }}>Change Password</h3>
          <form onSubmit={handleChangePassword}>
            <div className="form-group">
              <label>New Password</label>
              <input type="password" className="form-control" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} required minLength={6} />
            </div>
            <div className="form-group">
              <label>Confirm New Password</label>
              <input type="password" className="form-control" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required minLength={6} />
            </div>
            <button type="submit" className="btn btn-primary" disabled={loading}>Change Password</button>
          </form>
        </div>
      </div>
    </div>
  );
}
