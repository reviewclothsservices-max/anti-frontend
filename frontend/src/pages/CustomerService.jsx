import './pages.css';

export default function CustomerService() {
  return (
    <div className="page-container" style={{ padding: '6rem 2rem', maxWidth: '800px', margin: '0 auto', minHeight: '60vh' }}>
      <h1 className="page-title" style={{ textAlign: 'center', marginBottom: '3rem' }}>Customer Service</h1>
      
      <div style={{ fontSize: '1.1rem', lineHeight: 1.8, color: '#444' }}>
        <p>We are here to help you. If you have any inquiries regarding your orders, product details, or returns, please reach out.</p>
        
        <div style={{ marginTop: '3rem', background: '#f9f9f9', padding: '2rem', borderRadius: '12px', border: '1px solid #eee' }}>
          <h3 style={{ marginBottom: '1.5rem', fontWeight: 700 }}>Contact Information</h3>
          <p>When reaching out, please include all required and useful things to contact us (e.g., your order number and full name) so we can assist you quickly.</p>
          
          <div style={{ marginTop: '1.5rem', padding: '1rem', background: '#111', color: '#fff', borderRadius: '8px', display: 'inline-block' }}>
            <span style={{ fontWeight: 600, letterSpacing: '0.05em' }}>Email: </span> 
            <a href="mailto:reviewclothsservices@gmail.com" style={{ color: '#fff', textDecoration: 'underline' }}>reviewclothsservices@gmail.com</a>
          </div>
        </div>
      </div>
    </div>
  );
}
