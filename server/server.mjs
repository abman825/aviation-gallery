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

// --- Database Connection ---
// .env ላይ ያለውን MONGODB_URI ይጠቀማል
mongoose.connect(process.env.MONGODB_URI)
    .then(() => console.log('✅ MongoDB Connected Successfully'))
    .catch(err => console.error('❌ MongoDB Connection Error:', err));

// --- Models ---
const Order = mongoose.model('Order', new mongoose.Schema({
    customerName: String,
    productName: String,
    amount: String,
    tx_ref: String,
    status: { type: String, default: 'pending' },
    date: { type: Date, default: Date.now }
}));

const Gallery = mongoose.model('Gallery', new mongoose.Schema({
    imageUrl: String,
    date: { type: Date, default: Date.now }
}));

// --- Multer Setup (ፎቶ ለመጫን) ---
const uploadDir = 'uploads';
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir);
}
const storage = multer.diskStorage({
    destination: (req, file, cb) => { cb(null, 'uploads/'); },
    filename: (req, file, cb) => { cb(null, Date.now() + path.extname(file.originalname)); }
});
const upload = multer({ storage: storage });
app.use('/uploads', express.static('uploads'));

// --- ROUTES ---

// 1. Chapa Payment & Order Placement (ዋናው ክፍል)
app.post('/api/pay', async (req, res) => {
    const { amount, customerName, productName } = req.body;
    
    // ለ Chapa የሚላክ ልዩ መለያ (Transaction Reference)
    const tx_ref = `lilmoo-${Date.now()}`;

    try {
        // .env ላይ ያለውን ቁልፍ ሲያነብ Space ካለ እንዲያጠፋ .trim() እንጠቀማለን
        const secretKey = process.env.CHAPA_SECRET_KEY ? process.env.CHAPA_SECRET_KEY.trim() : null;

        if (!secretKey) {
            throw new Error("CHAPA_SECRET_KEY is missing in Environment Variables");
        }

        const response = await axios.post(
            'https://api.chapa.co/v1/transaction/initialize',
            {
                amount: amount ? amount.toString() : "100",
                currency: 'ETB',
                email: 'customer@lilmoo.com', // የግድ መኖር አለበት
                first_name: customerName || "Guest",
                last_name: "Customer",
                tx_ref: tx_ref,
                callback_url: "https://aviation-backend-g75i.onrender.com/api/verify-payment",
                return_url: "https://aviation-gallery.vercel.app//success",
                "customization[title]": "Lilmoo Design Payment",
                "customization[description]": `Payment for ${productName || 'Order'}`
            },
            {
                headers: {
                    Authorization: `Bearer ${secretKey}`,
                    'Content-Type': 'application/json'
                }
            }
        );

        
        // ቻፓ በተሳካ ሁኔታ ሊንኩን ከፈጠረ
        if (response.data.status === 'success') {
            // ትዕዛዙን ዳታቤዝ ላይ መመዝገብ
            const newOrder = new Order({ customerName, productName, amount, tx_ref });
            await newOrder.save();
            
            // ለ Frontend የቻፓን መክፈያ ሊንክ መላክ
            res.json({ checkout_url: response.data.data.checkout_url });
        } else {
            res.status(400).json({ error: "Chapa initialization failed" });
        }

    } catch (err) {
        // ስህተቱ ምን እንደሆነ በ Render Logs ላይ እንዲታይ
        console.error("❌ CHAPA ERROR DETAILS:", err.response?.data || err.message);
        
        res.status(500).json({ 
            error: "ክፍያ ማስጀመር አልተቻለም", 
            message: err.response?.data?.message || err.message 
        });
    }
});

// 2. ጋለሪ Routes
app.get('/api/gallery', async (req, res) => {
    try {
        const images = await Gallery.find().sort({ date: -1 });
        res.json(images);
    } catch (err) { res.status(500).json([]); }
});

app.post('/api/gallery', upload.single('image'), async (req, res) => {
    try {
        const imageUrl = `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}`;
        const newImage = new Gallery({ imageUrl });
        await newImage.save();
        res.status(201).json(newImage);
    } catch (err) { res.status(500).json({ error: "Upload failed" }); }
});

app.delete('/api/gallery/:id', async (req, res) => {
    try {
        await Gallery.findByIdAndDelete(req.params.id);
        res.json({ success: true });
    } catch (err) { res.status(500).json({ error: "Delete failed" }); }
});

// 3. ትዕዛዞችን ማስተዳደር
app.get('/api/orders', async (req, res) => {
    try {
        const orders = await Order.find().sort({ date: -1 });
        res.json(orders);
    } catch (err) { res.status(500).json([]); }
});

app.delete('/api/orders/:id', async (req, res) => {
    try {
        await Order.findByIdAndDelete(req.params.id);
        res.json({ success: true });
    } catch (err) { res.status(500).json({ error: "Delete failed" }); }
});

// --- Server Start ---
const PORT = process.env.PORT || 10000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));