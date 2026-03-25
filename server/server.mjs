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
    customerName: String, productName: String, quantity: { type: Number, default: 1 }, date: { type: Date, default: Date.now }
}));
const Gallery = mongoose.model('Gallery', new mongoose.Schema({
    imageUrl: { type: String, required: true }, createdAt: { type: Date, default: Date.now }
}));

// --- ROUTES ---

// 1. Get Orders
app.get('/api/orders', async (req, res) => {
    try { res.json(await Order.find().sort({ date: -1 })); } catch (err) { res.status(500).send(err); }
});

// 2. Delete from Gallery
app.delete('/api/gallery/:id', async (req, res) => {
    try { await Gallery.findByIdAndDelete(req.params.id); res.json({ success: true }); } catch (err) { res.status(500).send(err); }
});

// 3. New Order & Telegram Notify
app.post('/api/orders', async (req, res) => {
    try {
        const { customerName, productName, quantity } = req.body;
        const newOrder = new Order({ customerName, productName, quantity: quantity || 1 });
        await newOrder.save();
        
        if(process.env.TELEGRAM_BOT_TOKEN && process.env.TELEGRAM_CHAT_ID) {
            const msg = `👗 አዲስ ትዕዛዝ!\n👤 ስም: ${customerName}\n📦 እቃ: ${productName}`;
            await axios.post(`https://api.telegram.org/bot${process.env.TELEGRAM_BOT_TOKEN}/sendMessage`, { chat_id: process.env.TELEGRAM_CHAT_ID, text: msg });
        }
        res.status(201).json({ success: true });
    } catch (err) { res.status(500).send(err); }
});

// 4. Chapa Payment (ይህ አዲሱ ክፍል ነው)
app.post('/api/pay', async (req, res) => {
    try {
        const { amount, email, first_name, last_name, tx_ref } = req.body;
        const response = await axios.post('https://api.chapa.co/v1/transaction/initialize', {
            amount, currency: 'ETB', email, first_name, last_name, tx_ref,
            callback_url: "https://github.com/abrhamman825",
            customization: { title: 'Lilmoo Design Payment', description: 'Payment for clothes' }
        }, {
            headers: { Authorization: `Bearer ${process.env.CHAPA_SECRET_KEY}` }
        });
        res.json(response.data);
    } catch (error) {
        res.status(500).json({ message: "Payment initialization failed" });
    }
});

// 5. Gallery Routes
app.post('/api/gallery', async (req, res) => {
    const newImg = new Gallery({ imageUrl: req.body.imageUrl });
    await newImg.save();
    res.json(newImg);
});
app.get('/api/gallery', async (req, res) => {
    res.json(await Gallery.find().sort({ createdAt: -1 }));
});

const PORT = process.env.PORT || 10000;
app.listen(PORT, '0.0.0.0', () => console.log(`🚀 Server on port ${PORT}`));