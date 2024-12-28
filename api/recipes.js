// 存储食谱的数组
const recipes = [
    // Happy Recipes
    {
        name: 'Morning Sunshine Smoothie Bowl',
        mood: 'happy',
        time: 'breakfast',
        ingredients: 'Mango, banana, orange juice, greek yogurt, granola, honey, chia seeds',
        instructions: 'Blend fruits with yogurt until smooth, top with granola, drizzle with honey, and sprinkle chia seeds.'
    },
    // ... 所有其他食谱 ...
];

// API handler
export default function handler(req, res) {
    const { mood, time } = req.query;
    
    console.log(`Searching for recipe with mood: ${mood}, time: ${time}`);

    // 首先尝试找到完全匹配的食谱
    const matchingRecipes = recipes.filter(recipe => 
        recipe.mood === mood && recipe.time === time
    );

    if (matchingRecipes.length > 0) {
        // 随机返回一个匹配的食谱
        const randomIndex = Math.floor(Math.random() * matchingRecipes.length);
        return res.status(200).json(matchingRecipes[randomIndex]);
    }

    // 如果没有完全匹配的，尝试找到同样心情的食谱
    const moodRecipes = recipes.filter(recipe => recipe.mood === mood);
    
    if (moodRecipes.length > 0) {
        // 随机返回一个相同心情的食谱
        const randomIndex = Math.floor(Math.random() * moodRecipes.length);
        return res.status(200).json(moodRecipes[randomIndex]);
    }

    // 如果什么都没找到，返回 404
    return res.status(404).json({
        error: 'No recipe found for this combination',
        mood,
        time
    });
} 