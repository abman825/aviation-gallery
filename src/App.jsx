import { useState } from 'react';
import './App.css';

// ምስሎችን አስመጣ (Import)
import img1 from './assets/1.jpg'; import img2 from './assets/2.jpg';
import img3 from './assets/3.jpg'; import img4 from './assets/4.jpg';
import img5 from './assets/5.jpg'; import img6 from './assets/6.jpg';
import img7 from './assets/7.jpg'; import img8 from './assets/8.jpg';
import img9 from './assets/9.jpg'; import img10 from './assets/10.jpg';
import img11 from './assets/11.jpg'; import img12 from './assets/12.jpg';

// ቪዲዮዎችን አስመጣ (Import)
import vid1 from './assets/1.mp4'; import vid2 from './assets/2.mp4';
import vid3 from './assets/3.mov'; import vid4 from './assets/4.mov';
import vid5 from './assets/5.mov'; import vid6 from './assets/6.mov';
import vid7 from './assets/7.mov'; import vid8 from './assets/8.mov';
import vid9 from './assets/8.mov'; import vid10 from './assets/10.mov';

function App() {
  const [searchTerm, setSearchTerm] = useState("");
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [category, setCategory] = useState("ሁሉም");

  const items = [
    { name: "ምስል 1", type: "image", category: "ዘመናዊ", src: img1 },
    { name: "ምስል 2", type: "image", category: "የበዓል", src: img2 },
    { name: "ምስል 3", type: "image", category: "የወንድ", src: img3 },
    { name: "ምስል 4", type: "image", category: "የልጅ", src: img4 },
    { name: "ምስል 5", type: "image", category: "ዘመናዊ", src: img5 },
    { name: "ምስል 6", type: "image", category: "የበዓል", src: img6 },
    { name: "ምስል 7", type: "image", category: "የወንድ", src: img7 },
    { name: "ምስል 8", type: "image", category: "የልጅ", src: img8 },
    { name: "ምስል 9", type: "image", category: "ዘመናዊ", src: img9 },
    { name: "ምስል 10", type: "image", category: "የበዓል", src: img10 },
    { name: "ምስል 11", type: "image", category: "የወንድ", src: img11 },
    { name: "ምስል 12", type: "image", category: "የልጅ", src: img12 },
    { name: "ቪዲዮ 1", type: "video", category: "ቪዲዮ", src: vid1 },
    { name: "ቪዲዮ 2", type: "video", category: "ቪዲዮ", src: vid2 },
    { name: "ቪዲዮ 3", type: "video", category: "ቪዲዮ", src: vid3 },
    { name: "ቪዲዮ 4", type: "video", category: "ቪዲዮ", src: vid4 },
    { name: "ቪዲዮ 5", type: "video", category: "ቪዲዮ", src: vid5 },
    { name: "ቪዲዮ 6", type: "video", category: "ቪዲዮ", src: vid6 },
    { name: "ቪዲዮ 7", type: "video", category: "ቪዲዮ", src: vid7 },
    { name: "ቪዲዮ 8", type: "video", category: "ቪዲዮ", src: vid8 },
    { name: "ቪዲዮ 10", type: "video", category: "ቪዲዮ", src: vid10 }
  ];

  const filteredItems = items.filter(item => {
    const matchesCategory = category === "ሁሉም" || item.category === category;
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const categories = ["ሁሉም", "የበዓል", "ዘመናዊ", "የወንድ", "የልጅ", "ቪዲዮ"];

  return (
    <div className="container">
      <nav className="navbar">
        <button className="nav-btn" onClick={() => window.location.reload()}>Home</button>
        <button className="nav-btn" onClick={() => setIsMenuOpen(!isMenuOpen)}>Menu ▼</button>
        {isMenuOpen && (
          <div className="dropdown-content">
            <a href="https://t.me/lilmoo_desing13" target="_blank">Telegram</a>
          </div>
        )}
        <input type="text" placeholder="Search..." onChange={(e) => setSearchTerm(e.target.value)} className="search-box" />
      </nav>

      <h1>lilmoo የሴቶች ፋሽን ጋለሪ</h1>
      
      <div className="category-filter">
        {categories.map(cat => (
          <button key={cat} onClick={() => setCategory(cat)} className={category === cat ? "active" : ""}>
            {cat}
          </button>
        ))}
      </div>

      <div className="gallery">
        {filteredItems.map((item, index) => (
          <div key={index} className="card" onClick={() => setSelectedItem(item)}>
            {item.type === "video" ? (
              <video src={item.src} width="100%" height="250px" style={{ objectFit: 'cover' }} />
            ) : (
              <img src={item.src} alt={item.name} width="100%" height="250px" style={{ objectFit: 'cover' }} />
            )}
            <h3>{item.name}</h3>
          </div>
        ))}
      </div>

      {selectedItem && (
        <div className="modal" onClick={() => setSelectedItem(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <span className="close" onClick={() => setSelectedItem(null)}>&times;</span>
            {selectedItem.type === "video" ? (
              <video src={selectedItem.src} controls autoPlay width="100%" />
            ) : (
              <img src={selectedItem.src} alt="Full view" style={{ width: '100%' }} />
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default App;