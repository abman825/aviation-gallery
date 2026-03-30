import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import multer from 'multer';
import { v2 as cloudinary } from 'cloudinary';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import axios from 'axios';
import dotenv from 'dotenv';

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

// --- 2. Storage Setup ---
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
const Gallery = mongoose.model('Gallery', new mongoose.Schema({
  imageUrl: { type: String, required: true },
  publicId: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
}));

const Order = mongoose.model('Order', new mongoose.Schema({
  customerName: String,
  productName: String,
  amount: Number,
  status: { type: String, default: 'pending' },
  tx_ref: { type: String, unique: true },
  createdAt: { type: Date, default: Date.now }
}));

// --- 4. Routes ---

// A. Gallery Upload
app.post('/api/gallery', upload.single('image'), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ message: "ፋይል አልተመረጠም!" });
    const newMedia = await Gallery.create({
      imageUrl: req.file.path,
      publicId: req.file.filename
    });
    res.status(201).json(newMedia);
  } catch (err) {
    res.status(500).json({ error: err.message });
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

// B. Payment Route (Initialize)
app.post('/api/pay', async (req, res) => {
  const { customerName, productName, amount } = req.body;
  const tx_ref = `tx-${Date.now()}`;

  try {
    const response = await axios.post('https://api.chapa.co/v1/transaction/initialize', {
      amount,
      currency: 'ETB',
      email: 'customer@gmail.com',
      first_name: customerName,
      last_name: productName,
      tx_ref,
      callback_url: "https://aviation-backend-g75i.onrender.com/api/verify",
      // ተጠቃሚው ከከፈለ በኋላ ሰርቨርህ ላይ ወዳለው የsuccess ገጽ እንዲመጣ እናደርጋለን
      return_url: "https://aviation-backend-g75i.onrender.com/api/success" 
    }, {
      headers: { Authorization: `Bearer ${process.env.CHAPA_SECRET_KEY}` }
    });

    await Order.create({ customerName, productName, amount, tx_ref });
    res.json(response.data.data);
  } catch (err) {
    console.error("Chapa Error:", err.response?.data || err.message);
    res.status(500).json({ error: "የክፍያ ስህተት ተከስቷል" });
  }
});

// C. Success Page Route (ተጠቃሚው ከክፍያ በኋላ የሚያየው)
app.get('/api/success', (req, res) => {
  res.send(`
    <div style="text-align: center; margin-top: 50px; font-family: sans-serif;">
      <h1 style="color: green;">✅ ክፍያዎ ተሳክቷል!</h1>
      <p>ስለገዙ እናመሰግናለን።</p>
      <a href="https://aviation-gallery.vercel.app/gallery" style="display: inline-block; padding: 10px 20px; background-color: #007bff; color: white; text-decoration: none; border-radius: 5px; margin-top: 20px;">ወደ ድህረ ገጽ ተመለስ</a>
    </div>
  `);
});

// D. Chapa Callback Route (ክፍያው መጠናቀቁን Chapa ለሰርቨርህ የሚያሳውቅበት)
app.post('/api/verify', async (req, res) => {
  try {
    console.log("Payment Callback Received:", req.body);
    // እዚህ ጋር የትዕዛዙን ሁኔታ (Status) ዳታቤዝ ላይ 'completed' ማድረግ ትችላለህ
    res.status(200).send("OK");
  } catch (err) {
    res.status(500).send("Callback Error");
  }
});

// --- 5. Server & Database Connection ---
const PORT = process.env.PORT || 10000;
const DB_URL = process.env.MONGODB_URI; 

if (!DB_URL) {
    console.error("❌ MONGODB_URI is missing in .env file");
    process.exit(1);
}

mongoose.connect(DB_URL)
  .then(() => {
    console.log("✅ MongoDB Connected Successfully!");
    app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
  })
  .catch(err => console.error("❌ DB Connection Error:", err));