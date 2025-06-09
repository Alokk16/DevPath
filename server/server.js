// 1. Import Express
const express = require('express');

// 2. Create an instance of the Express app
const app = express();

// 3. Define the port our server will run on
// Use an environment variable if it exists, otherwise default to 5000
const PORT = 5000;

// 4. Define a basic route
// This handles GET requests to the URL: http://localhost:5000/api
app.get('/api', (req, res) => {
  // Send a JSON response back to the client
  res.json({ message: "Hello from the backend server!" });
});

// 5. Start the server and listen for incoming requests
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});