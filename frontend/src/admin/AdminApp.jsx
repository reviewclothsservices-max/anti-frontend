import { useState } from 'react';
import { LayoutDashboard, Package, ShoppingCart, Archive, LogOut, ExternalLink, Image as ImageIcon } from 'lucide-react';
import AdminLogin from './AdminLogin';
import Dashboard from './pages/Dashboard';
import Products from './pages/Products';
import Orders from './pages/Orders';
import Inventory from './pages/Inventory';
import Splash from './pages/Splash';
import './admin.css';

const NAV = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'products', label: 'Products', icon: Package },
  { id: 'orders', label: 'Orders', icon: ShoppingCart },
  { id: 'splash', label: 'Splash', icon: ImageIcon },
];

export default function AdminApp() {
  const [isLoggedIn, setIsLoggedIn] = useState(() => localStorage.getItem('review-admin-auth') === 'true');
  const [page, setPage] = useState('dashboard');

  if (!isLoggedIn) {
    return <AdminLogin onLogin={() => { localStorage.setItem('review-admin-auth', 'true'); setIsLoggedIn(true); }} />;
  }

  const handleLogout = () => {
    localStorage.removeItem('review-admin-auth');
    setIsLoggedIn(false);
  };

  const pages = { dashboard: <Dashboard />, products: <Products />, orders: <Orders />, splash: <Splash /> };

  return (
    <div className="admin-layout">
      <aside className="admin-sidebar">
        <div className="admin-brand">
          <span>REVIEW</span>
          <small>Admin Panel</small>
        </div>
        <nav className="admin-nav">
          {NAV.map(({ id, label, icon: Icon }) => (
            <button key={id} className={`admin-nav-item ${page === id ? 'active' : ''}`} onClick={() => setPage(id)}>
              <Icon size={17} />
              <span>{label}</span>
            </button>
          ))}
        </nav>
        <div className="admin-nav-bottom">
          <a href="/" target="_blank" rel="noopener noreferrer" className="admin-nav-item">
            <ExternalLink size={17} /><span>View Store</span>
          </a>
          <button className="admin-nav-item logout" onClick={handleLogout}>
            <LogOut size={17} /><span>Logout</span>
          </button>
        </div>
      </aside>
      <main className="admin-content">
        {pages[page]}
      </main>
    </div>
  );
}
