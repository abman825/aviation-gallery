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

// --- 1. CORS Configuration ---
app.use(cors({
  origin: '*', 
  methods: ['GET', 'POST', 'DELETE', 'PUT', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());

// --- 2. Cloudinary Configuration ---
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

const storage = new CloudinaryStorage({
  cloudinary,
  params: { 
    folder: 'lilmoo', 
    resource_type: 'auto' 
  }
});
const upload = multer({ storage });

// --- 3. Database Models ---
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

// --- 4. Telegram Bot Function ---
const sendTelegramTab = async (message) => {
  const token = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;
  if (token && chatId) {
    try {
      await axios.post(`https://api.telegram.org/bot${token}/sendMessage`, {
        chat_id: chatId,
        text: message,
        parse_mode: 'HTML'
      });
    } catch (err) {
      console.error("Telegram Error:", err.message);
    }
  }
};

// --- 5. API Routes ---
app.get('/api/gallery', async (req, res) => {
  try {
    const images = await Gallery.find().sort({ _id: -1 });
    res.json(images);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/gallery', upload.single('image'), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ error: "No file uploaded" });
    const item = await Gallery.create({ 
      imageUrl: req.file.path, 
      publicId: req.file.filename 
    });
    res.json(item);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.delete('/api/gallery/:id', async (req, res) => {
  try {
    const item = await Gallery.findById(req.params.id);
    if (item && item.publicId) {
      await cloudinary.uploader.destroy(item.publicId);
    }
    await Gallery.findByIdAndDelete(req.params.id);
    res.json({ message: "Deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/api/orders', async (req, res) => {
  try {
    const orders = await Order.find().sort({ _id: -1 });
    res.json(orders);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/pay', async (req, res) => {
  const { customerName, productName, amount } = req.body;
  const tx_ref = `tx-${Date.now()}`;
  try {
    const chapaRes = await axios.post('https://api.chapa.co/v1/transaction/initialize', {
      amount,
      currency: 'ETB',
      email: 'customer@lilmoo.com',
      first_name: customerName,
      last_name: productName,
      tx_ref,
      return_url: "https://aviation-backend-g75i.onrender.com/api/success"
    }, {
      headers: { Authorization: `Bearer ${process.env.CHAPA_SECRET_KEY}` }
    });

    if (chapaRes.data.status === 'success') {
      await Order.create({ customerName, productName, tx_ref });
      await sendTelegramTab(`🛍 <b>አዲስ ትዕዛዝ!</b>\n👤 ስም: ${customerName}\n💰 ብር: ${amount} ETB`);
      res.json(chapaRes.data.data);
    }
  } catch (err) {
    res.status(500).json({ error: "Payment failed" });
  }
});

// --- 6. የተስተካከለ የ Server Start Logic ---
const PORT = process.env.PORT || 10000;

const startServer = async () => {
  try {
    // Render የ IP block እንዳያደርግብህ 0.0.0.0/0 መክፈትህን አረጋግጫለሁ
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("✅ Connected to MongoDB Successfully");

    app.listen(PORT, '0.0.0.0', () => {
      console.log(`🚀 Server running on port ${PORT}`);
    });
  } catch (err) {
    console.error("❌ DB Connection Error:", err.message);
    process.exit(1); 
  }
};

startServer();