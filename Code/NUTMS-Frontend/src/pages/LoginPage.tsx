import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
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
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>

      {/* ── Navbar ── */}
      <nav className="landing-navbar">
        <div className="landing-navbar-brand">
          <div className="brand-icon">🚌</div>
          <div>
            <div className="brand-name">Namal University</div>
            <div className="brand-sub">Transport Management System</div>
          </div>
        </div>
        <div className="landing-nav-links">
          <Link to="/" className="nav-link">Home</Link>
          <Link to="/#about" className="nav-link">About</Link>
          <Link to="/login" className="btn btn-primary" style={{ fontSize: 14, padding: '8px 20px' }}>Login</Link>
        </div>
      </nav>

      {/* ── Main Content ── */}
      <div style={{
        flex: 1,
        marginTop: 64,
        background: 'linear-gradient(-45deg, #0F172A, #0D7377, #14A085, #0A5A5D)',
        backgroundSize: '400% 400%',
        animation: 'gradientShift 8s ease infinite',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '60px 80px',
        position: 'relative',
        overflow: 'hidden',
      }}>

        {/* Decorative circles */}
        <div style={{ position: 'absolute', top: -100, left: -100, width: 400, height: 400, borderRadius: '50%', background: 'rgba(255,255,255,0.03)', pointerEvents: 'none' }} />
        <div style={{ position: 'absolute', bottom: -80, right: '40%', width: 300, height: 300, borderRadius: '50%', background: 'rgba(255,255,255,0.04)', pointerEvents: 'none' }} />
        <div style={{ position: 'absolute', top: '30%', left: '35%', width: 200, height: 200, borderRadius: '50%', background: 'rgba(255,255,255,0.03)', pointerEvents: 'none' }} />

        {/* ── Left Branding ── */}
        <div style={{ color: 'white', maxWidth: 480, zIndex: 1 }}>
          <div style={{
            width: 72, height: 72, borderRadius: 18,
            background: 'rgba(255,255,255,0.15)',
            backdropFilter: 'blur(8px)',
            border: '1px solid rgba(255,255,255,0.2)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 32, marginBottom: 28,
          }}>🚌</div>

          <h1 style={{ fontSize: 38, fontWeight: 800, margin: '0 0 12px', lineHeight: 1.2 }}>
            Welcome To<br />Namal University
          </h1>
          <h2 style={{ fontSize: 18, fontWeight: 400, margin: '0 0 24px', opacity: 0.8 }}>
            Transport Management System
          </h2>
          <p style={{ fontSize: 14, opacity: 0.65, lineHeight: 1.85, maxWidth: 380, margin: '0 0 40px' }}>
            A comprehensive platform for managing university transport operations.
            Track buses in real time, view schedules, and request special trips.
          </p>

          <div style={{ display: 'flex', gap: 32 }}>
            {[{ value: '500+', label: 'Active Users' }, { value: '12', label: 'Bus Routes' }, { value: '25', label: 'Buses' }].map((s) => (
              <div key={s.label}>
                <div style={{ fontSize: 24, fontWeight: 800 }}>{s.value}</div>
                <div style={{ fontSize: 12, opacity: 0.65 }}>{s.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* ── Right Login Card ── */}
        <div style={{
          background: 'white',
          borderRadius: 20,
          padding: '40px 36px',
          width: '100%',
          maxWidth: 420,
          boxShadow: '0 24px 64px rgba(0,0,0,0.25)',
          zIndex: 1,
        }}>
          <h2 style={{ fontSize: 26, fontWeight: 800, margin: '0 0 4px', color: 'var(--color-text)' }}>
            Sign In
          </h2>
          <p style={{ fontSize: 13, color: 'var(--color-text-muted)', margin: '0 0 24px' }}>
            Namal University — Transport Management System
          </p>

          {error && <div className="alert alert-error">{error}</div>}

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>I am a</label>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 8, marginTop: 4 }}>
                {ROLES.map((r) => (
                  <div
                    key={r}
                    onClick={() => setRole(r)}
                    style={{
                      border: `2px solid ${role === r ? 'var(--color-primary)' : 'var(--color-border)'}`,
                      borderRadius: 10,
                      padding: '10px 4px',
                      textAlign: 'center',
                      fontSize: 11,
                      fontWeight: 600,
                      cursor: 'pointer',
                      background: role === r ? 'var(--color-primary-light)' : 'white',
                      color: role === r ? 'var(--color-primary-dark)' : 'var(--color-text-muted)',
                      transition: 'all 0.15s',
                    }}
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

            <button
              type="submit"
              className="btn btn-primary"
              style={{ width: '100%', padding: '13px', fontSize: 15, marginTop: 8, borderRadius: 10 }}
              disabled={loading}
            >
              {loading ? 'Signing in...' : 'Sign In →'}
            </button>
          </form>

          <p style={{ fontSize: 12, textAlign: 'center', marginTop: 20, color: 'var(--color-text-muted)' }}>
            Demo accounts use password: <strong>password</strong>
          </p>
        </div>

      </div>

      {/* ── Footer ── */}
      <footer style={{ background: '#0F172A', color: 'rgba(255,255,255,0.6)', textAlign: 'center', padding: '16px 32px', fontSize: 12 }}>
        © {new Date().getFullYear()} Namal University, Mianwali. All rights reserved. &nbsp;|&nbsp; NUTMS v1.0
      </footer>

    </div>
  );
}