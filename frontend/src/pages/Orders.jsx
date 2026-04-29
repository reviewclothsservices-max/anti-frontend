import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useUI } from '../context/UIContext';
import { Package, CheckCircle, Clock, ArrowLeft, ExternalLink } from 'lucide-react';
import './pages.css';

export default function Orders() {
  const { user } = useAuth();
  const { openAuth } = useUI();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [trackingOrder, setTrackingOrder] = useState(null);

  useEffect(() => {
    if (user) {
      fetchOrders();
    }
  }, [user]);

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

  const handleCancel = async (orderNumber) => {
    if (!window.confirm('Are you sure you want to cancel this order?')) return;
    
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/cancel-order`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ orderNumber, email: user.email })
      });
      const data = await res.json();
      if (data.ok) {
        showToast('Order cancelled successfully', 'success');
        fetchOrders(); // Refresh the list
      } else {
        showToast(data.error || 'Failed to cancel order', 'error');
      }
    } catch (err) {
      showToast('Error cancelling order', 'error');
    }
  };

  if (!user) {
    return (
      <div className="page-container" style={{ textAlign: 'center', padding: '10rem 2rem' }}>
        <h2 style={{ fontSize: '2rem', fontWeight: 800, marginBottom: '1.5rem' }}>Sign in to view your orders</h2>
        <button className="btn" onClick={() => openAuth('login')}>Sign In / Register</button>
      </div>
    );
  }

  if (trackingOrder) {
    return (
      <div className="page-container" style={{ padding: '6rem 2rem', maxWidth: '800px', margin: '0 auto' }}>
        <button className="back-btn" onClick={() => setTrackingOrder(null)} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: 'none', border: 'none', cursor: 'pointer', fontWeight: 700, marginBottom: '2rem', padding: 0 }}>
          <ArrowLeft size={20} /> Back to My Orders
        </button>
        
        <div className="order-details-card" style={{ background: '#fff', border: '1px solid #eee', borderRadius: '16px', padding: '2.5rem', boxShadow: '0 4px 20px rgba(0,0,0,0.05)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '2.5rem', borderBottom: '1px solid #eee', paddingBottom: '1.5rem' }}>
            <div>
              <p style={{ fontSize: '0.85rem', color: '#888', textTransform: 'uppercase', letterSpacing: '1px' }}>Order Number</p>
              <h2 style={{ fontSize: '1.5rem', fontWeight: 800 }}>{trackingOrder.order_number}</h2>
            </div>
            <div style={{ textAlign: 'right' }}>
              <p style={{ fontSize: '0.85rem', color: '#888', textTransform: 'uppercase', letterSpacing: '1px' }}>Status</p>
              <span className={`badge ${trackingOrder.status === 'Cancelled' ? 'badge-red' : 'badge-green'}`} style={{ fontSize: '0.9rem', padding: '0.5rem 1rem' }}>
                {trackingOrder.status || 'Placed'}
              </span>
            </div>
          </div>

          <div className="tracking-timeline" style={{ marginBottom: '3rem' }}>
            <div style={{ display: 'flex', gap: '1.5rem', position: 'relative' }}>
               <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                  <div style={{ background: trackingOrder.status === 'Cancelled' ? '#ff4d4d' : '#111', color: '#fff', width: '40px', height: '40px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    {trackingOrder.status === 'Cancelled' ? '✕' : <CheckCircle size={20} />}
                  </div>
                  <div style={{ width: '2px', height: '40px', background: '#eee' }}></div>
                  <div style={{ border: '2px solid #eee', color: '#ccc', width: '40px', height: '40px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Clock size={20} />
                  </div>
               </div>
               <div style={{ padding: '0.5rem 0' }}>
                 <div style={{ marginBottom: '2.5rem' }}>
                   <h4 style={{ fontWeight: 700 }}>{trackingOrder.status === 'Cancelled' ? 'Order Cancelled' : 'Order Confirmed'}</h4>
                   <p style={{ fontSize: '0.9rem', color: '#666' }}>{trackingOrder.status === 'Cancelled' ? 'This order was cancelled by you.' : 'Your payment was successful and we\'re preparing your order.'}</p>
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
              Track on Delhivery <ExternalLink size={18} />
            </a>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="page-container" style={{ padding: '6rem 2rem', maxWidth: '900px', margin: '0 auto' }}>
      <h1 className="page-title" style={{ marginBottom: '1rem' }}>My Orders</h1>
      <p style={{ textAlign: 'center', color: '#666', marginBottom: '3rem' }}>Note: you can check your order in few hours</p>
      {loading ? (
        <p>Loading your orders...</p>
      ) : orders.length > 0 ? (
        <div style={{ display: 'grid', gap: '1.2rem', width: '100%' }}>
          {orders.map(order => (
            <div key={order.order_number} className="order-history-card" style={{ padding: '2rem', border: '1px solid #eee', borderRadius: '12px', background: '#fff', opacity: order.status === 'Cancelled' ? 0.7 : 1 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
                <div>
                  <span style={{ fontSize: '0.75rem', color: '#888', textTransform: 'uppercase' }}>Order Number</span>
                  <p style={{ fontWeight: 800, fontSize: '1.1rem', margin: '0.2rem 0 0 0' }}>{order.order_number}</p>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <span style={{ fontSize: '0.75rem', color: '#888', textTransform: 'uppercase' }}>Status</span>
                  <p style={{ color: order.status === 'Cancelled' ? '#e41e26' : '#00a650', fontWeight: 800, margin: '0.2rem 0 0 0' }}>{order.status || 'Placed'}</p>
                </div>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '1.5rem', borderTop: '1px solid #f5f5f5' }}>
                <p style={{ color: '#666', margin: 0 }}>{new Date(order.date).toLocaleDateString()} • ₹{parseFloat(order.amount).toFixed(2)}</p>
                <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                  {order.status !== 'Cancelled' && (
                    <button 
                      onClick={() => handleCancel(order.order_number)} 
                      style={{ fontSize: '0.85rem', fontWeight: 600, color: '#e41e26', background: 'none', border: '1px solid #e41e26', borderRadius: '4px', padding: '0.4rem 0.8rem', cursor: 'pointer' }}
                    >
                      Cancel Order
                    </button>
                  )}
                  <button onClick={() => setTrackingOrder(order)} style={{ fontSize: '0.9rem', fontWeight: 700, color: '#111', background: 'none', border: 'none', textDecoration: 'underline', cursor: 'pointer' }}>Track Progress</button>
                  <a href={order.tracking_number ? `https://www.delhivery.com/track/share?waybill=${order.tracking_number}` : "https://www.delhivery.com/tracking"} target="_blank" rel="noopener noreferrer" style={{ fontSize: '0.9rem', fontWeight: 700, color: '#e41e26', textDecoration: 'underline' }}>Delhivery Track</a>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div style={{ textAlign: 'center', padding: '5rem 2rem', background: '#f9f9f9', borderRadius: '16px' }}>
          <Package size={48} color="#ddd" style={{ marginBottom: '1.5rem' }} />
          <p style={{ color: '#666' }}>You haven't placed any orders yet.</p>
          <a href="/" className="btn btn-sm" style={{ marginTop: '2rem' }}>Start Shopping</a>
        </div>
      )}
    </div>
  );
}
