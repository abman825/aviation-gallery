import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();
const app = express();

app.use(cors());
app.use(express.json());

const mongoURI = process.env.MONGO_URI || "mongodb+srv://abrhamman825_db_user:Jl02Lx4pJWeiDZcr@cluster0.p76sc.mongodb.net/aviation_gallery?retryWrites=true&w=majority";

mongoose.connect(mongoURI)
  .then(() => console.log('MongoDB Connected!'))
  .catch((err) => console.error('DB Connection Error:', err));

const orderSchema = new mongoose.Schema({
  name: { type: String, required: true },
  orderType: { type: String, required: true },
  status: { type: String, default: 'Pending' },
  createdAt: { type: Date, default: Date.now }
});

const Order = mongoose.model('Order', orderSchema);

app.post('/api/orders', async (req, res) => {
  try {
    const { name, orderType } = req.body;
    if (!name || !orderType) {
      return res.status(400).json({ success: false, message: 'ስም እና የልብስ አይነት ያስፈልጋል!' });
    }
    const newOrder = new Order({ name, orderType });
    await newOrder.save();
    res.status(201).json({ success: true, message: 'ትዕዛዝዎ ደርሷል!', data: newOrder });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

const PORT = process.env.PORT || 10000;
app.listen(PORT, '0.0.0.0', () => console.log(`Server running on port ${PORT}`));