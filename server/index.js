const express = require("express");
const cors = require("cors");
require("dotenv").config();
// const { pool } = require('./db'); // Will be used later

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Basic route
app.get("/", (req, res) => {
  res.send("Food Recommendation System API");
});

// Import routes
const apiRoutes = require('./routes/api');
app.use('/api', apiRoutes);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
