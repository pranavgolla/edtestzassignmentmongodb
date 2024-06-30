const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const registerRoutes = require('./routes/registerRoutes');

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json()); // Middleware to parse JSON request bodies

// Connect to MongoDB
connectDB();

// Use Routes
app.use('/api', registerRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
