import './pages.css';

export default function Terms() {
  return (
    <div className="page-container" style={{ padding: '6rem 2rem', maxWidth: '800px', margin: '0 auto', minHeight: '60vh' }}>
      <h1 className="page-title" style={{ marginBottom: '3rem' }}>Terms & Conditions for review.clothing</h1>

      <div className="legal-content" style={{ lineHeight: 1.8, color: '#333' }}>
        <p>By using this website, you agree to the following terms:</p>

        <h3 style={{ marginTop: '2.5rem', marginBottom: '1rem', fontWeight: 700 }}>1. Use of Content</h3>
        <p>All content is for informational purposes only. You may not copy or reuse without permission.</p>

        <h3 style={{ marginTop: '2.5rem', marginBottom: '1rem', fontWeight: 700 }}>2. User Responsibility</h3>
        <p>You agree not to:</p>
        <ul style={{ paddingLeft: '1.5rem', marginBottom: '1.5rem' }}>
          <li>Post harmful or illegal content</li>
          <li>Misuse the website</li>
        </ul>

        <h3 style={{ marginTop: '2.5rem', marginBottom: '1rem', fontWeight: 700 }}>3. Reviews Disclaimer</h3>
        <p>All reviews are opinions and may not reflect actual product performance.</p>

        <h3 style={{ marginTop: '2.5rem', marginBottom: '1rem', fontWeight: 700 }}>4. External Links</h3>
        <p>We may link to third-party websites. We are not responsible for their content.</p>

        <h3 style={{ marginTop: '2.5rem', marginBottom: '1rem', fontWeight: 700 }}>5. Limitation of Liability</h3>
        <p>We are not liable for any loss or damage resulting from the use of our website.</p>

        <h3 style={{ marginTop: '2.5rem', marginBottom: '1rem', fontWeight: 700 }}>6. Changes</h3>
        <p>We may update these terms at any time.</p>

        <h3 style={{ marginTop: '2.5rem', marginBottom: '1rem', fontWeight: 700 }}>7. Governing Law</h3>
        <p>These terms are governed by the laws of India.</p>
      </div>
    </div>
  );
}
