import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import axios from 'axios';

const app = express();
app.use(cors());
app.use(express.json());

// 1. ቁልፉን እዚህ ጋር በቀጥታ አስገብተነዋል (ለሙከራ ብቻ)
const CHAPA_SECRET_KEY = process.env.CHAPA_SECRET_KEY;

// --- Multer Setup ---
const uploadDir = 'uploads';
if (!fs.existsSync(uploadDir)) { fs.mkdirSync(uploadDir); }
const storage = multer.diskStorage({
    destination: (req, file, cb) => { cb(null, 'uploads/'); },
    filename: (req, file, cb) => { cb(null, Date.now() + path.extname(file.originalname)); }
});
const upload = multer({ storage: storage });
app.use('/uploads', express.static('uploads'));

// --- MongoDB ---
// ማሳሰቢያ፡ እዚህ ጋር የራስህን MONGODB_URI ማስገባትህን እርግጠኛ ሁን
mongoose.connect("your_mongodb_connection_string_here") 
    .then(() => console.log('✅ MongoDB Connected'))
    .catch(err => console.error('❌ DB Error:', err));

const Order = mongoose.model('Order', new mongoose.Schema({
    customerName: String, productName: String, amount: String, tx_ref: String, date: { type: Date, default: Date.now }
}));

const Gallery = mongoose.model('Gallery', new mongoose.Schema({
    imageUrl: String, date: { type: Date, default: Date.now }
}));

// --- Chapa Payment Route ---
app.post('/api/pay', async (req, res) => {
    const { amount, customerName, productName } = req.body;
    const tx_ref = `lilmoo-${Date.now()}`;

    try {
        const response = await axios.post(
            'https://api.chapa.co/v1/transaction/initialize',
            {
                amount: amount.toString(), // መጠን የግድ String መሆን አለበት
                currency: 'ETB',
                email: 'test@gmail.com', // ለማንኛውም ደንበኛ የሚሰራ የሙከራ ኢሜይል
                first_name: customerName,
                tx_ref: tx_ref,
                callback_url: "https://aviation-backend-g75i.onrender.com/api/verify-payment",
                return_url: "https://lilmoo-design.vercel.app/success",
                "customization[title]": "Lilmoo Design",
            },
            {
                headers: {
                    Authorization: `Bearer ${CHAPA_SECRET_KEY}`,
                    'Content-Type': 'application/json'
                }
            }
        );

        if (response.data.status === 'success') {
            const newOrder = new Order({ customerName, productName, amount, tx_ref });
            await newOrder.save();
            res.json({ checkout_url: response.data.data.checkout_url });
        } else {
            res.status(400).json({ error: "Chapa returned failure status" });
        }
    } catch (err) {
        // ስህተት ካለ በ Render Logs ላይ በግልጽ እንዲታይ
        console.error("Chapa Error Details:", err.response?.data || err.message);
        res.status(500).json({ error: "ክፍያ ማስጀመር አልተቻለም" });
    }
});

// --- Other Routes (Gallery & Orders) ---
app.get('/api/gallery', async (req, res) => { try { res.json(await Gallery.find().sort({ date: -1 })); } catch(e){res.json([]);} });
app.post('/api/gallery', upload.single('image'), async (req, res) => {
    const imageUrl = `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}`;
    const newImg = new Gallery({ imageUrl });
    await newImg.save(); res.status(201).json(newImg);
});
app.delete('/api/gallery/:id', async (req, res) => { await Gallery.findByIdAndDelete(req.params.id); res.json({ success: true }); });
app.get('/api/orders', async (req, res) => { try { res.json(await Order.find().sort({ date: -1 })); } catch(e){res.json([]);} });
app.delete('/api/orders/:id', async (req, res) => { await Order.findByIdAndDelete(req.params.id); res.json({ success: true }); });

const PORT = process.env.PORT || 10000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));