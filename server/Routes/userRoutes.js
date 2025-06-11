const express = require('express');
const authMiddleware = require('../middleware/authMiddleware');
const User = require('../models/User');
const router = express.Router();

// POST /api/users/progress
// The route to update a user's progress.
router.post('/progress', authMiddleware, async (req, res) => {
  try {
    // Get the ID of the step the user completed from the request body
    const { stepId } = req.body;
    // Get the user's ID from the token (which our middleware provides)
    const userId = req.user.userId;

    // Find the user in the database
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Add the new stepId to the user's progress array
    // We'll also check to make sure it's not already in the array
    if (!user.progress.includes(stepId)) {
      user.progress.push(stepId);
      await user.save(); // Save the changes to the database
    }

    // Send a success response back with the updated progress
    res.json({ message: 'Progress updated successfully', progress: user.progress });

  } catch (error) {
    console.error("Error updating progress:", error);
    res.status(500).json({ message: "Server error while updating progress" });
  }
});

module.exports = router;

router.get('/progress', authMiddleware, async (req, res) => {
    try {
        const user = await User.findById(req.user.userId);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        res.json({ progress: user.progress });
    } catch (error) {
        console.error("Error fetching progress:", error);
        res.status(500).json({ message: "Server error while fetching progress" });
    }
});