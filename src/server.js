const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

// MongoDB connection
mongoose.connect('mongodb://localhost:27017/aviationDB')
  .then(() => console.log('MongoDB ተገናኝቷል!'))
  .catch((err) => console.log(err));

app.get('/', (req, res) => {
  res.send('ሰርቨሩ እየሰራ ነው!');
});

const PORT = 5000;
app.listen(PORT, () => console.log(`ሰርቨሩ በፖርት ${PORT} እየሰራ ነው`));