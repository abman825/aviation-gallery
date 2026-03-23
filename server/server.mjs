import 'dotenv/config'; 
import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import axios from 'axios'; // አዲሱ መስመር

const app = express();

// Middleware
app.use(cors()); 
app.use(express.json()); 
app.use(express.urlencoded({ extended: true })); 

// የ MongoDB ግንኙነት
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

// --- የቴሌግራም መልዕክት መላኪያ Function ---
const sendTelegramNotification = async (order) => {
    const token = process.env.TELEGRAM_BOT_TOKEN;
    const chatId = process.env.TELEGRAM_CHAT_ID;

    const message = `
🛍️ **አዲስ ትዕዛዝ ደርሷል!**
-----------------------
👤 **ደንበኛ:** ${order.customerName}
📦 **ዕቃ:** ${order.productName}
🔢 **ብዛት:** ${order.quantity}
📅 **ቀን:** ${new Date(order.date).toLocaleString()}
-----------------------
Lilmoo Design - መልካም ስራ!
    `;

    try {
        await axios.post(`https://api.telegram.org/bot${token}/sendMessage`, {
            chat_id: chatId,
            text: message,
            parse_mode: 'Markdown'
        });
        console.log("🚀 የቴሌግራም መልዕክት ተልኳል!");
    } catch (error) {
        console.error("❌ ቴሌግራም ላይ መላክ አልተቻለም:", error.message);
    }
};
// ---------------------------------------

// ትዕዛዝ መቀበያ API
app.post('/api/orders', async (req, res) => {
    try {
        console.log("የመጣው ዳታ:", req.body); 

        const { customerName, productName, quantity } = req.body;

        if (!customerName || !productName) {
            return res.status(400).json({ 
                success: false, 
                message: "እባክዎ ስም እና የልብስ አይነት በትክክል ይላኩ" 
            });
        }

        // 1. ወደ ዳታቤዝ (MongoDB) ሴቭ ማድረግ
        const newOrder = new Order({
            customerName,
            productName,
            quantity: quantity || 1
        });
        const savedOrder = await newOrder.save();

        // 2. ወደ ቴሌግራም መልዕክት መላክ (አዲሱ ክፍል)
        await sendTelegramNotification(savedOrder);

        console.log(`✨ ትዕዛዝ ደርሷል፦ ${customerName} - ${productName}`);
        
        res.status(201).json({ 
            success: true, 
            message: `ተሳክቷል! ${customerName} ሆይ፣ ትዕዛዝህ ደርሶናል!` 
        });

    } catch (error) {
        console.error('❌ ስህተት:', error.message);
        res.status(500).json({ success: false, error: "ትዕዛዙን መቀበል አልተቻለም" });
    }
});

const PORT = process.env.PORT || 10000;
app.listen(PORT, '0.0.0.0', () => {
    console.log(`🚀 ሰርቨሩ በፖርት ${PORT} ላይ እየሰራ ነው`);
});