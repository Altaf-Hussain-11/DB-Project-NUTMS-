import React, { useEffect, useState } from 'react';
import { api, getErrorMessage } from "../../services/client.ts";
import type { AdminUserRow} from '../../types';
import StatusBadge from '../../components/StatusBadge';
import Modal from '../../components/Modal';

type RoleFilter = 'All' | 'Student' | 'Faculty' | 'Driver' | 'Administrator';
type AddRole = 'Student' | 'Faculty' | 'Driver';

const EMPTY_STUDENT = { fullName: '', email: '', password: '', registrationNo: '', residentialType: 'Hosteler' as 'Hosteler' | 'Day Scholar' };
const EMPTY_FACULTY = { fullName: '', email: '', password: '', employeeId: '', department: '', designation: '' };
const EMPTY_DRIVER = {
  fullName: '', email: '', password: '', driverId: '', licenseNumber: '',
  licenseExpiry: '', hireDate: '', emergencyContact: '', salary: '',
};

export default function ManageUsersPage() {
  const [roleFilter, setRoleFilter] = useState<RoleFilter>('All');
  const [users, setUsers] = useState<AdminUserRow[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const [showAddModal, setShowAddModal] = useState(false);
  const [addRole, setAddRole] = useState<AddRole>('Student');
  const [studentForm, setStudentForm] = useState(EMPTY_STUDENT);
  const [facultyForm, setFacultyForm] = useState(EMPTY_FACULTY);
  const [driverForm, setDriverForm] = useState(EMPTY_DRIVER);
  const [submitting, setSubmitting] = useState(false);

  const [editUser, setEditUser] = useState<AdminUserRow | null>(null);
const [editForm, setEditForm] = useState<Record<string, string>>({});

  const [deleteUser, setDeleteUser] = useState<AdminUserRow | null>(null);

  function loadUsers() {
    api.get(`/admin/users?role=${roleFilter}`)
      .then((res) => setUsers(res.data))
      .catch((err) => setError(getErrorMessage(err)));
  }

  useEffect(() => {
  api.get(`/admin/users?role=${roleFilter}`)
    .then((res) => setUsers(res.data))
    .catch((err) => setError(getErrorMessage(err)));
}, [roleFilter]);

  function clearMessages() {
    setError(null);
    setSuccess(null);
  }

  // -------------------------------------------------------------------
  // Add user
  // -------------------------------------------------------------------
  async function handleAddSubmit(e: React.FormEvent) {
    e.preventDefault();
    clearMessages();
    setSubmitting(true);
    try {
      if (addRole === 'Student') {
        await api.post('/admin/users/student', studentForm);
      } else if (addRole === 'Faculty') {
        await api.post('/admin/users/faculty', facultyForm);
      } else {
        await api.post('/admin/users/driver', { ...driverForm, salary: Number(driverForm.salary) });
      }
      setSuccess(`${addRole} added successfully.`);
      setShowAddModal(false);
      setStudentForm(EMPTY_STUDENT);
      setFacultyForm(EMPTY_FACULTY);
      setDriverForm(EMPTY_DRIVER);
      loadUsers();
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setSubmitting(false);
    }
  }

  // -------------------------------------------------------------------
  // Edit user
  // -------------------------------------------------------------------
  function openEdit(user: AdminUserRow) {
    clearMessages();
    setEditUser(user);
    if (user.role_id === 'Student') {
      setEditForm({
        fullName: user.Full_Name, email: user.Email,
        registrationNo: user.Registration_No || '', residentialType: user.Residential_Type || 'Hosteler',
      });
    } else if (user.role_id === 'Faculty') {
      setEditForm({
        fullName: user.Full_Name, email: user.Email,
        department: user.department || '', designation: user.designation || '',
      });
    } else if (user.role_id === 'Driver') {
      setEditForm({
        fullName: user.Full_Name, email: user.Email,
        licenseNumber: user.license_number || '', licenseExpiry: '', salary: '', status: user.driver_status || 'Active',
      });
    } else {
      setEditForm({ fullName: user.Full_Name, email: user.Email });
    }
  }

  async function handleEditSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!editUser) return;
    clearMessages();
    setSubmitting(true);
    try {
      if (editUser.role_id === 'Student') {
        await api.put(`/admin/users/student/${editUser.User_ID}`, editForm);
      } else if (editUser.role_id === 'Faculty') {
        await api.put(`/admin/users/faculty/${editUser.User_ID}`, editForm);
      } else if (editUser.role_id === 'Driver') {
        await api.put(`/admin/users/driver/${editUser.User_ID}`, { ...editForm, salary: Number(editForm.salary) || 0 });
      } else {
        // Administrator: no dedicated update endpoint beyond name/email; skip
      }
      setSuccess('User updated successfully.');
      setEditUser(null);
      loadUsers();
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setSubmitting(false);
    }
  }

  // -------------------------------------------------------------------
  // Delete user
  // -------------------------------------------------------------------
  async function handleDelete() {
    if (!deleteUser) return;
    clearMessages();
    try {
      await api.delete(`/admin/users/${deleteUser.User_ID}`);
      setSuccess('User deleted successfully.');
      setDeleteUser(null);
      loadUsers();
    } catch (err) {
      setError(getErrorMessage(err));
    }
  }

  return (
    <div>
      <div className="section-header">
        <h2>Manage Users</h2>
        <div className="flex gap-12">
          <select className="form-control" value={roleFilter} onChange={(e) => setRoleFilter(e.target.value as RoleFilter)} style={{ width: 180 }}>
            <option value="All">All Roles</option>
            <option value="Student">Students</option>
            <option value="Faculty">Faculty</option>
            <option value="Driver">Drivers</option>
            <option value="Administrator">Administrators</option>
          </select>
          <button className="btn btn-primary" onClick={() => { clearMessages(); setShowAddModal(true); }}>+ Add New User</button>
        </div>
      </div>

      {error && <div className="alert alert-error">{error}</div>}
      {success && <div className="alert alert-success">{success}</div>}

      <div className="card table-wrap">
        <table>
          <thead>
            <tr>
              <th>ID</th><th>Name</th><th>Email</th><th>Role</th><th>Details</th><th>Status</th><th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((u) => (
              <tr key={u.User_ID}>
                <td>{u.User_ID}</td>
                <td>{u.Full_Name}</td>
                <td>{u.Email}</td>
                <td>{u.role_id}</td>
                <td>
                  {u.role_id === 'Student' && `${u.Registration_No} • ${u.Residential_Type}`}
                  {u.role_id === 'Faculty' && `${u.employee_id} • ${u.department}`}
                  {u.role_id === 'Driver' && `${u.driver_id} • ${u.license_number}`}
                  {u.role_id === 'Administrator' && '—'}
                </td>
                <td>{u.driver_status ? <StatusBadge status={u.driver_status} /> : '—'}</td>
                <td>
                  <div className="flex gap-8">
                    {u.role_id !== 'Administrator' && (
                      <button className="btn btn-outline btn-sm" onClick={() => openEdit(u)}>Edit</button>
                    )}
                    <button className="btn btn-danger btn-sm" onClick={() => { clearMessages(); setDeleteUser(u); }}>Delete</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Add User Modal */}
      {showAddModal && (
        <Modal title="Add New User" onClose={() => setShowAddModal(false)}>
          <div className="form-group">
            <label>Role</label>
            <select className="form-control" value={addRole} onChange={(e) => setAddRole(e.target.value as AddRole)}>
              <option value="Student">Student</option>
              <option value="Faculty">Faculty</option>
              <option value="Driver">Driver</option>
            </select>
          </div>

          <form onSubmit={handleAddSubmit}>
            {addRole === 'Student' && (
              <>
                <div className="form-row">
                  <div className="form-group">
                    <label>Full Name</label>
                    <input className="form-control" value={studentForm.fullName} onChange={(e) => setStudentForm({ ...studentForm, fullName: e.target.value })} required />
                  </div>
                  <div className="form-group">
                    <label>Email</label>
                    <input type="email" className="form-control" value={studentForm.email} onChange={(e) => setStudentForm({ ...studentForm, email: e.target.value })} required />
                  </div>
                </div>
                <div className="form-row">
                  <div className="form-group">
                    <label>Password</label>
                    <input type="password" className="form-control" value={studentForm.password} onChange={(e) => setStudentForm({ ...studentForm, password: e.target.value })} required minLength={6} />
                  </div>
                  <div className="form-group">
                    <label>Registration No</label>
                    <input className="form-control" value={studentForm.registrationNo} onChange={(e) => setStudentForm({ ...studentForm, registrationNo: e.target.value })} required />
                  </div>
                </div>
                <div className="form-group">
                  <label>Residential Type</label>
                  <select className="form-control" value={studentForm.residentialType} onChange={(e) => setStudentForm({ ...studentForm, residentialType: e.target.value as 'Hosteler' | 'Day Scholar' })}>
                    <option value="Hosteler">Hosteler</option>
                    <option value="Day Scholar">Day Scholar</option>
                  </select>
                </div>
              </>
            )}

            {addRole === 'Faculty' && (
              <>
                <div className="form-row">
                  <div className="form-group">
                    <label>Full Name</label>
                    <input className="form-control" value={facultyForm.fullName} onChange={(e) => setFacultyForm({ ...facultyForm, fullName: e.target.value })} required />
                  </div>
                  <div className="form-group">
                    <label>Email</label>
                    <input type="email" className="form-control" value={facultyForm.email} onChange={(e) => setFacultyForm({ ...facultyForm, email: e.target.value })} required />
                  </div>
                </div>
                <div className="form-row">
                  <div className="form-group">
                    <label>Password</label>
                    <input type="password" className="form-control" value={facultyForm.password} onChange={(e) => setFacultyForm({ ...facultyForm, password: e.target.value })} required minLength={6} />
                  </div>
                  <div className="form-group">
                    <label>Employee ID</label>
                    <input className="form-control" value={facultyForm.employeeId} onChange={(e) => setFacultyForm({ ...facultyForm, employeeId: e.target.value })} required />
                  </div>
                </div>
                <div className="form-row">
                  <div className="form-group">
                    <label>Department</label>
                    <input className="form-control" value={facultyForm.department} onChange={(e) => setFacultyForm({ ...facultyForm, department: e.target.value })} required />
                  </div>
                  <div className="form-group">
                    <label>Designation</label>
                    <input className="form-control" value={facultyForm.designation} onChange={(e) => setFacultyForm({ ...facultyForm, designation: e.target.value })} required />
                  </div>
                </div>
              </>
            )}

            {addRole === 'Driver' && (
              <>
                <div className="form-row">
                  <div className="form-group">
                    <label>Full Name</label>
                    <input className="form-control" value={driverForm.fullName} onChange={(e) => setDriverForm({ ...driverForm, fullName: e.target.value })} required />
                  </div>
                  <div className="form-group">
                    <label>Email</label>
                    <input type="email" className="form-control" value={driverForm.email} onChange={(e) => setDriverForm({ ...driverForm, email: e.target.value })} required />
                  </div>
                </div>
                <div className="form-row">
                  <div className="form-group">
                    <label>Password</label>
                    <input type="password" className="form-control" value={driverForm.password} onChange={(e) => setDriverForm({ ...driverForm, password: e.target.value })} required minLength={6} />
                  </div>
                  <div className="form-group">
                    <label>Driver ID</label>
                    <input className="form-control" value={driverForm.driverId} onChange={(e) => setDriverForm({ ...driverForm, driverId: e.target.value })} placeholder="DRV-XX" required />
                  </div>
                </div>
                <div className="form-row">
                  <div className="form-group">
                    <label>License Number</label>
                    <input className="form-control" value={driverForm.licenseNumber} onChange={(e) => setDriverForm({ ...driverForm, licenseNumber: e.target.value })} required />
                  </div>
                  <div className="form-group">
                    <label>License Expiry</label>
                    <input type="date" className="form-control" value={driverForm.licenseExpiry} onChange={(e) => setDriverForm({ ...driverForm, licenseExpiry: e.target.value })} required />
                  </div>
                </div>
                <div className="form-row">
                  <div className="form-group">
                    <label>Hire Date</label>
                    <input type="date" className="form-control" value={driverForm.hireDate} onChange={(e) => setDriverForm({ ...driverForm, hireDate: e.target.value })} required />
                  </div>
                  <div className="form-group">
                    <label>Emergency Contact</label>
                    <input className="form-control" value={driverForm.emergencyContact} onChange={(e) => setDriverForm({ ...driverForm, emergencyContact: e.target.value })} required />
                  </div>
                </div>
                <div className="form-group">
                  <label>Salary</label>
                  <input type="number" className="form-control" value={driverForm.salary} onChange={(e) => setDriverForm({ ...driverForm, salary: e.target.value })} required />
                </div>
              </>
            )}

            <div className="modal-actions">
              <button type="button" className="btn btn-outline" onClick={() => setShowAddModal(false)}>Cancel</button>
              <button type="submit" className="btn btn-primary" disabled={submitting}>{submitting ? 'Saving...' : 'Add User'}</button>
            </div>
          </form>
        </Modal>
      )}

      {/* Edit User Modal */}
      {editUser && (
        <Modal title={`Edit ${editUser.role_id} - ${editUser.Full_Name}`} onClose={() => setEditUser(null)}>
          <form onSubmit={handleEditSubmit}>
            <div className="form-row">
              <div className="form-group">
                <label>Full Name</label>
                <input className="form-control" value={editForm.fullName} onChange={(e) => setEditForm({ ...editForm, fullName: e.target.value })} required />
              </div>
              <div className="form-group">
                <label>Email</label>
                <input type="email" className="form-control" value={editForm.email} onChange={(e) => setEditForm({ ...editForm, email: e.target.value })} required />
              </div>
            </div>

            {editUser.role_id === 'Student' && (
              <>
                <div className="form-group">
                  <label>Registration No</label>
                  <input className="form-control" value={editForm.registrationNo} onChange={(e) => setEditForm({ ...editForm, registrationNo: e.target.value })} required />
                </div>
                <div className="form-group">
                  <label>Residential Type</label>
                  <select className="form-control" value={editForm.residentialType} onChange={(e) => setEditForm({ ...editForm, residentialType: e.target.value })}>
                    <option value="Hosteler">Hosteler</option>
                    <option value="Day Scholar">Day Scholar</option>
                  </select>
                </div>
              </>
            )}

            {editUser.role_id === 'Faculty' && (
              <div className="form-row">
                <div className="form-group">
                  <label>Department</label>
                  <input className="form-control" value={editForm.department} onChange={(e) => setEditForm({ ...editForm, department: e.target.value })} required />
                </div>
                <div className="form-group">
                  <label>Designation</label>
                  <input className="form-control" value={editForm.designation} onChange={(e) => setEditForm({ ...editForm, designation: e.target.value })} required />
                </div>
              </div>
            )}

            {editUser.role_id === 'Driver' && (
              <>
                <div className="form-row">
                  <div className="form-group">
                    <label>License Number</label>
                    <input className="form-control" value={editForm.licenseNumber} onChange={(e) => setEditForm({ ...editForm, licenseNumber: e.target.value })} required />
                  </div>
                  <div className="form-group">
                    <label>License Expiry</label>
                    <input type="date" className="form-control" value={editForm.licenseExpiry} onChange={(e) => setEditForm({ ...editForm, licenseExpiry: e.target.value })} required />
                  </div>
                </div>
                <div className="form-row">
                  <div className="form-group">
                    <label>Salary</label>
                    <input type="number" className="form-control" value={editForm.salary} onChange={(e) => setEditForm({ ...editForm, salary: e.target.value })} required />
                  </div>
                  <div className="form-group">
                    <label>Status</label>
                    <select className="form-control" value={editForm.status} onChange={(e) => setEditForm({ ...editForm, status: e.target.value })}>
                      <option value="Active">Active</option>
                      <option value="On Leave">On Leave</option>
                      <option value="Terminated">Terminated</option>
                    </select>
                  </div>
                </div>
              </>
            )}

            <div className="modal-actions">
              <button type="button" className="btn btn-outline" onClick={() => setEditUser(null)}>Cancel</button>
              <button type="submit" className="btn btn-primary" disabled={submitting}>{submitting ? 'Saving...' : 'Save Changes'}</button>
            </div>
          </form>
        </Modal>
      )}

      {/* Delete Confirmation Modal */}
      {deleteUser && (
        <Modal title="Confirm Deletion" onClose={() => setDeleteUser(null)} footer={
          <>
            <button className="btn btn-outline" onClick={() => setDeleteUser(null)}>Cancel</button>
            <button className="btn btn-danger" onClick={handleDelete}>Delete</button>
          </>
        }>
          <p>
            Are you sure you want to permanently delete <strong>{deleteUser.Full_Name}</strong> ({deleteUser.role_id})?
            This action cannot be undone.
          </p>
        </Modal>
      )}
    </div>
  );
}
