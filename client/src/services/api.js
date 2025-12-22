const API_BASE_URL = 'http://localhost:5000/api';

/**
 * Fetch all available food items.
 */
export async function fetchFoods() {
    const response = await fetch(`${API_BASE_URL}/foods`);
    if (!response.ok) throw new Error('Failed to fetch foods');
    return await response.json();
}

/**
 * Fetch recommendations for a specific user.
 * @param {string|number} userId 
 */
export async function fetchRecommendations(userId) {
    const response = await fetch(`${API_BASE_URL}/recommendations/${userId}`);
    if (!response.ok) throw new Error('Failed to fetch recommendations');
    return await response.json();
}

/**
 * Submit a rating for a food item.
 * @param {string|number} userId 
 * @param {number} foodId 
 * @param {number} rating 
 */
export async function submitRating(userId, foodId, rating) {
    const response = await fetch(`${API_BASE_URL}/ratings`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userId, foodId, rating }),
    });
    if (!response.ok) throw new Error('Failed to submit rating');
    return await response.json();
}
