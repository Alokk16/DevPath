const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  // Add this new field to track progress
  progress: {
    // We will store an array of numbers
    type: [Number],
    default: [] // Default to an empty array for new users
  }
});

const User = mongoose.model('User', userSchema);
module.exports = User;    