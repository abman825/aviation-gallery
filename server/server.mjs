import 'dotenv/config'; 
import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';

const app = express();
app.use(express.json());
app.use(cors());

// የዳታቤዝ ግንኙነት (ከ Render Environment Variables ስሙን ያነባል)
const mongoDBURI = process.env.MONGODB_URI; 

if (!mongoDBURI) {
    console.error('❌ ስህተት: MONGODB_URI አልተገኘም! Render ላይ Environment Variable መኖሩን አረጋግጥ።');
}

mongoose.connect(mongoDBURI)
    .then(() => console.log('✅ MongoDB Atlas ተገናኝቷል!'))
    .catch(err => {
        console.error('❌ የዳታቤዝ ስህተት ዝርዝር:', err.message);
    });

// ትዕዛዝ መቀበያ API
app.post('/api/orders', async (req, res) => {
    try {
        const { name, orderType } = req.body;
        console.log(`ትዕዛዝ ደርሷል: ${name} - ${orderType}`);
        res.status(201).json({ success: true, message: "ትዕዛዝህ ተመዝግቧል!" });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

const PORT = process.env.PORT || 10000;
app.listen(PORT, '0.0.0.0', () => {
    console.log(`🚀 ሰርቨሩ በፖርት ${PORT} ላይ እየሰራ ነው`);
});