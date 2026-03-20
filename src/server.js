import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// MongoDB Connection String
const mongoURI = "mongodb+srv://abrhamman825_db_user:Jl02Lx4pJWeiDZcr@cluster0.p76sc.mongodb.net/aviation_gallery?retryWrites=true&w=majority";

mongoose.connect(mongoURI)
  .then(() => console.log('MongoDB በትክክል ተገናኝቷል!'))
  .catch((err) => console.error('የዳታቤዝ ግንኙነት ስህተት:', err));

// Schema
const orderSchema = new mongoose.Schema({
  name: { type: String, required: true },
  orderType: { type: String, required: true },
  date: { type: Date, default: Date.now }
});

const Order = mongoose.model('Order', orderSchema);

// Routes
app.get('/', (req, res) => res.send('ሰርቨሩ እየሰራ ነው!'));

app.post('/api/orders', async (req, res) => {
  try {
    const { name, orderType } = req.body;
    const newOrder = new Order({ name, orderType });
    await newOrder.save();
    res.status(201).json({ success: true, message: 'ትዕዛዝ ተመዝግቧል!' });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server on port ${PORT}`));