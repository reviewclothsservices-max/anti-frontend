import { useState } from 'react';
import { useCart } from '../context/CartContext';
import { useUI } from '../context/UIContext';
import { CreditCard, Smartphone, Truck, ShieldCheck, ChevronRight, CheckCircle } from 'lucide-react';
import './pages.css';

export default function Checkout() {
  const { items, total, clearCart } = useCart();
  const { showToast } = useUI();
  
  const [step, setStep] = useState(1); // 1: Shipping, 2: Payment
  const [paymentMethod, setPaymentMethod] = useState('upi');
  const [loading, setLoading] = useState(false);
  const [orderDetails, setOrderDetails] = useState(null);

  const [shipping, setShipping] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    pincode: ''
  });

  const handleNextStep = (e) => {
    e.preventDefault();
    if (!shipping.name || !shipping.email || !shipping.phone || !shipping.address) {
      showToast('Please fill in all required fields', 'error');
      return;
    }
    setStep(2);
  };

  const confirmOrder = async (paymentId = null) => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/confirm-order`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          email: shipping.email, 
          amount: total,
          paymentId: paymentId || ('COD-' + Date.now()),
          shipping,
          items: items.map(i => ({ name: i.product.name, size: i.size, qty: i.qty, price: i.product.price }))
        }),
      });
      
      const data = await response.json();
      if (data.ok) {
        setOrderDetails(data);
        clearCart();
      } else {
        throw new Error(data.error || 'Failed to confirm order');
      }
    } catch (err) {
      showToast(`Confirmation Error: ${err.message}`, 'error');
    }
  };

  const handlePayment = async () => {
    setLoading(true);
    try {
      if (paymentMethod === 'cod') {
        await confirmOrder();
        return;
      }

      // Online Payment Flow (Razorpay)
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/create-order`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amount: total }),
      });
      
      if (!res.ok) {
        const errorMsg = await res.text();
        throw new Error(errorMsg || 'Failed to initialize payment');
      }

      const data = await res.json();
      if (!data.ok) throw new Error(data.error || 'Server error');

      const options = {
        key: 'rzp_live_SbqtzACu7XATZi',
        amount: data.order.amount,
        currency: data.order.currency,
        name: 'REVIEW Clothing',
        description: 'Purchase Payment',
        order_id: data.order.id,
        handler: async function (response) {
          await confirmOrder(response.razorpay_payment_id);
        },
        prefill: {
          name: shipping.name,
          email: shipping.email,
          contact: shipping.phone,
        },
        theme: { color: '#111' },
      };

      const rzp = new window.Razorpay(options);
      rzp.on('payment.failed', function (response) {
        showToast(`Payment Failed: ${response.error.description}`, 'error');
      });
      rzp.open();
    } catch (err) {
      showToast(`Error: ${err.message}`, 'error');
    } finally {
      setLoading(false);
    }
  };

  if (orderDetails) {
    return (
      <div className="page-container success-page" style={{ textAlign: 'center', padding: '10rem 2rem' }}>
        <CheckCircle size={64} color="#00a650" style={{ marginBottom: '2rem' }} />
        <h1 style={{ fontSize: '2.5rem', fontWeight: 800, marginBottom: '1rem' }}>Order Placed!</h1>
        <p style={{ fontSize: '1.2rem', color: '#666', marginBottom: '3rem' }}>
          Thank you for choosing Review. Your order number is: <br />
          <strong style={{ fontSize: '2rem', color: '#111', display: 'block', marginTop: '1rem' }}>{orderDetails.orderNumber}</strong>
        </p>
        <p style={{ color: '#888', marginBottom: '3rem' }}>You can use this number to track your order details anytime.</p>
        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
          <a href="/orders" className="btn btn-outline" style={{ borderColor: '#111', color: '#111' }}>Track Order</a>
          <a href="/" className="btn">Back to Shop</a>
        </div>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="page-container" style={{ textAlign: 'center', padding: '10rem 2rem' }}>
        <h2>Your bag is empty</h2>
        <a href="/" className="btn" style={{ marginTop: '2rem' }}>Go Shopping</a>
      </div>
    );
  }

  return (
    <div className="page-container checkout-page" style={{ padding: '6rem 2rem', maxWidth: '1200px', margin: '0 auto' }}>
      <div className="checkout-header" style={{ marginBottom: '4rem', textAlign: 'center' }}>
        <h1 className="page-title">Checkout</h1>
        <div className="checkout-steps" style={{ display: 'flex', justifyContent: 'center', gap: '2rem', marginTop: '2rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', opacity: step >= 1 ? 1 : 0.4 }}>
            <span style={{ width: '24px', height: '24px', borderRadius: '50%', background: step >= 1 ? '#111' : '#ccc', color: '#fff', fontSize: '0.8rem', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>1</span>
            <span style={{ fontWeight: 600 }}>Address</span>
          </div>
          <ChevronRight size={18} color="#ccc" />
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', opacity: step >= 2 ? 1 : 0.4 }}>
            <span style={{ width: '24px', height: '24px', borderRadius: '50%', background: step >= 2 ? '#111' : '#ccc', color: '#fff', fontSize: '0.8rem', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>2</span>
            <span style={{ fontWeight: 600 }}>Payment</span>
          </div>
        </div>
      </div>

      <div className="checkout-layout">
        <div className="checkout-main">
          {step === 1 ? (
            <form onSubmit={handleNextStep}>
              <section className="checkout-section">
                <h3 className="section-title"><Truck size={20} /> Shipping Details</h3>
                <div className="checkout-form">
                  <input type="text" placeholder="Full Name" className="form-input" value={shipping.name} onChange={e => setShipping({...shipping, name: e.target.value})} required />
                  <input type="email" placeholder="Email Address" className="form-input" value={shipping.email} onChange={e => setShipping({...shipping, email: e.target.value})} required />
                  <input type="tel" placeholder="Phone Number" className="form-input" value={shipping.phone} onChange={e => setShipping({...shipping, phone: e.target.value})} required />
                  <input type="text" placeholder="House No, Area, Street Name" className="form-input" value={shipping.address} onChange={e => setShipping({...shipping, address: e.target.value})} required />
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                    <input type="text" placeholder="City" className="form-input" value={shipping.city} onChange={e => setShipping({...shipping, city: e.target.value})} required />
                    <input type="text" placeholder="Pincode" className="form-input" value={shipping.pincode} onChange={e => setShipping({...shipping, pincode: e.target.value})} required />
                  </div>
                </div>
                <button type="submit" className="btn" style={{ width: '100%', marginTop: '2rem', padding: '1.2rem' }}>Proceed to Payment</button>
              </section>
            </form>
          ) : (
            <section className="checkout-section">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                <h3 className="section-title" style={{ margin: 0 }}><CreditCard size={20} /> Payment Method</h3>
                <button onClick={() => setStep(1)} style={{ background: 'none', border: 'none', fontWeight: 600, textDecoration: 'underline', cursor: 'pointer', fontSize: '0.9rem' }}>Change Address</button>
              </div>
              
              <div className="payment-options">
                {[
                  { id: 'upi', label: 'Online Payment (Razorpay)', icon: <Smartphone size={20} /> },
                  { id: 'cod', label: 'Cash on Delivery', icon: <Truck size={20} /> },
                ].map(method => (
                  <label key={method.id} className={`payment-option-card ${paymentMethod === method.id ? 'active' : ''}`}>
                    <input type="radio" name="payment" value={method.id} checked={paymentMethod === method.id} onChange={() => setPaymentMethod(method.id)} style={{ display: 'none' }} />
                    <span className="icon">{method.icon}</span>
                    <span className="label">{method.label}</span>
                  </label>
                ))}
              </div>

              <div style={{ marginTop: '3rem', padding: '2rem', border: '1px solid #111', borderRadius: '12px' }}>
                <p style={{ display: 'flex', alignItems: 'center', gap: '0.8rem', fontWeight: 700, marginBottom: '1rem' }}>
                   <Truck size={18} /> Delivering to:
                </p>
                <p style={{ color: '#666', fontSize: '0.95rem' }}>{shipping.name}, {shipping.phone}</p>
                <p style={{ color: '#666', fontSize: '0.95rem' }}>{shipping.address}, {shipping.city} - {shipping.pincode}</p>
              </div>
            </section>
          )}
        </div>

        <div className="checkout-sidebar">
          <div className="order-summary-card">
            <h3 style={{ marginBottom: '1.5rem', fontWeight: 700 }}>Order Summary</h3>
            <div className="summary-items">
              {items.map(item => (
                <div key={item.key} className="summary-item">
                  <span>{item.product.name} (x{item.qty})</span>
                  <span>₹{(item.product.price * item.qty).toFixed(2)}</span>
                </div>
              ))}
            </div>
            
            <div className="summary-totals">
              <div className="total-row">
                <span>Subtotal</span>
                <span>₹{total.toFixed(2)}</span>
              </div>
              <div className="total-row highlight">
                <span>Delivery Charge</span>
                <span>FREE</span>
              </div>
              <div className="total-row final">
                <span>Total</span>
                <span>₹{total.toFixed(2)}</span>
              </div>
            </div>

            {step === 2 && (
              <button 
                className="btn" 
                style={{ width: '100%', padding: '1.2rem', fontSize: '1.1rem', marginTop: '2rem' }} 
                onClick={handlePayment}
                disabled={loading}
              >
                {loading ? 'Processing...' : paymentMethod === 'cod' ? 'Place Order' : 'Pay Now'}
              </button>
            )}
            {step === 2 && (
              <p className="secure-text"><ShieldCheck size={16} /> Secure Encrypted Payment</p>
            )}
          </div>
        </div>
      </div>

      <style>{`
        .checkout-layout { display: grid; grid-template-columns: 1fr 400px; gap: 4rem; }
        @media (max-width: 900px) { .checkout-layout { grid-template-columns: 1fr; } }
        .section-title { display: flex; alignItems: center; gap: 0.8rem; marginBottom: 1.5rem; fontWeight: 700; fontSize: 1.25rem; }
        .checkout-form { display: grid; gap: 1rem; }
        .form-input { width: 100%; padding: 1.1rem; border: 1px solid #ddd; borderRadius: 8px; font-family: inherit; transition: border-color 0.2s; }
        .form-input:focus { outline: none; border-color: #111; }
        .payment-options { display: grid; gap: 1rem; }
        .payment-option-card { display: flex; alignItems: center; gap: 1rem; padding: 1.5rem; border: 2px solid #eee; borderRadius: 12px; cursor: pointer; transition: all 0.2s; }
        .payment-option-card.active { border-color: #111; background: #fff; }
        .payment-option-card .icon { color: #888; }
        .payment-option-card.active .icon { color: #111; }
        .payment-option-card .label { fontWeight: 600; }
        .order-summary-card { background: #f9f9f9; padding: 2.5rem; borderRadius: 20px; position: sticky; top: 100px; }
        .summary-items { marginBottom: 2rem; borderBottom: 1px solid #ddd; paddingBottom: 1.5rem; }
        .summary-item { display: flex; justifyContent: space-between; marginBottom: 0.8rem; fontSize: 0.95rem; }
        .total-row { display: flex; justifyContent: space-between; marginBottom: 0.8rem; }
        .total-row.highlight { color: #00a650; fontWeight: 600; }
        .total-row.final { marginTop: 1.5rem; fontSize: 1.4rem; fontWeight: 900; }
        .secure-text { display: flex; alignItems: center; justifyContent: center; gap: 0.5rem; marginTop: 1.5rem; fontSize: 0.85rem; color: #666; }
      `}</style>
    </div>
  );
}
