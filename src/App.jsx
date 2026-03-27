import { useState, useEffect } from 'react';
import { Routes, Route, Link, useLocation } from 'react-router-dom';
import './App.css'; 

// Assets
import img1 from './assets/1.jpg'; import img2 from './assets/2.jpg';
import img3 from './assets/3.jpg'; import img4 from './assets/4.jpg';
import imga from './assets/a.jpg'; import imgb from './assets/b.jpg';

export default function App() {
  const [showAdmin, setShowAdmin] = useState(false); 
  const [adminOrders, setAdminOrders] = useState([]); 
  const [dbImages, setDbImages] = useState([]); // 1. ይህ መስመር ተጨምሯል (ስህተቱን የሚፈታው ይህ ነው)
  const [imgUrl, setImgUrl] = useState("");
  const { pathname } = useLocation();

  const API_URL = "https://aviation-backend-g75i.onrender.com/api"; 

  useEffect(() => {
    window.scrollTo(0, 0);
    fetchImages(); // ገጹ ሲከፈት ፎቶዎቹን እንዲያመጣ
  }, [pathname]);

  // ጋለሪ ለማምጣት
  const fetchImages = async () => {
    try {
      const res = await fetch(`${API_URL}/gallery`);
      const data = await res.json();
      if (Array.isArray(data)) setDbImages(data);
    } catch (err) { console.error("Gallery Fetch Error"); }
  };

  // ፎቶ ለመጫን
  const handleUploadImage = async () => {
    if(!imgUrl) return alert("እባክህ የፎቶ ሊንክ አስገባ");
    try {
        const res = await fetch(`${API_URL}/gallery`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ imageUrl: imgUrl })
        });
        if(res.ok) {
            alert("ፎቶ ተጭኗል!");
            setImgUrl("");
            fetchImages(); 
        }
    } catch (err) { alert("መጫን አልተቻለም"); }
  };

  // ፎቶ ለመሰረዝ
  const deleteImage = async (id) => {
    if(window.confirm("ይህ ፎቶ እንዲጠፋ ትፈልጋለህ?")) {
        await fetch(`${API_URL}/gallery/${id}`, { method: 'DELETE' });
        fetchImages();
    }
  };

  const fetchOrders = async () => {
    const password = prompt("የአድሚን ፓስወርድ ያስገቡ:");
    if (password === "admin123") { 
      try {
        const response = await fetch(`${API_URL}/orders`);
        const data = await response.json();
        setAdminOrders(data);
        setShowAdmin(true);
      } catch (error) { alert("መረጃ ማግኘት አልተቻለም!"); }
    } else { alert("የተሳሳተ ፓስወርድ!"); }
  };

  const deleteOrder = async (id) => {
    if(window.confirm("ትዕዛዙን መሰረዝ ትፈልጋለህ?")) {
        await fetch(`${API_URL}/orders/${id}`, { method: 'DELETE' });
        setAdminOrders(adminOrders.filter(order => order._id !== id));
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
               <h2 className="text-2xl font-bold">Admin Dashboard</h2>
               <button onClick={() => setShowAdmin(false)} className="text-3xl hover:text-red-500">&times;</button>
            </div>
            
            {/* Orders Table */}
            <div className="overflow-x-auto mb-10">
              <table className="w-full text-left border-collapse">
                <thead className="bg-gray-50">
                  <tr className="text-xs uppercase text-gray-500 font-black">
                    <th className="p-4">Customer</th><th className="p-4">Product</th><th className="p-4">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {adminOrders.map((ord) => (
                    <tr key={ord._id} className="text-sm">
                      <td className="p-4 font-bold">{ord.customerName}</td>
                      <td className="p-4">{ord.productName}</td>
                      <td className="p-4"><button onClick={() => deleteOrder(ord._id)} className="text-red-500 hover:underline font-bold">Delete</button></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Manage Gallery (አሁን በትክክል እዚህ ቦታ ገብቷል) */}
            <div className="mt-12 border-t pt-8">
                <h3 className="text-xl font-bold mb-4 text-purple-700">Manage Gallery</h3>
                <div className="flex gap-2 mb-6">
                    <input type="text" placeholder="Image URL Here..." value={imgUrl} onChange={(e) => setImgUrl(e.target.value)} className="flex-1 p-3 border rounded-xl outline-none focus:ring-2 focus:ring-purple-500" />
                    <button onClick={handleUploadImage} className="bg-green-600 text-white px-6 py-3 rounded-xl font-bold">Upload</button>
                </div>
                <div className="grid grid-cols-3 md:grid-cols-5 gap-4">
                    {dbImages.map((img) => (
                        <div key={img._id} className="relative group aspect-square">
                            <img src={img.imageUrl} className="w-full h-full object-cover rounded-lg shadow-sm" />
                            <button onClick={() => deleteImage(img._id)} className="absolute -top-2 -right-2 bg-red-500 text-white w-6 h-6 rounded-full opacity-0 group-hover:opacity-100 transition">&times;</button>
                        </div>
                    ))}
                </div>
            </div>
          </div>
        </div>
      )}

      <Routes>
        <Route path="/" element={
          <section className="relative h-[80vh] flex items-center justify-center text-center">
            <div>
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
              {/* Database Images */}
              {dbImages.map((img, i) => (
                <div key={i} className="aspect-[3/4] rounded-3xl overflow-hidden shadow-xl hover:scale-[1.02] transition-transform">
                   <img src={img.imageUrl} className="w-full h-full object-cover" alt="Gallery" />
                </div>
              ))}
              {/* Static Images */}
              {[img1, img2, img3, img4, imga, imgb].map((pic, i) => (
                <div key={`st-${i}`} className="aspect-[3/4] rounded-3xl overflow-hidden shadow-xl hover:scale-[1.02] transition-transform">
                   <img src={pic} className="w-full h-full object-cover" alt="Collection" />
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
        body: JSON.stringify({ customerName: order.name, productName: order.orderType })
      });
      if (res.ok) { 
        alert("✅ ትዕዛዝዎ ደርሶናል!"); 
        setOrder({ name: '', orderType: '' }); 
      } else { alert("❌ ትዕዛዝ ማስተላለፍ አልተቻለም"); }
    } catch (err) { alert("❌ የሰርቨር ግንኙነት የለም!"); } finally { setLoading(false); }
  };

  return (
    <section className="py-20 px-6 min-h-screen flex items-center justify-center bg-purple-50">
      <div className="max-w-md w-full bg-white p-12 rounded-[40px] shadow-2xl">
        <h2 className="text-4xl font-black mb-10 text-center">አዲስ ትዕዛዝ</h2>
        <form onSubmit={handleOrderSubmit} className="space-y-6">
          <input type="text" placeholder="ሙሉ ስም" value={order.name} onChange={(e) => setOrder({...order, name: e.target.value})} className="w-full p-4 bg-gray-50 rounded-xl outline-none focus:ring-2 focus:ring-purple-500 font-bold" required />
          <input type="text" placeholder="የልብስ አይነት" value={order.orderType} onChange={(e) => setOrder({...order, orderType: e.target.value})} className="w-full p-4 bg-gray-50 rounded-xl outline-none focus:ring-2 focus:ring-purple-500 font-bold" required />
          <button type="submit" className="w-full py-4 bg-purple-600 text-white rounded-xl font-black text-lg shadow-lg hover:bg-purple-700 transition" disabled={loading}>
            {loading ? "በመላክ ላይ..." : "ትዕዛዝ ይላኩ"}
          </button>
        </form>
      </div>
    </section>
  );
}