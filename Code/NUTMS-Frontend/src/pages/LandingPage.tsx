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
  function scrollTo(id: string) {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  }

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>

      {/* ── Top Navbar ── */}
      <nav style={{
        position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100,
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '0 32px', height: 64,
        background: 'rgba(255,255,255,0.95)', backdropFilter: 'blur(8px)',
        borderBottom: '1px solid var(--color-border)',
        boxShadow: '0 2px 12px rgba(0,0,0,0.06)',
      }}>
        {/* Left — Brand */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <span style={{ fontSize: 28 }}>🚌</span>
          <div style={{ lineHeight: 1.2 }}>
            <div style={{ fontWeight: 700, fontSize: 15, color: 'var(--color-primary)' }}>Namal University</div>
            <div style={{ fontSize: 11, color: 'var(--color-text-muted)' }}>Transport Management System</div>
          </div>
        </div>

        {/* Right — Nav Links */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 24 }}>
          <button onClick={() => scrollTo('hero')} style={{ background: 'none', border: 'none', cursor: 'pointer', fontWeight: 500, fontSize: 14, color: 'var(--color-text)' }}>Home</button>
          <button onClick={() => scrollTo('features')} style={{ background: 'none', border: 'none', cursor: 'pointer', fontWeight: 500, fontSize: 14, color: 'var(--color-text)' }}>Features</button>
          <button onClick={() => scrollTo('about')} style={{ background: 'none', border: 'none', cursor: 'pointer', fontWeight: 500, fontSize: 14, color: 'var(--color-text)' }}>About</button>
          <Link to="/login" className="btn btn-primary" style={{ fontSize: 14, padding: '8px 20px' }}>Login</Link>
        </div>
      </nav>

      {/* ── Hero Section ── */}
 <section id="hero" style={{
  marginTop: 64,
 background: 'linear-gradient(135deg, #0F172A 0%, #0D7377 60%, #14A085 100%)',
  color: 'white', padding: '90px 32px',
  textAlign: 'center', position: 'relative', overflow: 'hidden',
}}>
  {/* Decorative circles */}
  <div style={{ position: 'absolute', top: -80, right: -80, width: 350, height: 350, borderRadius: '50%', background: 'rgba(255,255,255,0.07)', pointerEvents: 'none' }} />
  <div style={{ position: 'absolute', bottom: -60, left: -60, width: 280, height: 280, borderRadius: '50%', background: 'rgba(255,255,255,0.06)', pointerEvents: 'none' }} />
  <div style={{ position: 'absolute', top: '40%', right: '15%', width: 120, height: 120, borderRadius: '50%', background: 'rgba(255,255,255,0.04)', pointerEvents: 'none' }} />
  <div style={{ position: 'absolute', top: '20%', left: '10%', width: 80, height: 80, borderRadius: '50%', background: 'rgba(255,255,255,0.05)', pointerEvents: 'none' }} />
        <div style={{ position: 'relative', zIndex: 1, maxWidth: 700, margin: '0 auto' }}>
          <div style={{ display: 'inline-block', background: 'rgba(255,255,255,0.15)', borderRadius: 20, padding: '4px 16px', fontSize: 13, marginBottom: 20, backdropFilter: 'blur(4px)' }}>
            🚌 Smart Transport for Namal University
          </div>
          <h1 style={{ fontSize: 42, fontWeight: 800, margin: '0 0 20px', lineHeight: 1.2 }}>
            Namal University Transport<br />Management System
          </h1>
          <p style={{ fontSize: 18, opacity: 0.9, marginBottom: 36, lineHeight: 1.7 }}>
            A comprehensive web-based solution for managing university transportation.
            Track buses in real time, view schedules, request special vehicles, and
            receive instant notifications.
          </p>
          <div className="cta-row">
            <Link to="/login" className="btn" style={{ background: 'white', color: 'var(--color-primary)', fontWeight: 700, padding: '12px 28px', fontSize: 15 }}>Get Started</Link>
            <button onClick={() => scrollTo('features')} className="btn" style={{ background: 'rgba(255,255,255,0.15)', color: 'white', border: '2px solid rgba(255,255,255,0.4)', padding: '12px 28px', fontSize: 15 }}>View Features</button>
          </div>
        </div>
      </section>

      {/* ── Features Section ── */}
      <section id="features" className="landing-section" style={{ background: '#f8fffe' }}>
        <h2 style={{ textAlign: 'center', marginBottom: 8 }}>Key Features</h2>
        <p className="text-muted" style={{ textAlign: 'center', marginBottom: 40, fontSize: 15 }}>Everything you need to manage university transport efficiently</p>
        <div className="feature-grid">
          {FEATURES.map((f) => (
            <div className="feature-card" key={f.title} style={{ transition: 'transform 0.2s, box-shadow 0.2s' }}
              onMouseEnter={(e) => { (e.currentTarget as HTMLDivElement).style.transform = 'translateY(-4px)'; (e.currentTarget as HTMLDivElement).style.boxShadow = '0 8px 24px rgba(0,0,0,0.12)'; }}
              onMouseLeave={(e) => { (e.currentTarget as HTMLDivElement).style.transform = 'translateY(0)'; (e.currentTarget as HTMLDivElement).style.boxShadow = ''; }}
            >
              <div className="feature-icon" style={{ backgroundColor: f.color, color: f.iconColor }}>{f.icon}</div>
              <h3 style={{ margin: '0 0 8px', fontSize: 16 }}>{f.title}</h3>
              <p className="text-muted" style={{ fontSize: 14, margin: 0 }}>{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── Stats Band ── */}
      <section className="stats-band" style={{ background: 'var(--color-primary)', color: 'white' }}>
        {[
          { value: '500+', label: 'Active Users' },
          { value: '12', label: 'Bus Routes' },
          { value: '25', label: 'Buses' },
          { value: '10K+', label: 'Monthly Trips' },
        ].map((s) => (
          <div key={s.label} style={{ textAlign: 'center' }}>
            <div className="stat-value" style={{ color: 'white', fontSize: 36, fontWeight: 800 }}>{s.value}</div>
            <div className="stat-label" style={{ color: 'rgba(255,255,255,0.8)', fontSize: 14 }}>{s.label}</div>
          </div>
        ))}
      </section>

      {/* ── About Section ── */}
<section id="about" className="about-section">
  <div className="about-inner">
    <h2 style={{ textAlign: 'center', marginBottom: 8 }}>About NUTMS</h2>
    <p className="text-muted" style={{ textAlign: 'center', marginBottom: 48, fontSize: 15 }}>
      Digitizing university transport for a better campus experience
    </p>

    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 32, marginBottom: 40 }}>
      {/* About Us */}
      <div style={{ background:  'linear-gradient(135deg, #0f9d8f 0%, #0a4a44 100%)', borderRadius: 16, padding: 32 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
          <span style={{ fontSize: 28 }}>🏫</span>
          <h3 style={{ margin: 0, fontSize: 20, color:'white' }}>About Us</h3>
        </div>
        <p style={{ lineHeight: 1.85, color: 'rgba(255,255,255,0.9)', fontSize: 14.5, margin: 0 }}>
          The Namal University Transport Management System (NUTMS) is a modern, web-based platform
          built to digitize and streamline all transport operations at Namal University, Mianwali.
          It serves as a single platform connecting students, faculty, drivers, and administrators —
          replacing manual paperwork with a fast, transparent, and accessible digital system.
          From real-time GPS bus tracking to automated scheduling and special trip approvals,
          NUTMS brings efficiency and clarity to every aspect of university transport.
        </p>
      </div>

      {/* Our Mission */}
      <div style={{ background: 'linear-gradient(135deg, #0f9d8f 0%, #0a4a44 100%)', borderRadius: 16, padding: 32 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
          <span style={{ fontSize: 28 }}>🎯</span>
          <h3 style={{ margin: 0, fontSize: 20, color: 'white' }}>Our Mission</h3>
        </div>
        <p style={{ lineHeight: 1.85, color: 'rgba(255,255,255,0.9)', fontSize: 14.5, margin: 0 }}>
          Our mission is to provide Namal University with a safe, reliable, and transparent
          transport management experience. We aim to reduce delays, improve accountability,
          and empower every member of the university community — whether tracking a bus in
          real time, requesting a special trip, or managing the entire fleet — through a
          single, easy-to-use platform built on modern technology.
        </p>
      </div>
    </div>
  </div>
</section>

      {/* ── Footer ── */}
      <footer style={{ background: '#0F172A', 
        color: 'rgba(255,255,255,0.85)',
        padding: '48px 32px 24px',
        marginTop: 'auto',
      }}>
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr', gap: 40, marginBottom: 40 }}>

            {/* Brand */}
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
                <span style={{ fontSize: 28 }}>🚌</span>
                <div>
                  <div style={{ fontWeight: 700, fontSize: 15, color: 'white' }}>Namal University</div>
                  <div style={{ fontSize: 11, opacity: 0.7 }}>Transport Management System</div>
                </div>
              </div>
              <p style={{ fontSize: 13, lineHeight: 1.7, opacity: 0.7, maxWidth: 280 }}>
                A digital platform for managing university transport operations — built for students, faculty, drivers, and administrators.
              </p>
            </div>

            {/* Quick Links */}
            <div>
              <div style={{ fontWeight: 600, color: 'white', marginBottom: 16, fontSize: 14 }}>Quick Links</div>
              {['Home', 'Features', 'About'].map((link) => (
                <div key={link} style={{ marginBottom: 10 }}>
                  <button onClick={() => scrollTo(link.toLowerCase())} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'rgba(255,255,255,0.7)', fontSize: 13, padding: 0 }}>{link}</button>
                </div>
              ))}
              <div style={{ marginBottom: 10 }}>
                <Link to="/login" style={{ color: 'rgba(255,255,255,0.7)', fontSize: 13, textDecoration: 'none' }}>Login</Link>
              </div>
            </div>

            {/* Contact */}
            <div>
              <div style={{ fontWeight: 600, color: 'white', marginBottom: 16, fontSize: 14 }}>Contact</div>
              <div style={{ fontSize: 13, opacity: 0.7, lineHeight: 2 }}>
                <div>📍 Namal University</div>
                <div>Mianwali, Punjab, Pakistan</div>
                <div style={{ marginTop: 8 }}>📧 transport@namal.edu.pk</div>
                <div>📞 +92-459-236026</div>
              </div>
            </div>
          </div>

          {/* Bottom bar */}
          <div style={{ borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: 20, display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: 12, opacity: 0.6 }}>
            <span>© {new Date().getFullYear()} Namal University, Mianwali. All rights reserved.</span>
            <span>NUTMS v1.0 — Database Systems Project</span>
          </div>
        </div>
      </footer>

    </div>
  );
}