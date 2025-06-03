const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
const allowedOrigins = [
  'https://bank-frontend-nine.vercel.app',
  'http://localhost:5173'
];

app.use(cors({
  origin: function (origin, callback) {
    // allow requests with no origin like curl/postman
    if (!origin) return callback(null, true);
    if (allowedOrigins.includes(origin)) {
      return callback(null, true);
    } else {
      return callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true
}));

app.use(express.json());

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => console.log('✅ MongoDB connected'))
  .catch(err => console.error('❌ MongoDB connection error:', err));

const userRoutes = require('./routes/users');
const transactionRoutes = require('./routes/transactions');
const billRoutes = require('./routes/bills');


// Routes
app.use('/api/bills', billRoutes);

app.use('/api/users', userRoutes);
app.use('/api/transactions', transactionRoutes);

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
