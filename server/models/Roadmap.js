const mongoose = require('mongoose');

// This is the schema for a single task, like "HTML Basics"
const taskSchema = new mongoose.Schema({
  id: { type: Number, required: true, unique: true }, // A unique ID for progress tracking
  title: { type: String, required: true },
  problemLink: { type: String, default: '#' },
  discussionLink: { type: String, default: '#' },
  notesLink: { type: String, default: '#' },
  codeLink: { type: String, default: '#' },
});

// This is the schema for a major topic, like "HTML"
const topicSchema = new mongoose.Schema({
  title: { type: String, required: true },
  tasks: [taskSchema], // Each topic contains an array of tasks
});

// This is the main roadmap schema
const roadmapSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, default: '' },
  complexity: { type: String, enum: ['Easy', 'Medium', 'Advanced'], default: 'Medium' },
  topics: [topicSchema], // Each roadmap contains an array of topics
});

const Roadmap = mongoose.model('Roadmap', roadmapSchema);

module.exports = Roadmap;