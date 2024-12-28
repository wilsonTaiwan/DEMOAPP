import { recipes } from '../../data/recipes';

export default function handler(req, res) {
    // 从 URL 路径中获取参数
    const pathParts = req.url.split('/');
    const mood = pathParts[pathParts.length - 2];
    const time = pathParts[pathParts.length - 1].split('?')[0];  // 移除查询字符串
    
    console.log(`Searching for recipe with mood: ${mood}, time: ${time}`);

    try {
        // 首先尝试找到完全匹配的食谱
        const matchingRecipes = recipes.filter(recipe => 
            recipe.mood.toLowerCase() === mood.toLowerCase() && 
            recipe.time.toLowerCase() === time.toLowerCase()
        );

        if (matchingRecipes.length > 0) {
            const randomIndex = Math.floor(Math.random() * matchingRecipes.length);
            return res.status(200).json(matchingRecipes[randomIndex]);
        }

        // 如果没有找到，返回 404
        return res.status(404).json({
            error: 'No recipe found for this combination',
            mood,
            time
        });

    } catch (error) {
        console.error('Error processing request:', error);
        return res.status(500).json({
            error: 'Internal server error',
            details: error.message
        });
    }
} 