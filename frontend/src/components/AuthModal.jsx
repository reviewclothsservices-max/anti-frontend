import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { X, Eye, EyeOff, Smartphone, Mail, Fingerprint } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useUI } from '../context/UIContext';
import './AuthModal.css';

export default function AuthModal() {
  const { authOpen, authMode, authRedirect, closeAuth } = useUI();
  const { login, register, logout, user, sendOTP, verifyOTP, socialLogin, forgotPassword } = useAuth();
  const { showToast } = useUI();
  const navigate = useNavigate();

  const [mode, setMode] = useState(authMode || 'login');
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [error, setError] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [otpCode, setOtpCode] = useState('');
  const [resendTimer, setResendTimer] = useState(0);
  const [adminStats, setAdminStats] = useState(null);

  useEffect(() => {
    if (authOpen) {
      setMode(authMode || 'login');
      setError('');
      setOtpCode('');
      setResendTimer(0);
      if (user?.email === 'review.cloths24@gmail.com') {
        fetchAdminStats();
      }
    }
  }, [authOpen, authMode, user]);

  const fetchAdminStats = async () => {
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/admin/stats`);
      const data = await res.json();
      if (data.ok) setAdminStats(data);
    } catch (err) { console.error(err); }
  };

  useEffect(() => {
    let interval;
    if (resendTimer > 0) {
      interval = setInterval(() => {
        setResendTimer(prev => prev - 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [resendTimer]);

  if (!authOpen) return null;

  const set = (field, val) => { setForm(f => ({ ...f, [field]: val })); setError(''); };


  const handleSubmit = async (e) => {
    e.preventDefault();
    if (mode === 'login') {
      const res = await login(form.email, form.password);
      if (res.ok) { 
        showToast('Welcome back!'); 
        if (authRedirect) navigate(authRedirect);
        closeAuth(); 
      }
      else setError(res.error);
    } else if (mode === 'forgot') {
      if (!form.email) { setError('Email is required'); return; }
      setLoading(true);
      const res = await forgotPassword(form.email);
      setLoading(false);
      if (res.ok) {
        showToast('Password reset link sent!');
        setMode('login');
      } else {
        setError(res.error);
      }
    } else if (mode === 'register') {
      if (!form.name.trim()) { setError('Name is required'); return; }
      setLoading(true);
      const res = await register(form.name, form.email, form.password);
      setLoading(false);
      if (res.ok) {
        showToast('Account created successfully!');
        if (authRedirect) navigate(authRedirect);
        closeAuth();
      } else {
        setError(res.error);
      }
    }
  };

  const handleOTPVerify = async (e) => {
    e.preventDefault();
    if (!otpCode) { setError('Please enter the OTP'); return; }
    setLoading(true);
    const res = await verifyOTP(form.email, otpCode);
    setLoading(false);
    if (res.ok) {
      showToast('Successfully verified!');
      if (authRedirect) navigate(authRedirect);
      closeAuth();
    } else {
      setError(res.error);
    }
  };

  const handleLogout = () => {
    logout();
    showToast('Logged out');
    closeAuth();
  };

  const handleSocialClick = async (method) => {
    if (method === 'OTP') {
      if (!form.email || !form.email.includes('@')) { setError('Please enter a valid email address first to receive OTP'); return; }
      setLoading(true);
      const res = await sendOTP(form.email);
      setLoading(false);
      if (res.ok) {
        showToast('OTP sent successfully!');
        setMode('otp-verify');
        setResendTimer(60);
      } else {
        setError(res.error || 'Failed to send OTP');
      }
    } else if (method === 'Magic Link') {
      if (!form.email || !form.email.includes('@')) { setError('Please enter a valid email address first for the Magic Link'); return; }
      setLoading(true);
      await sendOTP(form.email);
      setLoading(false);
      showToast('Magic Link sent! Please check your inbox.');
    } else {
      // Mock Social Login or Passkey
      setLoading(true);
      const provider = method === 'Passkey' ? 'Apple' : method;
      const res = await socialLogin(provider);
      setLoading(false);
      if (res.ok) {
        showToast(`Successfully logged in with ${method}!`);
        if (authRedirect) navigate(authRedirect);
        closeAuth();
      } else {
        setError(res.error);
      }
    }
  }

  if (user) {
    return (
      <>
        <div className="modal-overlay" onClick={closeAuth} />
        <div className="auth-modal">
          <button className="modal-close" onClick={closeAuth} aria-label="Close"><X size={20} /></button>
          <div className="auth-account-view">
            <div className="auth-avatar">{user.name.charAt(0).toUpperCase()}</div>
            <h2>Hello, {user.name}!</h2>
            <p>{user.email}</p>
            
            {user.email === 'review.cloths24@gmail.com' && adminStats && (
              <div style={{ width: '100%', margin: '1.5rem 0', background: '#111', borderRadius: '12px', padding: '1.25rem', border: '1px solid #333' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%', marginBottom: '1rem' }}>
                  <span style={{ fontSize: '0.7rem', opacity: 0.6, textTransform: 'uppercase', letterSpacing: '0.1em', color: '#fff' }}>Admin Master Block</span>
                  <span style={{ fontSize: '0.7rem', color: '#4ade80', fontWeight: 800 }}>ACTIVE SESSION</span>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', width: '100%', textAlign: 'left', marginBottom: '1.25rem' }}>
                  <div>
                    <p style={{ fontSize: '0.6rem', margin: 0, opacity: 0.5, textTransform: 'uppercase', color: '#fff' }}>Net Revenue</p>
                    <span style={{ fontSize: '1.1rem', fontWeight: 900, color: '#4ade80' }}>₹{adminStats.revenue.toLocaleString()}</span>
                  </div>
                  <div>
                    <p style={{ fontSize: '0.6rem', margin: 0, opacity: 0.5, textTransform: 'uppercase', color: '#fff' }}>Total Loss</p>
                    <span style={{ fontSize: '1.1rem', fontWeight: 900, color: '#f87171' }}>₹{adminStats.loss.toLocaleString()}</span>
                  </div>
                </div>

                {/* Performance Graph */}
                <div style={{ width: '100%', height: '6px', background: '#222', borderRadius: '3px', overflow: 'hidden', display: 'flex', marginBottom: '1.25rem' }}>
                  <div style={{ 
                    height: '100%', 
                    background: '#4ade80', 
                    width: `${(adminStats.revenue / (adminStats.revenue + adminStats.loss || 1)) * 100}%` 
                  }} />
                  <div style={{ 
                    height: '100%', 
                    background: '#f87171', 
                    width: `${(adminStats.loss / (adminStats.revenue + adminStats.loss || 1)) * 100}%` 
                  }} />
                </div>
                
                {/* Quick Access Grid */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem', width: '100%' }}>
                  <button 
                    className="btn" 
                    style={{ fontSize: '0.7rem', padding: '0.6rem', background: '#222', border: '1px solid #444', color: '#fff' }}
                    onClick={() => { navigate('/admin/orders'); closeAuth(); }}
                  >
                    View Orders ({adminStats.total})
                  </button>
                  <button 
                    className="btn" 
                    style={{ fontSize: '0.7rem', padding: '0.6rem', background: '#222', border: '1px solid #444', color: '#fff' }}
                    onClick={() => { navigate('/admin/inventory'); closeAuth(); }}
                  >
                    My Status
                  </button>
                  <button 
                    className="btn" 
                    style={{ fontSize: '0.7rem', padding: '0.8rem', background: '#e41e26', gridColumn: 'span 2', marginTop: '0.25rem' }}
                    onClick={() => { navigate('/admin'); closeAuth(); }}
                  >
                    Go to Dashboard
                  </button>
                </div>
              </div>
            )}

            <button className="btn" style={{ width: '100%' }} onClick={handleLogout}>Sign Out</button>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <div className="modal-overlay" onClick={closeAuth} />
      <div className="auth-modal">
        <button className="modal-close" onClick={closeAuth} aria-label="Close"><X size={20} /></button>
        
        {mode !== 'otp-verify' && (
          <div className="auth-tabs">
            <button className={`auth-tab ${mode === 'login' ? 'active' : ''}`} onClick={() => { setMode('login'); setError(''); }}>Sign In</button>
            <button className={`auth-tab ${mode === 'register' ? 'active' : ''}`} onClick={() => { setMode('register'); setError(''); }}>Create Account</button>
          </div>
        )}

        {mode === 'otp-verify' ? (
          <form className="auth-form" onSubmit={handleOTPVerify}>
            <h2 style={{ fontSize: '1.2rem', fontWeight: 800, textAlign: 'center', marginBottom: '0.5rem' }}>Verify OTP</h2>
            <p style={{ textAlign: 'center', color: '#666', fontSize: '0.9rem', marginBottom: '1rem' }}>We sent a code to <br/><strong>{form.email}</strong></p>
            <div className="auth-field">
              <input 
                type="text" 
                value={otpCode} 
                onChange={e => { setOtpCode(e.target.value.replace(/\D/g, '')); setError(''); }} 
                className="otp-input"
                placeholder="000000" 
                maxLength={6} 
                required 
              />
            </div>
            {error && <p className="auth-error">{error}</p>}
            <button type="submit" className="btn auth-submit" disabled={loading}>
              {loading ? 'Verifying...' : 'Verify & Sign In'}
            </button>
            <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.5rem', flexWrap: 'wrap' }}>
              <button 
                type="button" 
                className="btn btn-outline" 
                style={{ flex: '1 1 140px' }} 
                onClick={() => setMode('login')}
              >
                Go Back
              </button>
              <button 
                type="button" 
                className="btn btn-outline" 
                style={{ flex: '1 1 140px', color: resendTimer > 0 ? '#999' : '#111' }} 
                onClick={() => handleSocialClick('OTP')} 
                disabled={resendTimer > 0 || loading}
              >
                {resendTimer > 0 ? `Resend in ${resendTimer}s` : 'Resend OTP'}
              </button>
            </div>
          </form>
        ) : (
          <form className="auth-form" onSubmit={handleSubmit}>
            {mode === 'register' && (
              <div className="auth-field">
                <label>Full Name</label>
                <input type="text" value={form.name} onChange={e => set('name', e.target.value)} placeholder="Your name" required />
              </div>
            )}
            <div className="auth-field">
              <label>Email</label>
              <input type="email" value={form.email} onChange={e => set('email', e.target.value)} placeholder="your@email.com" required />
            </div>
            {mode !== 'forgot' && (
              <div className="auth-field">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <label>Password</label>
                  {mode === 'login' && (
                    <button type="button" className="auth-link-btn" onClick={() => { setMode('forgot'); setError(''); }} style={{ fontSize: '0.75rem', color: '#666', background: 'none', border: 'none', cursor: 'pointer' }}>
                      Forgot password?
                    </button>
                  )}
                </div>
                <div className="auth-pass-wrap">
                  <input type={showPass ? 'text' : 'password'} value={form.password} onChange={e => set('password', e.target.value)} placeholder="Password" />
                  <button type="button" className="auth-eye" onClick={() => setShowPass(v => !v)} aria-label="Toggle password">
                    {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>
            )}
            {error && <p className="auth-error">{error}</p>}
            <button type="submit" className="btn auth-submit" disabled={loading}>
              {loading ? 'Processing...' : mode === 'forgot' ? 'Send Reset Link' : mode === 'login' ? 'Sign In' : 'Create Account'}
            </button>
            {mode === 'forgot' && (
              <button type="button" className="btn btn-outline" style={{ marginTop: '0.5rem', width: '100%' }} onClick={() => setMode('login')}>
                Cancel
              </button>
            )}
          </form>
        )}

        {mode !== 'forgot' && mode !== 'otp-verify' && (
          <div className="auth-social">
            <div className="auth-divider"><span>or continue with</span></div>
            
            <div className="social-btn-group">
              <a href="https://accounts.google.com/v3/signin/identifier?continue=https%3A%2F%2Faccounts.google.com%2Fgsi%2Ffedcm%2Fsignincontinue&flowName=GlifWebSignIn&flowEntry=AddSession&dsh=S2100855148%3A1776709774081047" target="_blank" rel="noreferrer" className="auth-social-btn hover-elevate" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <svg width="18" height="18" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                  <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                  <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                  <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                </svg>
                Google
              </a>

            </div>

            <div className="modern-auth-options" style={{ display: 'flex', width: '100%' }}>
              <button type="button" className="auth-social-btn small hover-elevate" style={{ flex: 1 }} onClick={() => handleSocialClick('OTP')}>
                 <Smartphone size={16}/> Get OTP Code
              </button>
            </div>
          </div>
        )}
      </div>
    </>
  );
}

