const express = require('express');
const router = express.Router();

const { pool } = require('../db');
const { getRecommendations } = require('../recommendation/engine');

// Get all food items
router.get('/foods', async (req, res) => {
  try {
    const { rows } = await pool.query('SELECT * FROM food_items ORDER BY id');
    return res.json(rows);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Server error' });
  }
});

// Submit a rating
router.post('/ratings', async (req, res) => {
  const { userId, foodId, rating } = req.body;

  if (!userId || !foodId || !rating) {
    return res.status(400).json({ error: 'Missing fields' });
  }

  try {
    // Check if rating exists
    const checkQuery = 'SELECT 1 FROM ratings WHERE user_id = $1 AND food_id = $2';
    const checkValues = [userId, foodId];
    const check = await pool.query(checkQuery, checkValues);

    if (check.rows.length > 0) {
      const updateQuery =
        'UPDATE ratings SET rating = $1, created_at = NOW() WHERE user_id = $2 AND food_id = $3';
      const updateValues = [rating, userId, foodId];

      await pool.query(updateQuery, updateValues);
    } else {
      const insertQuery = 'INSERT INTO ratings (user_id, food_id, rating) VALUES ($1, $2, $3)';
      const insertValues = [userId, foodId, rating];

      await pool.query(insertQuery, insertValues);
    }

    return res.json({ message: 'Rating saved' });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Server error' });
  }
});

// Get recommendations
router.get('/recommendations/:userId', async (req, res) => {
  const { userId } = req.params;

  try {
    const recommendations = await getRecommendations(userId);
    return res.json(recommendations);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
