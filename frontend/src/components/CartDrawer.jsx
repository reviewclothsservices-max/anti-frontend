import { useCart } from '../context/CartContext';
import { useUI } from '../context/UIContext';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { X, Trash2, Plus, Minus, ShoppingBag } from 'lucide-react';
import './CartDrawer.css';

export default function CartDrawer() {
  const { cartOpen, closeCart, openAuth } = useUI();
  const { items, removeItem, updateQty, total, count } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  const handleCheckout = () => {
    closeCart();
    if (!user) {
      openAuth('login', '/checkout');
      return;
    }
    navigate('/checkout');
  };

  if (!cartOpen) return null;

  return (
    <>
      <div className="drawer-overlay" onClick={closeCart} />
      <div className="cart-drawer">
        <div className="cart-drawer-header">
          <h2>Your Bag ({count})</h2>
          <button className="drawer-close" onClick={closeCart} aria-label="Close cart"><X size={22} /></button>
        </div>

        {items.length === 0 ? (
          <div className="cart-empty">
            <ShoppingBag size={52} strokeWidth={1} />
            <p>Your bag is empty</p>
            <button className="btn" onClick={closeCart}>Continue Shopping</button>
          </div>
        ) : (
          <>
            <div className="cart-items">
              {items.map(({ key, product, size, qty }) => (
                <div key={key} className="cart-item">
                  <img src={product.image} alt={product.name} />
                  <div className="cart-item-info">
                    <p className="cart-item-name">{product.name}</p>
                    <p className="cart-item-size">Size: {size}</p>
                    <div className="cart-item-controls">
                      <div className="qty-control">
                        <button onClick={() => updateQty(key, qty - 1)} aria-label="Decrease"><Minus size={13} /></button>
                        <span>{qty}</span>
                        <button onClick={() => updateQty(key, qty + 1)} aria-label="Increase"><Plus size={13} /></button>
                      </div>
                      <span className="cart-item-price">₹{(product.price * qty).toFixed(2)}</span>
                    </div>
                  </div>
                  <button className="cart-item-remove" onClick={() => removeItem(key)} aria-label="Remove"><Trash2 size={15} /></button>
                </div>
              ))}
            </div>
            <div className="cart-footer">
              <div className="cart-subtotal">
                <span>Subtotal</span>
                <strong>₹{total.toFixed(2)}</strong>
              </div>
              <p className="cart-note">Shipping &amp; taxes calculated at checkout</p>
              <button className="btn cart-checkout-btn" onClick={handleCheckout}>Proceed to Checkout</button>
              <button className="btn btn-outline cart-continue-btn" onClick={closeCart}>Continue Shopping</button>
            </div>
          </>
        )}
      </div>
    </>
  );
}
