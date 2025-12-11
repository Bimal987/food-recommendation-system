const { pool } = require('../db');

async function getRecommendations(userId) {
    console.log(`Generating recommendations for user ${userId}...`);
    
    // 1. Get all food items
    const foodsRes = await pool.query('SELECT * FROM food_items');
    const allFoods = foodsRes.rows;

    // 2. Get user's ratings
    const userRatingsRes = await pool.query('SELECT * FROM ratings WHERE user_id = $1', [userId]);
    const userRatings = userRatingsRes.rows;
    const ratedFoodIds = new Set(userRatings.map(r => r.food_id));

    console.log(`User ${userId} has rated ${userRatings.length} items.`);

    // 3. Get all other ratings (for collaborative context)
    const allRatingsRes = await pool.query('SELECT * FROM ratings WHERE user_id != $1', [userId]);
    const allRatings = allRatingsRes.rows;

    // --- Content-Based Filtering ---
    // User profile: Frequency of tags in highly rated items (>=4)
    const tagPreferences = {};
    userRatings.filter(r => r.rating >= 4).forEach(r => {
        const food = allFoods.find(f => f.id === r.food_id);
        if (food && food.tags) {
            food.tags.forEach(tag => {
                tagPreferences[tag] = (tagPreferences[tag] || 0) + 1;
            });
        }
    });
    console.log('User Tag Preferences:', tagPreferences);

    // Score foods based on tag overlap
    const contentScores = {};
    allFoods.forEach(food => {
        if (ratedFoodIds.has(food.id)) return; // Skip already rated
        let score = 0;
        if (food.tags) {
            food.tags.forEach(tag => {
                if (tagPreferences[tag]) score += tagPreferences[tag];
            });
        }
        contentScores[food.id] = score;
    });

    // --- Collaborative Filtering (Simplified) ---
    // For now, use average rating of items by others as a popularity proxy/collaborative signal
    const collabScores = {};
    const itemRatings = {}; // foodId -> [ratings]

    allRatings.forEach(r => {
        if (!itemRatings[r.food_id]) itemRatings[r.food_id] = [];
        itemRatings[r.food_id].push(r.rating);
    });

    allFoods.forEach(food => {
        if (ratedFoodIds.has(food.id)) return;
        if (itemRatings[food.id]) {
            const sum = itemRatings[food.id].reduce((a, b) => a + b, 0);
            const avg = sum / itemRatings[food.id].length;
            collabScores[food.id] = avg; 
        } else {
            collabScores[food.id] = 0;
        }
    });

    // --- Hybrid Combination ---
    // Weight: Content Score * 1.0 + Collab Score * 1.0 (Simple linear combination)
    
    const hybridScores = [];
    allFoods.forEach(food => {
        if (ratedFoodIds.has(food.id)) return;
        
        const cScore = contentScores[food.id] || 0;
        const colScore = collabScores[food.id] || 0;
        
        // Normalize roughly: cScore can be 0-5+, colScore is 0-5.
        // Let's treat them equally.
        const finalScore = cScore + colScore; 
        
        // Calculate a "Match %" for display purposes (arbitrary scale)
        // Let's say max expected score is around 10.
        const matchPercentage = Math.min(finalScore / 10, 1.0);

        if (finalScore > 0) {
            hybridScores.push({ ...food, matchScore: matchPercentage, debug: { cScore, colScore } });
        }
    });

    // Sort by descending score
    hybridScores.sort((a, b) => b.matchScore - a.matchScore);

    return hybridScores;
}

module.exports = { getRecommendations };
