import { useState, useEffect } from 'react';
import { Image as ImageIcon, Trash2, Plus, UploadCloud } from 'lucide-react';

export default function Splash() {
  const [images, setImages] = useState([]);
  const [heroTitle, setHeroTitle] = useState('');
  const [heroSubtitle, setHeroSubtitle] = useState('');
  const [heroAnimation, setHeroAnimation] = useState('hero-ken-burns');
  const [heroFit, setHeroFit] = useState('cover');
  const [heroPosition, setHeroPosition] = useState('center');
  const [videoFit, setVideoFit] = useState('cover');
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [viewing, setViewing] = useState(null);

  useEffect(() => {
    fetchSplashImages();
  }, []);

  const fetchSplashImages = async () => {
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/splash-images`);
      const data = await res.json();
      if (data.ok) {
        setImages(data.images);
        setHeroTitle(data.heroTitle);
        setHeroSubtitle(data.heroSubtitle);
        setHeroAnimation(data.heroAnimation || 'hero-ken-burns');
        setHeroFit(data.heroFit || 'cover');
        setHeroPosition(data.heroPosition || 'center');
        setVideoFit(data.videoFit || 'cover');
      }
    } catch (err) {
      console.error('Failed to fetch splash images:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    setUploading(true);
    const formData = new FormData();
    selectedFiles.forEach(file => formData.append('images', file));
    formData.append('existingImages', JSON.stringify(images));
    formData.append('heroTitle', heroTitle);
    formData.append('heroSubtitle', heroSubtitle);
    formData.append('heroAnimation', heroAnimation);
    formData.append('heroFit', heroFit);
    formData.append('heroPosition', heroPosition);
    formData.append('videoFit', videoFit);

    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/admin/splash-images`, {
        method: 'POST',
        body: formData,
      });
      const data = await res.json();
      if (data.ok) {
        setImages(data.images);
        setSelectedFiles([]);
        alert('Home Screen settings updated!');
      }
    } catch (err) {
      alert('Failed to save settings: ' + err.message);
    } finally {
      setUploading(false);
    }
  };

  const removeImage = async (index) => {
    const updated = images.filter((_, i) => i !== index);
    setImages(updated);
    setViewing(null);
  };

  if (loading) return <div className="admin-loading">Loading configuration...</div>;

  return (
    <div className="admin-page">
      <div className="admin-page-header">
        <div>
          <h1>Home Screen Typography & Visuals</h1>
          <p>Control the first impression of your website</p>
        </div>
        <button className="admin-btn admin-btn-dark" onClick={handleSave} disabled={uploading}>
          {uploading ? 'Applying...' : 'Publish Changes'}
        </button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 350px', gap: '2rem' }}>
        <div className="admin-card">
          <div className="admin-card-header">
            <h2 style={{ fontSize: '1rem', fontWeight: 600 }}>Hero Background Carousel</h2>
          </div>
          
          <div className="splash-grid" style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', 
            gap: '1.5rem', 
            padding: '1.5rem' 
          }}>
            {images.map((img, i) => {
              const isVideo = img.toLowerCase().match(/\.(mp4|webm|mov)$/);
              return (
                <div 
                  key={i} 
                  className="splash-item" 
                  onClick={() => setViewing(i)}
                  style={{ 
                    position: 'relative', borderRadius: '12px', overflow: 'hidden', 
                    aspectRatio: '16/9', height: '140px', border: '1px solid #eee', cursor: 'pointer' 
                  }}
                >
                  {isVideo ? (
                    <video src={img} muted style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  ) : (
                    <img src={img} alt={`Splash ${i}`} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  )}
                  <div style={{ 
                    position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.2)', 
                    opacity: 0, transition: 'opacity 0.2s', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff' 
                  }} className="hover-mask">
                    <Plus size={20} />
                  </div>
                </div>
              );
            })}

            <div className="splash-add" style={{ 
              height: '140px', border: '2px dashed #ddd', borderRadius: '12px', 
              display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', 
              gap: '0.5rem', color: '#888', cursor: 'pointer' 
            }} onClick={() => document.getElementById('splash-input').click()}>
              <ImageIcon size={24} />
              <span style={{ fontSize: '0.8rem' }}>Upload Media</span>
              <small style={{ fontSize: '0.6rem' }}>Images & Videos</small>
              <input 
                id="splash-input" 
                type="file" 
                multiple 
                accept="image/*,video/mp4,video/webm"
                onChange={(e) => setSelectedFiles(Array.from(e.target.files))} 
                style={{ display: 'none' }} 
              />
            </div>
          </div>
          
          {selectedFiles.length > 0 && (
            <div style={{ padding: '0 1.5rem 1.5rem', fontSize: '0.9rem', color: '#00a650', fontWeight: 600 }}>
              ✓ {selectedFiles.length} new files ready to publish
            </div>
          )}
        </div>

        <div className="admin-card" style={{ height: 'fit-content' }}>
          <div className="admin-card-header">
            <h2 style={{ fontSize: '1rem', fontWeight: 600 }}>Hero Text</h2>
          </div>
          <div style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <div className="admin-field">
              <label>Main Heading</label>
              <input value={heroTitle} onChange={(e) => setHeroTitle(e.target.value)} placeholder="e.g. Exclusive Drop" />
            </div>
            <div className="admin-field">
              <label>Description</label>
              <textarea 
                value={heroSubtitle} 
                onChange={(e) => setHeroSubtitle(e.target.value)} 
                style={{ width: '100%', padding: '0.8rem', borderRadius: '8px', border: '1px solid #ddd', minHeight: '100px' }}
                placeholder="e.g. Elevate your everyday..."
              />
            </div>
            <div className="admin-field">
              <label>Animation Style</label>
              <select 
                value={heroAnimation} 
                onChange={(e) => setHeroAnimation(e.target.value)}
                style={{ width: '100%', padding: '0.8rem', borderRadius: '8px', border: '1px solid #ddd' }}
              >
                <option value="hero-ken-burns">Ken Burns (Slow Zoom In)</option>
                <option value="hero-zoom-out">Cinematic Zoom Out</option>
                <option value="hero-pan-down">Elegant Pan Down</option>
                <option value="hero-breathe">Atmospheric Fade (Breathe)</option>
                <option value="hero-blur">Soft Focus (Blur & Reveal)</option>
                <option value="hero-fade">Static (No Movement)</option>
              </select>
            </div>

            <div className="admin-field">
              <label>Alignment Grid (Image Focus)</label>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '4px', width: '120px', marginTop: '8px' }}>
                {[
                  'top left', 'top center', 'top right',
                  'center left', 'center', 'center right',
                  'bottom left', 'bottom center', 'bottom right'
                ].map((realPos, idx) => (
                  <button 
                    key={idx}
                    onClick={() => setHeroPosition(realPos)}
                    style={{ 
                      height: '30px', border: '1px solid #ddd', 
                      background: heroPosition === realPos ? '#111' : '#fff',
                      borderRadius: '4px', cursor: 'pointer'
                    }}
                    type="button"
                    title={realPos}
                  />
                ))}
              </div>
              <small style={{ color: '#888', marginTop: '4px', display: 'block' }}>Current Focus: {heroPosition}</small>
            </div>

            <div className="admin-field">
              <label>Video Sizing</label>
              <div style={{ display: 'flex', gap: '0.5rem', marginTop: '8px' }}>
                <button 
                  type="button"
                  className={`admin-btn ${videoFit === 'cover' ? 'admin-btn-dark' : 'admin-btn-outline'}`}
                  onClick={() => setVideoFit('cover')}
                  style={{ flex: 1, fontSize: '0.8rem', padding: '0.5rem' }}
                >Full Screen</button>
                <button 
                  type="button"
                  className={`admin-btn ${videoFit === 'contain' ? 'admin-btn-dark' : 'admin-btn-outline'}`}
                  onClick={() => setVideoFit('contain')}
                  style={{ flex: 1, fontSize: '0.8rem', padding: '0.5rem' }}
                >Fit Video</button>
              </div>
            </div>

            <div className="admin-field">
              <label>Image Sizing</label>
              <div style={{ display: 'flex', gap: '0.5rem', marginTop: '8px' }}>
                <button 
                  type="button"
                  className={`admin-btn ${heroFit === 'cover' ? 'admin-btn-dark' : 'admin-btn-outline'}`}
                  onClick={() => setHeroFit('cover')}
                  style={{ flex: 1, fontSize: '0.8rem', padding: '0.5rem' }}
                >Full Screen</button>
                <button 
                  type="button"
                  className={`admin-btn ${heroFit === 'contain' ? 'admin-btn-dark' : 'admin-btn-outline'}`}
                  onClick={() => setHeroFit('contain')}
                  style={{ flex: 1, fontSize: '0.8rem', padding: '0.5rem' }}
                >Fit Image</button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {viewing !== null && (
        <div className="admin-modal-overlay" onClick={() => setViewing(null)}>
          <div className="admin-modal" onClick={e => e.stopPropagation()} style={{ maxWidth: '600px' }}>
            <h3>Manage Splash Media</h3>
            <img src={images[viewing]} style={{ width: '100%', borderRadius: '8px', marginBottom: '1.5rem' }} />
            <div style={{ display: 'flex', gap: '1rem' }}>
              <button className="admin-btn admin-btn-outline" style={{ flex: 1 }} onClick={() => setViewing(null)}>Close</button>
              <button className="admin-btn" style={{ flex: 1, backgroundColor: '#ff4d4d', color: '#fff', border: 'none' }} onClick={() => removeImage(viewing)}>
                <Trash2 size={16} /> Remove from Carousel
              </button>
            </div>
          </div>
        </div>
      )}

      <style>{`
        .splash-item:hover .hover-mask { opacity: 1 !important; }
      `}</style>
    </div>
  );
}
