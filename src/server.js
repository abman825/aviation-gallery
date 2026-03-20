const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

// MongoDB Connection - ያቀረብከውን ትክክለኛ መረጃ ተጠቅሜያለሁ
const mongoURI = "mongodb+srv://abrhamman825_db_user:Jl02Lx4pJWeiDZcr@cluster0.mongodb.net/aviation_gallery?retryWrites=true&w=majority";

mongoose.connect(mongoURI)
  .then(() => console.log('MongoDB በትክክል ተገናኝቷል!'))
  .catch((err) => console.error('የዳታቤዝ ግንኙነት ስህተት:', err));

// Order Schema - ትዕዛዞች የሚቀመጡበት መዋቅር
const orderSchema = new mongoose.Schema({
  name: String,
  orderType: String,
  status: { type: String, default: 'Pending' },
  createdAt: { type: Date, default: Date.now }
});

const Order = mongoose.model('Order', orderSchema);

// Routes
app.get('/', (req, res) => {
  res.send('Lilmoo Backend ሰርቨር በትክክል እየሰራ ነው!');
});

// ትዕዛዝ መቀበያ መንገድ (ይህ ክፍል ነው ለውጥ የሚያመጣው)
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
  console.log(`ሰርቨር በፖርት ${PORT} ላይ ስራ ጀምሯል`);
});