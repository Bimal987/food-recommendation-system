const express = require("express");
const cors = require("cors");
const fs = require("fs");
require("dotenv").config();
// const { pool } = require('./db'); // Will be used later

const app = express();
const PORT = process.env.PORT || 5000;
const logFile = 'server_log.txt';

// simple logger
function log(msg) {
  const line = `[${new Date().toISOString()}] ${msg}\n`;
  console.log(msg);
  fs.appendFile(logFile, line, err => {
    if (err) console.error('Log write failed:', err.message);
  });
}

app.use(cors());
app.use(express.json());

// Basic route
app.get("/", (req, res) => {
  res.send("Food Recommendation System API");
});

// Import routes
const apiRoutes = require('./routes/api');
app.use('/api', apiRoutes);

// Start server
const server = app.listen(PORT, () => {
  log(`Server running on port ${PORT}`);
});

// Graceful shutdown (good practice)
process.on('SIGINT', () => {
  log('Server shutting down...');
  server.close(() => {
    log('Server closed.');
    process.exit(0);
  });
});
