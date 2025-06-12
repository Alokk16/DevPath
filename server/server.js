// server.js - CORRECTED VERSION

require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

// --- Corrected Imports ---
const authMiddleware = require('./middleware/authMiddleware');
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const Roadmap = require('./models/Roadmap'); // Import the correct model

const app = express();
app.use(cors());
app.use(express.json());

const PORT = 5000;

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("Successfully connected to MongoDB Atlas!"))
  .catch(err => console.error("Error connecting to MongoDB Atlas:", err));


// --- API Routes ---

// GET all roadmaps --- THIS IS THE MISSING ROUTE ---
app.get('/api/roadmaps', authMiddleware, async (req, res) => {
    try {
        const roadmaps = await Roadmap.find().lean();
        res.json(roadmaps);
    } catch (err) {
        console.error("Error in /api/roadmaps route:", err);
        res.status(500).json({ message: "Error fetching roadmaps" });
    }
});

// GET a single roadmap by its ID
app.get('/api/roadmaps/:id', authMiddleware, async (req, res) => {
    try {
        const roadmapId = req.params.id;
        const roadmap = await Roadmap.findById(roadmapId).lean();
        if (!roadmap) {
            return res.status(404).json({ message: "Roadmap not found" });
        }
        res.json(roadmap);
    } catch (err) {
        console.error("--- ERROR in /api/roadmaps/:id route ---", err);
        res.status(500).json({ message: "Error fetching single roadmap" });
    }
});

// Use the auth and user routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);


// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});