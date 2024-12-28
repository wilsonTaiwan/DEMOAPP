const express = require('express');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3002;

// Serve static files
app.use(express.static('public'));
app.use(express.json());

// 初始化空数组
const recipes = [];

// 添加所有食谱数据
const initializeRecipes = () => {
    recipes.push(
        // Happy Recipes
        {
            name: 'Morning Sunshine Smoothie Bowl',
            mood: 'happy',
            time: 'breakfast',
            ingredients: 'Mango, banana, orange juice, greek yogurt, granola, honey, chia seeds',
            instructions: 'Blend fruits with yogurt until smooth, top with granola, drizzle with honey, and sprinkle chia seeds.'
        },
        {
            name: 'Happy Brunch Pancakes',
            mood: 'happy',
            time: 'brunch',
            ingredients: 'Buttermilk, eggs, flour, vanilla, maple syrup, fresh berries, whipped cream',
            instructions: 'Make fluffy pancakes, stack them high, top with fresh berries and a cloud of whipped cream.'
        },
        {
            name: 'Colorful Buddha Bowl',
            mood: 'happy',
            time: 'lunch',
            ingredients: 'Quinoa, roasted chickpeas, avocado, rainbow vegetables, tahini dressing',
            instructions: 'Arrange colorful ingredients in a bowl, drizzle with creamy tahini dressing.'
        },
        {
            name: 'Happy Hour Tapas',
            mood: 'happy',
            time: 'afternoon',
            ingredients: 'Spanish olives, manchego cheese, crusty bread, tomato spread, jamón',
            instructions: 'Arrange a colorful spread of Mediterranean favorites for a cheerful afternoon snack.'
        },
        {
            name: 'Festive Taco Bar',
            mood: 'happy',
            time: 'dinner',
            ingredients: 'Corn tortillas, grilled fish, shrimp, avocado, mango salsa, lime crema',
            instructions: 'Set up a DIY taco bar with all the colorful toppings and let everyone create their own combinations.'
        },
        {
            name: 'Party Popcorn Mix',
            mood: 'happy',
            time: 'latenight',
            ingredients: 'Popcorn, M&Ms, pretzels, peanuts, white chocolate drizzle',
            instructions: 'Mix sweet and salty ingredients, drizzle with melted chocolate, and enjoy while watching a fun movie.'
        },
        {
            name: 'Rainbow Fruit Kebabs',
            mood: 'happy',
            time: 'snack',
            ingredients: 'Strawberries, oranges, pineapple, kiwi, blueberries, grapes, honey yogurt dip',
            instructions: 'Thread colorful fruits onto skewers in rainbow order, serve with honey yogurt dip.'
        },
        {
            name: 'Birthday Cake Sundae',
            mood: 'happy',
            time: 'dessert',
            ingredients: 'Vanilla ice cream, sprinkles, cake pieces, whipped cream, cherry, hot fudge',
            instructions: 'Layer ice cream with cake pieces, top with all the festive garnishes.'
        },

        // Melancholic Recipes
        {
            name: 'Dark Chocolate Oatmeal',
            mood: 'melancholic',
            time: 'breakfast',
            ingredients: 'Steel-cut oats, dark chocolate, sea salt, almond milk, coffee, maple syrup',
            instructions: 'Cook oats in coffee-infused milk, top with melted dark chocolate and sea salt.'
        },
        {
            name: 'Rainy Day French Toast',
            mood: 'melancholic',
            time: 'brunch',
            ingredients: 'Brioche, eggs, heavy cream, vanilla, cinnamon, maple syrup, butter',
            instructions: 'Dip thick brioche slices in rich custard, cook until golden, serve with warm maple syrup.'
        },
        {
            name: 'Comfort Mac and Cheese',
            mood: 'melancholic',
            time: 'lunch',
            ingredients: 'Aged cheddar, gruyere, pasta, breadcrumbs, truffle oil, chives',
            instructions: 'Bake until golden and bubbly, finish with a drizzle of truffle oil.'
        },
        {
            name: 'Earl Grey Tea Scones',
            mood: 'melancholic',
            time: 'afternoon',
            ingredients: 'Earl grey tea, cream, flour, butter, lavender honey, clotted cream',
            instructions: 'Bake tender scones infused with tea, serve with honey and cream.'
        },
        {
            name: 'Braised Short Ribs',
            mood: 'melancholic',
            time: 'dinner',
            ingredients: 'Beef short ribs, red wine, root vegetables, herbs, mashed potatoes',
            instructions: 'Slow cook until tender, serve over creamy mashed potatoes.'
        },
        {
            name: 'Midnight Comfort Ramen',
            mood: 'melancholic',
            time: 'latenight',
            ingredients: 'Ramen noodles, miso broth, soft-boiled egg, nori, green onions, corn',
            instructions: 'Prepare rich miso broth, cook noodles until tender, top with traditional garnishes.'
        },
        {
            name: 'Dark Chocolate Sea Salt Cookies',
            mood: 'melancholic',
            time: 'snack',
            ingredients: 'Dark chocolate, butter, flour, sea salt, vanilla, espresso powder',
            instructions: 'Bake until edges are set but centers remain soft, sprinkle with sea salt.'
        },
        {
            name: 'Dark Chocolate Lava Cake',
            mood: 'melancholic',
            time: 'dessert',
            ingredients: 'Dark chocolate, butter, eggs, sugar, vanilla extract, flour, sea salt',
            instructions: 'Bake until edges are set but center remains molten. Serve with a dusting of powdered sugar.'
        },

        // Energetic Recipes
        {
            name: 'Power Protein Smoothie',
            mood: 'energetic',
            time: 'breakfast',
            ingredients: 'Protein powder, banana, spinach, almond butter, chia seeds, almond milk',
            instructions: 'Blend all ingredients until smooth, top with extra chia seeds.'
        },
        {
            name: 'Energetic Acai Bowl',
            mood: 'energetic',
            time: 'brunch',
            ingredients: 'Acai powder, mixed berries, banana, granola, coconut, goji berries',
            instructions: 'Blend acai base until smooth, top with crunchy and energizing toppings.'
        },
        {
            name: 'Quinoa Power Bowl',
            mood: 'energetic',
            time: 'lunch',
            ingredients: 'Quinoa, grilled chicken, kale, sweet potato, avocado, seeds',
            instructions: 'Arrange protein-rich ingredients in a bowl, dress with lemon vinaigrette.'
        },
        {
            name: 'Energy Bite Platter',
            mood: 'energetic',
            time: 'afternoon',
            ingredients: 'Dates, nuts, protein powder, coconut, dark chocolate chips',
            instructions: 'Roll into bite-sized balls, perfect for an afternoon energy boost.'
        },
        {
            name: 'Grilled Salmon Bowl',
            mood: 'energetic',
            time: 'dinner',
            ingredients: 'Wild salmon, brown rice, roasted vegetables, ginger, sesame seeds',
            instructions: 'Grill salmon to perfection, serve over rice with Asian-inspired sauce.'
        },
        {
            name: 'Protein Energy Bars',
            mood: 'energetic',
            time: 'latenight',
            ingredients: 'Oats, protein powder, honey, nuts, dried fruit, dark chocolate',
            instructions: 'Mix ingredients, press into pan, chill until firm.'
        },
        {
            name: 'Trail Mix',
            mood: 'energetic',
            time: 'snack',
            ingredients: 'Mixed nuts, dried fruits, dark chocolate chips, coconut chips',
            instructions: 'Mix all ingredients for a perfect energy-boosting snack.'
        },
        {
            name: 'Berry Protein Parfait',
            mood: 'energetic',
            time: 'dessert',
            ingredients: 'Greek yogurt, mixed berries, granola, honey, mint',
            instructions: 'Layer ingredients in a glass, top with fresh mint.'
        },

        // Anxious Recipes
        {
            name: 'Calming Chamomile Oatmeal',
            mood: 'anxious',
            time: 'breakfast',
            ingredients: 'Oats, chamomile tea, honey, banana, cinnamon, almonds',
            instructions: 'Cook oats in chamomile tea, top with calming ingredients.'
        },
        {
            name: 'Avocado Toast',
            mood: 'anxious',
            time: 'brunch',
            ingredients: 'Sourdough bread, avocado, eggs, microgreens, seeds, lemon',
            instructions: 'Mash avocado with lemon, top with soft-boiled egg and seeds.'
        },
        {
            name: 'Grounding Root Vegetable Soup',
            mood: 'anxious',
            time: 'lunch',
            ingredients: 'Root vegetables, ginger, turmeric, coconut milk, herbs',
            instructions: 'Simmer until vegetables are tender, blend until smooth.'
        },
        {
            name: 'Lavender Shortbread',
            mood: 'anxious',
            time: 'afternoon',
            ingredients: 'Butter, flour, lavender, sugar, vanilla, salt',
            instructions: 'Bake delicate cookies infused with calming lavender.'
        },
        {
            name: 'Comfort Risotto',
            mood: 'anxious',
            time: 'dinner',
            ingredients: 'Arborio rice, mushrooms, parmesan, white wine, butter, thyme',
            instructions: 'Stir slowly until creamy, fold in mushrooms and cheese.'
        },
        {
            name: 'Calming Tea Latte',
            mood: 'anxious',
            time: 'latenight',
            ingredients: 'Chamomile tea, warm milk, honey, cinnamon, nutmeg',
            instructions: 'Steep tea in warm spiced milk, sweeten with honey.'
        },
        {
            name: 'Spiced Nuts',
            mood: 'anxious',
            time: 'snack',
            ingredients: 'Mixed nuts, rosemary, sea salt, olive oil, honey',
            instructions: 'Roast with herbs until fragrant and golden.'
        },
        {
            name: 'Warm Apple Crisp',
            mood: 'anxious',
            time: 'dessert',
            ingredients: 'Apples, oats, cinnamon, butter, brown sugar, vanilla ice cream',
            instructions: 'Bake until bubbly and golden, serve warm with ice cream.'
        },

        // Romantic Recipes
        {
            name: 'Rose Petal Pancakes',
            mood: 'romantic',
            time: 'breakfast',
            ingredients: 'Pancake batter, rose water, edible rose petals, honey, berries',
            instructions: 'Make delicate pancakes, garnish with rose petals and berries.'
        },
        {
            name: 'Champagne Brunch',
            mood: 'romantic',
            time: 'brunch',
            ingredients: 'Champagne, orange juice, smoked salmon, cream cheese, capers',
            instructions: 'Arrange an elegant brunch spread with bubbles and delicate bites.'
        },
        {
            name: 'Heart-Shaped Ravioli',
            mood: 'romantic',
            time: 'lunch',
            ingredients: 'Pasta dough, ricotta, spinach, nutmeg, truffle oil',
            instructions: 'Shape pasta into hearts, fill with creamy ricotta mixture.'
        },
        {
            name: 'Chocolate Covered Strawberries',
            mood: 'romantic',
            time: 'afternoon',
            ingredients: 'Fresh strawberries, dark chocolate, white chocolate, gold dust',
            instructions: 'Dip strawberries in tempered chocolate, decorate with gold.'
        },
        {
            name: 'Romantic Pasta',
            mood: 'romantic',
            time: 'dinner',
            ingredients: 'Homemade pasta, truffle oil, wild mushrooms, cream, parmesan',
            instructions: 'Toss fresh pasta in luxurious sauce, finish with shaved truffle.'
        },
        {
            name: 'Midnight Chocolate Fondue',
            mood: 'romantic',
            time: 'latenight',
            ingredients: 'Dark chocolate, cream, fruit, cake pieces, berries',
            instructions: 'Melt chocolate with cream, serve with dippers.'
        },
        {
            name: 'Love Letter Cookies',
            mood: 'romantic',
            time: 'snack',
            ingredients: 'Sugar cookies, royal icing, edible flowers, gold leaf',
            instructions: 'Decorate cookies with romantic messages and flowers.'
        },
        {
            name: 'Dreamy Soufflé',
            mood: 'romantic',
            time: 'dessert',
            ingredients: 'Dark chocolate, eggs, sugar, butter, vanilla bean, berries',
            instructions: 'Bake until perfectly risen, serve immediately with berries.'
        },

        // Contemplative Recipes
        {
            name: 'Zen Garden Smoothie Bowl',
            mood: 'contemplative',
            time: 'breakfast',
            ingredients: 'Dragon fruit, coconut milk, banana, matcha, black sesame seeds',
            instructions: 'Create a peaceful pattern with toppings on smooth base.'
        },
        {
            name: 'Mindful Meditation Bowl',
            mood: 'contemplative',
            time: 'brunch',
            ingredients: 'Brown rice, soft-boiled egg, seaweed, pickled vegetables',
            instructions: 'Arrange ingredients mindfully, eat with full attention.'
        },
        {
            name: 'Forest Mushroom Soup',
            mood: 'contemplative',
            time: 'lunch',
            ingredients: 'Wild mushrooms, thyme, cream, truffle oil, sourdough',
            instructions: 'Simmer slowly, serve with crusty bread for dipping.'
        },
        {
            name: 'Japanese Tea Ceremony',
            mood: 'contemplative',
            time: 'afternoon',
            ingredients: 'Matcha green tea, wagashi sweets, seasonal garnish',
            instructions: 'Prepare tea with focused attention and seasonal awareness.'
        },
        {
            name: 'Seasonal Grain Bowl',
            mood: 'contemplative',
            time: 'dinner',
            ingredients: 'Ancient grains, roasted vegetables, miso dressing, microgreens',
            instructions: 'Compose bowl thoughtfully with seasonal ingredients.'
        },
        {
            name: 'Moonlight Meditation Tea',
            mood: 'contemplative',
            time: 'latenight',
            ingredients: 'White tea, jasmine, honey, lemon, mint',
            instructions: 'Steep tea gently, sip slowly under moonlight.'
        },
        {
            name: 'Rice Paper Rolls',
            mood: 'contemplative',
            time: 'snack',
            ingredients: 'Rice paper, vegetables, herbs, tofu, peanut sauce',
            instructions: 'Roll mindfully, arrange in a peaceful pattern.'
        },
        {
            name: 'Matcha Green Tea Cake',
            mood: 'contemplative',
            time: 'dessert',
            ingredients: 'Matcha powder, white chocolate, cream, pistachios',
            instructions: 'Create subtle layers of green tea flavor.'
        }
    );

    // 添加调试日志
    console.log(`Initialized ${recipes.length} recipes`);
    console.log('Available combinations:', recipes.map(r => `${r.mood}-${r.time}`));
};

// API endpoint to get a random recipe by mood and time
app.get('/api/recipe/:mood/:time', (req, res) => {
    const { mood, time } = req.params;
    
    console.log(`Searching for recipe with mood: ${mood}, time: ${time}`);

    // 首先尝试找到完全匹配的食谱
    const matchingRecipes = recipes.filter(recipe => 
        recipe.mood === mood && recipe.time === time
    );

    if (matchingRecipes.length > 0) {
        // 随机返回一个匹配的食谱
        const randomIndex = Math.floor(Math.random() * matchingRecipes.length);
        return res.json(matchingRecipes[randomIndex]);
    }

    // 如果没有完全匹配的，尝试找到同样心情的食谱
    const moodRecipes = recipes.filter(recipe => recipe.mood === mood);
    
    if (moodRecipes.length > 0) {
        // 随机返回一个相同心情的食谱
        const randomIndex = Math.floor(Math.random() * moodRecipes.length);
        return res.json(moodRecipes[randomIndex]);
    }

    // 如果什么都没找到，返回 404
    res.status(404).json({
        error: 'No recipe found for this combination',
        mood,
        time
    });
});

// 初始化食谱数据
initializeRecipes();

// 启动服务器
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});