import { Link } from 'react-router-dom';
import { useUI } from '../context/UIContext';

export default function Footer() {
  const { openAuth } = useUI();

  return (
    <footer className="footer">
      <div className="footer-grid">
        <div className="footer-section">
          <h4>Shop</h4>
          <ul>
            <li><Link to="/">Shop Collection</Link></li>
            <li><Link to="/home">Home</Link></li>
          </ul>
        </div>

        <div className="footer-section">
          <h4>Corporate Info</h4>
          <ul>
            <li><Link to="/about">About REVIEW group</Link></li>
            <li><Link to="/disclaimer">Disclaimer</Link></li>
            <li><Link to="/terms">Terms & Conditions</Link></li>
          </ul>
        </div>

        <div className="footer-section">
          <h4>Help</h4>
          <ul>
            <li><Link to="/customer-service">Customer Service</Link></li>
            <li><Link to="/account">Track Your Order</Link></li>
            <li><Link to="/account">My Account</Link></li>
            <li><Link to="/stores">Find a Store</Link></li>
            <li><Link to="/privacy">Privacy Policy</Link></li>
          </ul>
        </div>

        <div className="footer-section">
          <h4>Become a member</h4>
          <p style={{ fontSize: '0.9rem', marginBottom: '1rem', color: '#aaa' }}>
            Join now and get 10% off your next purchase!
          </p>
          <button className="btn btn-outline" style={{ borderColor: 'white', color: 'white' }} onClick={() => openAuth('register')}>READ MORE</button>
        </div>
      </div>
      <div className="footer-bottom">
        <p>The content of this site is copyright-protected and is the property of Review.clothing</p>
        <div className="logo" style={{ marginTop: '1rem' }}>
          <img src="/logo.svg" alt="REVIEW Logo" style={{ height: '40px', filter: 'invert(1)' }} />
        </div>
      </div>
    </footer>
  );
}
