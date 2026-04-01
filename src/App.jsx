import { useState, useEffect } from 'react';
import { Routes, Route, Link, useLocation } from 'react-router-dom';
import './App.css'; 

// --- Static Assets ---
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
  const [selectedMedia, setSelectedMedia] = useState(null); // ለ Full Screen እይታ የተጨመረ
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

  const isVideo = (url) => {
    if (typeof url !== 'string') return false;
    return url.match(/\.(mp4|webm|ogg|mov)$/i);
  };

  return (
    <div className="relative min-h-screen font-sans text-white selection:bg-purple-500/30 overflow-x-hidden">
      
      {/* Background Section */}
      <div className="fixed inset-0 z-0">
        <img src={bgImage} className="w-full h-full object-cover" alt="Background" />
        <div className="absolute inset-0 bg-black/60 backdrop-blur-[3px]"></div>
      </div>

      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 bg-white/10 backdrop-blur-2xl border-b border-white/10 px-6 py-4 flex justify-between items-center shadow-xl">
        <Link to="/" className="text-2xl md:text-3xl font-black italic hover:scale-105 transition-all tracking-tighter text-white">lilmoo</Link>
        <div className="flex items-center gap-4 md:gap-8 font-bold text-[9px] md:text-[10px] uppercase tracking-[0.2em] md:tracking-[0.25em]">
          <Link to="/" className={pathname === "/" ? "text-purple-400 border-b-2 border-purple-400 pb-1" : "hover:text-purple-300 transition-colors"}>Home</Link>
          <Link to="/gallery" className={pathname === "/gallery" ? "text-purple-400 border-b-2 border-purple-400 pb-1" : "hover:text-purple-300 transition-colors"}>Gallery</Link>
          <Link to="/order" className={pathname === "/order" ? "text-purple-400 border-b-2 border-purple-400 pb-1" : "hover:text-purple-300 transition-colors"}>Order</Link>
          <button onClick={fetchOrders} className="w-8 h-8 md:w-10 md:h-10 flex items-center justify-center bg-white/10 hover:bg-white/20 rounded-full transition-all border border-white/20 text-sm">⚙️</button>
        </div>
      </nav>

      {/* Full Screen Media Viewer (አዲስ የተጨመረ) */}
      {selectedMedia && (
        <div 
          className="fixed inset-0 z-[200] bg-black/95 flex items-center justify-center p-4 md:p-10 cursor-zoom-out"
          onClick={() => setSelectedMedia(null)}
        >
          <button className="absolute top-10 right-10 text-white text-4xl font-bold z-[210] hover:text-purple-400 transition-colors">&times;</button>
          
          <div className="max-w-full max-h-full flex items-center justify-center" onClick={e => e.stopPropagation()}>
            {isVideo(selectedMedia) ? (
              <video src={selectedMedia} controls autoPlay className="max-w-full max-h-[90vh] rounded-2xl shadow-2xl" />
            ) : (
              <img src={selectedMedia} className="max-w-full max-h-[90vh] object-contain rounded-2xl shadow-2xl" alt="Full View" />
            )}
          </div>
        </div>
      )}

      {/* Routes & Pages */}
      <div className="relative z-10 pt-28 px-6 pb-20">
        <Routes>
          <Route path="/" element={<Home staticPhotos={staticPhotos} setSelectedMedia={setSelectedMedia} />} />
          <Route path="/gallery" element={<Gallery dbImages={dbImages} staticPhotos={staticPhotos} staticVideos={staticVideos} isVideo={isVideo} setSelectedMedia={setSelectedMedia} />} />
          <Route path="/order" element={<OrderPage />} />
        </Routes>
      </div>

      {/* Admin Panel (ካልተለወጠው የቀጠለ) */}
      {showAdmin && (
        <div className="fixed inset-0 z-[100] bg-black/60 flex items-center justify-center p-4 backdrop-blur-md" onClick={() => setShowAdmin(false)}>
          <div className="bg-gray-900/40 backdrop-blur-3xl rounded-[40px] w-full max-w-4xl max-h-[85vh] overflow-y-auto p-10 shadow-2xl border border-white/10 text-white" onClick={e => e.stopPropagation()}>
            <div className="flex justify-between items-center border-b border-white/10 pb-6 mb-8">
               <h2 className="text-3xl font-black tracking-tighter italic text-purple-400 uppercase">Admin Panel</h2>
               <button onClick={() => setShowAdmin(false)} className="w-10 h-10 flex items-center justify-center bg-white/10 rounded-full text-2xl hover:bg-red-500 transition-all">&times;</button>
            </div>
            
            <div className="overflow-x-auto mb-10 rounded-2xl bg-black/20 p-4 border border-white/5">
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
                    <input type="file" accept="image/*,video/*" onChange={(e) => setSelectedFile(e.target.files[0])} className="flex-1 text-sm file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:bg-purple-600 file:text-white p-2 border border-dashed border-white/20 rounded-2xl bg-white/5" />
                    <button onClick={handleUploadImage} className="bg-purple-600 text-white px-8 py-2 rounded-2xl font-black hover:bg-purple-700 transition-all">Upload</button>
                </div>
                <div className="grid grid-cols-3 md:grid-cols-4 gap-2">
                    {dbImages.map((img) => (
                        <div key={img._id} className="relative group aspect-square rounded-xl overflow-hidden border border-white/10 bg-black/40">
                             <img src={img.imageUrl} className="w-full h-full object-cover" />
                             <button onClick={() => deleteImage(img._id)} className="absolute inset-0 bg-red-600/80 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-all text-xs font-black">DELETE</button>
                        </div>
                    ))}
                </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// --- Home Component ---
function Home({ staticPhotos, setSelectedMedia }) {
  return (
    <div className="max-w-7xl mx-auto space-y-16">
      <header className="text-center space-y-4">
        <h1 className="text-6xl md:text-8xl font-black italic tracking-tighter uppercase leading-[0.8] text-white">Luxury <br/> <span className="text-purple-400">Design</span></h1>
        <p className="text-[10px] md:text-xs uppercase tracking-[0.4em] font-bold opacity-60">High-End Custom Fashion & Style</p>
      </header>
      
      <div className="columns-2 md:columns-3 lg:columns-4 gap-4 space-y-4">
        {staticPhotos.slice(0, 8).map((img, i) => (
          <div key={i} className="rounded-[20px] overflow-hidden border border-white/10 hover:border-purple-400/50 transition-all group cursor-zoom-in" onClick={() => setSelectedMedia(img)}>
            <img src={img} className="w-full group-hover:scale-110 transition-transform duration-700" alt="Fashion" />
          </div>
        ))}
      </div>
    </div>
  );
}

// --- Gallery Component ---
function Gallery({ dbImages, staticPhotos, staticVideos, isVideo, setSelectedMedia }) {
  return (
    <div className="max-w-7xl mx-auto space-y-12">
      <h2 className="text-4xl font-black italic tracking-tighter text-purple-400">OUR COLLECTION</h2>
      
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {/* ዳታቤዝ ውስጥ ያሉ ፎቶዎች */}
        {dbImages.map((img) => (
          <div key={img._id} className="aspect-[3/4] rounded-2xl overflow-hidden border border-white/10 group cursor-zoom-in" onClick={() => setSelectedMedia(img.imageUrl)}>
            <img src={img.imageUrl} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" alt="Gallery" />
          </div>
        ))}

        {/* ቪዲዮዎች */}
        {staticVideos.map((vid, i) => (
          <div key={i} className="aspect-[3/4] rounded-2xl overflow-hidden border border-white/10 bg-black/20 group relative cursor-zoom-in" onClick={() => setSelectedMedia(vid)}>
            <video src={vid} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" muted loop onMouseOver={e => e.target.play()} onMouseOut={e => e.target.pause()} />
            <div className="absolute top-4 right-4 bg-black/40 backdrop-blur-md p-2 rounded-full border border-white/10">🎬</div>
          </div>
        ))}

        {/* ስታቲክ ፎቶዎች */}
        {staticPhotos.map((img, i) => (
          <div key={i} className="aspect-[3/4] rounded-2xl overflow-hidden border border-white/10 group cursor-zoom-in" onClick={() => setSelectedMedia(img)}>
            <img src={img} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" alt="Static" />
          </div>
        ))}
      </div>
    </div>
  );
}

// --- Order Page Component (የቀድሞው እንዳለ) ---
function OrderPage() {
    return (
        <div className="max-w-2xl mx-auto bg-white/5 backdrop-blur-3xl p-10 rounded-[40px] border border-white/10 text-center">
            <h2 className="text-4xl font-black italic tracking-tighter text-purple-400 mb-6 uppercase">Order Now</h2>
            <p className="opacity-70 mb-10 text-sm tracking-wide">ትዕዛዝ ለመስጠት ወይም መረጃ ለመጠየቅ ከታች ያሉትን አማራጮች ይጠቀሙ።</p>
            <div className="space-y-4">
                <a href="https://t.me" className="block w-full py-5 bg-white/10 hover:bg-white/20 rounded-2xl border border-white/10 font-bold transition-all uppercase tracking-widest text-xs">Telegram Contact</a>
                <a href="tel:+251912345678" className="block w-full py-5 bg-purple-600 hover:bg-purple-700 rounded-2xl font-bold transition-all uppercase tracking-widest text-xs shadow-xl shadow-purple-900/20">Call Us</a>
            </div>
        </div>
    );
}
