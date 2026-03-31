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

app.use(express.json());
app.use(cors());

// --- Cloudinary Configuration ---
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

const storage = new CloudinaryStorage({
  cloudinary,
  params: { 
    folder: 'lilmoo', 
    resource_type: 'auto' // ይህ ፎቶንም ቪዲዮንም እንዲቀበል ያደርገዋል
  }
});
const upload = multer({ storage });

// --- Database Models ---
const GallerySchema = new mongoose.Schema({ imageUrl: String, publicId: String });
const Gallery = mongoose.model('Gallery', GallerySchema);

const OrderSchema = new mongoose.Schema({ 
  customerName: String, 
  productName: String, 
  status: { type: String, default: 'pending' }, 
  tx_ref: String,
  createdAt: { type: Date, default: Date.now }
});
const Order = mongoose.model('Order', OrderSchema);

// --- Telegram Bot Function ---
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
    } catch (err) { console.error("Telegram Error:", err.message); }
  }
};

// --- API Routes ---

// 1. Gallery Routes
app.get('/api/gallery', async (req, res) => {
  try {
    const images = await Gallery.find().sort({ _id: -1 });
    res.json(images);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

app.post('/api/gallery', upload.single('image'), async (req, res) => {
  try {
    const item = await Gallery.create({ 
      imageUrl: req.file.path, 
      publicId: req.file.filename 
    });
    res.json(item);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// ፋይል ከመረጃ ቋት እና ከ Cloudinary ለመሰረዝ
app.delete('/api/gallery/:id', async (req, res) => {
  try {
    const item = await Gallery.findById(req.params.id);
    if (item && item.publicId) {
      await cloudinary.uploader.destroy(item.publicId); // ከ Cloudinary ይሰርዘዋል
    }
    await Gallery.findByIdAndDelete(req.params.id); // ከመረጃ ቋት ይሰርዘዋል
    res.json({ message: "Deleted successfully" });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// 2. Order Routes
app.get('/api/orders', async (req, res) => {
  try {
    const orders = await Order.find().sort({ _id: -1 });
    res.json(orders);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

app.delete('/api/orders/:id', async (req, res) => {
  try {
    await Order.findByIdAndDelete(req.params.id);
    res.json({ message: "Order deleted" });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// 3. Payment Route (Chapa)
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
      callback_url: "https://aviation-backend-g75i.onrender.com/api/verify", // ክፍያው ሲጠናቀቅ ቻፓ የሚነግረን
      return_url: "https://aviation-backend-g75i.onrender.com/api/success"
    }, {
      headers: { Authorization: `Bearer ${process.env.CHAPA_SECRET_KEY}` }
    });

    if (chapaRes.data.status === 'success') {
      await Order.create({ customerName, productName, tx_ref });
      
      // ቴሌግራም ላይ መልዕክት እንዲልክልህ
      await sendTelegramTab(`🛍 <b>አዲስ ትዕዛዝ ገብቷል!</b>\n\n👤 ስም: ${customerName}\n👗 አይነት: ${productName}\n💰 ብር: ${amount} ETB`);
      
      res.json(chapaRes.data.data);
    }
  } catch (err) {
    res.status(500).json({ error: "Payment init failed" });
  }
});

// Success Page Route
app.get('/api/success', (req, res) => {
  res.send(`
    <html>
      <body style="text-align:center; padding:100px; font-family:sans-serif; background-color:#f4f4f9;">
        <div style="background:white; padding:50px; border-radius:20px; display:inline-block; shadow: 0 4px 6px rgba(0,0,0,0.1);">
          <h1 style="color:#28a745; font-size:40px;">✓ ክፍያዎ ተፈፅሟል!</h1>
          <p style="font-size:18px; color:#555;">ትዕዛዝዎን በትክክል ተቀብለናል፣ እናመሰግናለን።</p>
          <br>
          <a href="https://aviation-gallery.vercel.app/" style="padding:15px 30px; background:#6366f1; color:white; text-decoration:none; border-radius:12px; font-weight:bold;">ወደ ድህረ ገጹ ተመለስ</a>
        </div>
      </body>
    </html>
  `);
});

// --- Server & Database Connection ---
const PORT = process.env.PORT || 10000;
const MONGO_URI = process.env.MONGODB_URI;

mongoose.connect(MONGO_URI)
  .then(() => {
    console.log("🔥 Connected to MongoDB");
    app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
  })
  .catch(err => console.error("MongoDB Connection Error:", err));