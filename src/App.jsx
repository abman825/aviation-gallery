import axios from 'axios'; 
import { useState, useEffect } from 'react';
import { Routes, Route, Link, useLocation } from 'react-router-dom';
import './App.css'; 

// Assets (Images)
import img1 from './assets/1.jpg'; import img2 from './assets/2.jpg';
import img3 from './assets/3.jpg'; import img4 from './assets/4.jpg';
import img5 from './assets/5.jpg'; import img6 from './assets/6.jpg';
import imga from './assets/a.jpg'; import imgb from './assets/b.jpg';
import imgc from './assets/c.jpg'; import imgd from './assets/d.jpg';
import imge from './assets/e.jpg'; import imgf from './assets/f.jpg';
import imgg from './assets/g.jpg'; import imgh from './assets/h.jpg';
import imgi from './assets/i.jpg'; import imgj from './assets/j.jpg';
import imgk from './assets/k.jpg'; import imgl from './assets/l.jpg';

// Videos
import vid1 from './assets/1.mp4'; import vid2 from './assets/2.mp4'; 
import vid3 from './assets/3.mp4'; import vid4 from './assets/4.mp4'; 
import vid5 from './assets/5.mp4'; import vid6 from './assets/6.mp4'; 
import vid7 from './assets/7.mp4'; import vid8 from './assets/8.mp4';
import vid10 from './assets/10.mp4';

export default function App() {
  const [showAdmin, setShowAdmin] = useState(false); 
  const [adminOrders, setAdminOrders] = useState([]); 
  const [dbImages, setDbImages] = useState([]); 
  const [uploading, setUploading] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const { pathname } = useLocation();

  const API_URL = "https://aviation-backend-g75i.onrender.com/api";
  const CLOUD_NAME = "dml3qv23x";
  const UPLOAD_PRESET = "lilmoo_preset";

  useEffect(() => {
    window.scrollTo(0, 0);
    fetchImages();
  }, [pathname]);

  const fetchImages = async () => {
    try {
      const res = await fetch(`${API_URL}/gallery`);
      const data = await res.json();
      setDbImages(data);
    } catch (err) { console.error(err); }
  };

  const deleteImage = async (id) => {
    if (!window.confirm("እርግጠኛ ነህ ይህ ምስል እንዲጠፋ ትፈልጋለህ?")) return;
    try {
      await axios.delete(`${API_URL}/gallery/${id}`);
      alert("✅ ምስሉ ተሰርዟል!");
      fetchImages();
    } catch (error) { alert("❌ መሰረዝ አልተቻለም"); }
  };

  const fetchOrders = async () => {
    const password = prompt("የአድሚን ፓስዎርድ ያስገቡ:");
    if (password === "0000") { 
      try {
        const response = await fetch(`${API_URL}/orders`);
        const data = await response.json();
        setAdminOrders(data);
        setShowAdmin(true);
      } catch (error) { alert("መረጃ ማግኘት አልተቻለም!"); }
    } else { alert("የተሳሳተ ፓስዎርድ!"); }
  };

  const handleImageUpload = async () => {
    if (!selectedFile) return alert("እባክዎ መጀመሪያ ምስል ይምረጡ!");
    setUploading(true);
    const formData = new FormData();
    formData.append('file', selectedFile);
    formData.append('upload_preset', UPLOAD_PRESET);

    try {
      const res = await fetch(`https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`, {
        method: "POST",
        body: formData
      });
      const cloudData = await res.json();
      await fetch(`${API_URL}/gallery`, {
        method: "POST",
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ imageUrl: cloudData.secure_url })
      });
      alert("✅ ተጭኗል!");
      setSelectedFile(null);
      fetchImages(); 
    } catch (error) { alert("❌ ስህተት ተፈጥሯል!"); }
    finally { setUploading(false); }
  };

  return (
    <div className="min-h-screen bg-gray-50 font-sans text-gray-900">
      {/* Navbar */}
      <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md shadow-sm border-b border-gray-100 px-6 py-4">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <Link to="/" className="text-3xl font-bold text-purple-700 italic tracking-tighter">lilmoo</Link>
          <div className="flex items-center gap-6 font-semibold text-xs uppercase tracking-widest">
            <Link to="/" className={pathname === "/" ? "text-purple-600" : "hover:text-purple-400 transition"}>Home</Link>
            <Link to="/gallery" className={pathname === "/gallery" ? "text-purple-600" : "hover:text-purple-400 transition"}>Gallery</Link>
            <Link to="/order" className={pathname === "/order" ? "text-purple-600" : "hover:text-purple-400 transition"}>Order</Link>
            <button onClick={fetchOrders} className="p-2 hover:bg-gray-100 rounded-full transition text-lg">⚙️</button>
          </div>
        </div>
      </nav>

      {/* Admin Modal */}
      {showAdmin && (
        <div className="fixed inset-0 z-[100] bg-black/60 flex items-center justify-center p-4 backdrop-blur-sm" onClick={() => setShowAdmin(false)}>
          <div className="bg-white rounded-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto p-8" onClick={e => e.stopPropagation()}>
            <div className="flex justify-between items-center border-b pb-4 mb-8">
               <h2 className="text-2xl font-bold text-gray-800 tracking-tight">Admin Dashboard</h2>
               <button onClick={() => setShowAdmin(false)} className="text-3xl hover:text-red-500 transition">&times;</button>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
              <div className="bg-purple-50 p-6 rounded-2xl border border-purple-100">
                <h3 className="text-lg font-bold mb-4 text-purple-900">አዲስ ምስል ፖስት ማድረጊያ</h3>
                <input type="file" className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:bg-purple-200 file:text-purple-700 file:font-bold" onChange={(e) => setSelectedFile(e.target.files[0])} />
                <button onClick={handleImageUpload} disabled={uploading} className="mt-6 w-full py-3 bg-purple-600 text-white rounded-xl font-bold hover:bg-purple-700 shadow-lg shadow-purple-200 transition disabled:bg-gray-400">
                  {uploading ? "በመጫን ላይ..." : "Post to Gallery"}
                </button>
              </div>

              <div className="bg-gray-50 p-6 rounded-2xl border border-gray-200">
                <h3 className="text-lg font-bold mb-4 text-gray-800">የጋለሪ ምስሎች</h3>
                <div className="grid grid-cols-4 gap-2 max-h-40 overflow-y-auto p-1">
                  {dbImages.map((img) => (
                    <div key={img._id} className="relative group aspect-square">
                      <img src={img.imageUrl} className="w-full h-full object-cover rounded-lg shadow-sm" />
                      <button onClick={() => deleteImage(img._id)} className="absolute inset-0 bg-red-600/80 text-white text-[10px] font-bold opacity-0 group-hover:opacity-100 rounded-lg transition flex items-center justify-center">DELETE</button>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="mt-10">
              <h3 className="text-xl font-bold mb-6 text-gray-800 border-b pb-2">የደንበኞች ትዕዛዝ</h3>
              <div className="overflow-x-auto rounded-xl border border-gray-100">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-gray-50 text-xs uppercase text-gray-500 font-black">
                      <th className="p-4">Customer Name</th><th className="p-4">Product</th><th className="p-4">Date</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {adminOrders.map((ord, i) => (
                      <tr key={i} className="text-sm hover:bg-gray-50 transition">
                        <td className="p-4 font-bold text-gray-800">{ord.customerName}</td>
                        <td className="p-4 text-gray-600 font-medium">{ord.productName}</td>
                        <td className="p-4 text-gray-400">{new Date(ord.date).toLocaleDateString()}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      )}

      <Routes>
        <Route path="/" element={
          <section className="relative h-[90vh] flex items-center justify-center overflow-hidden">
            <img src={img1} alt="Hero" className="absolute inset-0 h-full w-full object-cover" />
            <div className="absolute inset-0 bg-black/45"></div>
            <div className="relative z-10 container mx-auto px-6 flex justify-center">
              <div 
                className="max-w-2xl p-10 md:p-16 rounded-[40px] bg-white/10 backdrop-blur-xl border border-white/20 shadow-2xl text-center"
                style={{ animation: 'slideUp 1.2s ease-out forwards', opacity: 0 }}
              >
                <style>{` @keyframes slideUp { from { opacity: 0; transform: translateY(60px); } to { opacity: 1; transform: translateY(0); } } `}</style>
                <span className="text-pink-400 font-black tracking-[0.4em] uppercase text-xs block mb-6">Elegance in Every Stitch</span>
                <h1 className="text-5xl md:text-8xl font-black text-white leading-none mb-8 drop-shadow-2xl">Lilmoo Design</h1>
                <p className="text-lg md:text-2xl text-gray-100 font-medium leading-relaxed mb-12 drop-shadow-md">ልዩ ለሆኑ ሴቶችና ልዩ የሆኑ ዲዛይኖች ጥራትን ከውበት ጋር አቀናጅተን እናቀርባለን።</p>
                <div className="flex flex-wrap gap-6 justify-center">
                  <Link to="/gallery" className="px-12 py-5 border-2 border-white/30 text-white rounded-full font-black hover:bg-white/10 transition backdrop-blur-md uppercase text-sm tracking-widest">Explore Gallery</Link>
                  <Link to="/order" className="px-12 py-5 bg-pink-600 text-white rounded-full font-black shadow-2xl shadow-pink-500/50 hover:bg-pink-700 transition uppercase text-sm tracking-widest">Order Now</Link>
                </div>
              </div>
            </div>
          </section>
        } />

        <Route path="/gallery" element={
          <section className="py-20 px-6 max-w-7xl mx-auto">
            <h2 className="text-5xl font-black text-center mb-16 text-gray-900 tracking-tighter italic">Exclusive Collection</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              {dbImages.map((img, i) => (
                <div key={`db-${i}`} className="aspect-[3/4] rounded-3xl overflow-hidden shadow-2xl hover:scale-[1.02] transition-transform">
                   <img src={img.imageUrl} className="w-full h-full object-cover" loading="lazy" />
                </div>
              ))}
              {[img1, img2, img3, img4, img5, img6, imga, imgb, imgc, imgd, imge, imgf, imgg, imgh, imgi, imgj, imgk, imgl].map((pic, i) => (
                <div key={`st-${i}`} className="aspect-[3/4] rounded-3xl overflow-hidden shadow-xl hover:scale-[1.02] transition-transform">
                   <img src={pic} className="w-full h-full object-cover" loading="lazy" />
                </div>
              ))}
            </div>
            
            <h2 className="text-5xl font-black text-center mt-32 mb-16 text-gray-900 tracking-tighter italic">Behind the Scenes</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
              {[vid1, vid2, vid3, vid4, vid5, vid6, vid7, vid8, vid10].map((vid, i) => (
                <div key={i} className="rounded-[40px] overflow-hidden shadow-2xl aspect-[9/16] bg-black max-w-[340px] mx-auto border-8 border-gray-900">
                  <video controls className="w-full h-full object-cover opacity-90"><source src={vid} type="video/mp4" /></video>
                </div>
              ))}
            </div>
          </section>
        } />

        <Route path="/order" element={<OrderForm API_URL={`${API_URL}/orders`} />} />
      </Routes>

      {/* Modern Footer */}
      <footer className="bg-gray-950 text-white pt-24 pb-12 px-8 mt-32 border-t border-purple-900/40">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-16 mb-20">
          <div className="space-y-8">
            <h3 className="text-5xl font-black text-purple-500 italic tracking-tighter">lilmoo</h3>
            <p className="text-gray-400 leading-relaxed text-xl font-medium">በጥራት እና በውበት የተሰሩ የሴቶች አልባሳትን ወደ እርስዎ እናደርሳለን። ዘመናዊነትን ከባህላዊ እሴቶች ጋር አዋህደን የምንሰራበት ቦታ።</p>
            <div className="flex gap-6 text-3xl text-purple-400">
              <a href="#" className="hover:text-pink-500 transition-all transform hover:scale-110">📸</a>
              <a href="#" className="hover:text-pink-500 transition-all transform hover:scale-110">✈️</a>
              <a href="#" className="hover:text-pink-500 transition-all transform hover:scale-110">🔵</a>
            </div>
          </div>
          <div className="space-y-8">
            <h4 className="text-2xl font-black border-l-4 border-pink-600 pl-4 uppercase tracking-widest text-sm">Quick Links</h4>
            <ul className="space-y-5 text-gray-400 font-bold text-lg">
              <li><Link to="/" className="hover:text-purple-400 transition">Home</Link></li>
              <li><Link to="/gallery" className="hover:text-purple-400 transition">Our Gallery</Link></li>
              <li><Link to="/order" className="hover:text-purple-400 transition">Make an Order</Link></li>
              <li><button onClick={fetchOrders} className="hover:text-purple-400 transition">Admin Access</button></li>
            </ul>
          </div>
          <div className="space-y-8">
            <h4 className="text-2xl font-black border-l-4 border-pink-600 pl-4 uppercase tracking-widest text-sm">Contact Info</h4>
            <div className="space-y-6 text-gray-400 text-lg">
              <p className="flex items-center gap-4 italic font-medium">📍 አዲስ አበባ ፣ ኢትዮጵያ</p>
              <p className="flex items-center gap-4 font-black text-white text-xl">📞 +251 919 82 17 17</p>
              <p className="flex items-center gap-4 font-medium">✉️ info@lilmoo.com</p>
            </div>
          </div>
        </div>
        <div className="max-w-7xl mx-auto border-t border-gray-900 pt-10 flex flex-col md:row justify-between items-center text-gray-500 text-sm gap-6 font-bold uppercase tracking-widest">
          <p>&copy; {new Date().getFullYear()} <span className="text-purple-500">Lilmoo Design</span>. Crafting Excellence.</p>
          <div className="flex gap-10">
            <a href="#" className="hover:text-white transition underline underline-offset-8">Privacy</a>
            <a href="#" className="hover:text-white transition underline underline-offset-8">Terms</a>
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
      const res = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ customerName: order.name, productName: order.orderType })
      });
      if (res.ok) { alert("✅ ትዕዛዝዎ ደርሶናል!"); setOrder({ name: '', orderType: '' }); }
    } catch (err) { alert("❌ ስህተት!"); }
    finally { setLoading(false); }
  };
  return (
    <section className="py-32 px-6 min-h-[80vh] flex items-center bg-purple-50 justify-center">
      <div className="max-w-md w-full bg-white p-12 rounded-[40px] shadow-2xl border border-purple-100">
        <h2 className="text-4xl font-black mb-10 text-center tracking-tighter">አዲስ ትዕዛዝ</h2>
        <form onSubmit={handleOrderSubmit} className="space-y-8">
          <div className="space-y-2">
            <label className="text-xs font-black uppercase tracking-widest text-gray-400 pl-2">Full Name</label>
            <input type="text" placeholder="ሙሉ ስም" value={order.name} onChange={(e) => setOrder({...order, name: e.target.value})} className="w-full p-5 bg-gray-50 border-none rounded-2xl outline-none focus:ring-2 focus:ring-purple-500 transition font-bold" required />
          </div>
          <div className="space-y-2">
            <label className="text-xs font-black uppercase tracking-widest text-gray-400 pl-2">Clothing Type</label>
            <input type="text" placeholder="የልብስ አይነት" value={order.orderType} onChange={(e) => setOrder({...order, orderType: e.target.value})} className="w-full p-5 bg-gray-50 border-none rounded-2xl outline-none focus:ring-2 focus:ring-purple-500 transition font-bold" required />
          </div>
          <button type="submit" className="w-full py-5 bg-purple-600 text-white rounded-2xl font-black text-lg shadow-xl shadow-purple-200 hover:bg-purple-700 transition transform active:scale-95" disabled={loading}>{loading ? "በመላክ ላይ..." : "ትዕዛዝ ይላኩ"}</button>
        </form>
      </div>
    </section>
  );
}