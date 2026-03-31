import { useState, useEffect } from 'react';
import { Routes, Route, Link, useLocation } from 'react-router-dom';
import './App.css'; 

// --- Static Assets (Images & Videos) ---
import img1 from './assets/1.jpg'; import vid1 from './assets/1.mp4';
import img2 from './assets/2.jpg'; import vid2 from './assets/2.mp4';
import img3 from './assets/3.jpg'; import vid3 from './assets/3.mp4';
import img4 from './assets/4.jpg'; import vid4 from './assets/4.mp4';
import img5 from './assets/5.jpg'; import vid5 from './assets/5.mp4';
import img6 from './assets/6.jpg'; import vid6 from './assets/6.mp4';
import imge from './assets/e.jpg'; import vid7 from './assets/7.mp4';
import imgi from './assets/i.jpg'; import vid8 from './assets/8.mp4';
import img11 from './assets/11.jpg'; import img10 from './assets/10.jpg';

import bgImage from './assets/1.jpg'; 

export default function App() {
  const [showAdmin, setShowAdmin] = useState(false); 
  const [adminOrders, setAdminOrders] = useState([]); 
  const [dbImages, setDbImages] = useState([]); 
  const [selectedFile, setSelectedFile] = useState(null); 
  const { pathname } = useLocation();
  
  const API_URL = "https://aviation-backend-g75i.onrender.com/api"; 

  const staticVideos = [vid1, vid2, vid3, vid4, vid5, vid6, vid7, vid8];
  const staticPhotos = [img1, img2, img3, img4, img5, img6, imge, imgi, img11, img10];

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
    const password = prompt("የአድሚን ፓስዎርድ ያስገቡ:");
    if (password === "admin123") { 
      try {
        const response = await fetch(`${API_URL}/orders`);
        const data = await response.json();
        setAdminOrders(data);
        setShowAdmin(true);
      } catch (error) { alert("መረጃ ማግኘት አልተቻለም!"); }
    } else { alert("የተሳሳተ ፓስዎርድ!"); }
  };

  const handleUploadImage = async () => {
    if(!selectedFile) return alert("እባክህ መጀመሪያ ፋይል ምረጥ");
    const formData = new FormData();
    formData.append('image', selectedFile);
    try {
        const res = await fetch(`${API_URL}/gallery`, { method: 'POST', body: formData });
        if(res.ok) {
            alert("ፋይሉ ተጭኗል!");
            setSelectedFile(null);
            fetchImages(); 
        }
    } catch (err) { alert("መጫን አልተቻለም"); }
  };

  const deleteImage = async (id) => {
    if(window.confirm("ይህንን ፋይል እንዲጠፋ ትፈልጋለህ?")) {
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

  // ፋይሉ ቪዲዮ መሆኑን መለያ Function
  const isVideo = (url) => url.match(/\.(mp4|webm|ogg|mov)$/i);

  return (
    <div className="relative min-h-screen font-sans text-white selection:bg-purple-500/30 overflow-x-hidden">
      
      <div className="fixed inset-0 z-0">
        <img src={bgImage} className="w-full h-full object-cover" alt="Background" />
        <div className="absolute inset-0 bg-black/60 backdrop-blur-[3px]"></div>
      </div>

      <nav className="fixed top-0 w-full z-50 bg-white/10 backdrop-blur-2xl border-b border-white/10 px-6 py-4 flex justify-between items-center shadow-xl">
        <Link to="/" className="text-2xl md:text-3xl font-black italic hover:scale-105 transition-all tracking-tighter text-white">lilmoo</Link>
        <div className="flex items-center gap-4 md:gap-8 font-bold text-[9px] md:text-[10px] uppercase tracking-[0.2em] md:tracking-[0.25em]">
          <Link to="/" className={pathname === "/" ? "text-purple-400 border-b-2 border-purple-400 pb-1" : "hover:text-purple-300 transition-colors"}>Home</Link>
          <Link to="/gallery" className={pathname === "/gallery" ? "text-purple-400 border-b-2 border-purple-400 pb-1" : "hover:text-purple-300 transition-colors"}>Gallery</Link>
          <Link to="/order" className={pathname === "/order" ? "text-purple-400 border-b-2 border-purple-400 pb-1" : "hover:text-purple-300 transition-colors"}>Order</Link>
          <button onClick={fetchOrders} className="w-8 h-8 md:w-10 md:h-10 flex items-center justify-center bg-white/10 hover:bg-white/20 rounded-full transition-all border border-white/20 text-sm">⚙️</button>
        </div>
      </nav>

      {showAdmin && (
        <div className="fixed inset-0 z-[100] bg-black/60 flex items-center justify-center p-4 backdrop-blur-md" onClick={() => setShowAdmin(false)}>
          <div className="bg-gray-900/40 backdrop-blur-3xl rounded-[40px] w-full max-w-4xl max-h-[85vh] overflow-y-auto p-10 shadow-2xl border border-white/10 text-white" onClick={e => e.stopPropagation()}>
            <div className="flex justify-between items-center border-b border-white/10 pb-6 mb-8">
               <h2 className="text-3xl font-black tracking-tighter italic text-purple-400 uppercase">Admin Panel</h2>
               <button onClick={() => setShowAdmin(false)} className="w-10 h-10 flex items-center justify-center bg-white/10 rounded-full text-2xl hover:bg-red-500 transition-all">&times;</button>
            </div>
            
            <div className="grid grid-cols-3 md:grid-cols-4 gap-2">
              <table className="w-full text-left">
                <thead>
                  <tr className="text-[10px] uppercase text-purple-300 font-black border-b border-white/10">
                    <th className="pb-4 px-4">Customer</th><th className="pb-4 px-4">Product</th><th className="pb-4 px-4 text-center">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {adminOrders.map((ord) => (
                    <tr key={ord._id} className="hover:bg-white/5 transition-colors">
                      <td className="py-4 px-4 font-bold">{ord.customerName}</td>
                      <td className="py-4 px-4 italic opacity-80">{ord.productName}</td>
                      <td className="py-4 px-4 text-center">
                        <button onClick={() => deleteOrder(ord._id)} className="text-red-400 hover:text-red-600 font-bold text-xs uppercase transition-colors px-4 py-2 hover:bg-red-500/20 rounded-xl">Delete</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="mt-8 pt-10 border-t border-white/10">
                <h3 className="text-xl font-black mb-6 text-purple-300 italic">Gallery Management</h3>
                <div className="flex gap-4 mb-8">
                    {/* accept="image/*,video/*" ተጨምሯል */}
                    <input type="file" accept="image/*,video/*" onChange={(e) => setSelectedFile(e.target.files[0])} className="flex-1 text-sm file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:bg-purple-600 file:text-white p-2 border border-dashed border-white/20 rounded-2xl bg-white/5" />
                    <button onClick={handleUploadImage} className="bg-purple-600 text-white px-8 py-2 rounded-2xl font-black hover:bg-purple-700 transition-all">Upload</button>
                </div>
                <div className="grid grid-cols-3 md:grid-cols-4 gap-2 md:gap-8">
                    {dbImages.map((img) => (
                        <div key={img._id} className="relative group aspect-square rounded-xl overflow-hidden border border-white/10 bg-black/40">
                            {isVideo(img.imageUrl) ? (
                                <video src={img.imageUrl} className="w-full h-full object-cover" muted />
                            ) : (
                                <img src={img.imageUrl} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-125" />
                            )}
                            <button onClick={() => deleteImage(img._id)} className="absolute inset-0 bg-red-600/50 opacity-0 group-hover:opacity-100 flex items-center justify-center font-black transition-all text-2xl">×</button>
                        </div>
                    ))}
                </div>
            </div>
          </div>
        </div>
      )}

      <main className="relative z-10 pt-28 min-h-[80vh]">
        <Routes>
          <Route path="/" element={
            <section className="min-h-[75vh] flex items-center justify-center px-6">
              <div className="w-full max-w-4xl p-14 md:p-24 bg-white/10 backdrop-blur-3xl border border-white/20 rounded-[40px] md:rounded-[60px] shadow-[0_40px_100px_rgba(0,0,0,0.4)] text-center animate-fade-in-up">
                <span className="inline-block px-6 py-2 mb-8 text-purple-300 font-black text-[10px] uppercase tracking-[0.5em] bg-purple-600/30 backdrop-blur-md rounded-full ring-1 ring-white/20">New Collection 2026</span>
                <h1 className="text-6xl md:text-9xl font-black text-white mb-8 italic tracking-tighter leading-none drop-shadow-2xl">Lilmoo <br/> <span className="text-purple-400">Design</span></h1>
                <p className="text-sm md:text-xl text-gray-200 mb-12 font-medium max-w-xl mx-auto leading-relaxed italic">ልዩ ዲዛይኖችን በጥራት እናቀርባለን። ዘመናዊነትን ከጥራት ጋር አጣምረን ለናንተ።</p>
                <Link to="/order" className="px-12 py-5 md:px-16 md:py-6 bg-purple-600 text-white rounded-full font-black text-lg md:text-xl shadow-2xl hover:scale-105 hover:bg-purple-700 transition-all active:scale-95 inline-block ring-1 ring-white/20">Order Now</Link>
              </div>
            </section>
          } />

          <Route path="/gallery" element={
            <section className="py-12 px-4 max-w-7xl mx-auto space-y-20">
              {/* --- Photos First --- */}
              <div className="animate-fade-in-up">
                  <h2 className="text-3xl md:text-5xl font-black italic text-white tracking-tighter mb-8 pl-4 border-l-8 border-purple-500 uppercase">Photos</h2>
                 <div className="grid grid-cols-3 md:grid-cols-4 gap-2 md:gap-8 px-1">
                    {/* ዳታቤዝ ውስጥ ያሉ ፎቶዎች */}
                    {dbImages.filter(item => !isVideo(item.imageUrl)).map((img, i) => (
                      <div key={`db-p-${i}`} className="aspect-[3/4] rounded-xl md:rounded-[45px] overflow-hidden shadow-2xl hover:-translate-y-2 transition-all duration-700 ring-1 ring-white/20 group">
                         <img src={img.imageUrl} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                      </div>
                    ))}
                    {staticPhotos.map((pic, i) => (
                      <div key={`st-p-${i}`} className="aspect-[3/4] rounded-xl md:rounded-[45px] overflow-hidden shadow-2xl hover:-translate-y-2 transition-all duration-700 ring-1 ring-white/20 group">
                         <img src={pic} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                      </div>
                    ))}
                  </div>
              </div>

              {/* --- Videos Section --- */}
              <div className="animate-fade-in-up">
                  <h2 className="text-3xl md:text-5xl font-black italic text-white tracking-tighter mb-8 pl-4 border-l-8 border-purple-500 uppercase">Videos</h2>
                  <div className="grid grid-cols-4 gap-2 md:gap-8 px-1">
                    {/* ዳታቤዝ ውስጥ ያሉ ቪዲዮዎች */}
                    {dbImages.filter(item => isVideo(item.imageUrl)).map((vid, i) => (
                      <div key={`db-v-${i}`} className="relative aspect-[3/4] rounded-xl md:rounded-[45px] overflow-hidden shadow-2xl hover:-translate-y-2 transition-all duration-700 ring-1 ring-white/20 bg-black/60 group">
                         <video src={vid.imageUrl} className="w-full h-full object-cover" controls playsInline webkit-playsinline="true" preload="metadata" style={{ objectFit: 'cover' }} />
                      </div>
                    ))}
                    {/* Static Videos */}
                    {staticVideos.map((vid, i) => (
                      <div key={`st-v-${i}`} className="relative aspect-[3/4] rounded-xl md:rounded-[45px] overflow-hidden shadow-2xl hover:-translate-y-2 transition-all duration-700 ring-1 ring-white/20 bg-black/60 group">
                         <video src={vid} className="w-full h-full object-cover" controls playsInline webkit-playsinline="true" preload="metadata" style={{ objectFit: 'cover' }} />
                      </div>
                    ))}
                  </div>
              </div>
            </section>
          } />

          <Route path="/order" element={<OrderForm API_URL={API_URL} />} />
        </Routes>
      </main>

      <footer className="relative z-10 mt-20">
        <div className="w-full bg-white/5 backdrop-blur-3xl border-t border-white/10 px-6 py-10">
          <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-10">
            <div className="text-center md:text-left flex-1">
              <Link to="/" className="text-4xl md:text-5xl font-black text-white italic tracking-tighter">lilmoo</Link>
              <p className="text-gray-200 text-xs md:text-sm font-medium leading-relaxed max-w-sm italic mt-2">ሊልሙ ዲዛይን የዘመናዊ ልብስ ጥበብን ከአዲስ እይታ ጋር ያቀርባል።</p>
            </div>
            <div className="flex flex-row items-center gap-8 border-t md:border-t-0 border-white/10 pt-8 md:pt-0">
              <div className="text-right">
                <h4 className="text-white font-black text-[9px] uppercase tracking-widest opacity-50 mb-1">Contact Us</h4>
                <p className="text-purple-300 font-black text-xl md:text-2xl tracking-tighter">+251919821717</p>
              </div>
              <div className="flex flex-row gap-3">
                <a href="https://t.me/Lilmoo_design13" target="_blank" rel="noreferrer" className="w-10 h-10 md:w-12 md:h-12 bg-white/10 hover:bg-purple-600 rounded-2xl flex items-center justify-center text-white transition-all border border-white/10 group"><span className="font-black text-[10px]">TG</span></a>
                <a href="https://instagram.com/yomu_ko" target="_blank" rel="noreferrer" className="w-10 h-10 md:w-12 md:h-12 bg-white/10 hover:bg-pink-600 rounded-2xl flex items-center justify-center text-white transition-all border border-white/10 group"><span className="font-black text-[10px]">IG</span></a>
              </div>
            </div>
          </div>
          <div className="max-w-7xl mx-auto mt-10 pt-6 border-t border-white/5 flex flex-row justify-between items-center text-[8px] font-black uppercase tracking-[0.3em] text-gray-500">
            <p>© 2026 Lilmoo Design | Crafted Excellence</p>
            <p className="italic text-white/20">Developed by Abraham</p>
          </div>
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
      const res = await fetch(`${API_URL}/pay`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ customerName: order.name, productName: order.orderType, amount: "150" })
      });
      const data = await res.json();
      if (data.checkout_url) window.location.href = data.checkout_url;
      else alert("ክፍያ ማስጀመር አልተቻለም");
    } catch (err) { alert("Error!"); }
    finally { setLoading(false); }
  };
  return (
    <section className="min-h-[80vh] flex items-center justify-center px-6">
      <div className="max-w-md w-full bg-white/10 backdrop-blur-3xl p-10 md:p-14 rounded-[40px] md:rounded-[60px] shadow-[0_40px_100px_rgba(0,0,0,0.5)] border border-white/20 animate-fade-in-up text-white">
        <h2 className="text-4xl md:text-5xl font-black mb-10 text-center italic tracking-tight leading-tight">አዲስ <br/> <span className="text-purple-400">ትዕዛዝ</span></h2>
        <form onSubmit={handleOrderSubmit} className="space-y-6">
          <input type="text" placeholder="ሙሉ ስም" value={order.name} onChange={(e) => setOrder({...order, name: e.target.value})} className="w-full p-5 bg-white/10 border border-white/10 focus:border-purple-400 focus:bg-white/20 rounded-[25px] outline-none font-bold text-white placeholder-white/30 transition-all shadow-inner" required />
          <input type="text" placeholder="የልብስ አይነት" value={order.orderType} onChange={(e) => setOrder({...order, orderType: e.target.value})} className="w-full p-5 bg-white/10 border border-white/10 focus:border-purple-400 focus:bg-white/20 rounded-[25px] outline-none font-bold text-white placeholder-white/30 transition-all shadow-inner" required />
          <button type="submit" className="w-full py-5 bg-purple-600 text-white rounded-[25px] font-black text-xl shadow-2xl hover:bg-purple-700 hover:scale-[1.02] transition-all" disabled={loading}>
            {loading ? "በመላክ ላይ..." : "በ Chapa ይክፈሉ"}
          </button>
        </form>
      </div>
    </section>
  );
}