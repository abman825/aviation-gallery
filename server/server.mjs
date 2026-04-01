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

// --- 2. Cloudinary Configuration (.env ላይ ባለው ስም መሰረት) ---
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

// --- 4. API Routes ---

// Gallery: Get All
app.get('/api/gallery', async (req, res) => {
  try {
    const images = await Gallery.find().sort({ _id: -1 });
    res.json(images);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Gallery: Upload
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

// Gallery: Delete
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

// Orders: Get All
app.get('/api/orders', async (req, res) => {
  try {
    const orders = await Order.find().sort({ _id: -1 });
    res.json(orders);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Payment: Chapa Initialize (ቴሌግራም ተወግዷል)
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
      res.json(chapaRes.data.data);
    }
  } catch (err) {
    res.status(500).json({ error: "Payment failed" });
  }
});

// Success Page
app.get('/api/success', (req, res) => {
  res.send(`
    <html>
      <body style="text-align:center; padding:100px; font-family:sans-serif;">
        <h1 style="color:#28a745;">✓ ክፍያዎ ተፈጽሟል!</h1>
        <a href="https://aviation-gallery.vercel.app/">ወደ ድህረ ገጽ ተመለስ</a>
      </body>
    </html>
  `);
});

// --- 5. Server & DB Connection ---
const PORT = process.env.PORT || 10000;

mongoose.connect(process.env.MONGODB_URI)
  .then(() => {
    console.log("✅ Connected to MongoDB Successfully");
    app.listen(PORT, '0.0.0.0', () => {
      console.log(`🚀 Server running on port ${PORT}`);
    });
  })
  .catch(err => {
    console.error("❌ DB Connection Error:", err.message);
  });