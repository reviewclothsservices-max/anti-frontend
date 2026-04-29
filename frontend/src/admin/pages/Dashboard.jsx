import { useState, useEffect } from 'react';
import { useProducts } from '../../context/ProductsContext';
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer 
} from 'recharts';

export default function Dashboard() {
  const { products } = useProducts();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  
  // Default to last 30 days
  const now = new Date();
  const thirtyDaysAgo = new Date(now.setDate(now.getDate() - 30)).toISOString().split('T')[0];
  const today = new Date().toISOString().split('T')[0];
  
  const [startDate, setStartDate] = useState(thirtyDaysAgo);
  const [endDate, setEndDate] = useState(today);

  useEffect(() => {
    setLoading(true);
    const query = (startDate && endDate) ? `?start=${startDate}&end=${endDate}` : '';
    fetch(`${import.meta.env.VITE_API_URL}/api/admin/dashboard-stats${query}`)
      .then(res => res.json())
      .then(data => {
        if (data.ok) setStats(data.stats);
        setLoading(false);
      });
  }, [startDate, endDate]);

  if (loading) return <div className="admin-loading">Syncing dashboard...</div>;

  const lowStock = products.filter(p => p.stock <= 5);
  const categories = [...new Set(products.map(p => p.category))];

  const statCards = [
    { icon: '💰', label: 'Total Revenue', value: `₹${(stats?.revenue || 0).toLocaleString()}`, sub: 'From paid orders' },
    { icon: '📦', label: 'Total Orders', value: stats?.orders || 0, sub: 'Lifetime orders' },
    { icon: '👥', label: 'Registered Users', value: stats?.users || 0, sub: 'Total accounts' },
    { icon: '👗', label: 'Products', value: products.length, sub: `${categories.length} categories` },
  ];

  const recentOrders = stats?.recentOrders || [];
  const chartData = stats?.graphData || [];
  const statusBadge = { Delivered: 'badge-green', Shipped: 'badge-blue', Processing: 'badge-orange', Pending: 'badge-gray', Cancelled: 'badge-red' };

  return (
    <div>
      <div className="admin-page-header">
        <div>
          <h1>Dashboard</h1>
          <p>Welcome back — here's what's happening today.</p>
        </div>
        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', background: '#fff', padding: '0.5rem 1rem', borderRadius: '8px', border: '1px solid #ddd' }}>
          <span style={{ fontSize: '0.8rem', fontWeight: 600, color: '#666' }}>Filter:</span>
          <input 
            type="date" 
            value={startDate} 
            onChange={(e) => setStartDate(e.target.value)} 
            style={{ border: 'none', fontSize: '0.9rem', outline: 'none', cursor: 'pointer' }}
          />
          <span style={{ color: '#ddd' }}>—</span>
          <input 
            type="date" 
            value={endDate} 
            onChange={(e) => setEndDate(e.target.value)} 
            style={{ border: 'none', fontSize: '0.9rem', outline: 'none', cursor: 'pointer' }}
          />
          {(startDate || endDate) && (
            <button 
              onClick={() => { setStartDate(''); setEndDate(''); }}
              style={{ border: 'none', background: 'none', color: '#ff4d4d', fontSize: '0.75rem', fontWeight: 600, cursor: 'pointer', paddingLeft: '0.5rem', borderLeft: '1px solid #eee' }}
            >
              Clear
            </button>
          )}
        </div>
      </div>

      <div className="admin-stats-grid">
        {statCards.map(s => (
          <div key={s.label} className="admin-stat-card">
            <div className="stat-icon">{s.icon}</div>
            <p className="stat-label">{s.label}</p>
            <p className="stat-value">{s.value}</p>
            <p className="stat-sub">{s.sub}</p>
          </div>
        ))}
      </div>
      
      <div className="admin-card" style={{ marginBottom: '1.25rem' }}>
        <div className="admin-card-header">
          <h2>Revenue Velocity (Day-wise)</h2>
        </div>
        <div style={{ height: '300px', padding: '1rem' }}>
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData}>
              <defs>
                <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#111" stopOpacity={0.1}/>
                  <stop offset="95%" stopColor="#111" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#eee" />
              <XAxis 
                dataKey="day" 
                tick={{ fontSize: 12 }} 
                tickFormatter={(val) => new Date(val).toLocaleDateString(undefined, { day: 'numeric', month: 'short' })}
              />
              <YAxis tick={{ fontSize: 12 }} tickFormatter={(val) => `₹${val}`} />
              <Tooltip 
                contentStyle={{ borderRadius: '8px', border: '1px solid #eee', boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }} 
                formatter={(val) => [`₹${val.toLocaleString()}`, 'Revenue']}
              />
              <Area 
                type="monotone" 
                dataKey="revenue" 
                stroke="#111" 
                strokeWidth={2}
                fillOpacity={1} 
                fill="url(#colorRev)" 
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1.6fr 1fr', gap: '1.25rem' }}>
        <div className="admin-card">
          <div className="admin-card-header">
            <h2>Recent Orders</h2>
          </div>
          <div className="admin-table-wrap">
            <table className="admin-table">
              <thead><tr><th>Order</th><th>Customer</th><th>Total</th><th>Status</th><th>Date</th></tr></thead>
              <tbody>
                {recentOrders.map(o => (
                  <tr key={o.id}>
                    <td><strong>#{o.order_number}</strong></td>
                    <td>{o.customer_email}</td>
                    <td><strong>₹{o.amount.toLocaleString()}</strong></td>
                    <td><span className={`badge ${statusBadge[o.status] || 'badge-gray'}`}>{o.status}</span></td>
                    <td style={{ color: '#888' }}>{new Date(o.date).toLocaleDateString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="admin-card">
          <div className="admin-card-header"><h2>Low Stock Alert</h2></div>
          <div className="admin-table-wrap">
            {lowStock.length === 0 ? (
              <p style={{ padding: '2rem', textAlign: 'center', color: '#888' }}>All items well stocked ✅</p>
            ) : (
              <table className="admin-table">
                <thead><tr><th>Product</th><th>Stock</th></tr></thead>
                <tbody>
                  {lowStock.map(p => (
                    <tr key={p.id}>
                      <td>{p.name}</td>
                      <td><span className={`badge ${p.stock === 0 ? 'badge-red' : 'badge-orange'}`}>{p.stock}</span></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
