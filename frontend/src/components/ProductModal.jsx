import { useState } from 'react';
import { X, ShoppingBag, Heart, Plus, Minus } from 'lucide-react';
import { useUI } from '../context/UIContext';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import './ProductModal.css';

export default function ProductModal() {
  const { selectedProduct, closeProduct, openCart, showToast } = useUI();
  const { addItem } = useCart();
  const { toggle, isWishlisted } = useWishlist();

  const [activeImg, setActiveImg] = useState(0);
  const [size, setSize] = useState(null);
  const [qty, setQty] = useState(1);
  const [sizeError, setSizeError] = useState(false);

  if (!selectedProduct) return null;

  const p = selectedProduct;
  const wishlisted = isWishlisted(p.id);
  const images = p.images && p.images.length > 0 ? p.images : (p.image ? [p.image] : []);

  const handleAddToCart = () => {
    const chosen = size || (p.sizes && p.sizes[0]) || 'Standard';
    addItem(p, chosen, qty);
    showToast(`${p.name} added to bag`);
    closeProduct();
    setTimeout(() => {
      openCart();
    }, 300);
  };

  const handleWishlist = () => {
    toggle(p);
    showToast(isWishlisted(p.id) ? 'Removed from wishlist' : 'Added to wishlist', isWishlisted(p.id) ? 'info' : 'success');
  };

  return (
    <>
      <div className="modal-overlay" style={{ zIndex: 960 }} onClick={closeProduct} />
      <div className="product-modal">
        <button className="modal-close product-modal-close" onClick={closeProduct} aria-label="Close"><X size={20} /></button>
        <div className="product-modal-image-group">
          <div className="pm-main-image">
            {p.badge && <span className="pm-badge">{p.badge}</span>}
            <img src={images[activeImg]} alt={p.name} />
          </div>
          {images.length > 1 && (
            <div className="pm-thumbnails">
              {images.map((img, idx) => (
                <div 
                  key={idx} 
                  className={`pm-thumb ${activeImg === idx ? 'active' : ''}`}
                  onClick={() => setActiveImg(idx)}
                >
                  <img src={img} alt={`Thumb ${idx}`} />
                </div>
              ))}
            </div>
          )}
        </div>
        <div className="product-modal-info">
          <p className="pm-category">{p.category} / {p.subCategory}</p>
          <h2 className="pm-name">{p.name}</h2>
          <div className="pm-price-row">
            {p.oldPrice && <span className="pm-old-price">₹{p.oldPrice.toFixed(2)}</span>}
            <span className="pm-price">₹{p.price.toFixed(2)}</span>
          </div>
          <p className="pm-stock">{p.stock > 5 ? `In Stock (${p.stock} left)` : p.stock > 0 ? `⚡ Only ${p.stock} left!` : 'Out of Stock'}</p>

          {p.sizes && p.sizes.length > 0 && (
            <div className="pm-section">
              <p className="pm-label">Size {sizeError && <span className="pm-size-error"> — Please select a size</span>}</p>
              <div className="pm-sizes">
                {p.sizes.map(s => (
                  <button
                    key={s}
                    className={`pm-size-btn ${size === s ? 'active' : ''}`}
                    onClick={() => { setSize(s); setSizeError(false); }}
                  >{s}</button>
                ))}
              </div>
            </div>
          )}

          <div className="pm-section">
            <p className="pm-label">Quantity</p>
            <div className="pm-qty">
              <button onClick={() => setQty(q => Math.max(1, q - 1))} aria-label="Decrease"><Minus size={14} /></button>
              <span>{qty}</span>
              <button onClick={() => setQty(q => q + 1)} aria-label="Increase"><Plus size={14} /></button>
            </div>
          </div>

          <div className="pm-actions">
            <button className="btn pm-cart-btn" onClick={handleAddToCart} disabled={p.stock === 0}>
              <ShoppingBag size={18} strokeWidth={1.5} />
              {p.stock === 0 ? 'Out of Stock' : 'Add to Bag'}
            </button>
            <button className={`pm-wish-btn ${wishlisted ? 'active' : ''}`} onClick={handleWishlist} aria-label="Wishlist">
              <Heart size={20} fill={wishlisted ? '#e63946' : 'none'} stroke={wishlisted ? '#e63946' : '#111'} />
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
