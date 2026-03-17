import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import fetch from 'node-fetch';

const app = express();
app.use(express.json());
app.use(cors());

// 1. MongoDB Atlas ግንኙነት
const mongoURI = "mongodb+srv://abrhamman825_db_user:Jl02Lx4pJWeiDZcr@cluster0.tpkbh2l.mongodb.net/lilmoo_orders?retryWrites=true&w=majority&appName=Cluster0";

mongoose.connect(mongoURI)
  .then(() => console.log('✅ በደስታ የምስራች! MongoDB Atlas ተገናኝቷል!'))
  .catch(err => console.error('❌ የግንኙነት ስህተት፡', err.message));

// 2. አዲሱ የቴሌግራም መላኪያ ፈንክሽን (የላክኸው ኮድ)
const sendTelegramMessage = async (text) => {
  const token = '8601691945:AAH2Md26xKU2wvvZTr0aD4PEUxMc4-WWT-Q'; 
  const chatId = '2068983666';
  const url = `https://api.telegram.org/bot${token}/sendMessage`;

  console.log("📡 ለቴሌግራም መልእክት በመላክ ላይ...");

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: chatId,
        text: text,
        parse_mode: 'HTML'
      }),
      timeout: 10000 
    });

    const data = await response.json();
    if (data.ok) {
      console.log('📬 በደስታ የምስራች! የቴሌግራም መልእክት ተልኳል!');
    } else {
      console.log('❌ የቴሌግራም ስህተት:', data.description);
    }
  } catch (error) {
    console.log('⚠️ የግንኙነት ስህተት (Timeout): ኢንተርኔትህ እየዘገየ ነው። ደግመህ ሞክር።');
  }
};

// 3. ዳታቤዝ Schema
const orderSchema = new mongoose.Schema({
  customerName: String,
  productName: String,
  quantity: Number,
  date: { type: Date, default: Date.now }
});
const Order = mongoose.model('Order', orderSchema);

// 4. API Endpoint
app.post('/api/orders', async (req, res) => {
  try {
    const { customerName, productName } = req.body;
    const newOrder = new Order(req.body);
    await newOrder.save();

    const telegramText = `
🔔 <b>አዲስ ትዕዛዝ ደርሷል!</b>
👤 <b>ደንበኛ:</b> ${customerName}
👗 <b>ልብስ:</b> ${productName}
📅 <b>ቀን:</b> ${new Date().toLocaleString()}
`;

    await sendTelegramMessage(telegramText);
    res.status(201).json({ message: "ትዕዛዝዎ በትክክል ደርሶናል!" });
  } catch (error) {
    res.status(500).json({ error: "ትዕዛዝ መቀበል አልተቻለም" });
  }
});

const PORT = process.env.PORT || 5000;

// '0.0.0.0' መጨመር በጣም ወሳኝ ነው
app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 ሰርቨር በፖርት ${PORT} ላይ ስራ ጀምሯል`);
});