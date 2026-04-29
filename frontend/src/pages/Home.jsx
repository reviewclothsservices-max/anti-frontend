import { useState, useEffect } from 'react';
import { useProducts } from '../context/ProductsContext';
import ProductGrid from '../components/ProductGrid';
import ThreeDHero from '../components/ThreeDHero';
import './pages.css';

export default function Home() {
  const { products } = useProducts();
  const [heroIndex, setHeroIndex] = useState(0);
  const [splashImages, setSplashImages] = useState([]);
  const [heroTitle, setHeroTitle] = useState('Exclusive Drop');
  const [heroSubtitle, setHeroSubtitle] = useState('Elevate your everyday with the signature collection.');
  const [heroAnimation, setHeroAnimation] = useState('hero-ken-burns');
  const [heroFit, setHeroFit] = useState('cover');
  const [heroPosition, setHeroPosition] = useState('center');
  const [videoFit, setVideoFit] = useState('cover');

  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_URL}/api/splash-images`)
      .then(res => res.json())
      .then(data => {
        if (data.ok) {
          if (data.images && data.images.length > 0) setSplashImages(data.images);
          if (data.heroTitle) setHeroTitle(data.heroTitle);
          if (data.heroSubtitle) setHeroSubtitle(data.heroSubtitle);
          if (data.heroAnimation) setHeroAnimation(data.heroAnimation);
          if (data.heroFit) setHeroFit(data.heroFit);
          if (data.heroPosition) setHeroPosition(data.heroPosition);
          if (data.videoFit) setVideoFit(data.videoFit);
        }
      });
  }, []);

  // Use specifically uploaded splash images, or fall back to product images
  const heroImages = splashImages.length > 0 
    ? splashImages 
    : products
        .filter(p => p.images && p.images.length > 0)
        .map(p => p.images[0]);

  useEffect(() => {
    if (heroImages.length <= 1) return;

    const currentMedia = heroImages[heroIndex];
    const isVideo = currentMedia?.toLowerCase().match(/\.(mp4|webm|mov)$/);

    // If current is an image, set a timer to advance
    if (!isVideo) {
      const timer = setTimeout(() => {
        setHeroIndex(prev => (prev + 1) % heroImages.length);
      }, 5000);
      return () => clearTimeout(timer);
    }
    
    // For videos, we don't set a timer here; we rely on the onEnded event in the JSX.
  }, [heroIndex, heroImages.length, heroImages]);

  const handleVideoEnded = () => {
    setHeroIndex(prev => (prev + 1) % heroImages.length);
  };

  const currentHeroImg = heroImages[heroIndex] || '';

  return (
    <div>
      {/* Hero */}
      <section
        className={`page-hero ${heroAnimation}`}
        style={{
          backgroundSize: heroFit,
          backgroundPosition: heroPosition,
          transition: 'background-image 1.5s ease-in-out',
        }}
      >
        {/* Render Background Media */}
        {currentHeroImg.toLowerCase().match(/\.(mp4|webm|mov)$/) ? (
          <video 
            key={currentHeroImg}
            autoPlay 
            muted 
            loop={heroImages.length === 1}
            onEnded={handleVideoEnded}
            playsInline
            style={{ 
              position: 'absolute', inset: 0, width: '100%', height: '100%', 
              objectFit: videoFit, 
              objectPosition: heroPosition, zIndex: -1
            }}
          >
            <source src={currentHeroImg} type="video/mp4" />
          </video>
        ) : (
          <div style={{
            position: 'absolute', inset: 0, 
            backgroundImage: `url('${currentHeroImg}')`,
            backgroundSize: heroFit,
            backgroundPosition: heroPosition,
            zIndex: -1,
            transition: 'background-image 1.5s ease-in-out'
          }} />
        )}

        <div className="page-hero-content">
          <h1>{heroTitle}</h1>
          <p>{heroSubtitle}</p>
          <button 
            className="admin-btn admin-btn-dark" 
            onClick={() => document.getElementById('collection').scrollIntoView({ behavior: 'smooth' })}
          >
            Shop the Drop
          </button>
        </div>
      </section>

      {/* Product Section */}
      <section id="collection" style={{ padding: '5rem 2rem', background: '#fff' }}>
        <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
          <h2 className="sec-title" style={{ textAlign: 'center', marginBottom: '3rem' }}>The Collection</h2>
          <ProductGrid products={products} />
        </div>
      </section>

      {/* Minimal Footer Info Strip */}
      <section style={{
        background: '#f8f8f8', padding: '4rem 2rem', textAlign: 'center'
      }}>
        <h3 style={{ fontSize: '1.5rem', fontWeight: 800, marginBottom: '1rem' }}>Premium Quality</h3>
        <p style={{ color: '#666', maxWidth: '600px', margin: '0 auto' }}>Crafted for those who value style and substance. Every piece is designed with precision.</p>
      </section>
    </div>
  );
}
