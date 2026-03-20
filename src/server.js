const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB Connection
// ማሳሰቢያ፡ የ 'password' የሚለውን ቃል በእውነተኛው የዳታቤዝ ፓስወርድህ መተካትህን አረጋግጥ
const mongoURI = "mongodb+srv://abrahamman825_db_user:Jl02Lx4pJWeiDZcr@cluster0.p76sc.mongodb.net/lilmooDB?retryWrites=true&w=majority&appName=Cluster0";
mongoose.connect(mongoURI)
  .then(() => console.log('MongoDB ተገናኝቷል!'))
  .catch((err) => console.error('የዳታቤዝ ግንኙነት ስህተት:', err));

// Order Schema
const orderSchema = new mongoose.Schema({
  name: String,
  orderType: String,
  status: { type: String, default: 'Pending' },
  createdAt: { type: Date, default: Date.now }
});

const Order = mongoose.model('Order', orderSchema);

// Routes
app.get('/', (req, res) => {
  res.send('Lilmoo Backend ሰርቨር እየሰራ ነው!');
});

// ትዕዛዝ መቀበያ መንገድ (POST Route)
app.post('/api/orders', async (req, res) => {
  try {
    const { name, orderType } = req.body;
    
    if (!name || !orderType) {
      return res.status(400).json({ error: 'እባክህ ስም እና የልብስ አይነት አስገባ' });
    }

    const newOrder = new Order({ name, orderType });
    await newOrder.save();
    
    console.log('አዲስ ትዕዛዝ ተመዝግቧል:', newOrder);
    res.status(201).json({ message: 'ትዕዛዝህ በትክክል ደርሷል!', data: newOrder });
  } catch (error) {
    console.error('ትዕዛዝ ሲመዘገብ ስህተት ተከስቷል:', error);
    res.status(500).json({ error: 'ትዕዛዝ መላክ አልተቻለም' });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`ሰርቨር በፖርት ${PORT} ላይ እየሰራ ነው`);
});