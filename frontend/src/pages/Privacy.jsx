import './pages.css';

export default function Privacy() {
  return (
    <div className="page-container" style={{ padding: '6rem 2rem', maxWidth: '800px', margin: '0 auto', minHeight: '60vh' }}>
      <h1 className="page-title" style={{ marginBottom: '1rem' }}>Privacy Policy for review.clothing</h1>
      <p style={{ color: '#666', marginBottom: '3rem' }}>Effective Date: April 2026</p>

      <div className="legal-content" style={{ lineHeight: 1.8, color: '#333' }}>
        <p>At review.clothing, we respect your privacy and are committed to protecting your personal information.</p>

        <h3 style={{ marginTop: '2.5rem', marginBottom: '1rem', fontWeight: 700 }}>1. Information We Collect</h3>
        <p>We may collect:</p>
        <ul style={{ paddingLeft: '1.5rem', marginBottom: '1.5rem' }}>
          <li>Personal information (name, email, etc.)</li>
          <li>Usage data (pages visited, time spent)</li>
          <li>Cookies and tracking technologies</li>
        </ul>

        <h3 style={{ marginTop: '2.5rem', marginBottom: '1rem', fontWeight: 700 }}>2. How We Use Information</h3>
        <p>We use your data to:</p>
        <ul style={{ paddingLeft: '1.5rem', marginBottom: '1.5rem' }}>
          <li>Improve our website</li>
          <li>Respond to user inquiries</li>
          <li>Provide better content and recommendations</li>
        </ul>

        <h3 style={{ marginTop: '2.5rem', marginBottom: '1rem', fontWeight: 700 }}>3. Cookies</h3>
        <p>We use cookies to enhance user experience. You can disable cookies in your browser settings.</p>

        <h3 style={{ marginTop: '2.5rem', marginBottom: '1rem', fontWeight: 700 }}>4. Third-Party Services</h3>
        <p>We may use third-party tools (e.g., analytics, ads) that may collect information in accordance with their policies.</p>

        <h3 style={{ marginTop: '2.5rem', marginBottom: '1rem', fontWeight: 700 }}>5. Data Protection</h3>
        <p>We take reasonable steps to protect your data but cannot guarantee 100% security.</p>

        <h3 style={{ marginTop: '2.5rem', marginBottom: '1rem', fontWeight: 700 }}>6. User Rights</h3>
        <p>You may request:</p>
        <ul style={{ paddingLeft: '1.5rem', marginBottom: '1.5rem' }}>
          <li>Access to your data</li>
          <li>Correction or deletion of your data</li>
        </ul>

        <h3 style={{ marginTop: '2.5rem', marginBottom: '1rem', fontWeight: 700 }}>7. Changes to This Policy</h3>
        <p>We may update this policy anytime. Changes will be posted on this page.</p>

        <h3 style={{ marginTop: '2.5rem', marginBottom: '1rem', fontWeight: 700 }}>8. Contact Us</h3>
        <p>If you have any questions, contact us at:</p>
        <p>Email: <strong>reviewclothsservices@gmail.com</strong></p>
      </div>
    </div>
  );
}
