import { recipes } from '../../data/recipes.js';

export default async function handler(req, res) {
    // 设置响应头
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Content-Type', 'application/json');
    
    try {
        const { mood, time } = req.query;
        
        console.log(`Received request for mood: ${mood}, time: ${time}`);
        
        if (!mood || !time) {
            console.log('Missing parameters');
            return res.status(400).json({
                error: 'Missing mood or time parameters'
            });
        }

        const matchingRecipes = recipes.filter(recipe => 
            recipe.mood.toLowerCase() === mood.toLowerCase() && 
            recipe.time.toLowerCase() === time.toLowerCase()
        );

        console.log(`Found ${matchingRecipes.length} matching recipes`);

        if (matchingRecipes.length > 0) {
            const randomIndex = Math.floor(Math.random() * matchingRecipes.length);
            const recipe = matchingRecipes[randomIndex];
            console.log('Returning recipe:', recipe.name);
            return res.status(200).json(recipe);
        }

        console.log('No matching recipes found');
        return res.status(404).json({
            error: `No recipe found for mood: ${mood} and time: ${time}`
        });

    } catch (error) {
        console.error('Server error:', error);
        return res.status(500).json({
            error: 'Internal server error: ' + (error.message || 'Unknown error')
        });
    }
} 