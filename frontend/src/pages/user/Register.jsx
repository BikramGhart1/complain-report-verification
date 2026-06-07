import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setCredentials } from "../../features/auth/authSlice";
// import { registerUser } from '../../services/authService';
import { registerUser } from "../../services/authService";

import { toast } from "react-toastify";

const INITIAL = {
  firstName: "",
  middleName: "",
  lastName: "",
  gender: "",
  permanentAddress: "",
  email: "",
  phone: "",
  citizenshipNumber: "",
  password: "",
  confirmPassword: "",
};

export default function Register() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [form, setForm] = useState(INITIAL);
  const [loading, setLoading] = useState(false);
  const [showPw, setShowPw] = useState(false);

  const handleChange = (e) =>
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (form.password !== form.confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }
    setLoading(true);
    const formData = new FormData();
    formData.append("email", form.email);
    formData.append("password", form.password);
    formData.append("first_name", form.firstName);
    formData.append("middle_name", form.middleName ?? "");
    formData.append("last_name", form.lastName);
    formData.append("citizenship_number", form.citizenshipNumber);
    formData.append("gender", form.gender);
    formData.append("phone_number", form.phone);
    try {
      console.log("form register: ", formData);
      const data = await registerUser(formData);
      dispatch(setCredentials(data));
      toast.success("Account created successfully!");
      navigate("/dashboard", { replace: true });
    } catch (err) {
      toast.error(err.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      {/* Brand bar */}
      <div className="auth-brand">
        <div className="auth-brand-icon">
          <i className="ti ti-shield-check" />
        </div>
        <div>
          <div className="auth-brand-name">CCRS Nepal</div>
          <div className="auth-brand-sub">Cybercrime Reporting System</div>
        </div>
      </div>

      <div className="auth-center">
        <div className="auth-header">
          <h1 className="auth-title">Create an Account</h1>
          <p className="auth-subtitle">Sign up to access the system</p>
        </div>

        <div
          style={{
            width: "100%",
            maxWidth: 700,
            display: "flex",
            flexDirection: "column",
            gap: "1rem",
          }}
        >
          {/* Personal Information */}
          <div className="card">
            <div className="card-header">
              <i className="ti ti-user me-2" />
              Personal Information
            </div>
            <div className="card-body p-4">
              <div className="row g-3">
                <div className="col-md-4">
                  <label className="form-label">First Name</label>
                  <input
                    name="firstName"
                    className="form-control"
                    value={form.firstName}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="col-md-4">
                  <label className="form-label">Middle Name</label>
                  <input
                    name="middleName"
                    className="form-control"
                    value={form.middleName}
                    onChange={handleChange}
                  />
                </div>
                <div className="col-md-4">
                  <label className="form-label">Last Name</label>
                  <input
                    name="lastName"
                    className="form-control"
                    value={form.lastName}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="col-12">
                  <label className="form-label d-block">Gender</label>
                  <div className="d-flex gap-4">
                    {["Male", "Female", "Other"].map((g) => (
                      <div className="form-check" key={g}>
                        <input
                          className="form-check-input"
                          type="radio"
                          name="gender"
                          id={`gender-${g}`}
                          value={g.toLowerCase()}
                          checked={form.gender === g.toLowerCase()}
                          onChange={handleChange}
                        />
                        <label
                          className="form-check-label"
                          htmlFor={`gender-${g}`}
                        >
                          {g}
                        </label>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="col-md-6">
                  <label className="form-label">Permanent Address</label>
                  <input
                    name="permanentAddress"
                    className="form-control"
                    value={form.permanentAddress}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Contact Information */}
          <div className="card">
            <div className="card-header">
              <i className="ti ti-address-book me-2" />
              Contact Information
            </div>
            <div className="card-body p-4">
              <div className="row g-3">
                <div className="col-md-6">
                  <label className="form-label">Email Address</label>
                  <input
                    type="email"
                    name="email"
                    className="form-control"
                    placeholder="example@gmail.com"
                    value={form.email}
                    onChange={handleChange}
                    required
                    autoComplete="email"
                  />
                </div>
                <div className="col-md-6">
                  <label className="form-label">Phone Number</label>
                  <input
                    type="tel"
                    name="phone"
                    className="form-control"
                    placeholder="98XXXXXXXX"
                    value={form.phone}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Account Information */}
          <div className="card">
            <div className="card-header">
              <i className="ti ti-lock me-2" />
              Account Information
            </div>
            <div className="card-body p-4">
              <div className="row g-3">
                <div className="col-md-6">
                  <label className="form-label">Citizenship Number</label>
                  <input
                    name="citizenshipNumber"
                    className="form-control"
                    placeholder="XX-XX-XX-XXXXX"
                    value={form.citizenshipNumber}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="col-12" />

                <div className="col-md-6">
                  <label className="form-label">Password</label>
                  <div className="input-group">
                    <input
                      type={showPw ? "text" : "password"}
                      name="password"
                      className="form-control"
                      placeholder="••••••••"
                      value={form.password}
                      onChange={handleChange}
                      required
                      autoComplete="new-password"
                    />
                    <button
                      type="button"
                      className="input-group-text auth-pw-toggle"
                      onClick={() => setShowPw((v) => !v)}
                      tabIndex={-1}
                    >
                      <i className={`ti ${showPw ? "ti-eye-off" : "ti-eye"}`} />
                    </button>
                  </div>
                </div>

                <div className="col-md-6">
                  <label className="form-label">Confirm Password</label>
                  <input
                    type="password"
                    name="confirmPassword"
                    className="form-control"
                    placeholder="••••••••"
                    value={form.confirmPassword}
                    onChange={handleChange}
                    required
                    autoComplete="new-password"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="auth-actions">
            <button
              className="btn auth-btn-primary"
              onClick={handleSubmit}
              disabled={loading}
            >
              {loading ? (
                <>
                  <span className="spinner-border spinner-border-sm me-2" />
                  Creating account...
                </>
              ) : (
                <>
                  <i className="ti ti-user-plus me-2" />
                  Register
                </>
              )}
            </button>
            <p className="auth-switch">
              Already have an account?{" "}
              <Link to="/login" className="auth-link">
                Login
              </Link>
            </p>
          </div>
        </div>
      </div>

      <style>{`
        .auth-page {
          min-height: 100vh;
          background: var(--color-bg);
          display: flex;
          flex-direction: column;
        }

        .auth-brand {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 1rem 1.5rem;
          border-bottom: 1px solid var(--color-border);
          background: var(--color-surface);
        }

        .auth-brand-icon {
          width: 32px; height: 32px;
          background: #1a3a5c;
          border-radius: var(--radius-sm);
          display: flex; align-items: center; justify-content: center;
          font-size: 17px; color: #fff;
        }

        .auth-brand-name {
          font-size: 13px; font-weight: 600;
          color: var(--color-text-primary);
          letter-spacing: 0.01em;
        }

        .auth-brand-sub {
          font-size: 10px;
          color: var(--color-text-secondary);
          letter-spacing: 0.03em;
        }

        .auth-center {
          flex: 1;
          display: flex;
          flex-direction: column;
          align-items: center;
          padding: 2.5rem 1rem;
          gap: 1.5rem;
        }

        .auth-header { text-align: center; }

        .auth-title {
          font-size: 1.75rem;
          font-weight: 700;
          color: var(--color-text-primary);
          margin: 0 0 0.35rem;
          letter-spacing: -0.02em;
        }

        .auth-subtitle {
          font-size: 0.875rem;
          color: var(--color-text-secondary);
          margin: 0;
        }

        .auth-pw-toggle {
          background: var(--color-surface-3) !important;
          border: 1px solid var(--color-border) !important;
          border-left: none !important;
          color: var(--color-text-secondary) !important;
          cursor: pointer;
        }

        .auth-pw-toggle:hover {
          color: var(--color-text-primary) !important;
        }

        .auth-actions {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 0.875rem;
          width: 100%;
        }

        .auth-btn-primary {
          width: 100%;
          background: #1a3a5c;
          color: #fff;
          border: none;
          padding: 0.65rem 1.5rem;
          font-size: 0.9rem;
          font-weight: 600;
          border-radius: var(--radius-sm);
          transition: background var(--transition);
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .auth-btn-primary:hover:not(:disabled) {
          background: #224a73;
          color: #fff;
        }

        .auth-btn-primary:disabled {
          opacity: 0.7;
          cursor: not-allowed;
        }

        .auth-switch {
          font-size: 0.85rem;
          color: var(--color-text-secondary);
          margin: 0;
        }

        .auth-link {
          color: #3a7bd5;
          font-weight: 600;
          text-decoration: none;
        }

        .auth-link:hover { text-decoration: underline; }
      `}</style>
    </div>
  );
}
