import { useState } from 'react';
import { Plus, Minus } from 'lucide-react';
import { useProducts } from '../../context/ProductsContext';

export default function Inventory() {
  const { products, updateProduct } = useProducts();
  const [search, setSearch] = useState('');
  const [catFilter, setCatFilter] = useState('all');

  const filtered = products.filter(p => {
    const matchCat = catFilter === 'all' || p.category === catFilter;
    const matchSearch = p.name.toLowerCase().includes(search.toLowerCase());
    return matchCat && matchSearch;
  });

  const adjust = (id, delta) => {
    const p = products.find(x => x.id === id);
    if (!p) return;
    const newStock = Math.max(0, (p.stock || 0) + delta);
    updateProduct(id, { stock: newStock });
  };

  const setStock = (id, val) => {
    const n = parseInt(val);
    if (!isNaN(n) && n >= 0) updateProduct(id, { stock: n });
  };

  const totalStock = products.reduce((s, p) => s + (p.stock || 0), 0);
  const lowCount = products.filter(p => p.stock <= 5).length;
  const outCount = products.filter(p => p.stock === 0).length;

  const categories = ['all', 'women', 'men', 'kids', 'sale'];
  const getColor = (stock) => stock > 10 ? 'high' : stock > 0 ? 'medium' : 'low';
  const maxStock = Math.max(...products.map(p => p.stock || 0), 1);

  return (
    <div>
      <div className="admin-page-header">
        <div><h1>Inventory</h1><p>Manage stock levels across all products</p></div>
      </div>

      <div className="admin-stats-grid" style={{ gridTemplateColumns: 'repeat(3, 1fr)', marginBottom: '1.5rem' }}>
        <div className="admin-stat-card">
          <p className="stat-label">Total Stock Units</p>
          <p className="stat-value">{totalStock}</p>
        </div>
        <div className="admin-stat-card">
          <p className="stat-label">Low Stock Items</p>
          <p className="stat-value" style={{ color: '#f59e0b' }}>{lowCount}</p>
          <p className="stat-sub">≤ 5 units</p>
        </div>
        <div className="admin-stat-card">
          <p className="stat-label">Out of Stock</p>
          <p className="stat-value" style={{ color: '#e63946' }}>{outCount}</p>
        </div>
      </div>

      <div className="admin-card">
        <div className="admin-card-header" style={{ gap: '1rem', flexWrap: 'wrap' }}>
          <h2>Stock Levels</h2>
          <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center', flexWrap: 'wrap' }}>
            <input
              style={{ border: '1px solid #eee', padding: '0.45rem 0.85rem', fontSize: '0.85rem', fontFamily: 'inherit', outline: 'none', borderRadius: '4px' }}
              value={search} onChange={e => setSearch(e.target.value)} placeholder="Search..."
            />
            <div style={{ display: 'flex', gap: '0.4rem' }}>
              {categories.map(c => (
                <button key={c} className={`admin-btn admin-btn-sm ${catFilter === c ? 'admin-btn-dark' : 'admin-btn-outline'}`} onClick={() => setCatFilter(c)}>
                  {c.charAt(0).toUpperCase() + c.slice(1)}
                </button>
              ))}
            </div>
          </div>
        </div>
        <div className="admin-table-wrap">
          <table className="admin-table">
            <thead><tr><th>Product</th><th>Category</th><th>Stock Level</th><th>Units</th><th>Adjust</th></tr></thead>
            <tbody>
              {filtered.map(p => (
                <tr key={p.id}>
                  <td><strong style={{ fontSize: '0.82rem' }}>{p.name}</strong></td>
                  <td><span className="badge badge-blue">{p.category}</span></td>
                  <td style={{ minWidth: '160px' }}>
                    <div className="stock-bar-wrap">
                      <div className="stock-bar">
                        <div className={`stock-bar-fill ${getColor(p.stock)}`} style={{ width: `${Math.min(100, (p.stock / maxStock) * 100)}%` }} />
                      </div>
                    </div>
                  </td>
                  <td>
                    <input
                      type="number"
                      min="0"
                      value={p.stock}
                      onChange={e => setStock(p.id, e.target.value)}
                      style={{ width: '64px', border: '1px solid #ddd', padding: '0.3rem 0.5rem', fontFamily: 'inherit', textAlign: 'center', fontSize: '0.85rem', outline: 'none' }}
                    />
                  </td>
                  <td>
                    <div style={{ display: 'flex', gap: '0.4rem' }}>
                      <button className="admin-btn admin-btn-outline admin-btn-sm" onClick={() => adjust(p.id, -1)}><Minus size={12} /></button>
                      <button className="admin-btn admin-btn-dark admin-btn-sm" onClick={() => adjust(p.id, 1)}><Plus size={12} /></button>
                      <button className="admin-btn admin-btn-outline admin-btn-sm" onClick={() => adjust(p.id, 10)} title="Add 10">+10</button>
                    </div>
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
