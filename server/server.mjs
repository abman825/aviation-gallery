import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';

const app = express();
app.use(express.json());
app.use(cors());

// 1. የቴሌግራም መልእክት መላኪያ ፈንክሽን
const sendTelegramMessage = async (text) => {
  const token = process.env.TELEGRAM_BOT_TOKEN; 
  const chatId = process.env.TELEGRAM_CHAT_ID;
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
      })
    });

    const data = await response.json();
    if (data.ok) {
      console.log('📬 የቴሌግራም መልእክት ተልኳል!');
    } else {
      console.log('❌ የቴሌግራም ስህተት:', data.description);
    }
  } catch (error) {
    console.log('⚠️ የግንኙነት ስህተት:', error.message);
  }
}; // <--- ቅንፉ እዚህ ጋር መዘጋት ነበረበት

// 2. የዳታቤዝ ግንኙነት
const mongoURI = process.env.MONGO_URI;
mongoose.connect(mongoURI)
  .then(() => console.log('MongoDB Atlas ተገናኝቷል!'))
  .catch((err) => console.error('የዳታቤዝ ስህተት:', err));

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
🔔 <b>አዲስ ትዕዛዝ ደርሷል</b>
👤 <b>ደንበኛ:</b> ${customerName}
👗 <b>ልብስ:</b> ${productName}
📅 <b>ቀን:</b> ${new Date().toLocaleString()}
`;

    await sendTelegramMessage(telegramText);
    res.status(201).json({ message: "ትዕዛዝዎ በትክክል ደርሶናል!" });
  } catch (error) {
    console.error("Endpoint Error:", error);
    res.status(500).json({ error: "ትዕዛዝ መቀበል አልተቻለም" });
  }
});

// 5. ሰርቨር ማስነሻ (Port 10000 ለ Render ይመረጣል)
const PORT = process.env.PORT || 10000;
app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server is running on port ${PORT}`);
});
