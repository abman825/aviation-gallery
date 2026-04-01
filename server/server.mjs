import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();
const app = express();

app.use(cors());
app.use(express.json());

// --- Simple Model ---
const Gallery = mongoose.model('Gallery', new mongoose.Schema({ 
  imageUrl: String 
}));

// --- Test Route ---
app.get('/', (req, res) => {
  res.send("Server is running and waiting for DB...");
});

// --- API Test Route ---
app.get('/api/test', async (req, res) => {
  try {
    const data = await Gallery.find();
    res.json({ message: "Connected to DB!", data });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// --- Server & DB Connection ---
const PORT = process.env.PORT || 10000;

mongoose.connect(process.env.MONGODB_URI)
  .then(() => {
    console.log("✅ ✅ ✅ Connected to MongoDB Successfully!");
    app.listen(PORT, '0.0.0.0', () => {
      console.log(`🚀 Server is live on port ${PORT}`);
    });
  })
  .catch(err => {
    console.error("❌ DB Connection Error:", err.message);
  });