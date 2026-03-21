import 'dotenv/config'; 
import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';

const app = express();

// ✅ መረጃው undefined እንዳይሆን እነዚህ በጣም አስፈላጊ ናቸው
app.use(cors()); 
app.use(express.json()); // JSON ዳታን ለመቀበል

const mongoDBURI = process.env.MONGODB_URI; 

// የዳታቤዝ ግንኙነት
if (mongoDBURI) {
    mongoose.connect(mongoDBURI, { family: 4 })
        .then(() => console.log('✅ MongoDB Atlas ተገናኝቷል!'))
        .catch(err => console.error('❌ የዳታቤዝ ስህተት:', err.message));
}

// ትዕዛዝ መቀበያ API (Undefined እንዳይሆን የተስተካከለ)
app.post('/api/orders', async (req, res) => {
    try {
        // መረጃው መድረሱን ለማረጋገጥ መጀመሪያ console ላይ እናትመዋለን
        console.log("የመጣው ዳታ:", req.body); 

        const { name, orderType } = req.body;

        // ዳታው ካልመጣ ለተጠቃሚው ስህተት መላክ
        if (!name || !orderType) {
            return res.status(400).json({ 
                success: false, 
                message: "ስም ወይም የልብስ አይነት አልተላከም (Undefined)" 
            });
        }

        console.log(`🔔 አዲስ ትዕዛዝ ደርሷል: ስም: ${name}, አይነት: ${orderType}`);
        
        // እዚህ ጋር ወደ ዳታቤዝ (MongoDB) ሴቭ ማድረግ ትችላለህ
        
        res.status(201).json({ 
            success: true, 
            message: `ተሳክቷል! ${name} ሆይ፣ ትዕዛዝህ ደርሶናል!` 
        });

    } catch (error) {
        console.error('❌ ስህተት:', error.message);
        res.status(500).json({ success: false, error: error.message });
    }
});

const PORT = process.env.PORT || 10000;
app.listen(PORT, '0.0.0.0', () => {
    console.log(`🚀 ሰርቨሩ በፖርት ${PORT} ላይ እየሰራ ነው`);
});