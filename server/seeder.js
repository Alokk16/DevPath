const mongoose = require('mongoose');
const Roadmap = require('./models/Roadmap'); // Make sure we import the model
require('dotenv').config();

const seedData = [
  {
    title: "Company Wise Full-Stack Roadmap",
    description: "A roadmap covering everything from basics to advanced levels, tailored for top tech companies.",
    complexity: "Advanced",
    topics: [
      {
        title: "HTML",
        tasks: [
          { id: 101, title: "HTML Basics", problemLink: "#" },
          { id: 102, title: "HTML Top-Level Tags", problemLink: "#" },
          { id: 103, title: "HTML Block & Inline Tags", problemLink: "#" },
          { id: 104, title: "HTML Tables", problemLink: "#" },
          { id: 105, title: "HTML Forms", problemLink: "#" },
          { id: 106, title: "HTML Attributes", problemLink: "#" },
        ]
      },
      {
        title: "CSS",
        tasks: [
          { id: 201, title: "CSS Basics", problemLink: "#" },
          { id: 202, title: "Selectors", problemLink: "#" },
          { id: 203, title: "Box Model", problemLink: "#" },
          { id: 204, title: "Flexbox", problemLink: "#" },
          { id: 205, title: "CSS Grid", problemLink: "#" },
          { id: 206, title: "Responsive Design", problemLink: "#" },
        ]
      },
      {
        title: "JavaScript",
        tasks: [
          { id: 301, title: "JS Fundamentals", problemLink: "#" },
          { id: 302, title: "DOM Manipulation", problemLink: "#" },
          { id: 303, title: "Asynchronous JS (Promises, async/await)", problemLink: "#" },
          { id: 304, title: "ES6+ Features", problemLink: "#" },
        ]
      }
    ]
  }
];

const seedDatabase = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Connected to MongoDB for seeding...");

    await Roadmap.deleteMany({}); // Clear ALL existing roadmaps
    console.log("Old roadmaps deleted.");

    await Roadmap.insertMany(seedData);
    console.log("Database seeded successfully with new detailed data!");

  } catch (error) {
    console.error("Error seeding database:", error);
  } finally {
    mongoose.connection.close();
  }
};

seedDatabase();