const { Client } = require('pg');
require('dotenv').config({ path: '../.env' });

const dbConfig = {
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
};

async function createDatabase() {
  // Connect to default 'postgres' database to check/create target database
  const client = new Client({ ...dbConfig, database: 'postgres' });
  try {
    await client.connect();
    const res = await client.query(`SELECT 1 FROM pg_database WHERE datname = '${process.env.DB_NAME}'`);
    if (res.rowCount === 0) {
      console.log(`Creating database ${process.env.DB_NAME}...`);
      await client.query(`CREATE DATABASE "${process.env.DB_NAME}"`);
      console.log('Database created.');
    } else {
      console.log('Database already exists.');
    }
  } catch (err) {
    console.error('Error creating database:', err);
  } finally {
    await client.end();
  }
}

async function createTablesAndSeed() {
  const client = new Client({ ...dbConfig, database: process.env.DB_NAME });
  try {
    await client.connect();

    // Users
    await client.query(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        username VARCHAR(50) UNIQUE NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // Food Items
    await client.query(`
      CREATE TABLE IF NOT EXISTS food_items (
        id SERIAL PRIMARY KEY,
        name VARCHAR(100) NOT NULL,
        category VARCHAR(50),
        tags TEXT[],
        image_url TEXT,
        description TEXT
      );
    `);

    // Ratings
    await client.query(`
      CREATE TABLE IF NOT EXISTS ratings (
        user_id INTEGER REFERENCES users(id),
        food_id INTEGER REFERENCES food_items(id),
        rating INTEGER CHECK (rating >= 1 AND rating <= 5),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        PRIMARY KEY (user_id, food_id)
      );
    `);

    console.log('Tables created.');

    // Seed Data
    const usersCount = await client.query('SELECT COUNT(*) FROM users');
    if (usersCount.rows[0].count == 0) {
        console.log('Seeding data...');
        // Insert Users
        await client.query(`INSERT INTO users (username) VALUES ('alice'), ('bob'), ('charlie')`);
        
        // Insert Food Items
        await client.query(`
            INSERT INTO food_items (name, category, tags, image_url, description) VALUES
            ('Margherita Pizza', 'Italian', ARRAY['vegetarian', 'cheese', 'italian'], 'https://via.placeholder.com/150?text=Pizza', 'Classic cheese pizza'),
            ('Pepperoni Pizza', 'Italian', ARRAY['meat', 'cheese', 'italian', 'spicy'], 'https://via.placeholder.com/150?text=Pepperoni', 'Pizza with pepperoni'),
            ('Vegan Salad', 'Healthy', ARRAY['vegan', 'vegetarian', 'healthy'], 'https://via.placeholder.com/150?text=Salad', 'Fresh mix of greens'),
            ('Cheeseburger', 'American', ARRAY['meat', 'cheese', 'fastfood'], 'https://via.placeholder.com/150?text=Burger', 'Juicy beef burger with cheese'),
            ('Sushi Platter', 'Japanese', ARRAY['seafood', 'rice', 'japanese'], 'https://via.placeholder.com/150?text=Sushi', 'Assorted fresh sushi');
        `);

        // Insert Ratings
        // Alice (1) likes Pizza
        // Bob (2) likes Healthy & Japanese
        // Charlie (3) likes Meat/Fastfood
        await client.query(`
            INSERT INTO ratings (user_id, food_id, rating) VALUES
            (1, 1, 5), (1, 2, 4), (1, 3, 2),
            (2, 3, 5), (2, 5, 5), (2, 4, 1),
            (3, 2, 5), (3, 4, 5);
        `);
        console.log('Data seeded.');
    } else {
        console.log('Data already exists, skipping seed.');
    }

  } catch (err) {
    console.error('Error init tables/seed:', err);
  } finally {
    await client.end();
  }
}

(async () => {
    await createDatabase();
    // Wait a brief moment to ensure DB is ready if just created (though connect handles it mostly)
    setTimeout(createTablesAndSeed, 1000);
})();
