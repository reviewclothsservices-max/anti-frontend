import { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';


const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try { return JSON.parse(localStorage.getItem('review-user') || 'null'); }
    catch { return null; }
  });

  const login = async (email, password) => {
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      
      const text = await res.text();
      let data;
      try { data = JSON.parse(text); } catch { data = { ok: false, error: text || 'Invalid server response' }; }

      if (data.ok) {
        setUser(data.user);
        localStorage.setItem('review-user', JSON.stringify(data.user));
      }
      return data;
    } catch (err) {
      return { ok: false, error: 'Network error or server unavailable' };
    }
  };

  const register = async (name, email, password) => {
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password })
      });
      
      const text = await res.text();
      let data;
      try { data = JSON.parse(text); } catch { data = { ok: false, error: text || 'Invalid server response' }; }

      if (data.ok) {
        setUser(data.user);
        localStorage.setItem('review-user', JSON.stringify(data.user));
      }
      return data;
    } catch (err) {
      return { ok: false, error: 'Network error or server unavailable' };
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('review-user');
  };

  const sendOTP = async (email) => {
    try {
      const API = import.meta.env.VITE_API_URL;
      const res = await axios.post(`${API}/api/send-otp`, {
        email: email
      });
      return res.data;
      return data;
    } catch (err) {
      return { ok: false, error: 'Network error' };
    }
  };

  const verifyOTP = async (email, otp) => {
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/verify-otp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, otp })
      });
      const text = await res.text();
      let data;
      try { data = JSON.parse(text); } catch { data = { ok: false, error: 'Invalid response' }; }

      if (data.ok) {
        setUser(data.user);
        localStorage.setItem('review-user', JSON.stringify(data.user));
      }
      return data;
    } catch (err) {
      return { ok: false, error: 'Network error' };
    }
  };

  const socialLogin = async (provider) => {
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/social-login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ provider })
      });
      const data = await res.json();
      if (data.ok) {
        setUser(data.user);
        localStorage.setItem('review-user', JSON.stringify(data.user));
      }
      return data;
    } catch (err) {
      return { ok: false, error: 'Network error' };
    }
  };

  const forgotPassword = async (email) => {
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/forgot-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
      });
      const data = await res.json();
      return data;
    } catch (err) {
      return { ok: false, error: 'Network error' };
    }
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout, sendOTP, verifyOTP, socialLogin, forgotPassword }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
