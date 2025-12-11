const express = require('express');
const router = express.Router();
const { pool } = require('../db');
const { getRecommendations } = require('../recommendation/engine');

// Get all food items
router.get('/foods', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM food_items ORDER BY id');
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
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
    const check = await pool.query('SELECT * FROM ratings WHERE user_id = $1 AND food_id = $2', [userId, foodId]);
    if (check.rows.length > 0) {
        await pool.query('UPDATE ratings SET rating = $1, created_at = NOW() WHERE user_id = $2 AND food_id = $3', [rating, userId, foodId]);
    } else {
        await pool.query('INSERT INTO ratings (user_id, food_id, rating) VALUES ($1, $2, $3)', [userId, foodId, rating]);
    }
    res.json({ message: 'Rating saved' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

// Get recommendations
router.get('/recommendations/:userId', async (req, res) => {
    const userId = req.params.userId;
    try {
        const recommendations = await getRecommendations(userId);
        res.json(recommendations);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server error' });
    }
});

module.exports = router;
