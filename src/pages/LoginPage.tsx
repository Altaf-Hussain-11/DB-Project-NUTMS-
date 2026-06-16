import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { getErrorMessage } from "../services/client.ts";
import type { Role } from '../types';

const ROLES: Role[] = ['Student', 'Faculty', 'Driver', 'Administrator'];

const ROLE_HOME: Record<Role, string> = {
  Student: '/student/dashboard',
  Faculty: '/faculty/dashboard',
  Driver: '/driver/dashboard',
  Administrator: '/admin/dashboard',
};

export default function LoginPage() {
  const [role, setRole] = useState<Role>('Student');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const user = await login(email, password);
      if (user.role !== role) {
        setError(`This account is registered as "${user.role}", not "${role}". Please select the correct role.`);
        setLoading(false);
        return;
      }
      navigate(ROLE_HOME[user.role]);
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="login-wrap">
      <div className="login-card">
        <div className="login-logo">🚌</div>
        <h1>Welcome Back</h1>
        <p className="subtitle">Sign in to NUTMS to continue</p>

        {error && <div className="alert alert-error">{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>I am a</label>
            <div className="role-select-grid">
              {ROLES.map((r) => (
                <div
                  key={r}
                  className={`role-option${role === r ? ' active' : ''}`}
                  onClick={() => setRole(r)}
                >
                  {r}
                </div>
              ))}
            </div>
          </div>

          <div className="form-group">
            <label>Email</label>
            <input
              type="email"
              className="form-control"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@namal.edu.pk"
              required
            />
          </div>

          <div className="form-group">
            <label>Password</label>
            <input
              type="password"
              className="form-control"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
            />
          </div>

          <button type="submit" className="btn btn-primary" style={{ width: '100%' }} disabled={loading}>
            {loading ? 'Signing in...' : 'Login'}
          </button>
        </form>

        <p className="text-muted" style={{ fontSize: 12, textAlign: 'center', marginTop: 16 }}>
          Demo seed accounts use password: <strong>password</strong>
        </p>
      </div>
    </div>
  );
}
