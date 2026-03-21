import { useState } from 'react';
import './App.css'; 

// ምስሎች እና ቪዲዮዎች (ከዚህ በፊት እንዳሉት ይቀጥላሉ)
import img1 from './assets/1.jpg';
import img2 from './assets/2.jpg';
import img3 from './assets/3.jpg';
import img4 from './assets/4.jpg';
import img5 from './assets/5.jpg';
import img6 from './assets/6.jpg';
import imga from './assets/a.jpg';
import imgb from './assets/b.jpg';
import imgc from './assets/c.jpg';
import imgd from './assets/d.jpg';
import imge from './assets/e.jpg';
import imgf from './assets/f.jpg';
import imgg from './assets/g.jpg';
import imgh from './assets/h.jpg';
import imgi from './assets/i.jpg';
import imgj from './assets/j.jpg';
import imgk from './assets/k.jpg';
import imgl from './assets/l.jpg';

import vid1 from './assets/1.mp4';
import vid2 from './assets/2.mp4'; 
import vid3 from './assets/3.mp4';
import vid4 from './assets/4.mp4'; 
import vid5 from './assets/5.mp4';
import vid6 from './assets/6.mp4'; 
import vid7 from './assets/7.mp4';
import vid8 from './assets/8.mp4';
import vid10 from './assets/10.mp4';

export default function App() {
  const [showGallery, setShowGallery] = useState(false);
  const [activeTab, setActiveTab] = useState('images');
  const [order, setOrder] = useState({ name: '', orderType: '' });
  const [loading, setLoading] = useState(false);

  // የሰርቨር አድራሻ (Render ላይ ያለው)
  const API_URL = "https://aviation-backend-g75i.onrender.com/api/orders";

  const collections = [
    { id: 1, title: "የባህል ልብሶች", description: "ጥራት ያላቸው የሀበሻ ቀሚሶች", image: img2 },
    { id: 2, title: "ዘመናዊ ዲዛይን", description: "ለተለያዩ ዝግጅቶች የሚሆኑ", image: img3 },
    { id: 3, title: "የሰርግ ልብሶች", description: "ለእርስዎ ልዩ ቀን", image: imga }
  ];

  const imagesOnly = [img4, img5, img6, imga, imgb, imgc, imgd, imge, imgf, imgg, imgh, imgi, imgj, imgk, imgl];
  const videosOnly = [vid1, vid2, vid3, vid4, vid5, vid6, vid7, vid8, vid10];

  // ትዕዛዝ ለመላክ የሚሰራ Function
  const handleOrderSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json' 
        },
        body: JSON.stringify({
          name: order.name,
          orderType: order.orderType
        })
      });
      
      const result = await response.json();

      if (response.ok) {
        alert("✅ ትዕዛዝዎ በተሳካ ሁኔታ ተልኳል!");
        setOrder({ name: '', orderType: '' }); // ፎርሙን ባዶ ማድረግ
      } else {
        alert("❌ ስህተት: " + (result.message || "ትዕዛዙን መላክ አልተቻለም"));
      }
    } catch (error) {
      console.error("Error:", error);
      alert("❌ ሰርቨሩ አልተገኘም! እባክዎ ኢንተርኔትዎን ወይም የሰርቨሩን ሁኔታ ያረጋግጡ።");
    } finally {
      setLoading(false);
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
              <a href="#order-section">Order Now</a>
              <button onClick={() => setShowGallery(!showGallery)} className="gallery-link-btn">
                {showGallery ? "Close Gallery" : "Gallery"}
              </button>
            </div>
          </div>
        </div>
      </nav>

      <section id="home" className="hero">
        <img src={img1} alt="Hero" className="hero-image" />
        <div className="hero-overlay">
          <div className="hero-content">
            <h1>Lilmoo Design</h1>
            <p>Contemporary Fashion Design</p>
            <div style={{ display: 'flex', gap: '10px', justifyContent: 'center' }}>
               <button className="hero-btn" onClick={() => {
                 document.getElementById('collections').scrollIntoView({ behavior: 'smooth' });
               }}>See Collections</button>
               <a href="#order-section" className="hero-btn order-btn-alt">Order Now</a>
            </div>
          </div>
        </div>
      </section>

      {/* ትዕዛዝ መቀበያ ፎርም */}
      <section id="order-section" className="order-form-section">
        <div className="container">
          <h2 className="section-title">ልብስ ይዘዙ</h2>
          <form onSubmit={handleOrderSubmit} className="order-form">
            <input 
              type="text" 
              placeholder="ሙሉ ስምዎ" 
              value={order.name}
              onChange={(e) => setOrder({...order, name: e.target.value})}
              required 
            />
            <select 
              value={order.orderType}
              onChange={(e) => setOrder({...order, orderType: e.target.value})}
              required
            >
              <option value="">የሚፈልጉትን የልብስ አይነት ይምረጡ</option>
              <option value="Habesha Kemis">የሀበሻ ቀሚስ</option>
              <option value="Modern Dress">ዘመናዊ የሴቶች ልብስ</option>
              <option value="Wedding Dress">የሰርግ ልብስ</option>
            </select>
            <button type="submit" className="submit-btn" disabled={loading}>
              {loading ? "በመላክ ላይ..." : "ትዕዛዝ ላክ (Submit Order)"}
            </button>
          </form>
        </div>
      </section>

      <section id="collections" className="collections">
        <div className="container">
          <h2 className="section-title">FEATURED COLLECTIONS</h2>
          <div className="collections-grid">
            {collections.map((col) => (
              <div key={col.id} className="collection-card">
                <img src={col.image} alt={col.title} className="collection-image" />
                <h3>{col.title}</h3>
                <p>{col.description}</p>
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
              <button 
                onClick={() => setActiveTab('images')} 
                className={activeTab === 'images' ? 'active' : ''}
              >ፎቶዎች</button>
              <button 
                onClick={() => setActiveTab('videos')} 
                className={activeTab === 'videos' ? 'active' : ''}
              >ቪዲዮዎች</button>
            </div>
            <div className="gallery-grid">
              {activeTab === 'images' ? 
                imagesOnly.map((img, i) => <img key={i} src={img} className="gallery-item" alt={`Gallery ${i}`} />) :
                videosOnly.map((vid, i) => (
                  <video key={i} controls className="gallery-item">
                    <source src={vid} type="video/mp4" />
                  </video>
                ))
              }
            </div>
          </div>
        </section>
      )}

      <footer className="footer">
        <div className="container">
          <h2 style={{ color: '#d63384' }}>ሊልሙ ዲዛይን (Lilmoo Design)</h2>
          <p>📍 አድራሻ፦ አዲስ አበባ፣ ኢትዮጵያ | 📞 ስልክ፦ +251919821717</p>
          <p>&copy; {new Date().getFullYear()} Lilmoo Design. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}