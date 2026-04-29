import { useAuth } from '../context/AuthContext';
import { useUI } from '../context/UIContext';
import { User, Mail, Calendar, LogOut, ChevronRight } from 'lucide-react';
import './pages.css';

export default function Profile() {
  const { user, logout } = useAuth();
  const { openAuth, showToast } = useUI();

  if (!user) {
    return (
      <div className="page-container" style={{ textAlign: 'center', padding: '10rem 2rem' }}>
        <h2 style={{ fontSize: '2rem', fontWeight: 800, marginBottom: '1.5rem' }}>Sign in to view your profile</h2>
        <button className="btn" onClick={() => openAuth('login')}>Sign In / Register</button>
      </div>
    );
  }

  return (
    <div className="page-container" style={{ padding: '6rem 2rem', maxWidth: '800px', margin: '0 auto' }}>
      <h1 className="page-title" style={{ marginBottom: '3rem' }}>My Profile</h1>
      
      <div className="profile-card" style={{ background: '#fff', border: '1px solid #eee', borderRadius: '16px', padding: '2.5rem', boxShadow: '0 4px 20px rgba(0,0,0,0.03)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '2rem', marginBottom: '3rem' }}>
          <div style={{ width: '80px', height: '80px', background: '#f5f5f5', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <User size={40} color="#111" />
          </div>
          <div>
            <h2 style={{ fontSize: '1.8rem', fontWeight: 800 }}>{user.name}</h2>
            <p style={{ color: '#888' }}>Premium Member</p>
          </div>
        </div>

        <div className="info-grid" style={{ display: 'grid', gap: '1.5rem' }}>
          <div className="info-item" style={{ display: 'flex', alignItems: 'center', gap: '1rem', padding: '1.2rem', background: '#f9f9f9', borderRadius: '12px' }}>
            <Mail size={20} color="#666" />
            <div>
              <p style={{ fontSize: '0.75rem', color: '#888', textTransform: 'uppercase', marginBottom: '0.2rem' }}>Email Address</p>
              <p style={{ fontWeight: 600 }}>{user.email}</p>
            </div>
          </div>
          
          <div className="info-item" style={{ display: 'flex', alignItems: 'center', gap: '1rem', padding: '1.2rem', background: '#f9f9f9', borderRadius: '12px' }}>
            <Calendar size={20} color="#666" />
            <div>
              <p style={{ fontSize: '0.75rem', color: '#888', textTransform: 'uppercase', marginBottom: '0.2rem' }}>Joined Date</p>
              <p style={{ fontWeight: 600 }}>April 2026</p>
            </div>
          </div>
        </div>

        <div style={{ marginTop: '3rem', display: 'grid', gap: '1rem' }}>
          {user.email === 'review.cloths24@gmail.com' ? (
             <a href="/admin" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1.2rem', border: '1px solid #111', background: '#f5f5f5', borderRadius: '12px', textDecoration: 'none', color: '#111', fontWeight: 700 }}>
              My Status <ChevronRight size={18} />
             </a>
          ) : (
            <>
              <a href="/orders" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1.2rem', border: '1px solid #eee', borderRadius: '12px', textDecoration: 'none', color: '#111', fontWeight: 600 }}>
                My Orders <ChevronRight size={18} />
              </a>
              <a href="/wishlist" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1.2rem', border: '1px solid #eee', borderRadius: '12px', textDecoration: 'none', color: '#111', fontWeight: 600 }}>
                My Wishlist <ChevronRight size={18} />
              </a>
            </>
          )}
        </div>

        <button 
          onClick={logout} 
          className="btn btn-outline" 
          style={{ width: '100%', marginTop: '2rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.8rem', borderColor: '#ff4d4d', color: '#ff4d4d' }}
        >
          <LogOut size={18} /> Logout
        </button>
      </div>
    </div>
  );
}
