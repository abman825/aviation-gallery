import 'dotenv/config'; 
import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import axios from 'axios'; // አዲስ ትዕዛዝ ለቴሌግራም ለመላክ

const app = express();

// Middleware
app.use(cors()); 
app.use(express.json()); 

// MongoDB ግንኙነት
const mongoDBURI = process.env.MONGODB_URI; 
if (mongoDBURI) {
    mongoose.connect(mongoDBURI, { family: 4 })
        .then(() => console.log('✅ MongoDB Atlas ተገናኝቷል!'))
        .catch(err => console.error('❌ የዳታቤዝ ስህተት:', err.message));
}

// Order Schema
const orderSchema = new mongoose.Schema({
    customerName: String,
    productName: String,
    quantity: { type: Number, default: 1 },
    date: { type: Date, default: Date.now }
});
const Order = mongoose.model('Order', orderSchema);

// 1. ሁሉንም ትዕዛዞች ማየት (Admin)
app.get('/api/orders', async (req, res) => {
    try {
        const orders = await Order.find().sort({ date: -1 });
        res.status(200).json(orders);
    } catch (error) {
        res.status(500).json({ success: false, message: "መረጃ ማግኘት አልተቻለም" });
    }
});

// 2. ትዕዛዝ መቀበያ እና ለቴሌግራም መላኪያ
app.post('/api/orders', async (req, res) => {
    try {
        const { customerName, productName, quantity } = req.body;

        const newOrder = new Order({ customerName, productName, quantity: quantity || 1 });
        await newOrder.save();

        // --- ለቴሌግራም ቦት መልዕክት መላክ ---
        const botToken = process.env.TELEGRAM_BOT_TOKEN;
        const chatId = process.env.TELEGRAM_CHAT_ID;
        
        if(botToken && chatId) {
            const message = `👗 አዲስ ትዕዛዝ መጥቷል!\n\n👤 ስም: ${customerName}\n📦 እቃ: ${productName}\n🔢 ብዛት: ${quantity || 1}`;
            await axios.post(`https://api.telegram.org/bot${botToken}/sendMessage`, {
                chat_id: chatId,
                text: message
            });
        }

        res.status(201).json({ success: true, message: `ተሳክቷል! እናመሰግናለን ${customerName}!` });
    } catch (error) {
        res.status(500).json({ success: false, error: "ትዕዛዙ አልተሳካም" });
    }
});

const PORT = process.env.PORT || 10000;
app.listen(PORT, '0.0.0.0', () => {
    console.log(`🚀 ሰርቨሩ በፖርት ${PORT} ላይ እየሰራ ነው`);
});