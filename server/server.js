// 1. Import dependencies   
// At the top of server.js
const authMiddleware = require('./middleware/authMiddleware');
require('dotenv').config(); // <-- MOVED TO LINE 1
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const authRoutes = require('./Routes/authRoutes');
const userRoutes = require('./Routes/userRoutes');
// 2. Create Express app
const app = express();
app.use(cors());
app.use(express.json());
const PORT = 5000;

// 3. Connect to MongoDB
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("Successfully connected to MongoDB Atlas!"))
  .catch(err => console.error("Error connecting to MongoDB Atlas:", err));

// 4. Define a Mongoose Schema and Model
// A Schema is the blueprint for our data
const roadmapSchema = new mongoose.Schema({
  title: String,
  steps: [
    {
      id: Number,
      title: String,
      completed: Boolean
    }
  ]
});
// A Model is the tool we use to interact with the data
const Roadmap = mongoose.model('Roadmap', roadmapSchema);

// 5. Define our API routes
app.get('/api/roadmaps', authMiddleware, async (req, res) => {
  try {
    // Use the Roadmap model to find all roadmaps in the database
    const roadmaps = await Roadmap.find();
    res.json(roadmaps);
  } catch (err) {
    res.status(500).json({ message: "Error fetching roadmaps" });
  }
});

app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);

// 6. Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});