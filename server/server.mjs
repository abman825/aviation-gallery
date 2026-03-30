import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import multer from 'multer';
import { v2 as cloudinary } from 'cloudinary';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import axios from 'axios';
import dotenv from 'dotenv';

// .env ፋይልን ለማንበብ
dotenv.config();

const app = express();

// --- 1. Middleware ---
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));
app.use(cors());

// Cloudinary Configuration
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

// --- 2. Multer & Cloudinary Storage ---
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'lilmoo-gallery',
    resource_type: 'auto',
    allowed_formats: ['jpg', 'png', 'jpeg', 'mp4', 'mov', 'webm']
  },
});

const upload = multer({ 
  storage: storage,
  limits: { fileSize: 50 * 1024 * 1024 } 
});

// --- 3. Database Schemas ---
const GallerySchema = new mongoose.Schema({
  imageUrl: { type: String, required: true },
  publicId: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
});
const Gallery = mongoose.model('Gallery', GallerySchema);

const OrderSchema = new mongoose.Schema({
  customerName: String,
  productName: String,
  amount: Number,
  status: { type: String, default: 'pending' },
  tx_ref: { type: String, unique: true },
  createdAt: { type: Date, default: Date.now }
});
const Order = mongoose.model('Order', OrderSchema);

// --- 4. Gallery Routes ---

app.post('/api/gallery', upload.single('image'), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ message: "እባክዎ ፋይል ይምረጡ!" });
    
    const newMedia = new Gallery({
      imageUrl: req.file.path,
      publicId: req.file.filename
    });
    
    await newMedia.save();
    res.status(201).json(newMedia);
  } catch (err) {
    res.status(500).json({ message: "Upload Error", error: err.message });
  }
});

app.get('/api/gallery', async (req, res) => {
  try {
    const items = await Gallery.find().sort({ createdAt: -1 });
    res.json(items);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.delete('/api/gallery/:id', async (req, res) => {
  try {
    const item = await Gallery.findById(req.params.id);
    if (!item) return res.status(404).json({ message: "ፋይሉ አልተገኘም" });

    if (item.publicId) {
      const isVideo = item.imageUrl.match(/\.(mp4|mov|webm)$/i);
      await cloudinary.uploader.destroy(item.publicId, { 
        resource_type: isVideo ? 'video' : 'image' 
      });
    }

    await Gallery.findByIdAndDelete(req.params.id);
    res.json({ message: "ተሰርዟል" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// --- 5. Payment & Telegram Routes ---

app.post('/api/pay', async (req, res) => {
  const { customerName, productName, amount } = req.body;
  const tx_ref = `tx-${Date.now()}`;

  try {
    const chapaResponse = await axios.post('https://api.chapa.co/v1/transaction/initialize', {
      amount,
      currency: 'ETB',
      email: 'customer@gmail.com',
      first_name: customerName,
      last_name: productName,
      tx_ref,
      callback_url: "https://aviation-backend-g75i.onrender.com/api/verify",
      return_url: "http://localhost:5173/success" 
    }, {
      headers: { Authorization: `Bearer ${process.env.CHAPA_SECRET_KEY}` }
    });

    const newOrder = new Order({ customerName, productName, amount, tx_ref });
    await newOrder.save();

    const msg = `🔔 **አዲስ ትዕዛዝ!**\n👤 ስም: ${customerName}\n👗 አይነት: ${productName}\n💰 ዋጋ: ${amount} ETB`;
    await axios.post(`https://api.telegram.org/bot${process.env.TELEGRAM_BOT_TOKEN}/sendMessage`, {
      chat_id: process.env.TELEGRAM_CHAT_ID,
      text: msg,
      parse_mode: 'Markdown'
    });

    res.json(chapaResponse.data.data);
  } catch (err) {
    res.status(500).json({ error: "የክፍያ ሂደት መጀመር አልተቻለም" });
  }
});

// --- 6. Server Start ---
const PORT = process.env.PORT || 5000;

mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
  })
  .catch(err => console.error("❌ DB Error:", err));