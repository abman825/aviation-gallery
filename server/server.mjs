import 'dotenv/config'; 
import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import axios from 'axios';

const app = express();

// --- 1. CORS Fix (ሁሉንም ሪኩዌስት እንዲቀበል) ---
app.use(cors({
    origin: '*',
    methods: ['GET', 'POST', 'DELETE', 'PUT', 'PATCH'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());

// --- 2. MongoDB Connection ---
mongoose.connect(process.env.MONGODB_URI, { family: 4 })
    .then(() => console.log('✅ MongoDB Connected'))
    .catch(err => console.error('❌ DB Error:', err));

// --- 3. Models ---
const Order = mongoose.model('Order', new mongoose.Schema({
    customerName: String, productName: String, quantity: Number, date: { type: Date, default: Date.now }
}));
const Gallery = mongoose.model('Gallery', new mongoose.Schema({
    imageUrl: String, createdAt: { type: Date, default: Date.now }
}));

// --- 4. ROUTES ---

// Admin Login (Password: admin123)
app.post('/api/admin/login', (req, res) => {
    if (req.body.password === "1123") return res.json({ success: true });
    res.status(401).json({ success: false });
});

// Orders & Telegram
app.post('/api/pay', async (req, res) => {
    try {
        const { amount, email, first_name, last_name, tx_ref } = req.body;
        
        const response = await axios.post('https://api.chapa.co/v1/transaction/initialize', {
            amount,
            currency: 'ETB',
            email: email || "customer@example.com", // ትክክለኛ ኢሜይል መኖሩን ያረጋግጣል
            first_name,
            last_name,
            tx_ref,
            callback_url: "https://aviation-gallery.vercel.app/",
            customization: { 
                title: 'Lilmoo Payment', // ✅ ከ16 ፊደል እንዲያንስ ተደርጓል
                description: 'Payment for clothes' 
            }
        }, {
            headers: { 
                Authorization: `Bearer ${process.env.CHAPA_SECRET_KEY}`,
                "Content-Type": "application/json"
            }
        });
        res.json(response.data);
    } catch (error) {
        console.error("Chapa Error:", error.response?.data || error.message);
        res.status(500).json(error.response?.data || error.message);
    }
});

app.get('/api/orders', async (req, res) => {
    const orders = await Order.find().sort({ date: -1 });
    res.json(orders);
});

// Chapa Payment
app.post('/api/pay', async (req, res) => {
    try {
        const response = await axios.post('https://api.chapa.co/v1/transaction/initialize', req.body, {
            headers: { Authorization: `Bearer ${process.env.CHAPA_SECRET_KEY}` }
        });
        res.json(response.data);
    } catch (err) { res.status(500).json(err.response?.data || err.message); }
});

// Gallery (ሊንኩ በትክክል 'gallery' መሆኑን አረጋግጥ)
app.get('/api/gallery', async (req, res) => {
    const gallery = await Gallery.find().sort({ createdAt: -1 });
    res.json(gallery);
});

app.post('/api/gallery', async (req, res) => {
    const newImg = new Gallery(req.body);
    await newImg.save();
    res.json(newImg);
});

app.delete('/api/gallery/:id', async (req, res) => {
    await Gallery.findByIdAndDelete(req.params.id);
    res.json({ success: true });
});

const PORT = process.env.PORT || 10000;
app.listen(PORT, '0.0.0.0', () => console.log(`🚀 Server running on port ${PORT}`));