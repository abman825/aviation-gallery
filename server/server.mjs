import 'dotenv/config'; 
import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';

const app = express();

// --- 1. Middleware ---
app.use(cors());
app.use(express.json());

// --- 2. MongoDB Connection ---
mongoose.connect(process.env.MONGODB_URI)
    .then(() => console.log('✅ MongoDB Connected'))
    .catch(err => console.error('❌ DB Error:', err));

// --- 3. Models ---

// Order Model
const OrderSchema = new mongoose.Schema({
    customerName: String, 
    productName: String, 
    quantity: { type: String, default: "1" }, 
    date: { type: Date, default: Date.now }
});
const Order = mongoose.model('Order', OrderSchema);

// Gallery Model
const GallerySchema = new mongoose.Schema({
    imageUrl: String,
    date: { type: Date, default: Date.now }
});
const Gallery = mongoose.model('Gallery', GallerySchema);

// --- 4. ROUTES ---

// --- A. Gallery Routes ---

// 1. ሁሉንም የጋለሪ ፎቶዎች ለማምጣት (ይህ በጣም አስፈላጊ ነው!)
app.get('/api/gallery', async (req, res) => {
    try {
        const images = await Gallery.find().sort({ date: -1 });
        res.json(images);
    } catch (err) {
        res.status(500).json({ error: "ፎቶዎችን ማምጣት አልተቻለም" });
    }
});

// 2. አዲስ ፎቶ ለመጫን
app.post('/api/gallery', async (req, res) => {
    try {
        const { imageUrl } = req.body;
        if (!imageUrl) return res.status(400).json({ error: "Image URL ያስፈልጋል" });
        
        const newImage = new Gallery({ imageUrl });
        await newImage.save();
        res.status(201).json(newImage);
    } catch (err) {
        res.status(500).json({ error: "ፎቶ መጫን አልተቻለም" });
    }
});

// 3. ፎቶ ለመሰረዝ
app.delete('/api/gallery/:id', async (req, res) => {
    try {
        await Gallery.findByIdAndDelete(req.params.id);
        res.json({ success: true, message: "ፎቶ ተሰርዟል" });
    } catch (err) {
        res.status(500).json({ error: "መሰረዝ አልተቻለም" });
    }
});

// --- B. Order Routes ---

// 1. አዲስ ትዕዛዝ ለመቀበል
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

// 2. ሁሉንም ትዕዛዞች ለማየት (ለአድሚን)
app.get('/api/orders', async (req, res) => {
    try {
        const orders = await Order.find().sort({ date: -1 });
        res.json(orders);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// 3. ትዕዛዝ ለመሰረዝ (ለአድሚን)
app.delete('/api/orders/:id', async (req, res) => {
    try {
        await Order.findByIdAndDelete(req.params.id);
        res.json({ success: true, message: "ትዕዛዙ ተሰርዟል" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// --- 5. Server Start ---
const PORT = process.env.PORT || 10000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));