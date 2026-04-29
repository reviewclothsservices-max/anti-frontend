import { useState } from 'react';
import { Pencil, Trash2, Search } from 'lucide-react';
import { useProducts } from '../../context/ProductsContext';

export default function Products() {
  const { products, addProduct, updateProduct, deleteProduct, loading } = useProducts();
  const [search, setSearch] = useState('');
  const [modal, setModal] = useState(null); 
  const [form, setForm] = useState({ name: '', price: '', stock: '', images: [], description: '', category: 'Clothing' });
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [processing, setProcessing] = useState(false);

  const filtered = products.filter(p => 
    p.name.toLowerCase().includes(search.toLowerCase()) || 
    p.category?.toLowerCase().includes(search.toLowerCase())
  );

  const openAdd = () => {
    setForm({ name: '', price: '', stock: '100', images: [], description: '', category: 'Clothing' });
    setSelectedFiles([]);
    setModal('add');
  };

  const openEdit = (p) => {
    setForm({ ...p });
    setSelectedFiles([]);
    setModal(p);
  };

  const handleSave = async () => {
    if (!form.name || form.name.trim() === '') {
      alert('Please enter a product name.');
      return;
    }
    if (!form.price || isNaN(parseFloat(form.price))) {
      alert('Please enter a valid price.');
      return;
    }
    
    setProcessing(true);
    try {
      const formData = new FormData();
      formData.append('name', form.name.trim());
      formData.append('price', String(form.price));
      formData.append('stock', String(form.stock || 0));
      formData.append('description', form.description || '');
      formData.append('category', form.category || 'Clothing');
      
      if (selectedFiles.length > 0) {
        selectedFiles.forEach(file => {
          formData.append('images', file);
        });
      }

      if (modal !== 'add' && form.images) {
        formData.append('existingImages', JSON.stringify(form.images));
      }

      let result;
      if (modal === 'add') {
        result = await addProduct(formData);
      } else {
        result = await updateProduct(modal.id, formData);
      }

      if (result.success) {
        setModal(null);
        setSelectedFiles([]);
      } else {
        alert('Server Error: ' + (result.error || 'Failed to save product details.'));
      }
    } catch (err) {
      alert('System Error: ' + err.message);
    } finally {
      setProcessing(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Delete this product permanently?')) {
      await deleteProduct(id);
    }
  };

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));
  const handleFileChange = (e) => setSelectedFiles(Array.from(e.target.files));

  if (loading && !modal) return <div className="admin-loading">Syncing Inventory...</div>;

  return (
    <div>
      <div className="admin-page-header">
        <div>
          <h1>Inventory Management</h1>
          <p>Multi-image support and stock control</p>
        </div>
        <button className="admin-btn admin-btn-dark" onClick={openAdd}>+ Add New Product</button>
      </div>

      <div className="admin-card">
        <div className="admin-card-header">
          <div className="admin-search-bar">
            <Search size={16} color="#888" />
            <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search catalog..." />
          </div>
        </div>
        <div className="admin-table-wrap">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Gallery</th>
                <th>Product Details</th>
                <th>Pricing</th>
                <th>Inventory</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(p => (
                <tr key={p.id}>
                  <td>
                    <div className="admin-table-img">
                      <img src={p.images?.[0] || 'https://via.placeholder.com/100?text=No+Image'} alt={p.name} />
                      {p.images?.length > 1 && <span className="admin-img-count">+{p.images.length - 1}</span>}
                    </div>
                  </td>
                  <td>
                    <div>
                      <div style={{ fontWeight: 700 }}>{p.name}</div>
                      <div style={{ fontSize: '0.75rem', opacity: 0.6 }}>{p.category}</div>
                    </div>
                  </td>
                  <td><strong>₹{p.price.toLocaleString()}</strong></td>
                  <td>
                    <span className={`badge ${p.stock > 10 ? 'badge-green' : 'badge-red'}`}>
                      {p.stock} units
                    </span>
                  </td>
                  <td>
                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                      <button className="admin-btn admin-btn-outline admin-btn-sm" onClick={() => openEdit(p)}>
                        <Pencil size={13} />
                      </button>
                      <button className="admin-btn admin-btn-outline admin-btn-sm" style={{ color: '#ff4d4d' }} onClick={() => handleDelete(p.id)}>
                        <Trash2 size={13} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {modal !== null && (
        <div className="admin-modal-overlay" onClick={() => setModal(null)}>
          <div className="admin-modal" onClick={e => e.stopPropagation()}>
            <h3>{modal === 'add' ? 'Create New Entry' : 'Update Catalog Item'}</h3>
            <div className="admin-form">
              <div className="admin-field">
                <label>Product Name</label>
                <input value={form.name} onChange={e => set('name', e.target.value)} placeholder="e.g. Vintage Denim Jacket" />
              </div>
              
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div className="admin-field">
                  <label>Price (₹)</label>
                  <input type="number" value={form.price} onChange={e => set('price', e.target.value)} />
                </div>
                <div className="admin-field">
                  <label>Stock Count</label>
                  <input type="number" value={form.stock} onChange={e => set('stock', e.target.value)} />
                </div>
              </div>

              <div className="admin-field">
                <label>Media Gallery</label>
                <input type="file" multiple accept="image/*" onChange={handleFileChange} style={{ padding: '0.5rem 0' }} />
                
                {(form.images?.length > 0 || selectedFiles.length > 0) && (
                  <div className="admin-img-previews">
                    {form.images?.map((img, i) => (
                      <div key={i} className="preview-item">
                        <img src={img} alt="Gallery" />
                        <button type="button" onClick={() => set('images', form.images.filter((_, idx) => idx !== i))}>×</button>
                      </div>
                    ))}
                    {selectedFiles.map((file, i) => (
                      <div key={`new-${i}`} className="preview-item new">
                        <img src={URL.createObjectURL(file)} alt="New" />
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="admin-field">
                <label>Category Tag</label>
                <input value={form.category} onChange={e => set('category', e.target.value)} />
              </div>
              
              <div className="admin-field">
                <label>Detailed Description</label>
                <textarea 
                  value={form.description} 
                  onChange={e => set('description', e.target.value)}
                  style={{ width: '100%', padding: '0.8rem', borderRadius: '8px', border: '1px solid #ddd', minHeight: '100px', fontFamily: 'inherit' }}
                />
              </div>

              <div className="admin-form-actions">
                <button type="button" className="admin-btn admin-btn-outline" onClick={() => setModal(null)}>Cancel</button>
                <button type="button" className="admin-btn admin-btn-dark" onClick={handleSave} disabled={processing}>
                  {processing ? 'Processing...' : 'Confirm Changes'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
