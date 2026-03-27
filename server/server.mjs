import 'dotenv/config'; 
import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import multer from 'multer';
import path from 'path';
import fs from 'fs';

const app = express();

// --- Middleware ---
app.use(cors());
app.use(express.json());

// --- Multer Setup (ፎቶዎችን ለመቀበል) ---
const uploadDir = 'uploads';
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir);
}

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname));
    }
});

const upload = multer({ storage: storage });
app.use('/uploads', express.static('uploads')); // ፎቶዎቹ በሊንክ እንዲታዩ

// --- MongoDB Connection ---
mongoose.connect(process.env.MONGODB_URI)
    .then(() => console.log('✅ MongoDB Connected'))
    .catch(err => console.error('❌ DB Error:', err));

// --- Models ---
const Order = mongoose.model('Order', new mongoose.Schema({
    customerName: String, 
    productName: String, 
    quantity: { type: String, default: "1" }, 
    date: { type: Date, default: Date.now }
}));

const Gallery = mongoose.model('Gallery', new mongoose.Schema({
    imageUrl: String,
    date: { type: Date, default: Date.now }
}));

// --- ROUTES ---

// 1. ሁሉንም የጋለሪ ፎቶዎች ማምጣት
app.get('/api/gallery', async (req, res) => {
    try {
        const images = await Gallery.find().sort({ date: -1 });
        res.json(images);
    } catch (err) {
        res.status(500).json({ error: "ፎቶዎችን ማምጣት አልተቻለም" });
    }
});

// 2. አዲስ ፎቶ በፋይል መጫን (Updated with Multer)
app.post('/api/gallery', upload.single('image'), async (req, res) => {
    try {
        if (!req.file) return res.status(400).json({ error: "እባክህ ፋይል ምረጥ" });
        
        // የፎቶውን ሙሉ ሊንክ መፍጠር
        const imageUrl = `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}`;
        
        const newImage = new Gallery({ imageUrl });
        await newImage.save();
        res.status(201).json(newImage);
    } catch (err) {
        res.status(500).json({ error: "ፎቶ መጫን አልተቻለም" });
    }
});

app.delete('/api/gallery/:id', async (req, res) => {
    try {
        await Gallery.findByIdAndDelete(req.params.id);
        res.json({ success: true, message: "ፎቶ ተሰርዟል" });
    } catch (err) {
        res.status(500).json({ error: "መሰረዝ አልተቻለም" });
    }
});

// Order Routes
app.post('/api/orders', async (req, res) => {
    try {
        const { customerName, productName, quantity } = req.body;
        const newOrder = new Order({ customerName, productName, quantity });
        await newOrder.save();
        res.status(201).json({ success: true, message: "ትዕዛዝ ተመዝግቧል!" });
    } catch (err) {
        res.status(500).json({ error: "ትዕዛዝ መላክ አልተቻለም" });
    }
});

app.get('/api/orders', async (req, res) => {
    try {
        const orders = await Order.find().sort({ date: -1 });
        res.json(orders);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

const PORT = process.env.PORT || 10000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));