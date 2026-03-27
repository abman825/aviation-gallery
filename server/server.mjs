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

// --- 3. Order Model ---
const OrderSchema = new mongoose.Schema({
    customerName: String, 
    productName: String, 
    quantity: { type: String, default: "1" }, 
    date: { type: Date, default: Date.now }
});

const Order = mongoose.model('Order', OrderSchema);

// --- 4. ROUTES ---

// ሀ. አዲስ ትዕዛዝ ለመቀበል (ከደንበኛው)
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

// ለ. ሁሉንም ትዕዛዞች ለማየት (ለአድሚን ገጽ)
app.get('/api/orders', async (req, res) => {
    try {
        const orders = await Order.find().sort({ date: -1 });
        res.json(orders);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// ሐ. ትዕዛዝ ለመሰረዝ (Admin Delete)
app.delete('/api/orders/:id', async (req, res) => {
    try {
        await Order.findByIdAndDelete(req.params.id);
        res.json({ success: true });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

const PORT = process.env.PORT || 10000;
app.listen(PORT, () => console.log(`🚀 Server on port ${PORT}`));