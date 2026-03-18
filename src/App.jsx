import { Menu, X } from 'lucide-react';
import { useState } from 'react';
import imgAb from './assets/ab.jpg';
import imgBa from './assets/ba.jpg';
import './App.css'; 
import React from 'react';

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

  // አዲስ የተጨመረ፡ የትዕዛዝ መረጃ መቀበያ State
  const [order, setOrder] = useState({
    customerName: ''
    productName: '',
    quantity: 1
  });

  const collections = [
    { id: 1, title: 'Spring 2026', description: 'Ethereal designs inspired by nature', image: img1 },
    { id: 2, title: 'Urban Edge', description: 'Contemporary streetwear meets haute couture', image: img2 },
    { id: 3, title: 'Atelier', description: 'Behind the scenes of creative process', image: img3 }
  ];

  const imagesOnly = [img4, img5, img6, imga, imgb, imgc, imgd, imge, imgf, imgg, imgh, imgi, imgj, imgk, imgl];
  const videosOnly = [vid1, vid2, vid3, vid4, vid5, vid6, vid7, vid8, vid10];

  // ትዕዛዝ ወደ ሰርቨር የሚልክ ፈንክሽን
  const handleOrderSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('https://aviation-backend-g75i.onrender.com', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(order)
      });
      const result = await response.json();
      
      if (response.ok) {
        alert("✅ " + result.message);
        setOrder({ customerName: '', productName: '', quantity: 1 }); // ፎርሙን ባዶ ለማድረግ
      }
    } catch (error) {
      alert("❌ ሰርቨሩ አልተነሳም! መጀመሪያ 'node server.mjs' አስነሳ።");
      console.error("ስህተት:", error);
    }
  };

  return (
    <div className="app">
      <nav className="navbar">
        <div className="nav-container">
          <div className="nav-content">
            <div className="logo">lilmoo</div>
            <div className="nav-menu">
              <a href="#home">Home</a>
              <a href="#collections">Collections</a>
              <a href="#order-section">Order Now</a> {/* ወደ ፎርሙ ይወስዳል */}
              <a href="#gallery" onClick={() => setShowGallery(true)}>Gallery</a>
            </div>
            <button className="order-nav-btn" onClick={() => window.location.href='#order-section'} style={{
              backgroundColor: '#d63384', color: 'white', border: 'none', padding: '8px 15px', borderRadius: '5px', cursor: 'pointer'
            }}>
              ትዕዛዝ ላክ (Order Now)
            </button>
          </div>
        </div>
      </nav>

      <section id="home" className="hero">
        <img src={img1} alt="Fashion runway" className="hero-image" />
        <div className="hero-overlay">
          <div className="hero-content">
            <h1>Lilmoo Design</h1>
            <p className="hero-subtitle">Contemporary Fashion Design</p>
            <div style={{ display: 'flex', gap: '10px', justifyContent: 'center' }}>
               <button className="hero-btn" onClick={() => setShowGallery(true)}>Collections</button>
               <button className="hero-btn" onClick={() => window.location.href='#order-section'} style={{ backgroundColor: 'white', color: '#d63384' }}>Order Now</button>
            </div>
          </div>
        </div>
      </section>

      {/* አዲስ የተጨመረ፡ የትዕዛዝ መቀበያ ፎርም ክፍል */}
      <section id="order-section" style={{ padding: '60px 20px', backgroundColor: '#f9f9f9', textAlign: 'center' }}>
        <div className="container">
          <h2 className="section-title">ልብስ ይዘዙ</h2>
          <form onSubmit={handleOrderSubmit} style={{ maxWidth: '400px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '15px' }}>
            <input 
              type="text" 
              placeholder="ሙሉ ስምዎ" 
              value={order.customerName}
              onChange={(e) => setOrder({...order, customerName: e.target.value})}
              required 
              style={{ padding: '12px', borderRadius: '5px', border: '1px solid #ccc' }}
            />
            <select 
              value={order.productName}
              onChange={(e) => setOrder({...order, productName: e.target.value})}
              required
              style={{ padding: '12px', borderRadius: '5px', border: '1px solid #ccc' }}
            >
              <option value="">የሚፈልጉትን ልብስ ይምረጡ</option>
              <option value="Habesha Kemis">የሀበሻ ቀሚስ</option>
              <option value="Modern Dress">ዘመናዊ የሴቶች ልብስ</option>
              <option value="Wedding Dress">የሰርግ ልብስ</option>
            </select>
            <button type="submit" style={{
              backgroundColor: '#d63384', color: 'white', padding: '15px', border: 'none', borderRadius: '5px', cursor: 'pointer', fontWeight: 'bold'
            }}>
              ትዕዛዝ ላክ (Submit Order)
            </button>
          </form>
        </div>
      </section>

      <section id="collections" className="collections">
        <div className="container">
          <h2 className="section-title">FEATURED COLLECTIONS</h2>
          <div className="collections-grid">
            {collections.map((collection) => (
              <div key={collection.id} className="collection-card">
                <img src={collection.image} alt={collection.title} className="collection-image" />
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
            <div className="filter-buttons">
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

      <footer className="footer" style={{ 
        padding: '40px 20px', 
        backgroundColor: '#1a1a1a', 
        color: 'white', 
        textAlign: 'center' 
      }}>
        <div className="container">
          <h2 style={{ color: '#d63384', marginBottom: '15px' }}>ሊልሙ ዲዛይን (Lilmoo Design)</h2>
          <p style={{ maxWidth: '600px', margin: '0 auto 20px', lineHeight: '1.6' }}>
            ዘመናዊነትን ከባህል ጋር አዋህደን ለሴቶች የሚሆኑ ምርጥ የሀበሻ እና የዘመናዊ ልብሶችን በጥራት እናዘጋጃለን። 
            የእርስዎ ውበት የኛ ኩራት ነው!
          </p>
          
          <div className="footer-contact" style={{ marginBottom: '20px' }}>
            <p>📍 አድራሻ፡ አዲስ አበባ፣ ኢትዮጵያ</p>
            <p>📞 ስልክ፡ +251919821717</p>
          </div>

          <div style={{ borderTop: '1px solid #333', paddingTop: '20px', fontSize: '14px' }}>
            <p>&copy; 2026 Lilmoo Design. መብቱ በህግ የተጠበቀ ነው።</p>
          </div>
        </div>
      </footer>
    </div>
  );
}