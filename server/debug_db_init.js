const { Client } = require('pg');
const fs = require('fs');

const LOG_PATH = 'debug_log.txt';

const writeLog = (message) => {
  const timestamp = new Date().toISOString();
  const entry = `[${timestamp}] ${message}\n`;

  console.log(message);
  fs.appendFileSync(LOG_PATH, entry);
};

const dbConfig = {
  user: 'postgres',
  password: 'bimal',
  host: 'localhost',
  port: 5432,
  database: 'postgres' // initial connection DB
};

async function initDatabase() {
  writeLog('Starting debug DB init...');
  const pgClient = new Client(dbConfig);

  try {
    writeLog('Connecting to postgres database...');
    await pgClient.connect();
    writeLog('Connected.');

    const targetDb = 'food_rec_db';
    writeLog(`Checking if database "${targetDb}" exists...`);

    const result = await pgClient.query(
      'SELECT 1 FROM pg_database WHERE datname = $1',
      [targetDb]
    );

    if (result.rowCount === 0) {
      writeLog(`Database not found. Creating "${targetDb}"...`);
      await pgClient.query(`CREATE DATABASE "${targetDb}"`);
      writeLog('Database created successfully.');
    } else {
      writeLog('Database already exists.');
    }

  } catch (error) {
    writeLog(`ERROR: ${error.message}`);
    writeLog(error.stack);
  } finally {
    await pgClient.end();
    writeLog('Client disconnected.');
  }
}

initDatabase();
