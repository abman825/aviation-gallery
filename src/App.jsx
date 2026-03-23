import { useState } from 'react';
import './App.css'; 

// ምስሎች (Assets)
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

// ቪዲዮዎች (Assets)
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
  const [showAdmin, setShowAdmin] = useState(false); 
  const [adminOrders, setAdminOrders] = useState([]); 
  const [order, setOrder] = useState({ name: '', orderType: '' });
  const [loading, setLoading] = useState(false);

  // ሰርቨርህ (Render ላይ ያለው)
  const API_URL = "https://aviation-backend-g75i.onrender.com/api/orders";

  // የአድሚን ዝርዝር ለማምጣት
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

  // ትዕዛዝ ለመላክ
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
    <div className="app">
      {/* Navbar ክፍል */}
      <nav className="navbar">
        <div className="nav-container">
          <div className="nav-content">
            <div className="logo">lilmoo</div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
              <button onClick={fetchOrders} className="admin-btn">Admin</button>
              <div className="nav-menu">
                <a href="#home">Home</a>
                <button onClick={() => setShowGallery(!showGallery)} className="gallery-link-btn">
                  {showGallery ? "Close Gallery" : "Gallery"}
                </button>
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* የአድሚን ዝርዝር Dashboard (Modal) */}
      {showAdmin && (
        <div className="admin-overlay">
          <div className="admin-modal">
            <div style={{display:'flex', justifyContent:'space-between', marginBottom: '20px'}}>
               <h2 style={{color: '#d63384'}}>የደንበኞች ዝርዝር</h2>
               <button onClick={() => setShowAdmin(false)} className="close-btn">X</button>
            </div>
            <div style={{overflowX: 'auto'}}>
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

      {/* Gallery እና ሌሎች ክፍሎች እዚህ ይቀጥላሉ... */}

      <footer className="footer">
        <div className="container">
          <p>📍 አዲስ አበባ | 📞 +251919821717</p>
          <p>&copy; {new Date().getFullYear()} Lilmoo Design.</p>
        </div>
      </footer>
    </div>
  );
}