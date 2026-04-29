import { useState } from 'react';
import axios from 'axios';

import { Smartphone, ShieldCheck } from 'lucide-react';
import { useUI } from '../context/UIContext';

export default function AdminLogin({ onLogin }) {
  const [mode, setMode] = useState('otp'); // 'otp', 'otp-verify'
  const [otpCode, setOtpCode] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { showToast } = useUI();

  const adminEmail = 'review.cloths24@gmail.com';

  const handleRequestOTP = async () => {
    setLoading(true);
    setError('');
    try {
      const API = import.meta.env.VITE_API_URL;
      const res = await axios.post(`${API}/api/send-otp`, {
        email: adminEmail
      });
      const data = res.data;
      if (data.ok) {
        showToast('Secure code sent to master admin email');
        setMode('otp-verify');
      } else {
        setError(data.error);
      }
    } catch (err) {
      setError('Failed to reach authentication server');
    }
    setLoading(false);
  };

  const handleVerifyOTP = async (e) => {
    e.preventDefault();
    if (!otpCode || otpCode.length < 6) {
      setError('Please enter the full 6-digit code');
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/verify-otp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: adminEmail, otp: otpCode })
      });
      const data = await res.json();
      if (data.ok) {
        showToast('Identity verified. Access granted.');
        onLogin();
      } else {
        setError('Invalid or expired code. Please try again.');
      }
    } catch (err) {
      setError('Connection error. Verify your internet status.');
    }
    setLoading(false);
  };

  return (
    <div className="admin-login-page">
      <div className="admin-login-box">
        <div className="admin-login-brand">
          <div className="admin-lock-icon">
            <ShieldCheck size={48} color="#e41e26" />
          </div>
          <h1>REVIEW</h1>
          <p>Admin Command Center</p>
        </div>

        {mode === 'otp' && (
          <div className="admin-login-form">
            <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
              <p style={{ fontSize: '0.9rem', color: '#111', fontWeight: 700, marginBottom: '0.5rem' }}>
                Secure Keyless Entry
              </p>
              <p style={{ fontSize: '0.8rem', color: '#666', lineHeight: '1.4' }}>
                To access the command center, we will send a 6-digit verification code to your master email.
              </p>
            </div>

            {error && <p className="admin-login-error" style={{ marginBottom: '1rem' }}>{error}</p>}
            
            <button 
              type="button" 
              className="admin-login-btn" 
              onClick={handleRequestOTP} 
              disabled={loading}
              style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.75rem' }}
            >
              {loading ? 'Sending Code...' : (
                <>
                  <Smartphone size={18} />
                  Send Verification Code
                </>
              )}
            </button>
            
            <div style={{ marginTop: '2rem', textAlign: 'center' }}>
              <p style={{ fontSize: '0.65rem', color: '#999', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
                Protected by REVIEW Enterprise Security
              </p>
            </div>
          </div>
        )}

        {mode === 'otp-verify' && (
          <form className="admin-login-form" onSubmit={handleVerifyOTP}>
            <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
              <p style={{ fontSize: '1rem', fontWeight: 800, color: '#111' }}>Verify Identity</p>
              <p style={{ fontSize: '0.8rem', color: '#666', marginTop: '0.5rem' }}>
                Enter the code sent to your email.
              </p>
            </div>

            <div className="admin-login-field">
              <input 
                type="text" 
                maxLength={6} 
                value={otpCode} 
                onChange={e => { setOtpCode(e.target.value.replace(/\D/g,'')); setError(''); }} 
                className="otp-input" 
                placeholder="000000"
                autoFocus
                autoComplete="one-time-code"
                style={{ fontSize: '2rem', letterSpacing: '0.4em' }}
              />
            </div>

            {error && <p className="admin-login-error" style={{ marginBottom: '1.5rem' }}>{error}</p>}

            <button type="submit" className="admin-login-btn" disabled={loading}>
              {loading ? 'Verifying...' : 'Authorize Login'}
            </button>
            
            <button 
              type="button" 
              className="btn-link" 
              onClick={() => { setMode('otp'); setOtpCode(''); }} 
              style={{ 
                marginTop: '1.25rem', 
                width: '100%', 
                background: 'none', 
                border: 'none', 
                fontSize: '0.85rem', 
                color: '#666', 
                cursor: 'pointer',
                textDecoration: 'underline'
              }}
            >
              Resend code
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
