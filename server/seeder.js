const mongoose = require('mongoose');
require('dotenv').config();

const Roadmap = mongoose.model('Roadmap', new mongoose.Schema({
  title: String,
  steps: [{ id: Number, title: String, completed: Boolean }]
}));

const seedData = [
  {
    title: "Full Stack Developer Roadmap",
    steps: [
      { id: 1, title: "Learn HTML & CSS", completed: true },
      { id: 2, title: "JavaScript Basics", completed: true },
      { id: 3, title: "Learn a Frontend Framework (React)", completed: false },
      { id: 4, title: "Learn a Backend (Node.js & Express)", completed: false },
      { id: 5, title: "Learn a Database (MongoDB)", completed: false },
    ],
  }
];

const seedDatabase = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Connected to MongoDB for seeding...");

    await Roadmap.deleteMany({}); // Clear existing data
    console.log("Old roadmaps deleted.");

    await Roadmap.insertMany(seedData);
    console.log("Database seeded successfully!");

  } catch (error) {
    console.error("Error seeding database:", error);
  } finally {
    mongoose.connection.close();
  }
};

seedDatabase();