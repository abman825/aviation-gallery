import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();
const app = express();
const PORT = process.env.PORT || 10000;

app.use(cors());
app.use(express.json());

// --- Simple Route ---
app.get('/', (req, res) => {
  res.send("Server is LIVE! DB Status: Checking...");
});

// --- API Test Route ---
app.get('/api/status', (req, res) => {
  const dbStatus = mongoose.connection.readyState === 1 ? "Connected" : "Disconnected";
  res.json({ server: "Live", database: dbStatus });
});

// --- Server Start (DB ቢገናኝም ባይገናኝም ሰርቨሩ ይነሳል) ---
app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Server is live on port ${PORT}`);
  
  // ዳታቤዙን እዚህ ጋር እንዲገናኝ እንሞክራለን
  mongoose.connect(process.env.MONGODB_URI)
    .then(() => console.log("✅ DB Connected Successfully!"))
    .catch(err => console.error("❌ DB Wait Error (But server is still live):", err.message));
});