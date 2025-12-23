const { Client } = require('pg');
require('dotenv').config();

const client = new Client({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
  database: 'postgres',
});

async function connectDB() {
  try {
    console.log('Attempting database connection...');
    await client.connect();
    console.log('Database connected successfully!');
  } catch (error) {
    console.error('Database connection failed:', error.message);
  } finally {
    await client.end();
    console.log('Connection closed.');
  }
}

connectDB();
