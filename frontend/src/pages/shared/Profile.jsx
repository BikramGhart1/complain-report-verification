import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { selectCurrentUser, updateUser } from '../../features/auth/authSlice';
import { getProfile, updateProfile } from '../../services/authService';
import { toast } from 'react-toastify';

export default function Profile() {
  const dispatch    = useDispatch();
  const currentUser = useSelector(selectCurrentUser);

  const [form, setForm]       = useState({
    firstName: '', middleName: '', lastName: '',
    email: '', phone: '', permanentAddress: '',
    citizenshipNumber: '',
  });
  const [loading, setLoading]   = useState(true);
  const [saving, setSaving]     = useState(false);
  const [pwForm, setPwForm]     = useState({ currentPassword: '', newPassword: '', confirmPassword: '' });
  const [savingPw, setSavingPw] = useState(false);
  const [showPw, setShowPw]     = useState(false);

  useEffect(() => {
    getProfile()
      .then(data => setForm({
        firstName:         data.first_name         ?? '',
        middleName:        data.middle_name        ?? '',
        lastName:          data.last_name          ?? '',
        email:             data.email             ?? '',
        phone:             data.phone             ?? '',
        permanentAddress:  data.permanent_address  ?? '',
        citizenshipNumber: data.citizenship_number ?? '',
      }))
      .catch(err => toast.error(err.message || 'Failed to load profile'))
      .finally(() => setLoading(false));
  }, []);

  const handleChange = e =>
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSave = async e => {
    e.preventDefault();
    setSaving(true);
    try {
      const updated = await updateProfile(form);
      dispatch(updateUser(updated));
      toast.success('Profile updated');
    } catch (err) {
      toast.error(err.message || 'Update failed');
    } finally {
      setSaving(false);
    }
  };

  const handlePasswordChange = async e => {
    e.preventDefault();
    if (pwForm.newPassword !== pwForm.confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }
    setSavingPw(true);
    try {
      await updateProfile({ password: pwForm.newPassword, currentPassword: pwForm.currentPassword });
      toast.success('Password updated');
      setPwForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
    } catch (err) {
      toast.error(err.message || 'Password update failed');
    } finally {
      setSavingPw(false);
    }
  };

  const initials = [form.firstName, form.lastName]
    .filter(Boolean)
    .map(n => n[0].toUpperCase())
    .join('') || currentUser?.email?.[0]?.toUpperCase() || 'U';

  const role = currentUser?.role ?? 'user';

  return (
    <div className="fade-in">

      {/* Page header */}
      <div className="mb-4">
        <h5 className="fw-semibold mb-0" style={{ color: 'var(--color-text-primary)' }}>
          Profile
        </h5>
        <small style={{ color: 'var(--color-text-muted)', fontFamily: 'var(--font-mono)' }}>
          Manage your account information
        </small>
      </div>

      <div style={{ maxWidth: 680 }}>

        {/* ── Avatar + role card ── */}
        <div className="card mb-3">
          <div className="card-body d-flex align-items-center gap-3 p-3">
            <div
              className="d-flex align-items-center justify-content-center rounded-circle fw-bold flex-shrink-0"
              style={{
                width: 56, height: 56,
                fontSize: '1.2rem',
                background: role === 'admin' ? 'rgba(26,58,92,0.1)' : 'var(--color-surface-3)',
                border: `2px solid ${role === 'admin' ? '#1a3a5c' : 'var(--color-border)'}`,
                color: role === 'admin' ? '#1a3a5c' : 'var(--color-text-secondary)',
              }}
            >
              {loading ? '—' : initials}
            </div>
            <div>
              <div className="fw-semibold" style={{ color: 'var(--color-text-primary)', fontSize: '0.95rem' }}>
                {loading ? '—' : `${form.firstName} ${form.lastName}`.trim() || 'User'}
              </div>
              <div style={{ fontSize: '0.8rem', color: 'var(--color-text-secondary)' }}>
                {form.email}
              </div>
              <span
                className="badge mt-1"
                style={{
                  background: role === 'admin' ? 'rgba(26,58,92,0.1)' : 'var(--color-surface-3)',
                  color: role === 'admin' ? '#1a3a5c' : 'var(--color-text-secondary)',
                  fontSize: '0.65rem',
                  fontFamily: 'var(--font-mono)',
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em',
                }}
              >
                {role}
              </span>
            </div>
          </div>
        </div>

        {/* ── Personal information ── */}
        <div className="card mb-3">
          <div className="card-header">
            <i className="ti ti-user me-2" />
            Personal Information
          </div>
          <div className="card-body">
            {loading
              ? (
                <div className="row g-3">
                  {Array.from({ length: 6 }).map((_, i) => (
                    <div key={i} className="col-md-6">
                      <div className="placeholder-glow">
                        <span className="placeholder col-4 mb-1 d-block" style={{ height: 12 }} />
                        <span className="placeholder col-12" style={{ height: 36 }} />
                      </div>
                    </div>
                  ))}
                </div>
              )
              : (
                <div className="row g-3">
                  <div className="col-md-4">
                    <label className="form-label">First Name</label>
                    <input name="firstName" className="form-control"
                      value={form.firstName} onChange={handleChange} />
                  </div>
                  <div className="col-md-4">
                    <label className="form-label">Middle Name</label>
                    <input name="middleName" className="form-control"
                      value={form.middleName} onChange={handleChange} />
                  </div>
                  <div className="col-md-4">
                    <label className="form-label">Last Name</label>
                    <input name="lastName" className="form-control"
                      value={form.lastName} onChange={handleChange} />
                  </div>
                  <div className="col-md-6">
                    <label className="form-label">Phone Number</label>
                    <input name="phone" className="form-control"
                      value={form.phone} onChange={handleChange} />
                  </div>
                  <div className="col-md-6">
                    <label className="form-label">Permanent Address</label>
                    <input name="permanentAddress" className="form-control"
                      value={form.permanentAddress} onChange={handleChange} />
                  </div>
                  <div className="col-md-6">
                    <label className="form-label">Citizenship Number</label>
                    <input name="citizenshipNumber" className="form-control"
                      value={form.citizenshipNumber} onChange={handleChange}
                      readOnly={role === 'user'}
                      style={role === 'user'
                        ? { background: 'var(--color-surface-2)', cursor: 'not-allowed' }
                        : {}}
                    />
                  </div>
                  <div className="col-md-6">
                    <label className="form-label">Email Address</label>
                    <input name="email" className="form-control"
                      value={form.email} readOnly
                      style={{ background: 'var(--color-surface-2)', cursor: 'not-allowed' }} />
                  </div>
                  <div className="col-12 d-flex justify-content-end">
                    <button
                      className="btn btn-primary d-flex align-items-center gap-2"
                      onClick={handleSave} disabled={saving || loading}
                    >
                      {saving
                        ? <><span className="spinner-border spinner-border-sm" /> Saving...</>
                        : <><i className="ti ti-device-floppy" /> Save Changes</>
                      }
                    </button>
                  </div>
                </div>
              )
            }
          </div>
        </div>

        {/* ── Change password ── */}
        <div className="card mb-4">
          <div className="card-header">
            <i className="ti ti-lock me-2" />
            Change Password
          </div>
          <div className="card-body">
            <div className="row g-3">
              <div className="col-12">
                <label className="form-label">Current Password</label>
                <div className="input-group">
                  <input
                    type={showPw ? 'text' : 'password'}
                    className="form-control"
                    placeholder="••••••••"
                    value={pwForm.currentPassword}
                    onChange={e => setPwForm(p => ({ ...p, currentPassword: e.target.value }))}
                  />
                  <button
                    type="button"
                    className="input-group-text"
                    style={{ cursor: 'pointer' }}
                    onClick={() => setShowPw(v => !v)}
                  >
                    <i className={`ti ${showPw ? 'ti-eye-off' : 'ti-eye'}`} />
                  </button>
                </div>
              </div>
              <div className="col-md-6">
                <label className="form-label">New Password</label>
                <input
                  type="password" className="form-control"
                  placeholder="••••••••"
                  value={pwForm.newPassword}
                  onChange={e => setPwForm(p => ({ ...p, newPassword: e.target.value }))}
                />
              </div>
              <div className="col-md-6">
                <label className="form-label">Confirm New Password</label>
                <input
                  type="password" className="form-control"
                  placeholder="••••••••"
                  value={pwForm.confirmPassword}
                  onChange={e => setPwForm(p => ({ ...p, confirmPassword: e.target.value }))}
                />
              </div>

              {/* Password match indicator */}
              {pwForm.confirmPassword && (
                <div className="col-12">
                  <small
                    className="d-flex align-items-center gap-1"
                    style={{
                      color: pwForm.newPassword === pwForm.confirmPassword
                        ? 'var(--color-approved)' : 'var(--color-rejected)',
                    }}
                  >
                    <i className={`ti ${pwForm.newPassword === pwForm.confirmPassword
                      ? 'ti-circle-check' : 'ti-circle-x'}`} />
                    {pwForm.newPassword === pwForm.confirmPassword
                      ? 'Passwords match' : 'Passwords do not match'}
                  </small>
                </div>
              )}

              <div className="col-12 d-flex justify-content-end">
                <button
                  className="btn btn-primary d-flex align-items-center gap-2"
                  onClick={handlePasswordChange}
                  disabled={savingPw || !pwForm.currentPassword || !pwForm.newPassword}
                >
                  {savingPw
                    ? <><span className="spinner-border spinner-border-sm" /> Updating...</>
                    : <><i className="ti ti-lock-check" /> Update Password</>
                  }
                </button>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}