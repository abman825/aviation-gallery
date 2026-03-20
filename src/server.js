import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// MongoDB Connection
const mongoURI = "mongodb+srv://abrhamman825_db_user:Jl02Lx4pJWeiDZcr@cluster0.p76sc.mongodb.net/aviation_gallery?retryWrites=true&w=majority";

mongoose.connect(mongoURI)
  .then(() => console.log('MongoDB በትክክል ተገናኝቷል!'))
  .catch((err) => console.error('የዳታቤዝ ግንኙነት ስህተት:', err));

// Order Schema
const orderSchema = new mongoose.Schema({
  name: { type: String, required: true },
  orderType: { type: String, required: true },
  status: { type: String, default: 'Pending' },
  createdAt: { type: Date, default: Date.now }
});

const Order = mongoose.model('Order', orderSchema);

// Routes
app.get('/', (req, res) => {
  res.send('Lilmoo Backend ሰርቨር በትክክል እየሰራ ነው!');
});

app.post('/api/orders', async (req, res) => {
  try {
    const { name, orderType } = req.body;
    const newOrder = new Order({ name, orderType });
    await newOrder.save();
    res.status(201).json({ success: true, message: 'ትዕዛዝህ በትክክል ደርሷል!', data: newOrder });
  } catch (error) {
    console.error('Save Error:', error);
    res.status(500).json({ success: false, error: 'ትዕዛዝ መላክ አልተቻለም' });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`ሰርቨር በፖርት ${PORT} ላይ ስራ ጀምሯል`);
});