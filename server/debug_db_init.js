const { Client } = require('pg');
const fs = require('fs');

const logFile = 'debug_log.txt';
function log(msg) {
  const line = `[${new Date().toISOString()}] ${msg}\n`;
  console.log(msg);
  fs.appendFileSync(logFile, line);
}

const config = {
  user: 'postgres',
  password: 'bimal',
  host: 'localhost',
  port: 5432,
  database: 'postgres' // Connect to default DB first
};

async function run() {
  log('Starting debug DB init...');
  const client = new Client(config);
  
  try {
    log('Connecting to postgres database...');
    await client.connect();
    log('Connected.');
    
    const dbName = 'food_rec_db';
    log(`Checking if database "${dbName}" exists...`);
    const res = await client.query(`SELECT 1 FROM pg_database WHERE datname = $1`, [dbName]);
    
    if (res.rowCount === 0) {
      log(`Database does not exist. Creating "${dbName}"...`);
      await client.query(`CREATE DATABASE "${dbName}"`);
      log('Database created successfully.');
    } else {
      log('Database already exists.');
    }
    
  } catch (err) {
    log(`ERROR: ${err.message}`);
    log(err.stack);
  } finally {
    await client.end();
    log('Client disconnected.');
  }
}

run();
