import { ShoppingBag, Search, User, Menu, X, Heart, Package, LogOut, UserCircle } from 'lucide-react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useState, useRef, useEffect } from 'react';
import { useUI } from '../context/UIContext';
import { useAuth } from '../context/AuthContext';

import './Navbar.css';

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [accountOpen, setAccountOpen] = useState(false);
  const { openSearch, openAuth, openCart } = useUI();
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const dropdownRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setAccountOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [dropdownRef]);

  const handleAccountClick = () => {
    if (!user) {
      openAuth('login');
    } else {
      setAccountOpen(!accountOpen);
    }
  };

  return (
    <>
      <nav className="navbar">
        {/* Left Nav Links */}
        <div className="nav-left">
          <NavLink to="/" className={({ isActive }) => 'nav-link' + (isActive ? ' active' : '')}>Shop</NavLink>
        </div>

        {/* Centered Logo */}
        <Link to="/" className="nav-logo" onClick={() => { setMenuOpen(false); setAccountOpen(false); }}>
          <img src="/logo.svg" alt="REVIEW Logo" style={{ height: '32px' }} />
        </Link>

        {/* Right Icons */}
        <div className="nav-right">
          <button className="icon-btn" aria-label="Search" onClick={() => { openSearch(); setAccountOpen(false); }}><Search size={20} strokeWidth={1.5} /></button>
          
          <div className="account-dropdown-wrapper" ref={dropdownRef}>
            <button className={`icon-btn ${accountOpen ? 'active' : ''}`} aria-label="Account" onClick={handleAccountClick}>
              <User size={20} strokeWidth={1.5} />
            </button>
            
            {user && accountOpen && (
              <div className="account-dropdown" style={{ zIndex: 1005 }}>
                <div className="dropdown-header">
                  <p className="user-name">{user.name}</p>
                  <p className="user-email">{user.email}</p>
                </div>
                <div className="dropdown-divider"></div>
                
                <Link to="/profile" className="dropdown-item" onClick={() => setAccountOpen(false)}>
                  <UserCircle size={16} /> <span>Profile</span>
                </Link>
                
                {user.email === 'review.cloths24@gmail.com' ? (
                  <>
                    <Link to="/admin" className="dropdown-item" onClick={() => setAccountOpen(false)}>
                      <Package size={16} /> <span>My Status</span>
                    </Link>
                  </>
                ) : (
                  <>
                    <Link to="/orders" className="dropdown-item" onClick={() => setAccountOpen(false)}>
                      <Package size={16} /> <span>My Orders</span>
                    </Link>

                    <Link to="/orders" className="dropdown-item" onClick={() => setAccountOpen(false)}>
                      <Search size={16} /> <span>Track Order</span>
                    </Link>
                    
                    <Link to="/wishlist" className="dropdown-item" onClick={() => setAccountOpen(false)}>
                      <Heart size={16} /> <span>My Wishlist</span>
                    </Link>
                  </>
                )}
                
                <div className="dropdown-divider"></div>
                
                <button 
                  className="dropdown-item logout-item" 
                  onClick={() => { logout(); setAccountOpen(false); navigate('/'); }}
                >
                  <LogOut size={16} /> <span>Logout</span>
                </button>
              </div>
            )}
          </div>

          <button className="icon-btn" aria-label="Cart" onClick={() => { openCart(); setAccountOpen(false); }}>
            <ShoppingBag size={20} strokeWidth={1.5} />
          </button>
          <button className="icon-btn mobile-menu-btn" aria-label="Menu" onClick={() => setMenuOpen(!menuOpen)}>
            {menuOpen ? <X size={22} strokeWidth={1.5} /> : <Menu size={22} strokeWidth={1.5} />}
          </button>
        </div>
      </nav>

      {/* Mobile Drawer */}
      {menuOpen && (
        <div className="mobile-drawer">
          <NavLink to="/" onClick={() => setMenuOpen(false)} className="mobile-link">Shop</NavLink>
        </div>
      )}
    </>
  );
}


