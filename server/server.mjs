import 'dotenv/config'; 
import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import axios from 'axios';

const app = express();

// Middleware
app.use(cors()); 
app.use(express.json()); 

// MongoDB Connection
const mongoDBURI = process.env.MONGODB_URI; 
if (mongoDBURI) {
    mongoose.connect(mongoDBURI, { family: 4 })
        .then(() => console.log('✅ MongoDB Atlas connected!'))
        .catch(err => console.error('❌ DB Error:', err.message));
}

// Schemas
const Order = mongoose.model('Order', new mongoose.Schema({
    customerName: String, 
    productName: String, 
    quantity: { type: Number, default: 1 }, 
    date: { type: Date, default: Date.now }
}));

const Gallery = mongoose.model('Gallery', new mongoose.Schema({
    imageUrl: { type: String, required: true }, 
    createdAt: { type: Date, default: Date.now }
}));

// --- ROUTES ---

// 1. Get Orders
app.get('/api/orders', async (req, res) => {
    try { 
        const orders = await Order.find().sort({ date: -1 });
        res.json(orders); 
    } catch (err) { 
        res.status(500).json({ error: err.message }); 
    }
});

// 2. Delete from Gallery
app.delete('/api/gallery/:id', async (req, res) => {
    try { 
        await Gallery.findByIdAndDelete(req.params.id); 
        res.json({ success: true }); 
    } catch (err) { 
        res.status(500).json({ error: err.message }); 
    }
});

// 3. New Order & Telegram Notify (የተስተካከለ)
app.post('/api/orders', async (req, res) => {
    try {
        const { customerName, productName, quantity } = req.body;
        const newOrder = new Order({ customerName, productName, quantity: quantity || 1 });
        await newOrder.save();
        
        // Telegram Notification
        if(process.env.TELEGRAM_BOT_TOKEN && process.env.TELEGRAM_CHAT_ID) {
            const msg = `👗 አዲስ ትዕዛዝ!\n👤 ስም: ${customerName}\n📦 እቃ: ${productName}\n🔢 ብዛት: ${quantity || 1}`;
            try {
                await axios.post(`https://api.telegram.org/bot${process.env.TELEGRAM_BOT_TOKEN}/sendMessage`, { 
                    chat_id: process.env.TELEGRAM_CHAT_ID, 
                    text: msg 
                });
            } catch (teleErr) {
                console.error("Telegram Notification Failed:", teleErr.message);
            }
        }
        res.status(201).json({ success: true, order: newOrder });
    } catch (error) {
        console.error("Order Error:", error.message);
        res.status(500).json({ message: "Order creation failed", error: error.message });
    }
});

// 4. Chapa Payment Initialization
app.post('/api/pay', async (req, res) => {
    try {
        const { amount, email, first_name, last_name, tx_ref } = req.body;
        
        // Chapa API Call
        const response = await axios.post('https://api.chapa.co/v1/transaction/initialize', {
            amount, 
            currency: 'ETB', 
            email, 
            first_name, 
            last_name, 
            tx_ref,
            callback_url: "https://aviation-gallery.vercel.app/", // ድረ-ገጽህ ክፍያው ሲያልቅ የሚመለስበት ሊንክ
            customization: { 
                title: 'Lilmoo Design Payment', 
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
        console.error("Chapa Error:", error.response ? error.response.data : error.message);
        res.status(500).json({ 
            message: "Payment initialization failed", 
            error: error.response ? error.response.data : error.message 
        });
    }
});

// 5. Gallery Routes
app.post('/api/gallery', async (req, res) => {
    try {
        const newImg = new Gallery({ imageUrl: req.body.imageUrl });
        await newImg.save();
        res.json(newImg);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.get('/api/gallery', async (req, res) => {
    try {
        const gallery = await Gallery.find().sort({ createdAt: -1 });
        res.json(gallery);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

const PORT = process.env.PORT || 10000;
app.listen(PORT, '0.0.0.0', () => console.log(`🚀 Server running on port ${PORT}`));