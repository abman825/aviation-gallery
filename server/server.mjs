import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();
const app = express();
const PORT = process.env.PORT || 10000;

// --- CORS Configuration ---
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'DELETE', 'PUT', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());

// --- Database Model (lilmoo ለሚለው DB እንዲሆን) ---
// ማሳሰቢያ፡ mongoose.connect ላይ መጨረሻው ላይ /lilmoo ስላለ እዚህ ጋር በቂ ነው
const Gallery = mongoose.model('Gallery', new mongoose.Schema({ 
  imageUrl: String,
  publicId: String 
}));

const Order = mongoose.model('Order', new mongoose.Schema({ 
  customerName: String, 
  productName: String, 
  status: { type: String, default: 'pending' }, 
  tx_ref: String,
  createdAt: { type: Date, default: Date.now }
}));

// --- Routes ---
app.get('/', (req, res) => {
  const dbStatus = mongoose.connection.readyState === 1 ? "Connected" : "Disconnected";
  res.send(`Server is LIVE! Database (${dbStatus})`);
});
// ለሪአክቱ App.jsx መረጃ እንዲያገኝ
app.get('/api/gallery', async (req, res) => {
  try {
    const images = await Gallery.find().sort({ _id: -1 });
    res.json(images);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
// --- Server & DB Connection ---
// ሰርቨሩ መጀመሪያ ይነሳል (Render 'Live' እንዲለው)
app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Server running on port ${PORT}`);
  
  // ከዚያ ዳታቤዙን ለማገናኘት ይሞክራል
  mongoose.connect(process.env.MONGODB_URI)
    .then(() => {
      console.log("✅ MongoDB Connected: Database is 'lilmoo'");
    })
    .catch(err => {
      console.error("❌ DB Connection Error:", err.message);
    });
});