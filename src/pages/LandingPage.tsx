import React from 'react';
import { Link } from 'react-router-dom';

const FEATURES = [
  {
    icon: '🗺️',
    color: 'var(--color-primary-light)',
    iconColor: 'var(--color-primary-dark)',
    title: 'Route & Schedule Viewing',
    desc: 'View comprehensive bus schedules and routes with real-time updates and timing information.',
  },
  {
    icon: '📍',
    color: 'var(--color-accent-light)',
    iconColor: 'var(--color-accent)',
    title: 'Real-Time Bus Tracking',
    desc: 'Track buses in real time on an interactive map. See live locations, ETAs, and current route progress.',
  },
  {
    icon: '📅',
    color: '#fdf2e9',
    iconColor: '#d97706',
    title: 'Schedules',
    desc: 'Access detailed bus schedules with departure times, stops, and frequency information.',
  },
  {
    icon: '🔔',
    color: 'var(--color-warning-light)',
    iconColor: 'var(--color-warning)',
    title: 'Notifications & Alerts',
    desc: 'Receive instant notifications about delays, route changes, and important announcements.',
  },
  {
    icon: '🛡️',
    color: 'var(--color-accent-light)',
    iconColor: 'var(--color-accent)',
    title: 'Role-Based Access',
    desc: 'Secure, role-specific dashboards for students, faculty, drivers, and administrators with appropriate permissions.',
  },
  {
    icon: '🚐',
    color: '#f3e8ff',
    iconColor: '#9333ea',
    title: 'Special Trip Requests',
    desc: 'Faculty can request special vehicles for events and trips with a streamlined approval workflow.',
  },
];

export default function LandingPage() {
  return (
    <div>
      <header className="landing-header">
        <div className="landing-brand">
          <div className="sidebar-brand-icon">🚌</div>
          <div className="sidebar-brand-text">
            <strong>Namal University</strong>
            <span>Transport Management System</span>
          </div>
        </div>
        <Link to="/login" className="btn btn-primary">Login</Link>
      </header>

      <section className="landing-hero">
        <h1>Namal University Transport<br />Management System</h1>
        <p>
          A comprehensive web-based solution for managing university transportation.
          Track buses in real time, view schedules, request special vehicles, and
          receive instant notifications.
        </p>
        <div className="cta-row">
          <Link to="/login" className="btn btn-primary">Get Started</Link>
          <Link to="/login" className="btn btn-outline">View Bus Routes</Link>
        </div>
      </section>

      <section className="landing-section">
        <h2>Key Features</h2>
        <div className="feature-grid">
          {FEATURES.map((f) => (
            <div className="feature-card" key={f.title}>
              <div className="feature-icon" style={{ backgroundColor: f.color, color: f.iconColor }}>
                {f.icon}
              </div>
              <h3 style={{ margin: '0 0 8px', fontSize: 16 }}>{f.title}</h3>
              <p className="text-muted" style={{ fontSize: 14, margin: 0 }}>{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="stats-band">
        <div>
          <div className="stat-value">500+</div>
          <div className="stat-label">Active Users</div>
        </div>
        <div>
          <div className="stat-value">12</div>
          <div className="stat-label">Bus Routes</div>
        </div>
        <div>
          <div className="stat-value">25</div>
          <div className="stat-label">Buses</div>
        </div>
        <div>
          <div className="stat-value">10K+</div>
          <div className="stat-label">Monthly Trips</div>
        </div>
      </section>

      <footer className="landing-footer">
        © {new Date().getFullYear()} Namal University, Mianwali. All rights reserved.
      </footer>
    </div>
  );
}
