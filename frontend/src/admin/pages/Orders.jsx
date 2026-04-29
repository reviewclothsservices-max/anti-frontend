import { useState, useEffect } from 'react';

const statusBadge = { Delivered: 'badge-green', Shipped: 'badge-blue', Processing: 'badge-orange', Pending: 'badge-gray', Cancelled: 'badge-red' };
const ALL_STATUSES = ['All', 'Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled'];

export default function Orders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('All');
  const [updating, setUpdating] = useState(null);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/admin/orders`);
      const data = await res.json();
      if (data.ok) setOrders(data.orders);
    } catch (err) {
      console.error('Fetch orders error:', err);
    } finally {
      setLoading(false);
    }
  };

  const updateTracking = async (orderNumber, trackingNumber) => {
    setUpdating(orderNumber);
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/admin/update-tracking`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ orderNumber, trackingNumber })
      });
      const data = await res.json();
      if (data.ok) {
        setOrders(prev => prev.map(o => o.order_number === orderNumber ? { ...o, tracking_number: trackingNumber } : o));
      }
    } catch (err) {
      console.error('Update tracking error:', err);
    } finally {
      setUpdating(null);
    }
  };

  const filtered = statusFilter === 'All' ? orders : orders.filter(o => o.status === statusFilter || (statusFilter === 'Processing' && !o.status));

  const totals = {
    total: orders.reduce((s, o) => s + (parseFloat(o.amount) || 0), 0),
    count: orders.length,
    active: orders.filter(o => !o.status || o.status === 'Processing' || o.status === 'Shipped').length,
  };

  if (loading) return <div style={{ padding: '2rem' }}>Loading orders...</div>;

  return (
    <div>
      <div className="admin-page-header">
        <div><h1>Orders</h1><p>{totals.count} total orders</p></div>
      </div>

      <div className="admin-stats-grid" style={{ gridTemplateColumns: 'repeat(3, 1fr)', marginBottom: '1.5rem' }}>
        <div className="admin-stat-card">
          <p className="stat-label">Total Revenue</p>
          <p className="stat-value">₹{totals.total.toFixed(2)}</p>
        </div>
        <div className="admin-stat-card">
          <p className="stat-label">Total Orders</p>
          <p className="stat-value">{totals.count}</p>
        </div>
        <div className="admin-stat-card">
          <p className="stat-label">Active Shipments</p>
          <p className="stat-value">{totals.active}</p>
        </div>
      </div>

      <div className="admin-card">
        <div className="admin-card-header" style={{ flexWrap: 'wrap', gap: '0.75rem' }}>
          <h2>All Orders</h2>
          <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap' }}>
            {ALL_STATUSES.map(s => (
              <button key={s} className={`admin-btn admin-btn-sm ${statusFilter === s ? 'admin-btn-dark' : 'admin-btn-outline'}`} onClick={() => setStatusFilter(s)}>{s}</button>
            ))}
          </div>
        </div>
        <div className="admin-table-wrap">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Order Number</th>
                <th>Customer</th>
                <th>Total</th>
                <th>Status</th>
                <th>Tracking (Delhivery)</th>
                <th>Date</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(o => (
                <tr key={o.order_number}>
                  <td><strong>{o.order_number}</strong></td>
                  <td>
                    <div style={{ fontWeight: 600 }}>{o.customer_email}</div>
                  </td>
                  <td><strong>₹{(parseFloat(o.amount) || 0).toFixed(2)}</strong></td>
                  <td>
                    <span className={`badge ${statusBadge[o.status || 'Processing']}`}>
                      {o.status || 'Processing'}
                    </span>
                  </td>
                  <td>
                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                      <input 
                        type="text" 
                        placeholder="AWB Number"
                        defaultValue={o.tracking_number}
                        className="admin-input"
                        style={{ padding: '4px 8px', fontSize: '0.8rem', width: '140px' }}
                        onBlur={(e) => {
                          if (e.target.value !== o.tracking_number) {
                            updateTracking(o.order_number, e.target.value);
                          }
                        }}
                      />
                      {updating === o.order_number && <span style={{ fontSize: '0.7rem', color: '#888' }}>Saving...</span>}
                    </div>
                  </td>
                  <td style={{ color: '#888', fontSize: '0.85rem' }}>
                    {new Date(o.date).toLocaleDateString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

