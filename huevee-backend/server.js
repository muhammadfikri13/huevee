const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

// Routes
const paletteRoutes = require('./routes/palettes');
app.use('/api/palettes', paletteRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

const authRoutes = require('./routes/auth');
app.use('/api/auth', authRoutes);