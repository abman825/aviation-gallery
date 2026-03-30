const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const multer = require('multer');
const { v2: cloudinary } = require('cloudinary');
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const axios = require('axios'); // ለ Chapa እና Telegram
require('dotenv').config();

const app = express();

// 1. ፋይል ሳይዝ ሊሚቱን መጨመር (ለቪዲዮዎች)
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));
app.use(cors());

// Cloudinary Config
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

// 2. Storage ማስተካከያ (ለፎቶ እና ለቪዲዮ)
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'lilmoo-gallery',
    resource_type: 'auto', // ቪዲዮ እና ፎቶ እንዲቀበል
    allowed_formats: ['jpg', 'png', 'jpeg', 'mp4', 'mov', 'webm']
  },
});

const upload = multer({ 
  storage: storage,
  limits: { fileSize: 50 * 1024 * 1024 } // 50MB Max
});

// --- Database Schemas ---
const GallerySchema = new mongoose.Schema({
  imageUrl: String,
  publicId: String,
  createdAt: { type: Date, default: Date.now }
});
const Gallery = mongoose.model('Gallery', GallerySchema);

const OrderSchema = new mongoose.Schema({
  customerName: String,
  productName: String,
  amount: String,
  status: { type: String, default: 'pending' },
  tx_ref: String,
  createdAt: { type: Date, default: Date.now }
});
const Order = mongoose.model('Order', OrderSchema);

// --- 1. Gallery Routes (ፎቶ/ቪዲዮ) ---
app.post('/api/gallery', upload.single('image'), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ message: "ፋይል አልተመረጠም" });
    const newMedia = new Gallery({
      imageUrl: req.file.path,
      publicId: req.file.filename
    });
    await newMedia.save();
    res.status(201).json(newMedia);
  } catch (err) {
    res.status(500).json({ message: "Upload Error" });
  }
});

app.get('/api/gallery', async (req, res) => {
  try {
    const items = await Gallery.find().sort({ createdAt: -1 });
    res.json(items);
  } catch (err) {
    res.status(500).json(err);
  }
});

app.delete('/api/gallery/:id', async (req, res) => {
  try {
    const item = await Gallery.findById(req.params.id);
    if(item && item.publicId) {
        // ቪዲዮ ከሆነ 'video' ብሎ ማጥፋት አለበት
        const isVid = item.imageUrl.match(/\.(mp4|mov|webm)$/i);
        await cloudinary.uploader.destroy(item.publicId, { resource_type: isVid ? 'video' : 'image' });
    }
    await Gallery.findByIdAndDelete(req.params.id);
    res.json({ message: "Deleted" });
  } catch (err) {
    res.status(500).json(err);
  }
});

// --- 2. Order & Chapa Routes (ያልተቀነሰ) ---
app.post('/api/pay', async (req, res) => {
  const { customerName, productName, amount } = req.body;
  const tx_ref = `tx-${Date.now()}`;

  try {
    const response = await axios.post('https://api.chapa.co/v1/transaction/initialize', {
      amount, currency: 'ETB', email: 'customer@gmail.com',
      first_name: customerName, last_name: productName,
      tx_ref, callback_url: "https://aviation-backend-g75i.onrender.com/api/verify",
      return_url: "http://localhost:5173/success" // ወይም ያንተ ዶሜን
    }, {
      headers: { Authorization: `Bearer ${process.env.CHAPA_SECRET_KEY}` }
    });

    // ትዕዛዙን ዳታቤዝ ውስጥ ማስቀመጥ
    const newOrder = new Order({ customerName, productName, amount, tx_ref });
    await newOrder.save();

    // Telegram Bot ማሳወቂያ
    const msg = `🔔 አዲስ ትዕዛዝ!\n👤 ስም: ${customerName}\n👗 አይነት: ${productName}\n💰 ዋጋ: ${amount} ETB`;
    await axios.post(`https://api.telegram.org/bot${process.env.TELEGRAM_BOT_TOKEN}/sendMessage`, {
      chat_id: process.env.TELEGRAM_CHAT_ID, text: msg
    });

    res.json(response.data.data);
  } catch (err) {
    res.status(500).json({ error: "Payment Initialization Failed" });
  }
});

app.get('/api/orders', async (req, res) => {
  try {
    const orders = await Order.find().sort({ createdAt: -1 });
    res.json(orders);
  } catch (err) {
    res.status(500).json(err);
  }
});

app.delete('/api/orders/:id', async (req, res) => {
    try {
        await Order.findByIdAndDelete(req.params.id);
        res.json({ message: "Order Deleted" });
    } catch (err) { res.status(500).json(err); }
});

// --- Server Start ---
const PORT = process.env.PORT || 5000;
mongoose.connect(process.env.MONGO_URI)
  .then(() => app.listen(PORT, () => console.log(`Server running on port ${PORT}`)))
  .catch(err => console.error("DB Connection Error:", err));