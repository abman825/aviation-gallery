import { useState, useEffect } from 'react';
import { Routes, Route, Link, useLocation } from 'react-router-dom';
import './App.css'; 

// Assets (Images & Videos)
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
  const [showAdmin, setShowAdmin] = useState(false); 
  const [adminOrders, setAdminOrders] = useState([]); 
  const [loading, setLoading] = useState(false);
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  const API_URL = "https://aviation-backend-g75i.onrender.com/api/orders";

  const fetchOrders = async () => {
    const password = prompt("የአድሚን ፓስዎርድ ያስገቡ:");
    if (password === "1234") { 
      setLoading(true);
      try {
        const response = await fetch(API_URL);
        const data = await response.json();
        setAdminOrders(data);
        setShowAdmin(true);
      } catch (error) {
        alert("መረጃ ማግኘት አልተቻለም!");
      } finally {
        setLoading(false);
      }
    } else {
      alert("የተሳሳተ ፓስዎርድ!");
    }
  };

  return (
    <div className="app">
      {/* Navbar with Scaled Layout & Hidden Admin Icon */}
      <nav className="navbar">
        <div className="nav-container">
          <Link to="/" className="logo">lilmoo</Link>
          <div className="nav-actions">
            <div className="nav-menu">
              <Link to="/" className={pathname === "/" ? "active" : ""}>Home</Link>
              <Link to="/gallery" className={pathname === "/gallery" ? "active" : ""}>Gallery</Link>
              <Link to="/order" className={pathname === "/order" ? "active" : ""}>Order</Link>
            </div>
            {/* ረቂቁ አድሚን አይኮን */}
            <button onClick={fetchOrders} className="admin-icon-btn" title="Settings">
              <span role="img" aria-label="admin">⚙️</span> 
            </button>
          </div>
        </div>
      </nav>

      {/* Admin Modal */}
      {showAdmin && (
        <div className="admin-overlay" onClick={() => setShowAdmin(false)}>
          <div className="admin-modal" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
               <h2>የደንበኞች ዝርዝር</h2>
               <button onClick={() => setShowAdmin(false)} className="close-btn">×</button>
            </div>
            <div className="table-wrapper">
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
        </div>
      )}

      <Routes>
        <Route path="/" element={
          <section className="hero">
            <div className="blob-1"></div>
            <div className="blob-2"></div>
            <img src={img1} alt="Hero" className="hero-image" />
            <div className="hero-overlay">
              <div className="hero-content fade-in-up">
                <span className="hero-subtitle">Elegance in Every Stitch</span>
                <h1>Lilmoo Design</h1>
                <p>ልዩ ለሆኑ ህጻናት፣ ልዩ የሆኑ ዲዛይኖች። ጥራትን ከውበት ጋር አቀናጅተን እናቀርባለን።</p>
                
                <div className="hero-features">
                  <span>✨ Premium Quality</span>
                  <span>🧵 Unique Designs</span>
                  <span>💖 Pure Comfort</span>
                </div>

                <div className="hero-actions">
                  <Link to="/gallery" className="hero-btn-outline">Explore Gallery</Link>
                  <Link to="/order" className="hero-btn-primary">Order Now</Link>
                </div>
              </div>
            </div>
          </section>
        } />

        <Route path="/gallery" element={
          <section className="gallery-page">
            <div className="container">
              <h2 className="section-title">Exclusive Collection</h2>
              <div className="image-grid">
                {[img1, img2, img3, img4, img5, img6, imga, imgb, imgc, imgd, imge, imgf, imgg, imgh, imgi, imgj, imgk, imgl].map((pic, index) => (
                  <div key={index} className="grid-item">
                    <img src={pic} alt={`Design ${index}`} loading="lazy" />
                  </div>
                ))}
              </div>
              <h2 className="section-title">Behind the Scenes</h2>
              <div className="video-grid">
                {[vid1, vid2, vid3, vid4, vid5, vid6, vid7, vid8, vid10].map((vid, index) => (
                  <video key={index} controls className="grid-video">
                    <source src={vid} type="video/mp4" />
                  </video>
                ))}
              </div>
            </div>
          </section>
        } />

        <Route path="/order" element={<OrderForm API_URL={API_URL} />} />
      </Routes>

      {/* Footer with Balanced Scaling */}
      <footer className="footer">
        <div className="container footer-grid">
          <div className="footer-about">
            <h3 className="footer-logo">lilmoo</h3>
            <p>
              Lilmoo Design በዘመናዊ የፋሽን ጥበብ እና በባህላዊ እሴቶች መካከል ያለውን ቅንጅት የሚያሳይ የልብስ ዲዛይን ተቋም ነው። 
              ጥራትን፣ ውበትን እና ምቾትን መመሪያችን በማድረግ ለእርስዎ እና ለሚወዷቸው ልጆች የሚሆኑ ምርጥ ዲዛይኖችን እናቀርባለን።
            </p>
          </div>
          <div className="footer-contact">
            <h4>Contact Us</h4>
            <p>📍 አዲስ አበባ፣ ኢትዮጵያ</p>
            <p>📞 +251919821717</p>
            <p>✉️ info@lilmoodesign.com</p>
          </div>
        </div>
        <div className="footer-bottom">
          <p className="copyright">&copy; {new Date().getFullYear()} Lilmoo Design | Crafted with Passion</p>
        </div>
      </footer>
    </div>
  );
}

function OrderForm({ API_URL }) {
  const [order, setOrder] = useState({ name: '', orderType: '' });
  const [loading, setLoading] = useState(false);

  const handleOrderSubmit = async (e) => {
    e.preventDefault();
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
        alert("✅ ትዕዛዝዎ ደርሶናል!");
        setOrder({ name: '', orderType: '' });
      }
    } catch (error) {
      alert("❌ ስህተት ተፈጥሯል");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="order-page">
      <div className="container">
        <div className="order-form-wrapper">
          <h2 className="section-title">አዲስ ትዕዛዝ</h2>
          <form onSubmit={handleOrderSubmit} className="order-form">
            <div className="input-field">
              <label>ሙሉ ስም</label>
              <input 
                type="text" 
                placeholder="ስምዎን እዚህ ያስገቡ..." 
                value={order.name}
                onChange={(e) => setOrder({...order, name: e.target.value})}
                required
              />
            </div>
            <div className="input-field">
              <label>የልብስ አይነት</label>
              <input 
                type="text" 
                placeholder="ለምሳሌ፡ የሐበሻ ቀሚስ..." 
                value={order.orderType}
                onChange={(e) => setOrder({...order, orderType: e.target.value})}
                required
              />
            </div>
            <button type="submit" className="submit-btn" disabled={loading}>
              {loading ? "በመላክ ላይ..." : "ትዕዛዝ ይላኩ"}
            </button>
          </form>
        </div>
      </div>
    </section>
  );
}