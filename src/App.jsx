import { Menu, X } from 'lucide-react';
import { useState } from 'react';
import './App.css'; 

// ምስሎች
import img1 from './assets/1.jpg'; import img2 from './assets/2.jpg'; import img3 from './assets/3.jpg';
import img4 from './assets/4.jpg'; import img5 from './assets/5.jpg'; import img6 from './assets/6.jpg';
import imga from './assets/a.jpg'; import imgb from './assets/b.jpg'; import imgc from './assets/c.jpg';
import imgd from './assets/d.jpg'; import imge from './assets/e.jpg'; import imgf from './assets/f.jpg';
import imgg from './assets/g.jpg'; import imgh from './assets/h.jpg'; import imgi from './assets/i.jpg';
import imgj from './assets/j.jpg'; import imgk from './assets/k.jpg'; import imgl from './assets/l.jpg';

// ቪዲዮዎች
import vid1 from './assets/1.mp4'; import vid2 from './assets/2.mp4'; 
import vid3 from './assets/3.mp4'; import vid4 from './assets/4.mp4'; 
import vid5 from './assets/5.mp4'; import vid6 from './assets/6.mp4'; 
import vid7 from './assets/7.mp4'; import vid8 from './assets/8.mp4'; import vid10 from './assets/10.mp4';

export default function App() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [showGallery, setShowGallery] = useState(false);
  const [activeTab, setActiveTab] = useState('images');

  const collections = [
    { id: 1, title: 'Spring 2026', description: 'Ethereal designs inspired by nature', image: img1 },
    { id: 2, title: 'Urban Edge', description: 'Contemporary streetwear meets haute couture', image: img2 },
    { id: 3, title: 'Atelier', description: 'Behind the scenes of creative process', image: img3 }
  ];

  const imagesOnly = [img4, img5, img6, imga, imgb, imgc, imgd, imge, imgf, imgg, imgh, imgi, imgj, imgk, imgl];
  const videosOnly = [vid1, vid2, vid3, vid4, vid5, vid6, vid7, vid8, vid10];

  return (
    <div className="app">
      <nav className="navbar">
        <div className="nav-container">
          <div className="nav-content">
            <div className="logo">ATELIER</div>
            <div className="nav-menu">
              <a href="#home">Home</a>
              <a href="#collections">Collections</a>
              <a href="#about">About</a>
              <a href="#gallery">Gallery</a>
              <a href="#contact">Contact</a>
            </div>
            <button onClick={() => setMenuOpen(!menuOpen)} className="mobile-menu-btn">
              {menuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
        {menuOpen && (
          <div className="mobile-menu">
            <div className="mobile-menu-content">
              <a href="#home">Home</a>
              <a href="#collections">Collections</a>
              <a href="#about">About</a>
              <a href="#gallery">Gallery</a>
              <a href="https://t.me/lilmoo_design13" target="_blank" rel="noopener noreferrer">Contact</a>
            </div>
          </div>
        )}
      </nav>

      <section id="home" className="hero">
        <img src={img1} alt="Fashion runway" className="hero-image" />
        <div className="hero-overlay">
          <div className="hero-content">
            <h1>Lilmoo Design </h1>
            <p className="hero-subtitle">Contemporary Fashion Design</p>
            <button className="hero-btn" onClick={() => setShowGallery(true)}>Explore Collections</button>
          </div>
        </div>
      </section>

      <section id="collections" className="collections">
        <div className="container">
          <h2 className="section-title">FEATURED COLLECTIONS</h2>
          <div className="collections-grid">
            {collections.map((collection) => (
              <div key={collection.id} className="collection-card">
                <div className="collection-image-wrapper">
                  <img src={collection.image} alt={collection.title} className="collection-image" />
                </div>
                <h3 className="collection-title">{collection.title}</h3>
                <p className="collection-description">{collection.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {showGallery && (
        <section id="gallery" className="gallery-section">
          <div className="container">
            <h2 className="section-title">GALLERY</h2>
            <div className="filter-buttons" style={{ textAlign: 'center', marginBottom: '20px' }}>
              <button onClick={() => setActiveTab('images')}>ፎቶዎች</button>
              <button onClick={() => setActiveTab('videos')}>ቪዲዮዎች</button>
            </div>
            <div className="gallery-grid">
              {activeTab === 'images' ? 
                imagesOnly.map((img, i) => <img key={i} src={img} className="gallery-image" />) :
                videosOnly.map((vid, i) => (
                  <video key={i} controls className="gallery-image">
                    <source src={vid} type="video/mp4" />
                  </video>
                ))
              }
            </div>
          </div>
        </section>
      )}

      <footer className="footer">
        <p>&copy; 2026 Atelier. All rights reserved.</p>
      </footer>
    </div>
  );
}