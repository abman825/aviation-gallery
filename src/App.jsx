import { Menu, X } from 'lucide-react';
import { useState } from 'react';
import './App.css'; 

// ምስሎችን ከአካባቢው ፎልደር ማስገባት
import img1 from './assets/1.jpg';
import img2 from './assets/2.jpg';
import img3 from './assets/3.jpg';
import img4 from './assets/4.jpg';
import img5 from './assets/5.jpg';
import img6 from './assets/6.jpg';
import img7 from './assets/7.jpg';
import img8 from './assets/8.jpg';
import img9 from './assets/9.jpg';
import img10 from './assets/10.jpg';
import img11 from './assets/11.jpg';
import img12 from './assets/12.jpg';
import img22 from './assets/22.jpg';
import img20 from './assets/20.jpg';

export default function App() {
  const [menuOpen, setMenuOpen] = useState(false);

  const collections = [
    { id: 1, title: 'Spring 2026', description: 'Ethereal designs inspired by nature', image: img1 },
    { id: 2, title: 'Urban Edge', description: 'Contemporary streetwear meets haute couture', image: img2 },
    { id: 3, title: 'Atelier', description: 'Behind the scenes of creative process', image: img3 }
  ];

  const gallery = [img4, img5, img6, img7, img8, img9, img10,img11,img12,img22,img20,];

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
            <button className="hero-btn">Explore Collections</button>
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

      <section id="gallery" className="gallery-section">
        <div className="container">
          <h2 className="section-title">GALLERY</h2>
          <div className="gallery-grid">
            {gallery.map((image, index) => (
              <div key={index} className="gallery-item">
                <img src={image} alt={`Gallery ${index + 1}`} className="gallery-image" />
              </div>
            ))}
          </div>
        </div>
      </section>

      <footer className="footer">
        <p>&copy; 2026 Atelier. All rights reserved.</p>
      </footer>
    </div>
  );
}