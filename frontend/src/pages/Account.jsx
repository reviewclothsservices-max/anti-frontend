import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useWishlist } from '../context/WishlistContext';
import { useAuth } from '../context/AuthContext';
import { useUI } from '../context/UIContext';
import { Heart, Package, LogOut, CheckCircle, Clock, ArrowLeft, Search } from 'lucide-react';
import ProductGrid from '../components/ProductGrid';
import './pages.css';

export default function Account() {
  const { items: wishlistItems } = useWishlist();
  const { user, logout } = useAuth();
  const { openAuth, showToast } = useUI();
  const location = useLocation();
  
  const [activeTab, setActiveTab] = useState('orders');
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [trackingOrder, setTrackingOrder] = useState(null);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const tab = params.get('tab');
    if (tab) setActiveTab(tab);
    
    if (user) {
      fetchOrders();
    }
  }, [user, location.search]);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/orders/${user.email}`);
      const data = await res.json();
      if (data.ok) setOrders(data.orders);
    } catch (err) {
      console.error('Fetch orders error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    logout();
    showToast('Logged out');
  };

  if (!user) {
    return (
      <div className="page-container" style={{ textAlign: 'center', padding: '10rem 2rem' }}>
        <h2 style={{ fontSize: '2rem', fontWeight: 800, marginBottom: '1.5rem' }}>Sign in to view your orders</h2>
        <p style={{ color: '#666', marginBottom: '2.5rem' }}>You need an account to track your history and manage your wishlist.</p>
        <button className="btn" onClick={() => openAuth('login')}>Sign In / Register</button>
      </div>
    );
  }

  return (
    <div className="page-container account-page" style={{ padding: '6rem 2rem', maxWidth: '1000px', margin: '0 auto', minHeight: '80vh' }}>
      <div className="account-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '3rem', borderBottom: '1px solid #eee', paddingBottom: '1.5rem' }}>
        <div>
          <h1 style={{ fontSize: '2.5rem', fontWeight: 900 }}>My Account</h1>
          <p style={{ color: '#666' }}>Welcome back, {user.name}</p>
        </div>
        <button className="btn btn-outline" onClick={handleLogout} style={{ fontSize: '0.9rem', padding: '0.6rem 1.2rem', display: 'flex', alignItems: 'center', gap: '0.5rem', borderColor: '#111', color: '#111' }}>
          <LogOut size={16} /> Logout
        </button>
      </div>

      <div className="account-content" style={{ marginTop: '2rem' }}>
        {activeTab === 'orders' && !trackingOrder && (
          <section className="orders-section">
            <h2 style={{ fontSize: '1.8rem', fontWeight: 800, marginBottom: '2rem' }}>Order History</h2>
            {loading ? (
              <p>Loading your orders...</p>
            ) : orders.length > 0 ? (
              <div style={{ display: 'grid', gap: '1.2rem' }}>
                {orders.map(order => (
                  <div key={order.order_number} className="order-history-card">
                    <div className="order-card-top">
                      <div>
                        <span>Order Number</span>
                        <p>{order.order_number}</p>
                      </div>
                      <div style={{ textAlign: 'right' }}>
                        <span>Status</span>
                        <p className="status-badge">Processing</p>
                      </div>
                    </div>
                    <div className="order-card-bottom">
                      <p>{new Date(order.date).toLocaleDateString()} • ₹{parseFloat(order.amount).toFixed(2)}</p>
                      <div style={{ display: 'flex', gap: '1rem' }}>
                        <button onClick={() => setTrackingOrder(order)} className="track-link-btn">Track Details</button>
                        <a href={order.tracking_number ? `https://www.delhivery.com/track/share?waybill=${order.tracking_number}` : "https://www.delhivery.com/tracking"} target="_blank" rel="noopener noreferrer" className="track-link" style={{ color: '#e41e26' }}>Delhivery Track</a>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div style={{ textAlign: 'center', padding: '4rem 0', background: '#f9f9f9', borderRadius: '16px' }}>
                <Package size={48} color="#ddd" style={{ marginBottom: '1rem' }} />
                <p style={{ color: '#666' }}>You haven't placed any orders yet.</p>
                <a href="/" className="btn btn-sm" style={{ marginTop: '1.5rem' }}>Start Shopping</a>
              </div>
            )}
          </section>
        )}

        {activeTab === 'orders' && trackingOrder && (
          <div className="tracking-detail-view">
            <button className="back-btn" onClick={() => setTrackingOrder(null)} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: 'none', border: 'none', cursor: 'pointer', fontWeight: 700, marginBottom: '2rem', padding: 0 }}>
              <ArrowLeft size={20} /> Back to Orders
            </button>
            
            <div className="order-details-card" style={{ background: '#fff', border: '1px solid #eee', borderRadius: '16px', padding: '2.5rem', boxShadow: '0 4px 20px rgba(0,0,0,0.05)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '2.5rem', borderBottom: '1px solid #eee', paddingBottom: '1.5rem' }}>
                <div>
                  <p style={{ fontSize: '0.85rem', color: '#888', textTransform: 'uppercase', letterSpacing: '1px' }}>Order Number</p>
                  <h2 style={{ fontSize: '1.5rem', fontWeight: 800 }}>{trackingOrder.order_number}</h2>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <p style={{ fontSize: '0.85rem', color: '#888', textTransform: 'uppercase', letterSpacing: '1px' }}>Status</p>
                  <span className="badge badge-green" style={{ fontSize: '0.9rem', padding: '0.5rem 1rem' }}>Processing</span>
                </div>
              </div>

              <div className="tracking-timeline" style={{ marginBottom: '3rem' }}>
                <div style={{ display: 'flex', gap: '1.5rem', position: 'relative' }}>
                   <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                      <div style={{ background: '#111', color: '#fff', width: '40px', height: '40px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <CheckCircle size={20} />
                      </div>
                      <div style={{ width: '2px', height: '40px', background: '#eee' }}></div>
                      <div style={{ border: '2px solid #eee', color: '#ccc', width: '40px', height: '40px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <Clock size={20} />
                      </div>
                   </div>
                   <div style={{ padding: '0.5rem 0' }}>
                     <div style={{ marginBottom: '2.5rem' }}>
                       <h4 style={{ fontWeight: 700 }}>Order Confirmed</h4>
                       <p style={{ fontSize: '0.9rem', color: '#666' }}>Your payment was successful and we're preparing your order.</p>
                     </div>
                     <div>
                       <h4 style={{ fontWeight: 700, color: '#888' }}>Ready for Shipping</h4>
                       <p style={{ fontSize: '0.9rem', color: '#888' }}>Our team is packing your items with care.</p>
                     </div>
                   </div>
                </div>
              </div>

              <div style={{ background: '#f9f9f9', padding: '1.5rem', borderRadius: '12px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
                 <div>
                   <p style={{ fontSize: '0.8rem', color: '#888', marginBottom: '0.3rem' }}>Customer Email</p>
                   <p style={{ fontWeight: 600 }}>{trackingOrder.customer_email}</p>
                 </div>
                 <div>
                   <p style={{ fontSize: '0.8rem', color: '#888', marginBottom: '0.3rem' }}>Total Amount</p>
                   <p style={{ fontWeight: 600 }}>₹{parseFloat(trackingOrder.amount).toFixed(2)}</p>
                 </div>
              </div>

              <div style={{ marginTop: '2.5rem', textAlign: 'center' }}>
                <p style={{ fontSize: '0.9rem', color: '#666', marginBottom: '1.2rem' }}>This order is shipped via Delhivery. For more detailed tracking information, please visit their portal.</p>
                <a 
                  href={trackingOrder.tracking_number ? `https://www.delhivery.com/track/share?waybill=${trackingOrder.tracking_number}` : "https://www.delhivery.com/tracking"} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="btn" 
                  style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.8rem', background: '#e41e26' }}
                >
                  Track on Delhivery
                </a>
                {trackingOrder.tracking_number && (
                  <p style={{ marginTop: '0.8rem', fontSize: '0.85rem', color: '#888' }}>Tracking Number: <strong>{trackingOrder.tracking_number}</strong></p>
                )}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'wishlist' && (
          <section className="wishlist-section">
            <h2 style={{ fontSize: '1.8rem', fontWeight: 800, marginBottom: '2rem' }}>My Wishlist</h2>
            {wishlistItems.length > 0 ? (
              <ProductGrid products={wishlistItems} />
            ) : (
              <div style={{ textAlign: 'center', padding: '4rem 0', background: '#f9f9f9', borderRadius: '16px' }}>
                <Heart size={48} strokeWidth={1} style={{ marginBottom: '1rem', color: '#ddd' }} />
                <p style={{ color: '#666' }}>Your wishlist is empty.</p>
                <a href="/" className="btn btn-sm" style={{ marginTop: '1.5rem' }}>Explore Products</a>
              </div>
            )}
          </section>
        )}
      </div>

      <style>{`
        .tab-btn {
          display: flex; align-items: center; gap: 0.8rem; padding: 1rem 1.5rem;
          border: none; background: none; color: #888; border-bottom: 2px solid transparent;
          cursor: pointer; font-weight: 600; font-size: 1rem; transition: all 0.2s;
        }
        .tab-btn:hover { color: #111; }
        .tab-btn.active { color: #111; border-bottom-color: #111; }

        .order-history-card { padding: 2rem; border: 1px solid #eee; borderRadius: 12px; background: #fff; boxShadow: 0 2px 10px rgba(0,0,0,0.02); }
        .order-card-top { display: flex; justifyContent: space-between; marginBottom: 1.5rem; }
        .order-card-top span { fontSize: 0.75rem; color: #888; textTransform: uppercase; letterSpacing: 0.1em; }
        .order-card-top p { fontWeight: 800; fontSize: 1.1rem; margin: 0.2rem 0 0 0; }
        .status-badge { color: #00a650; }
        .order-card-bottom { display: flex; justifyContent: space-between; alignItems: center; paddingTop: 1.5rem; borderTop: 1px solid #f5f5f5; }
        .order-card-bottom p { color: #666; margin: 0; fontSize: 0.95rem; }
        .track-link, .track-link-btn { fontSize: 0.9rem; fontWeight: 700; textDecoration: underline; color: #111; background: none; border: none; padding: 0; cursor: pointer; font-family: inherit; }
        @media (max-width: 600px) {
          .order-card-bottom { flex-direction: column; align-items: flex-start; gap: 1rem; }
          .tab-btn { padding: 1rem 0.5rem; font-size: 0.9rem; gap: 0.4rem; }
        }
      `}</style>
    </div>
  );
}
