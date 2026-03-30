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

// C. SUCCESS ROUTE (በሚያምር ዲዛይን)
app.get('/api/success', (req, res) => {
  res.send(`
    <!DOCTYPE html>
    <html lang="am">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>ክፍያ ተሳክቷል</title>
        <style>
            body {
                font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
                background-color: #f4f7f6;
                display: flex;
                justify-content: center;
                align-items: center;
                height: 100vh;
                margin: 0;
            }
            .card {
                background: white;
                padding: 40px;
                border-radius: 20px;
                box-shadow: 0 10px 25px rgba(0,0,0,0.1);
                text-align: center;
                max-width: 400px;
                width: 90%;
                animation: slideUp 0.5s ease-out;
            }
            @keyframes slideUp {
                from { opacity: 0; transform: translateY(20px); }
                to { opacity: 1; transform: translateY(0); }
            }
            .icon-circle {
                width: 80px;
                height: 80px;
                background-color: #28a745;
                border-radius: 50%;
                display: flex;
                justify-content: center;
                align-items: center;
                margin: 0 auto 20px;
                box-shadow: 0 4px 15px rgba(40, 167, 69, 0.3);
            }
            .checkmark {
                color: white;
                font-size: 50px;
                font-weight: bold;
            }
            h1 {
                color: #2c3e50;
                margin-bottom: 10px;
                font-size: 24px;
            }
            p {
                color: #7f8c8d;
                line-height: 1.6;
                margin-bottom: 30px;
            }
            .btn {
                background: linear-gradient(135deg, #007bff, #0056b3);
                color: white;
                padding: 14px 28px;
                text-decoration: none;
                border-radius: 30px;
                font-weight: 600;
                transition: all 0.3s ease;
                display: inline-block;
                box-shadow: 0 4px 15px rgba(0, 123, 255, 0.3);
            }
            .btn:hover {
                transform: translateY(-2px);
                box-shadow: 0 6px 20px rgba(0, 123, 255, 0.4);
                background: linear-gradient(135deg, #0056b3, #004085);
            }
        </style>
    </head>
    <body>
        <div class="card">
            <div class="icon-circle">
                <span class="checkmark">✓</span>
            </div>
            <h1>ክፍያዎ ተሳክቷል!</h1>
            <p>ስለገዙ እናመሰግናለን። ትዕዛዝዎ በስኬት ተመዝግቧል። ማንኛውንም ጥያቄ ካሎት እባክዎ ያነጋግሩን።</p>
            <a href="https://aviation-gallery.vercel.app/gallery" class="btn">ወደ ድህረ ገጽ ተመለስ</a>
        </div>
    </body>
    </html>
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