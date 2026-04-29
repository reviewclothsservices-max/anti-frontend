import { useWishlist } from '../context/WishlistContext';
import ProductGrid from '../components/ProductGrid';
import { Heart } from 'lucide-react';
import './pages.css';

export default function Wishlist() {
  const { items } = useWishlist();

  if (items.length === 0) {
    return (
      <div className="page-container" style={{ textAlign: 'center', padding: '10rem 2rem' }}>
        <Heart size={48} color="#ddd" style={{ marginBottom: '1.5rem' }} />
        <h2 style={{ fontSize: '1.8rem', fontWeight: 800, marginBottom: '1rem' }}>No items in your wishlist</h2>
        <p style={{ color: '#666', marginBottom: '2rem' }}>Start saving your favorite pieces today.</p>
        <a href="/" className="btn">Continue Shopping</a>
      </div>
    );
  }

  return (
    <div className="page-container" style={{ padding: '6rem 2rem', maxWidth: '1400px', margin: '0 auto' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '4rem' }}>
        <h1 className="page-title" style={{ margin: 0 }}>Wishlist</h1>
        <span style={{ fontSize: '1.1rem', color: '#888', fontWeight: 500 }}>({items.length} items)</span>
      </div>

      <ProductGrid products={items} />
    </div>
  );
}
