import { useState, useEffect } from 'react';
import './App.css'; 

// ምስሎች እና ቪዲዮዎች
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
  const [showAdmin, setShowAdmin] = useState(false); // Admin ገጽ ለማሳየት
  const [adminOrders, setAdminOrders] = useState([]); // የትዕዛዝ ዝርዝር
  const [activeTab, setActiveTab] = useState('images');
  const [order, setOrder] = useState({ name: '', orderType: '' });
  const [loading, setLoading] = useState(false);

  const API_URL = "https://aviation-backend-g75i.onrender.com/api/orders";

  // --- Admin Dashboard መረጃን ከሰርቨር ማምጫ ---
  const fetchOrders = async () => {
    const password = prompt("የአድሚን ፓስዎርድ ያስገቡ:");
    if (password === "1234") { // የፈለግከውን ፓስዎርድ እዚህ ጋር ቀይረው
      setLoading(true);
      try {
        const response = await fetch(API_URL);
        const data = await response.json();
        setAdminOrders(data);
        setShowAdmin(true);
      } catch (error) {
        alert("መረጃውን ማግኘት አልተቻለም!");
      } finally {
        setLoading(false);
      }
    } else {
      alert("የተሳሳተ ፓስዎርድ!");
    }
  };

  const collections = [
    { id: 1, title: "የባህል ልብሶች", description: "ጥራት ያላቸው የሀበሻ ቀሚሶች", image: img2 },
    { id: 2, title: "ዘመናዊ ዲዛይን", description: "ለተለያዩ ዝግጅቶች የሚሆኑ", image: img3 },
    { id: 3, title: "የሰርግ ልብሶች", description: "ለእርስዎ ልዩ ቀን", image: imga }
  ];

  const imagesOnly = [img4, img5, img6, imga, imgb, imgc, imgd, imge, imgf, imgg, imgh, imgi, imgj, imgk, imgl];
  const videosOnly = [vid1, vid2, vid3, vid4, vid5, vid6, vid7, vid8, vid10];

  const handleOrderSubmit = async (e) => {
    e.preventDefault();
    if (!order.name || !order.orderType) {
      alert("እባክዎ ስምዎን እና የልብስ አይነት ይምረጡ");
      return;
    }
    setLoading(true);
    try {
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customerName: order.name,
          productName: order.orderType
        })
      });
      if (response.ok) {
        alert("✅ ትዕዛዝዎ በታማኝነት ደርሶናል!");
        setOrder({ name: '', orderType: '' });
      }
    } catch (error) {
      alert("❌ ስህተት ተፈጥሯል");
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
              <button onClick={() => setShowGallery(!showGallery)} className="gallery-link-btn">
                {showGallery ? "Close Gallery" : "Gallery"}
              </button>
              <button onClick={fetchOrders} className="admin-btn">Admin</button>
            </div>
          </div>
        </div>
      </nav>

      {/* Admin Dashboard እዚህ ጋር ይታያል */}
      {showAdmin && (
        <div className="admin-overlay">
          <div className="admin-modal">
            <div style={{display:'flex', justifyContent:'space-between', alignItems:'center'}}>
               <h2>የደንበኞች ትዕዛዝ ዝርዝር</h2>
               <button onClick={() => setShowAdmin(false)} className="close-btn">X</button>
            </div>
            <table className="admin-table">
              <thead>
                <tr>
                  <th>ስም</th>
                  <th>ልብስ</th>
                  <th>ቀን</th>
                </tr>
              </thead>
              <tbody>
                {adminOrders.map((ord, i) => (
                  <tr key={i}>
                    <td>{ord.customerName}</td>
                    <td>{ord.productName}</td>
                    <td>{new Date(ord.date).toLocaleDateString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Hero Section */}
      <section id="home" className="hero">
        <img src={img1} alt="Hero" className="hero-image" />
        <div className="hero-overlay">
          <div className="hero-content">
            <h1>Lilmoo Design</h1>
            <p>Contemporary Fashion Design</p>
            <a href="#order-section" className="hero-btn">Order Now</a>
          </div>
        </div>
      </section>

      {/* Order Form */}
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

      {/* Gallery Section */}
      {showGallery && (
        <section className="gallery-section">
          <div className="container">
            <h2 className="section-title">GALLERY</h2>
            <div className="filter-buttons">
              <button onClick={() => setActiveTab('images')} className={activeTab === 'images' ? 'active' : ''}>ፎቶዎች</button>
              <button onClick={() => setActiveTab('videos')} className={activeTab === 'videos' ? 'active' : ''}>ቪዲዮዎች</button>
            </div>
            <div className="gallery-grid">
              {activeTab === 'images' ? 
                imagesOnly.map((img, i) => <img key={i} src={img} className="gallery-item" />) :
                videosOnly.map((vid, i) => <video key={i} controls src={vid} className="gallery-item" />)
              }
            </div>
          </div>
        </section>
      )}

      <footer className="footer">
        <div className="container">
          <p>📍 አድራሻ፦ አዲስ አበባ፣ ኢትዮጵያ | 📞 ስልክ፦ +251919821717</p>
          <p>&copy; {new Date().getFullYear()} Lilmoo Design.</p>
        </div>
      </footer>
    </div>
  );
}