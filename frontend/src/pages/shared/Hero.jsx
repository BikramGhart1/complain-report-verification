import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import {
  selectIsAuthenticated,
  selectUserRole,
} from "../../features/auth/authSlice";

const STATS = [
  { value: "10,000+", label: "Cases resolved" },
  { value: "99.2%", label: "AI accuracy rate" },
  { value: "< 2 min", label: "Avg. response time" },
];

const FEATURES = [
  {
    icon: "ti-brain",
    title: "AI Evidence Analysis",
    desc: "Detects image manipulation using LBP scoring and densenet121 model.",
  },
  {
    icon: "ti-lock",
    title: "Secure & Confidential",
    desc: "End-to-end encrypted submissions with optional identity protection.",
  },
  {
    icon: "ti-map-pin",
    title: "Real-Time Tracking",
    desc: "Track your case at every stage from submission to resolution.",
  },
];

const Hero = () => {
  const navigate = useNavigate();
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const role = useSelector(selectUserRole);

  useEffect(() => {
    if (isAuthenticated) {
      navigate(role === "admin" ? "/admin/dashboard" : "/dashboard", {
        replace: true,
      });
    }
  }, [isAuthenticated, role, navigate]);

  if (isAuthenticated) return null;

  return (
    <div className="hero-root">
      <nav className="hero-nav">
        <div className="hero-brand">
          <div className="hero-brand-icon">
            <i className="ti ti-shield-check" aria-hidden="true" />
          </div>
          <div>
            <div className="hero-brand-name">AI Based</div>
            <div className="hero-brand-sub">Cybercrime Reporting System</div>
          </div>
        </div>
        <div className="hero-nav-actions">
          <button className="hero-btn-ghost" onClick={() => navigate("/login")}>
            Sign in
          </button>
          <button
            className="hero-btn-primary"
            onClick={() => navigate("/register")}
          >
            Register
          </button>
        </div>
      </nav>

      <div className="hero-body">
        <div className="hero-official-badge">
          <span className="hero-dot" />
          AI Based · Cybercrime Reporting System
        </div>

        <h1 className="hero-title">
          Cybercrime Complaint
          <br />
          Reporting System
        </h1>
        <p className="hero-subtitle">
          Submit cybercrime complaints securely. Our AI-assisted platform
          analyses evidence and let's you track reports.
        </p>

        <div className="hero-ctas">
          <button
            className="hero-btn-primary hero-btn-lg"
            onClick={() => navigate("/register")}
          >
            <i className="ti ti-file-plus" aria-hidden="true" />
            File a Complaint
          </button>
          <button
            className="hero-btn-ghost hero-btn-lg"
            onClick={() => navigate("/login")}
          >
            <i className="ti ti-search" aria-hidden="true" />
            Track Complaint
          </button>
        </div>

        <div className="hero-stats">
          {STATS.map((s, i) => (
            <div key={i} className="hero-stat-card">
              <div className="hero-stat-value">{s.value}</div>
              <div className="hero-stat-label">{s.label}</div>
            </div>
          ))}
        </div>

        <div className="hero-divider" />
        <div className="hero-features">
          {FEATURES.map((f, i) => (
            <div key={i} className="hero-feature">
              <div className="hero-feature-icon">
                <i className={`ti ${f.icon}`} aria-hidden="true" />
              </div>
              <div>
                <div className="hero-feature-title">{f.title}</div>
                <div className="hero-feature-desc">{f.desc}</div>
              </div>
            </div>
          ))}
        </div>

        <div className="hero-footer">
          <span>© 2025 BIT</span>
          <span className="hero-admin-link" onClick={() => navigate("/login")}>
            Admin login →
          </span>
        </div>
      </div>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:wght@500&family=DM+Sans:wght@300;400;500;600&display=swap');
        @import url('https://cdn.jsdelivr.net/npm/@tabler/icons-webfont@latest/tabler-icons.min.css');

        .hero-root {
          min-height: 100vh;
          background-color: var(--color-bg);
          display: flex;
          flex-direction: column;
        }

        /* Nav */
        .hero-nav {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 1rem 2rem;
          border-bottom: 1px solid var(--color-border);
        }

        .hero-brand {
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .hero-brand-icon {
          width: 34px;
          height: 34px;
          background: #1a3a5c;
          border-radius: var(--radius-sm);
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 18px;
          color: #fff;
        }

        .hero-brand-name {
          font-size: 13px;
          font-weight: 600;
          color: var(--color-text-primary);
          letter-spacing: 0.02em;
        }

        .hero-brand-sub {
          font-size: 10px;
          color: var(--color-text-secondary);
          letter-spacing: 0.04em;
        }

        .hero-nav-actions {
          display: flex;
          gap: 8px;
        }

        /* Body */
        .hero-body {
          flex: 1;
          max-width: 820px;
          width: 100%;
          margin: 0 auto;
          padding: 3rem 1.5rem 2rem;
          display: flex;
          flex-direction: column;
          gap: 1.75rem;
        }

        /* Official badge */
        .hero-official-badge {
          display: inline-flex;
          align-items: center;
          gap: 7px;
          font-family: var(--font-mono);
          font-size: 0.65rem;
          font-weight: 500;
          color: var(--color-text-secondary);
          letter-spacing: 0.06em;
        }

        .hero-dot {
          width: 7px;
          height: 7px;
          border-radius: 50%;
          background: #2e7d32;
          flex-shrink: 0;
        }

        /* Title */
        .hero-title {
          font-family: var(--font-body);
          font-size: clamp(2rem, 5vw, 2.8rem);
          font-weight: 600;
          color: var(--color-text-primary);
          line-height: 1.2;
          letter-spacing: -0.025em;
          margin: 0;
        }

        .hero-subtitle {
          font-size: 0.95rem;
          color: var(--color-text-secondary);
          line-height: 1.75;
          max-width: 540px;
          margin: 0;
          font-weight: 300;
        }

        /* Buttons */
        .hero-btn-primary {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          background: #1a3a5c;
          color: #fff;
          border: none;
          border-radius: var(--radius-sm);
          padding: 0.5rem 1.25rem;
          font-size: 0.85rem;
          font-weight: 600;
          font-family: var(--font-body);
          cursor: pointer;
          transition: background var(--transition);
        }

        .hero-btn-primary:hover { background: #224a73; }

        .hero-btn-ghost {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          background: transparent;
          color: var(--color-text-primary);
          border: 1px solid var(--color-border);
          border-radius: var(--radius-sm);
          padding: 0.5rem 1.25rem;
          font-size: 0.85rem;
          font-weight: 500;
          font-family: var(--font-body);
          cursor: pointer;
          transition: border-color var(--transition), color var(--transition);
        }

        .hero-btn-ghost:hover {
          border-color: var(--color-text-secondary);
          color: var(--color-text-primary);
        }

        .hero-btn-lg {
          padding: 0.7rem 1.6rem;
          font-size: 0.9rem;
        }

        .hero-btn-lg i { font-size: 16px; }

        /* CTAs row */
        .hero-ctas {
          display: flex;
          gap: 10px;
          flex-wrap: wrap;
        }

        /* Stats */
        .hero-stats {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 10px;
        }

        @media (max-width: 500px) {
          .hero-stats { grid-template-columns: 1fr; }
        }

        .hero-stat-card {
          background: var(--color-surface);
          border: 1px solid var(--color-border);
          border-radius: var(--radius-md);
          padding: 1rem 1.1rem;
        }

        .hero-stat-value {
          font-family: var(--font-mono);
          font-size: 1.4rem;
          font-weight: 500;
          color: var(--color-text-primary);
          margin-bottom: 3px;
        }

        .hero-stat-label {
          font-size: 0.72rem;
          color: var(--color-text-secondary);
          letter-spacing: 0.02em;
        }

        /* Divider */
        .hero-divider {
          border: none;
          border-top: 1px solid var(--color-border);
        }

        /* Features */
        .hero-features {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 10px;
        }

        @media (max-width: 600px) {
          .hero-features { grid-template-columns: 1fr; }
        }

        .hero-feature {
          display: flex;
          gap: 10px;
          align-items: flex-start;
        }

        .hero-feature-icon {
          width: 34px;
          height: 34px;
          border: 1px solid var(--color-border);
          border-radius: var(--radius-sm);
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
          font-size: 17px;
          color: #1a3a5c;
          background: var(--color-surface);
        }

        .hero-feature-title {
          font-size: 0.82rem;
          font-weight: 600;
          color: var(--color-text-primary);
          margin-bottom: 3px;
        }

        .hero-feature-desc {
          font-size: 0.76rem;
          color: var(--color-text-secondary);
          line-height: 1.55;
        }

        /* Footer */
        .hero-footer {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding-top: 1rem;
          border-top: 1px solid var(--color-border);
          font-size: 0.75rem;
          color: var(--color-text-secondary);
          flex-wrap: wrap;
          gap: 8px;
        }

        .hero-admin-link {
          cursor: pointer;
          font-family: var(--font-mono);
          font-size: 0.7rem;
          transition: color var(--transition);
        }

        .hero-admin-link:hover { color: var(--color-text-primary); }
      `}</style>
    </div>
  );
};

export default Hero;
