import 'dotenv/config'; 
import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import axios from 'axios';

const app = express();

// --- Middleware ---
app.use(cors());
app.use(express.json());

// --- Chapa Keys (ከ Chapa ያገኘሃቸው) ---
const CHAPA_SECRET_KEY = 'CHASECK_TEST-6v67vS0X9u1vB14841N43054f150n07S'; 

// --- Multer Setup (ፎቶዎችን ለመቀበል) ---
const uploadDir = 'uploads';
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir);
}

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname));
    }
});

const upload = multer({ storage: storage });
app.use('/uploads', express.static('uploads')); 

// --- MongoDB Connection ---
mongoose.connect(process.env.MONGODB_URI)
    .then(() => console.log('✅ MongoDB Connected'))
    .catch(err => console.error('❌ DB Error:', err));

// --- Models ---
const Order = mongoose.model('Order', new mongoose.Schema({
    customerName: String, 
    productName: String, 
    quantity: { type: String, default: "1" }, 
    amount: String, 
    tx_ref: String,
    date: { type: Date, default: Date.now }
}));

const Gallery = mongoose.model('Gallery', new mongoose.Schema({
    imageUrl: String,
    date: { type: Date, default: Date.now }
}));

// --- ROUTES ---

// 1. Chapa Payment Route (አዲሱ የተጨመረ)
app.post('/api/pay', async (req, res) => {
    const { amount, customerName, productName, email } = req.body;
    const tx_ref = `lilmoo-${Date.now()}`;

    try {
        const response = await axios.post(
            'https://api.chapa.co/v1/transaction/initialize',
            {
                amount: amount,
                currency: 'ETB',
                email: email || 'customer@lilmoo.com',
                first_name: customerName,
                tx_ref: tx_ref,
                callback_url: "https://aviation-backend-g75i.onrender.com/api/verify-payment",
                return_url: "https://lilmoo-design.vercel.app/success",
                "customization[title]": "Lilmoo Design Payment",
                "customization[description]": `${productName} ክፍያ`
            },
            {
                headers: {
                    Authorization: `Bearer ${CHAPA_SECRET_KEY}`,
                    'Content-Type': 'application/json'
                }
            }
        );

        if (response.data.status === 'success') {
            const newOrder = new Order({ customerName, productName, amount, tx_ref });
            await newOrder.save();
            res.json({ checkout_url: response.data.data.checkout_url });
        } else {
            res.status(400).json({ error: "ክፍያ ማስጀመር አልተቻለም" });
        }
    } catch (err) {
        res.status(500).json({ error: "የሰርቨር ስህተት" });
    }
});

// 2. ጋለሪ ማምጣት
app.get('/api/gallery', async (req, res) => {
    try {
        const images = await Gallery.find().sort({ date: -1 });
        res.json(images);
    } catch (err) {
        res.status(500).json({ error: "ፎቶዎችን ማምጣት አልተቻለም" });
    }
});

// 3. አዲስ ፎቶ መጫን
app.post('/api/gallery', upload.single('image'), async (req, res) => {
    try {
        if (!req.file) return res.status(400).json({ error: "እባክህ ፋይል ምረጥ" });
        const imageUrl = `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}`;
        const newImage = new Gallery({ imageUrl });
        await newImage.save();
        res.status(201).json(newImage);
    } catch (err) {
        res.status(500).json({ error: "ፎቶ መጫን አልተቻለም" });
    }
});

// 4. ፎቶ መሰረዝ
app.delete('/api/gallery/:id', async (req, res) => {
    try {
        await Gallery.findByIdAndDelete(req.params.id);
        res.json({ success: true, message: "ፎቶ ተሰርዟል" });
    } catch (err) {
        res.status(500).json({ error: "መሰረዝ አልተቻለም" });
    }
});

// 5. ትዕዛዞችን ማምጣት
app.get('/api/orders', async (req, res) => {
    try {
        const orders = await Order.find().sort({ date: -1 });
        res.json(orders);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// 6. ትዕዛዝ መሰረዝ
app.delete('/api/orders/:id', async (req, res) => {
    try {
        await Order.findByIdAndDelete(req.params.id);
        res.json({ success: true, message: "ትዕዛዝ ተሰርዟል" });
    } catch (err) {
        res.status(500).json({ error: "መሰረዝ አልተቻለም" });
    }
});

const PORT = process.env.PORT || 10000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));