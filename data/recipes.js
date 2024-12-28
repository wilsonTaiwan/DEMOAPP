export const recipes = [
    // ... 所有食谱数据 ...
];

// 验证数据
if (!recipes || !Array.isArray(recipes) || recipes.length === 0) {
    throw new Error('Invalid recipes data');
} 