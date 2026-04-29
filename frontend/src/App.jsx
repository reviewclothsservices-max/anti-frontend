import { Routes, Route, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import About from './pages/About';
import CustomerService from './pages/CustomerService';
import Privacy from './pages/Privacy';
import Terms from './pages/Terms';
import Disclaimer from './pages/Disclaimer';
import Checkout from './pages/Checkout';
import Account from './pages/Account';
import Profile from './pages/Profile';
import Orders from './pages/Orders';
import Wishlist from './pages/Wishlist';
import AdminApp from './admin/AdminApp';

import SearchModal from './components/SearchModal';
import AuthModal from './components/AuthModal';
import CartDrawer from './components/CartDrawer';
import ProductModal from './components/ProductModal';
import Toast from './components/Toast';
import './App.css';

function App() {
  const location = useLocation();
  const isAdminPath = location.pathname.startsWith('/admin');

  return (
    <div className="app-container">
      {!isAdminPath && <Navbar />}
      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/home" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/customer-service" element={<CustomerService />} />
          <Route path="/privacy" element={<Privacy />} />
          <Route path="/terms" element={<Terms />} />
          <Route path="/disclaimer" element={<Disclaimer />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/account" element={<Account />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/orders" element={<Orders />} />
          <Route path="/wishlist" element={<Wishlist />} />

          {/* Admin Routes */}
          <Route path="/admin/*" element={<AdminApp />} />

          <Route path="*" element={
            <div style={{ padding: '10rem 2rem', textAlign: 'center', minHeight: '50vh' }}>
              <h2 style={{ fontSize: '2rem', fontWeight: 800, marginBottom: '1rem' }}>404 — Page Not Found</h2>
              <a href="/" style={{ fontWeight: 600, textDecoration: 'underline' }}>Return Home</a>
            </div>
          } />
        </Routes>
      </main>
      {!isAdminPath && <Footer />}
      <SearchModal />
      <AuthModal />
      <CartDrawer />
      <ProductModal />
      <Toast />
    </div>
  );
}

export default App;
