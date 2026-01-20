const express = require('express');
const cors = require('cors');
const fs = require('fs');
require('dotenv').config();
// const { pool } = require('./db'); // For future use

const app = express();
const SERVER_PORT = process.env.PORT || 5000;
const LOG_PATH = 'server_log.txt';

// Lightweight logger utility
const writeLog = (msg) => {
  const time = new Date().toISOString();
  const logEntry = `[${time}] ${msg}\n`;

  console.log(msg);

  fs.appendFile(LOG_PATH, logEntry, (error) => {
    if (error) {
      console.error('Failed to write log:', error.message);
    }
  });
};

app.use(cors());
app.use(express.json());

// Health check route
app.get('/', (_req, res) => {
  res.send('Food Recommendation System API');
});

// API routes
const routes = require('./routes/api');
app.use('/api', routes);

// Start server
const httpServer = app.listen(SERVER_PORT, () => {
  writeLog(`Server running on port ${SERVER_PORT}`);
});

// Graceful shutdown
process.on('SIGINT', () => {
  writeLog('Server shutting down...');

  httpServer.close(() => {
    writeLog('Server closed.');
    process.exit(0);
  });
});
