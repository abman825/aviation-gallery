import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();
const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

// Database Connection
const mongoURI = process.env.MONGO_URI || "mongodb+srv://abrhamman825_db_user:Jl02Lx4pJWeiDZcr@cluster0.p76sc.mongodb.net/aviation_gallery?retryWrites=true&w=majority";

mongoose.connect(mongoURI)
  .then(() => console.log('MongoDB Connected!'))
  .catch((err) => console.error('DB Connection Error:', err));

// Schema and Model
const orderSchema = new mongoose.Schema({
  name: { type: String, required: true },
  orderType: { type: String, required: true },
  status: { type: String, default: 'Pending' },
  createdAt: { type: Date, default: Date.now }
});

const Order = mongoose.model('Order', orderSchema);

// 1. መነሻ መንገድ (Home Route)
app.get('/', (req, res) => {
  res.send('Lilmoo Backend ሰርቨር በትክክል እየሰራ ነው!');
});

// 2. ትዕዛዝ ለመቀበል (POST API)
app.post('/api/orders', async (req, res) => {
  try {
    const { name, orderType } = req.body;
    
    // አዲስ ትዕዛዝ ወደ ዳታቤዝ ማስገባት
    const newOrder = new Order({
      name,
      orderType
    });

    await newOrder.save();
    res.status(201).json({ message: "ትዕዛዝዎ በተሳካ ሁኔታ ተልኳል!", order: newOrder });
  } catch (error) {
    console.error('Error saving order:', error);
    res.status(500).json({ message: "ስህተት ተከስቷል፣ እባክዎ ደግመው ይሞክሩ" });
  }
});

// 3. ሁሉንም ትዕዛዞች ለማየት (አማራጭ GET API)
app.get('/api/orders', async (req, res) => {
  try {
    const orders = await Order.find().sort({ createdAt: -1 });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: "መረጃውን ማምጣት አልተቻለም" });
  }
});

const PORT = process.env.PORT || 10000;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on port ${PORT}`);
});
