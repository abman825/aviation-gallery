import { useState, useEffect } from 'react';
import { Routes, Route, Link, useLocation } from 'react-router-dom';
import './App.css'; 

import img1 from './assets/1.jpg'; import img2 from './assets/2.jpg';
import img3 from './assets/3.jpg'; import img4 from './assets/4.jpg';
import imga from './assets/a.jpg'; import imgb from './assets/b.jpg';

export default function App() {
  const [showAdmin, setShowAdmin] = useState(false); 
  const [adminOrders, setAdminOrders] = useState([]); 
  const [dbImages, setDbImages] = useState([]); 
  const [selectedFile, setSelectedFile] = useState(null); 
  const { pathname } = useLocation();

  // ዋናው የባክኢንድ አድራሻ
  const API_URL = "https://aviation-backend-g75i.onrender.com/api"; 

  useEffect(() => {
    window.scrollTo(0, 0);
    fetchImages();
  }, [pathname]);

  const fetchImages = async () => {
    try {
      const res = await fetch(`${API_URL}/gallery`);
      const data = await res.json();
      if (Array.isArray(data)) setDbImages(data);
    } catch (err) { console.error("Gallery Fetch Error"); }
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

  const handleUploadImage = async () => {
    if(!selectedFile) return alert("እባክህ መጀመሪያ ፎቶ ምረጥ");
    
    const formData = new FormData();
    formData.append('image', selectedFile);

    try {
        const res = await fetch(`${API_URL}/gallery`, {
            method: 'POST',
            body: formData
        });
        if(res.ok) {
            alert("ፎቶው ተጭኗል!");
            setSelectedFile(null);
            fetchImages(); 
        }
    } catch (err) { alert("መጫን አልተቻለም"); }
  };

  const deleteImage = async (id) => {
    if(window.confirm("ይህ ፎቶ እንዲጠፋ ትፈልጋለህ?")) {
        await fetch(`${API_URL}/gallery/${id}`, { method: 'DELETE' });
        fetchImages();
    }
  };

  const deleteOrder = async (id) => {
    if(window.confirm("ትዕዛዙን መሰረዝ ትፈልጋለህ?")) {
        await fetch(`${API_URL}/orders/${id}`, { method: 'DELETE' });
        setAdminOrders(adminOrders.filter(order => order._id !== id));
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 font-sans text-gray-900">
      <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md shadow-sm border-b border-gray-100 px-6 py-4 flex justify-between items-center">
        <Link to="/" className="text-3xl font-bold text-purple-700 italic">lilmoo</Link>
        <div className="flex items-center gap-6 font-semibold text-xs uppercase tracking-widest">
          <Link to="/" className={pathname === "/" ? "text-purple-600" : ""}>Home</Link>
          <Link to="/gallery" className={pathname === "/gallery" ? "text-purple-600" : ""}>Gallery</Link>
          <Link to="/order" className={pathname === "/order" ? "text-purple-600" : ""}>Order</Link>
          <button onClick={fetchOrders} className="p-2 hover:bg-gray-100 rounded-full transition text-lg">⚙️</button>
        </div>
      </nav>

      {showAdmin && (
        <div className="fixed inset-0 z-[100] bg-black/60 flex items-center justify-center p-4 backdrop-blur-sm" onClick={() => setShowAdmin(false)}>
          <div className="bg-white rounded-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto p-8 shadow-2xl" onClick={e => e.stopPropagation()}>
            <div className="flex justify-between items-center border-b pb-4 mb-8">
               <h2 className="text-2xl font-bold">Admin Dashboard</h2>
               <button onClick={() => setShowAdmin(false)} className="text-3xl hover:text-red-500">&times;</button>
            </div>
            
            <div className="overflow-x-auto mb-10 text-left">
              <table className="w-full border-collapse">
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

            <div className="mt-12 border-t pt-8">
                <h3 className="text-xl font-bold mb-4 text-purple-700">Manage Gallery</h3>
                <div className="flex gap-2 mb-6">
                    <input type="file" accept="image/*" onChange={(e) => setSelectedFile(e.target.files[0])} className="flex-1 p-3 border rounded-xl outline-none focus:ring-2 focus:ring-purple-500" />
                    <button onClick={handleUploadImage} className="bg-green-600 text-white px-6 py-3 rounded-xl font-bold transition hover:bg-green-700">Upload File</button>
                </div>
                <div className="grid grid-cols-3 md:grid-cols-5 gap-4">
                    {dbImages.map((img) => (
                        <div key={img._id} className="relative group aspect-square">
                            <img src={img.imageUrl} className="w-full h-full object-cover rounded-lg shadow-sm" alt="Gallery" />
                            <button onClick={() => deleteImage(img._id)} className="absolute -top-2 -right-2 bg-red-500 text-white w-7 h-7 rounded-full opacity-0 group-hover:opacity-100 transition flex items-center justify-center shadow-lg font-bold">×</button>
                        </div>
                    ))}
                </div>
            </div>
          </div>
        </div>
      )}

      <Routes>
        <Route path="/" element={
          <section className="relative h-[80vh] flex items-center justify-center text-center px-6">
            <div>
              <h1 className="text-6xl md:text-8xl font-black text-purple-700 mb-6 italic tracking-tighter">Lilmoo Design</h1>
              <p className="text-xl text-gray-600 mb-10 font-medium">ልዩ ዲዛይኖችን በጥራት እናቀርባለን።</p>
              <Link to="/order" className="px-12 py-5 bg-purple-600 text-white rounded-full font-black shadow-xl hover:bg-purple-700 hover:-translate-y-1 transition-all">Order Now</Link>
            </div>
          </section>
        } />

        <Route path="/gallery" element={
          <section className="py-20 px-6 max-w-7xl mx-auto">
            <h2 className="text-5xl font-black text-center mb-16 italic text-gray-900 tracking-tight">Gallery</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              {dbImages.map((img, i) => (
                <div key={i} className="aspect-[3/4] rounded-3xl overflow-hidden shadow-xl hover:scale-[1.03] transition-all duration-500">
                   <img src={img.imageUrl} className="w-full h-full object-cover" alt="Gallery Item" />
                </div>
              ))}
              {[img1, img2, img3, img4, imga, imgb].map((pic, i) => (
                <div key={`st-${i}`} className="aspect-[3/4] rounded-3xl overflow-hidden shadow-xl hover:scale-[1.03] transition-all duration-500">
                   <img src={pic} className="w-full h-full object-cover" alt="Static Item" />
                </div>
              ))}
            </div>
          </section>
        } />

        {/* አስተካክለነዋል: API_URL በትክክል እንዲሄድ ተደርጓል */}
        <Route path="/order" element={<OrderForm API_URL={API_URL} />} />
        <Route path="/success" element={<div className="h-screen flex items-center justify-center text-3xl font-black text-green-600">✅ ክፍያዎ ተፈጽሟል! እናመሰግናለን።</div>} />
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
      // ለክፍያ ወደ /pay መንገድ እንልካለን
      const res = await fetch(`${API_URL}/pay`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          customerName: order.name, 
          productName: order.orderType,
          amount: "150", // ዋጋው 150 ብር ቢሆን
          email: "customer@lilmoo.com" 
        })
      });

      const data = await res.json();
      if (data.checkout_url) {
        window.location.href = data.checkout_url; 
      } else {
        alert("ክፍያ ማስጀመር አልተቻለም፣ እባክዎ እንደገና ይሞክሩ።");
      }
    } catch (err) { 
      alert("ከሰርቨር ጋር መገናኘት አልተቻለም!"); 
    } finally { 
      setLoading(false); 
    }
  };

  return (
    <section className="py-20 px-6 min-h-screen flex items-center justify-center bg-purple-50">
      <div className="max-w-md w-full bg-white p-12 rounded-[40px] shadow-2xl">
        <h2 className="text-4xl font-black mb-10 text-center italic tracking-tight">አዲስ ትዕዛዝ</h2>
        <form onSubmit={handleOrderSubmit} className="space-y-6">
          <input type="text" placeholder="ሙሉ ስም" value={order.name} onChange={(e) => setOrder({...order, name: e.target.value})} className="w-full p-5 bg-gray-50 border border-gray-100 rounded-2xl outline-none focus:ring-4 focus:ring-purple-200 transition-all font-bold" required />
          <input type="text" placeholder="የልብስ አይነት" value={order.orderType} onChange={(e) => setOrder({...order, orderType: e.target.value})} className="w-full p-5 bg-gray-50 border border-gray-100 rounded-2xl outline-none focus:ring-4 focus:ring-purple-200 transition-all font-bold" required />
          <button type="submit" className="w-full py-5 bg-purple-600 text-white rounded-2xl font-black text-lg shadow-xl hover:bg-purple-700 active:scale-95 transition-all" disabled={loading}>
            {loading ? "በመላክ ላይ..." : "በ Chapa ይክፈሉ"}
          </button>
        </form>
      </div>
    </section>
  );
}