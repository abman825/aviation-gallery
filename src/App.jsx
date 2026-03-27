import { useState, useEffect } from 'react';
import { Routes, Route, Link, useLocation } from 'react-router-dom';
import './App.css'; 

// Assets (ከአንተ ፋይሎች ጋር አንድ መሆናቸውን አረጋግጥ)
import img1 from './assets/1.jpg'; import img2 from './assets/2.jpg';
import img3 from './assets/3.jpg'; import img4 from './assets/4.jpg';
import imga from './assets/a.jpg'; import imgb from './assets/b.jpg';
import vid1 from './assets/1.mp4'; import vid2 from './assets/2.mp4';
import vid3 from './assets/3.mp4';

export default function App() {
  const [showAdmin, setShowAdmin] = useState(false); 
  const [adminOrders, setAdminOrders] = useState([]); 
  const { pathname } = useLocation();

  // 💡 Localhost ላይ ከሆንክ ሰርቨርህ በ 10000 ፖርት መሆኑን አረጋግጥ
  const API_URL = "http://localhost:10000/api"; 
  // ለ Render ስትሰቅለው ይህንን ተጠቀም፡ "https://aviation-backend-g75i.onrender.com/api"

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  // አድሚን ገጽ ለመክፈት
  const fetchOrders = async () => {
    const password = prompt("የአድሚን ፓስወርድ ያስገቡ:");
    if (password === "admin123") { // ፓስወርዱ እዚህ ጋር ነው
      try {
        const response = await fetch(`${API_URL}/orders`);
        const data = await response.json();
        setAdminOrders(data);
        setShowAdmin(true);
      } catch (error) { 
        alert("መረጃ ማግኘት አልተቻለም! ሰርቨሩ መብራቱን አረጋግጥ።"); 
      }
    } else { 
      alert("የተሳሳተ ፓስወርድ!"); 
    }
  };

  // ኦርደር ለመሰረዝ
  const deleteOrder = async (id) => {
    if(window.confirm("ትዕዛዙን መሰረዝ ትፈልጋለህ?")) {
        try {
            await fetch(`${API_URL}/orders/${id}`, { method: 'DELETE' });
            setAdminOrders(adminOrders.filter(order => order._id !== id));
        } catch (err) {
            alert("መሰረዝ አልተቻለም!");
        }
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 font-sans text-gray-900">
      {/* Navbar */}
      <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md shadow-sm border-b border-gray-100 px-6 py-4 flex justify-between items-center">
        <Link to="/" className="text-3xl font-bold text-purple-700 italic tracking-tighter">lilmoo</Link>
        <div className="flex items-center gap-6 font-semibold text-xs uppercase tracking-widest">
          <Link to="/" className={pathname === "/" ? "text-purple-600" : ""}>Home</Link>
          <Link to="/gallery" className={pathname === "/gallery" ? "text-purple-600" : ""}>Gallery</Link>
          <Link to="/order" className={pathname === "/order" ? "text-purple-600" : ""}>Order</Link>
          <button onClick={fetchOrders} className="p-2 hover:bg-gray-100 rounded-full transition text-lg">⚙️</button>
        </div>
      </nav>

      {/* Admin Dashboard Modal */}
      {showAdmin && (
        <div className="fixed inset-0 z-[100] bg-black/60 flex items-center justify-center p-4 backdrop-blur-sm" onClick={() => setShowAdmin(false)}>
          <div className="bg-white rounded-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto p-8 shadow-2xl" onClick={e => e.stopPropagation()}>
            <div className="flex justify-between items-center border-b pb-4 mb-8">
               <h2 className="text-2xl font-bold text-gray-800">Admin Dashboard - Orders</h2>
               <button onClick={() => setShowAdmin(false)} className="text-3xl hover:text-red-500">&times;</button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-gray-50 text-xs uppercase text-gray-500 font-black">
                    <th className="p-4">Customer Name</th>
                    <th className="p-4">Product</th>
                    <th className="p-4">Date</th>
                    <th className="p-4">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {adminOrders.map((ord) => (
                    <tr key={ord._id} className="text-sm hover:bg-gray-50 transition">
                      <td className="p-4 font-bold text-gray-800">{ord.customerName}</td>
                      <td className="p-4 text-gray-600 font-medium">{ord.productName}</td>
                      <td className="p-4 text-gray-400">{new Date(ord.date).toLocaleDateString()}</td>
                      <td className="p-4">
                        <button onClick={() => deleteOrder(ord._id)} className="text-red-500 font-bold hover:underline">Delete</button>
                      </td>
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
          <section className="relative h-[80vh] flex items-center justify-center overflow-hidden">
            <div className="text-center">
              <h1 className="text-6xl md:text-8xl font-black text-purple-700 mb-6">Lilmoo Design</h1>
              <p className="text-xl text-gray-600 mb-10">ልዩ ዲዛይኖችን በጥራት እናቀርባለን።</p>
              <Link to="/order" className="px-12 py-5 bg-purple-600 text-white rounded-full font-black shadow-lg hover:bg-purple-700 transition">Order Now</Link>
            </div>
          </section>
        } />

        <Route path="/gallery" element={
          <section className="py-20 px-6 max-w-7xl mx-auto">
            <h2 className="text-5xl font-black text-center mb-16 italic text-gray-900">Gallery</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              {[img1, img2, img3, img4, imga, imgb].map((pic, i) => (
                <div key={i} className="aspect-[3/4] rounded-3xl overflow-hidden shadow-xl hover:scale-[1.02] transition-transform">
                   <img src={pic} className="w-full h-full object-cover" alt="Lilmoo Collection" />
                </div>
              ))}
            </div>
          </section>
        } />

        <Route path="/order" element={<OrderForm API_URL={`${API_URL}/orders`} />} />
      </Routes>
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
      const res = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          customerName: order.name, 
          productName: order.orderType 
        })
      });

      if (res.ok) { 
        alert("✅ ትዕዛዝዎ ደርሶናል!"); 
        setOrder({ name: '', orderType: '' }); 
      } else {
        alert("❌ ትዕዛዝ ማስተላለፍ አልተቻለም");
      }
    } catch (err) { 
      alert("❌ የሰርቨር ግንኙነት ችግር!"); 
    } finally { 
      setLoading(false); 
    }
  };

  return (
    <section className="py-20 px-6 min-h-screen flex flex-col items-center bg-purple-50 justify-center">
      <div className="max-w-md w-full bg-white p-12 rounded-[40px] shadow-2xl border border-purple-100">
        <h2 className="text-4xl font-black mb-10 text-center tracking-tighter">አዲስ ትዕዛዝ</h2>
        <form onSubmit={handleOrderSubmit} className="space-y-8">
          <input type="text" placeholder="ሙሉ ስም" value={order.name} onChange={(e) => setOrder({...order, name: e.target.value})} className="w-full p-5 bg-gray-50 border-none rounded-2xl outline-none focus:ring-2 focus:ring-purple-500 font-bold" required />
          <input type="text" placeholder="የልብስ አይነት" value={order.orderType} onChange={(e) => setOrder({...order, orderType: e.target.value})} className="w-full p-5 bg-gray-50 border-none rounded-2xl outline-none focus:ring-2 focus:ring-purple-500 font-bold" required />
          <button type="submit" className="w-full py-5 bg-purple-600 text-white rounded-2xl font-black text-lg shadow-xl hover:bg-purple-700 transition" disabled={loading}>
            {loading ? "በመላክ ላይ..." : "ትዕዛዝ ይላኩ"}
          </button>
        </form>
      </div>
    </section>
  );
}