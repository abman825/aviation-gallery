import 'dotenv/config'; 
import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';

const app = express();

// Middleware - መረጃው እንዳይጠፋ ቅደም ተከተላቸውን መጠበቅ አለባቸው
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

// ለትዕዛዞች የሚሆን Schema ማዘጋጀት (ዳታቤዝ ውስጥ እንዲቀመጥ)
const orderSchema = new mongoose.Schema({
    customerName: String,
    productName: String,
    quantity: { type: Number, default: 1 },
    date: { type: Date, default: Date.now }
});

const Order = mongoose.model('Order', orderSchema);

// ትዕዛዝ መቀበያ API
app.post('/api/orders', async (req, res) => {
    try {
        // Render Logs ላይ የመጣውን መረጃ ለማየት
        console.log("የመጣው ዳታ:", req.body); 

        // ከ Frontend (Vercel) የሚመጡት ትክክለኛ ስሞች
        const { customerName, productName, quantity } = req.body;

        // መረጃው መኖሩን ማረጋገጥ
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
        await newOrder.save();

        console.log(`✨ ትዕዛዝ ደርሷል፡ ${customerName} - ${productName}`);
        
        // 2. ለተጠቃሚው መልስ መላክ
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