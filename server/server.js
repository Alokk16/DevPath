// 1. Import dependencies   
const express = require('express');
const mongoose = require('mongoose');
require('dotenv').config(); // This loads the variables from .env

// 2. Create Express app
const app = express();
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
app.get('/api/roadmaps', async (req, res) => {
  try {
    // Use the Roadmap model to find all roadmaps in the database
    const roadmaps = await Roadmap.find();
    res.json(roadmaps);
  } catch (err) {
    res.status(500).json({ message: "Error fetching roadmaps" });
  }
});

// 6. Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});