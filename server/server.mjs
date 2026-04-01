import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();
const app = express();

app.use(cors());
app.use(express.json());

// --- Test Route ---
app.get('/', (req, res) => {
  res.send("Server is running! Waiting for DB connection...");
});

// --- Server & DB Connection Logic ---
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