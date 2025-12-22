const { Client } = require('pg');
require('dotenv').config();

const client = new Client({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
  database: 'postgres',
});

console.log('Attempting connection...');
client.connect()
  .then(() => {
    console.log('Connected successfully!');
    client.end();
  })
  .catch(err => {
    console.error('Connection failed:', err);
    process.exit(1);
  });
