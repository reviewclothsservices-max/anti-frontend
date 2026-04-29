import './pages.css';

export default function About() {
  return (
    <div className="page-container" style={{ padding: '6rem 2rem', maxWidth: '800px', margin: '0 auto', textAlign: 'center', minHeight: '60vh' }}>
      <h1 className="page-title">About REVIEW group</h1>
      <p style={{ marginTop: '2rem', fontSize: '1.2rem', lineHeight: 1.8, color: '#444' }}>
        this brand is developed by an group of friends
      </p>
    </div>
  );
}
