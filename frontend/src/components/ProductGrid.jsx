import { ShoppingBag, Heart } from 'lucide-react';
import { useUI } from '../context/UIContext';
import { useWishlist } from '../context/WishlistContext';
import './ProductGrid.css';

export default function ProductGrid({ products }) {
  return (
    <div className="pg-grid">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
}

function ProductCard({ product }) {
  const { openProduct } = useUI();
  const { toggle, isWishlisted } = useWishlist();
  const wishlisted = isWishlisted(product.id);

  return (
    <div className="pg-card">
      <div className="pg-image-wrap" onClick={() => openProduct(product)} style={{ cursor: 'pointer' }}>
        <img src={product.images?.[0] || product.image} alt={product.name} loading="lazy" />
        <button
          className={`pg-wishlist ${wishlisted ? 'active' : ''}`}
          onClick={(e) => { e.stopPropagation(); toggle(product); }}
          aria-label="Wishlist"
        >
          <Heart size={18} fill={wishlisted ? '#e63946' : 'none'} stroke={wishlisted ? '#e63946' : '#111'} />
        </button>
        <button className="pg-add-cart" onClick={(e) => { 
          e.stopPropagation(); 
          openProduct(product); 
        }}>
          <ShoppingBag size={16} strokeWidth={1.5} /> Add to Cart
        </button>
      </div>
      <div className="pg-info">
        {product.badge && <span className="pg-badge">{product.badge}</span>}
        <p className="pg-name">{product.name}</p>
        <p className="pg-price">
          {product.oldPrice && <span className="pg-old">₹{typeof product.oldPrice === 'number' ? product.oldPrice.toFixed(2) : product.oldPrice}</span>}
          <span>₹{typeof product.price === 'number' ? product.price.toFixed(2) : product.price}</span>
        </p>
      </div>
    </div>
  );
}
