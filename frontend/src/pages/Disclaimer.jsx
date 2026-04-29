import './pages.css';

export default function Disclaimer() {
  return (
    <div className="page-container" style={{ padding: '6rem 2rem', maxWidth: '800px', margin: '0 auto', minHeight: '60vh' }}>
      <h1 className="page-title" style={{ marginBottom: '3rem' }}>Disclaimer</h1>

      <div className="legal-content" style={{ lineHeight: 1.8, color: '#333' }}>
        <p style={{ marginBottom: '1.5rem' }}>The information provided on review.clothing is for general informational purposes only.</p>

        <ul style={{ paddingLeft: '1.5rem', marginBottom: '2.5rem', display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
          <li>We do not guarantee accuracy or completeness</li>
          <li>Product reviews are based on opinions</li>
          <li>We may earn commissions through affiliate links</li>
        </ul>

        <p>Users should verify product details independently before purchasing.</p>
      </div>
    </div>
  );
}
