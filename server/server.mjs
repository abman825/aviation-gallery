import 'dotenv/config'; 
import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import axios from 'axios';

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

// Gallery Schema
const gallerySchema = new mongoose.Schema({
    imageUrl: { type: String, required: true },
    createdAt: { type: Date, default: Date.now }
});
const Gallery = mongoose.model('Gallery', gallerySchema);

// --- ROUTES ---

// 1. ትዕዛዞችን ለማየት (Admin)
app.get('/api/orders', async (req, res) => {
    try {
        const orders = await Order.find().sort({ date: -1 });
        res.status(200).json(orders);
    } catch (error) {
        res.status(500).json({ success: false, message: "መረጃ ማግኘት አልተቻለም" });
    }
});

// 2. ምስልን ከGallery ለመሰረዝ (Delete Route)
app.delete('/api/gallery/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const deletedImage = await Gallery.findByIdAndDelete(id);
        if (!deletedImage) {
            return res.status(404).json({ success: false, message: "ምስሉ ዳታቤዝ ውስጥ አልተገኘም" });
        }
        res.status(200).json({ success: true, message: "ምስሉ በትክክል ተሰርዟል!" });
    } catch (error) {
        res.status(500).json({ success: false, message: "በሰርቨር ስህተት ምክንያት መሰረዝ አልተቻለም" });
    }
});

// 3. ትዕዛዝ መቀበል እና ለTelegram መላክ
app.post('/api/orders', async (req, res) => {
    try {
        const { customerName, productName, quantity } = req.body;
        const newOrder = new Order({ customerName, productName, quantity: quantity || 1 });
        await newOrder.save();

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

// 4. አዲስ ምስል መመዝገብ
app.post('/api/gallery', async (req, res) => {
    try {
        const { imageUrl } = req.body;
        if (!imageUrl) return res.status(400).json({ message: "Image URL is required" });
        const newImage = new Gallery({ imageUrl });
        await newImage.save();
        res.status(201).json({ success: true, data: newImage });
    } catch (error) {
        res.status(500).json({ success: false, message: "ምስሉን መመዝገብ አልተቻለም" });
    }
});

// 5. ሁሉንም ምስሎች ማውጣት
app.get('/api/gallery', async (req, res) => {
    try {
        const images = await Gallery.find().sort({ createdAt: -1 });
        res.status(200).json(images);
    } catch (error) {
        res.status(500).json({ success: false, message: "ምስሎችን ማግኘት አልተቻለም" });
    }
});

const PORT = process.env.PORT || 10000;
app.listen(PORT, '0.0.0.0', () => {
    console.log(`🚀 ሰርቨሩ በፖርት ${PORT} ላይ እየሰራ ነው`);
});