import { useState, useEffect } from 'react';
import { Routes, Route, Link, useLocation } from 'react-router-dom';
import './App.css'; 

// Static Assets (ፎቶዎችና ቪዲዮዎች)
import img1 from './assets/1.jpg'; import img2 from './assets/2.jpg';
import img3 from './assets/3.jpg'; import img4 from './assets/4.jpg';
import imga from './assets/a.jpg'; import imgb from './assets/b.jpg';
import vid1 from './assets/1.mp4'; import vid2 from './assets/2.mp4';
import vid3 from './assets/3.mp4'; import vid4 from './assets/4.mp4';
import bgImage from './assets/1.jpg'; 

export default function App() {
  const [showAdmin, setShowAdmin] = useState(false); 
  const [adminOrders, setAdminOrders] = useState([]); 
  const [dbImages, setDbImages] = useState([]); 
  const [selectedFile, setSelectedFile] = useState(null); 
  const { pathname } = useLocation();
  
  // Backend URL
  const API_URL = import.meta.env.VITE_API_URL || "https://aviation-backend-g75i.onrender.com/api"; 

  useEffect(() => {
    window.scrollTo(0, 0);
    fetchImages();
  }, [pathname]);

  // --- Functions ---
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
    if(!selectedFile) return alert("እባክህ ፋይል ምረጥ");
    const formData = new FormData();
    formData.append('image', selectedFile);
    try {
        const res = await fetch(`${API_URL}/gallery`, { method: 'POST', body: formData });
        if(res.ok) {
            alert("ተጭኗል!");
            setSelectedFile(null);
            fetchImages(); 
        }
    } catch (err) { alert("መጫን አልተቻለም"); }
  };

  const deleteImage = async (id) => {
    if(window.confirm("ይህንን ፋይል መሰረዝ ትፈልጋለህ?")) {
      try {
        await fetch(`${API_URL}/gallery/${id}`, { method: 'DELETE' });
        fetchImages();
      } catch (err) { alert("መሰረዝ አልተቻለም"); }
    }
  };

  const deleteOrder = async (id) => {
    if(window.confirm("ትዕዛዙን መሰረዝ ትፈልጋለህ?")) {
      try {
        await fetch(`${API_URL}/orders/${id}`, { method: 'DELETE' });
        setAdminOrders(adminOrders.filter(o => o._id !== id));
      } catch (err) { alert("መሰረዝ አልተቻለም"); }
    }
  };

  const isVideo = (url) => url && url.match(/\.(mp4|webm|mov)$/i);

  return (
    <div className="relative min-h-screen font-sans text-white overflow-x-hidden">
      
      {/* Background Section */}
      <div className="fixed inset-0 z-0">
        <img src={bgImage} className="w-full h-full object-cover" alt="Background" />
        <div className="absolute inset-0 bg-black/60 backdrop-blur-[3px]"></div>
      </div>

      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 bg-white/10 backdrop-blur-2xl border-b border-white/10 px-6 py-4 flex justify-between items-center shadow-xl">
        <Link to="/" className="text-2xl md:text-3xl font-black italic text-white tracking-tighter">lilmoo</Link>
        <div className="flex items-center gap-6 font-bold text-[10px] uppercase tracking-widest">
          <Link to="/" className={pathname === "/" ? "text-purple-400 border-b-2 border-purple-400" : ""}>Home</Link>
          <Link to="/gallery" className={pathname === "/gallery" ? "text-purple-400 border-b-2 border-purple-400" : ""}>Gallery</Link>
          <Link to="/order" className={pathname === "/order" ? "text-purple-400 border-b-2 border-purple-400" : ""}>Order</Link>
          <button onClick={fetchOrders} className="bg-white/10 p-2 rounded-full">⚙️</button>
        </div>
      </nav>

      {/* Admin Panel Modal */}
      {showAdmin && (
        <div className="fixed inset-0 z-[100] bg-black/80 flex items-center justify-center p-4 backdrop-blur-md" onClick={() => setShowAdmin(false)}>
          <div className="bg-gray-900 rounded-[40px] w-full max-w-4xl max-h-[85vh] overflow-y-auto p-10 shadow-2xl border border-white/10" onClick={e => e.stopPropagation()}>
            <div className="flex justify-between items-center mb-8">
               <h2 className="text-2xl font-black text-purple-400">ADMIN PANEL</h2>
               <button onClick={() => setShowAdmin(false)} className="text-2xl">&times;</button>
            </div>
            
            <div className="mb-10 bg-black/20 p-4 rounded-xl border border-white/5">
              <table className="w-full text-left text-sm">
                <thead><tr className="border-b border-white/10 opacity-50"><th>Customer</th><th>Product</th><th>Action</th></tr></thead>
                <tbody className="divide-y divide-white/5">
                  {adminOrders.map(o => (
                    <tr key={o._id}>
                      <td className="py-3">{o.customerName}</td>
                      <td>{o.productName}</td>
                      <td><button onClick={() => deleteOrder(o._id)} className="text-red-400 text-xs">Delete</button></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="mt-8 pt-8 border-t border-white/10">
                <h3 className="text-lg font-bold mb-4">Manage Gallery</h3>
                <div className="flex gap-4 mb-6">
                    <input type="file" accept="image/*,video/*" onChange={(e) => setSelectedFile(e.target.files[0])} className="text-xs" />
                    <button onClick={handleUploadImage} className="bg-purple-600 px-6 py-2 rounded-xl text-xs font-bold">Upload</button>
                </div>
                <div className="grid grid-cols-4 gap-2">
                    {dbImages.map((img) => (
                        <div key={img._id} className="relative aspect-square rounded-lg overflow-hidden group">
                            {isVideo(img.imageUrl) ? <video src={img.imageUrl} className="w-full h-full object-cover" /> : <img src={img.imageUrl} className="w-full h-full object-cover" />}
                            <button onClick={() => deleteImage(img._id)} className="absolute inset-0 bg-red-600/60 opacity-0 group-hover:opacity-100 flex items-center justify-center font-bold">Delete</button>
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
            <div className="text-center py-24 px-6">
              <h1 className="text-7xl md:text-9xl font-black italic tracking-tighter leading-none">Lilmoo <br/><span className="text-purple-400">Design</span></h1>
              <p className="mt-8 text-gray-200 max-w-md mx-auto italic text-lg leading-relaxed">ልዩ ዲዛይኖችን በጥራት እናቀርባለን። ዘመናዊነትን ከጥራት ጋር አጣምረን ለእናንተ።</p>
              <Link to="/order" className="mt-12 inline-block bg-purple-600 px-16 py-6 rounded-full font-black text-xl shadow-2xl hover:scale-105 transition-all">Order Now</Link>
            </div>
          } />

          <Route path="/gallery" element={
            <div className="max-w-7xl mx-auto px-6 py-12">
              <h2 className="text-5xl font-black italic text-center mb-16 uppercase tracking-tighter">Gallery</h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-20">
                {dbImages.filter(img => !isVideo(img.imageUrl)).map((img, i) => (
                  <div key={i} className="aspect-[3/4] rounded-3xl overflow-hidden border border-white/10 shadow-2xl hover:-translate-y-2 transition-all duration-500">
                     <img src={img.imageUrl} className="w-full h-full object-cover" alt="Gallery" />
                  </div>
                ))}
                {[img1, img2, img3, img4, imga, imgb].map((pic, i) => (
                  <div key={i} className="aspect-[3/4] rounded-3xl overflow-hidden border border-white/10 shadow-2xl hover:-translate-y-2 transition-all duration-500">
                     <img src={pic} className="w-full h-full object-cover" alt="Static" />
                  </div>
                ))}
              </div>

              <h3 className="text-3xl font-black italic text-purple-400 mb-8 uppercase">Cinematics</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {[vid1, vid2, vid3, vid4].map((video, i) => (
                  <div key={i} className="aspect-video rounded-3xl overflow-hidden border border-white/10 bg-black/40">
                     <video src={video} className="w-full h-full object-cover" controls preload="metadata" />
                  </div>
                ))}
                {dbImages.filter(img => isVideo(img.imageUrl)).map((v, i) => (
                   <div key={i} className="aspect-video rounded-3xl overflow-hidden border border-white/10 bg-black/40">
                     <video src={v.imageUrl} className="w-full h-full object-cover" controls />
                  </div>
                ))}
              </div>
            </div>
          } />

          <Route path="/order" element={<OrderForm API_URL={API_URL} />} />

          <Route path="/success" element={
            <div className="h-[70vh] flex flex-col items-center justify-center text-center px-6">
              <div className="p-20 bg-white/10 backdrop-blur-3xl rounded-[60px] border border-white/20 shadow-2xl">
                <div className="w-20 h-20 bg-green-500/30 text-green-400 rounded-full flex items-center justify-center text-5xl mx-auto mb-8 ring-1 ring-green-400/50">✓</div>
                <h1 className="text-4xl font-black mb-6 italic">ክፍያዎ ተፈፅሟል!</h1>
                <p className="text-gray-200 font-bold mb-10 text-lg">ትዕዛዝዎን በትክክል ተቀብለናል፣ እናመሰግናለን።</p>
                <Link to="/" className="px-12 py-4 bg-white text-purple-700 rounded-2xl font-black shadow-xl hover:scale-105 transition-all">ወደ ዋና ገጽ ተመለስ</Link>
              </div>
            </div>
          } />
        </Routes>
      </main>

      <footer className="relative z-10 mt-20">
        <div className="bg-white/5 backdrop-blur-3xl border-t border-white/10 px-8 py-16">
          <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-12">
            <div className="text-center md:text-left">
              <Link to="/" className="text-5xl font-black italic tracking-tighter">lilmoo</Link>
              <p className="text-gray-400 text-sm italic mt-4 max-w-sm">ሊልሙ ዲዛይን የዘመናዊ ልብስ ጥበብን ከአዲስ እይታ ጋር ያቀርባል። በጥራት እና በዘመናዊነት የታነፁ ልዩ ስራዎች።</p>
            </div>
            <div className="text-center md:text-right">
              <h4 className="text-[10px] uppercase font-black tracking-widest opacity-40">Contact Us</h4>
              <p className="text-purple-400 font-black text-3xl mt-2">+251919821717</p>
            </div>
          </div>
          <div className="max-w-7xl mx-auto mt-16 pt-8 border-t border-white/5 flex justify-between items-center text-[9px] uppercase tracking-widest text-gray-500">
            <p>© 2026 Lilmoo Design</p>
            <p className="italic text-white/20">Developed by Abraham</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

function OrderForm({ API_URL }) {
  const [order, setOrder] = useState({ name: '', type: '' });
  const [loading, setLoading] = useState(false);
  const submitOrder = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/pay`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ customerName: order.name, productName: order.type, amount: "150" })
      });
      const data = await res.json();
      if (data.checkout_url) window.location.href = data.checkout_url;
      else alert("ክፍያ ማስጀመር አልተቻለም");
    } catch (err) { alert("Error!"); }
    finally { setLoading(false); }
  };
  return (
    <div className="max-w-md mx-auto bg-white/10 backdrop-blur-3xl p-14 rounded-[60px] border border-white/20 shadow-2xl">
      <h2 className="text-5xl font-black text-center mb-12 italic tracking-tight">ORDER</h2>
      <form onSubmit={submitOrder} className="space-y-8">
        <div className="space-y-2">
          <label className="text-[10px] font-black text-purple-300 ml-4 tracking-widest">FULL NAME</label>
          <input type="text" placeholder="ሙሉ ስም" className="w-full p-5 bg-white/10 border border-white/10 rounded-3xl outline-none focus:border-purple-400 transition-all font-bold" onChange={e => setOrder({...order, name: e.target.value})} required />
        </div>
        <div className="space-y-2">
          <label className="text-[10px] font-black text-purple-300 ml-4 tracking-widest">PRODUCT TYPE</label>
          <input type="text" placeholder="የልብስ አይነት" className="w-full p-5 bg-white/10 border border-white/10 rounded-3xl outline-none focus:border-purple-400 transition-all font-bold" onChange={e => setOrder({...order, type: e.target.value})} required />
        </div>
        <button type="submit" className="w-full py-6 bg-purple-600 rounded-3xl font-black text-2xl shadow-2xl hover:bg-purple-700 transition-all" disabled={loading}>
          {loading ? "በመላክ ላይ..." : "በ Chapa ይክፈሉ"}
        </button>
      </form>
    </div>
  );
}