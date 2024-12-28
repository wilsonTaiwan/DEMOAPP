const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3002;

// Serve static files
app.use(express.static('public'));
app.use(express.json());

// Database connection
const dbPath = './database/recipes_new.db';

// 确保数据库目录存在
const fs = require('fs');
const dbDir = path.dirname(dbPath);
if (!fs.existsSync(dbDir)) {
    fs.mkdirSync(dbDir, { recursive: true });
}

// 在文件顶部，数据库连接之前添加这些常量
const createTableSQL = `
    CREATE TABLE IF NOT EXISTS recipes (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        mood TEXT NOT NULL,
        time TEXT NOT NULL,
        ingredients TEXT NOT NULL,
        instructions TEXT NOT NULL
    )
`;

const recipesSQL = `
    INSERT INTO recipes (name, mood, time, ingredients, instructions) VALUES
    /* Happy Recipes */
    ('Morning Sunshine Smoothie Bowl', 'happy', 'breakfast',
    'Mango, banana, orange juice, greek yogurt, granola, honey, chia seeds',
    'Blend fruits with yogurt until smooth, top with granola, drizzle with honey, and sprinkle chia seeds.'),
    
    ('Happy Brunch Pancakes', 'happy', 'brunch',
    'Buttermilk, eggs, flour, vanilla, maple syrup, fresh berries, whipped cream',
    'Make fluffy pancakes, stack them high, top with fresh berries and a cloud of whipped cream.'),
    
    ('Colorful Buddha Bowl', 'happy', 'lunch',
    'Quinoa, roasted chickpeas, avocado, rainbow vegetables, tahini dressing',
    'Arrange colorful ingredients in a bowl, drizzle with creamy tahini dressing.'),
    
    ('Happy Hour Tapas', 'happy', 'afternoon',
    'Spanish olives, manchego cheese, crusty bread, tomato spread, jamón',
    'Arrange a colorful spread of Mediterranean favorites for a cheerful afternoon snack.'),
    
    ('Festive Taco Bar', 'happy', 'dinner',
    'Corn tortillas, grilled fish, shrimp, avocado, mango salsa, lime crema',
    'Set up a DIY taco bar with all the colorful toppings and let everyone create their own combinations.'),
    
    ('Party Popcorn Mix', 'happy', 'latenight',
    'Popcorn, M&Ms, pretzels, peanuts, white chocolate drizzle',
    'Mix sweet and salty ingredients, drizzle with melted chocolate, and enjoy while watching a fun movie.'),
    
    ('Rainbow Fruit Kebabs', 'happy', 'snack',
    'Strawberries, oranges, pineapple, kiwi, blueberries, grapes, honey yogurt dip',
    'Thread colorful fruits onto skewers in rainbow order, serve with honey yogurt dip.'),
    
    ('Birthday Cake Sundae', 'happy', 'dessert',
    'Vanilla ice cream, sprinkles, cake pieces, whipped cream, cherry, hot fudge',
    'Layer ice cream with cake pieces, top with all the festive garnishes.'),

    /* Melancholic Recipes */
    ('Dark Chocolate Oatmeal', 'melancholic', 'breakfast',
    'Steel-cut oats, dark chocolate, sea salt, almond milk, coffee, maple syrup',
    'Cook oats in coffee-infused milk, top with melted dark chocolate and sea salt.'),
    
    ('Rainy Day French Toast', 'melancholic', 'brunch',
    'Brioche, eggs, heavy cream, vanilla, cinnamon, maple syrup, butter',
    'Dip thick brioche slices in rich custard, cook until golden, serve with warm maple syrup.'),
    
    ('Comfort Mac and Cheese', 'melancholic', 'lunch',
    'Aged cheddar, gruyere, pasta, breadcrumbs, truffle oil, chives',
    'Bake until golden and bubbly, finish with a drizzle of truffle oil.'),
    
    ('Earl Grey Tea Scones', 'melancholic', 'afternoon',
    'Earl grey tea, cream, flour, butter, lavender honey, clotted cream',
    'Bake tender scones infused with tea, serve with honey and cream.'),
    
    ('Braised Short Ribs', 'melancholic', 'dinner',
    'Beef short ribs, red wine, root vegetables, herbs, mashed potatoes',
    'Slow cook until tender, serve over creamy mashed potatoes.'),
    
    ('Midnight Comfort Ramen', 'melancholic', 'latenight',
    'Ramen noodles, miso broth, soft-boiled egg, nori, green onions, corn',
    'Prepare rich miso broth, cook noodles until tender, top with traditional garnishes.'),
    
    ('Dark Chocolate Sea Salt Cookies', 'melancholic', 'snack',
    'Dark chocolate, butter, flour, sea salt, vanilla, espresso powder',
    'Bake until edges are set but centers remain soft, sprinkle with sea salt.'),
    
    ('Dark Chocolate Lava Cake', 'melancholic', 'dessert',
    'Dark chocolate, butter, eggs, sugar, vanilla extract, flour, sea salt',
    'Bake until edges are set but center remains molten. Serve with a dusting of powdered sugar.'),

    /* Energetic Recipes */
    ('Power Protein Smoothie', 'energetic', 'breakfast',
    'Protein powder, banana, spinach, almond butter, chia seeds, almond milk',
    'Blend all ingredients until smooth, top with extra chia seeds.'),
    
    ('Energetic Acai Bowl', 'energetic', 'brunch',
    'Acai powder, mixed berries, banana, granola, coconut, goji berries',
    'Blend acai base until smooth, top with crunchy and energizing toppings.'),
    
    ('Quinoa Power Bowl', 'energetic', 'lunch',
    'Quinoa, grilled chicken, kale, sweet potato, avocado, seeds',
    'Arrange protein-rich ingredients in a bowl, dress with lemon vinaigrette.'),
    
    ('Energy Bite Platter', 'energetic', 'afternoon',
    'Dates, nuts, protein powder, coconut, dark chocolate chips',
    'Roll into bite-sized balls, perfect for an afternoon energy boost.'),
    
    ('Grilled Salmon Bowl', 'energetic', 'dinner',
    'Wild salmon, brown rice, roasted vegetables, ginger, sesame seeds',
    'Grill salmon to perfection, serve over rice with Asian-inspired sauce.'),
    
    ('Protein Energy Bars', 'energetic', 'latenight',
    'Oats, protein powder, honey, nuts, dried fruit, dark chocolate',
    'Mix ingredients, press into pan, chill until firm.'),
    
    ('Trail Mix', 'energetic', 'snack',
    'Mixed nuts, dried fruits, dark chocolate chips, coconut chips',
    'Mix all ingredients for a perfect energy-boosting snack.'),
    
    ('Berry Protein Parfait', 'energetic', 'dessert',
    'Greek yogurt, mixed berries, granola, honey, mint',
    'Layer ingredients in a glass, top with fresh mint.'),

    /* Anxious Recipes */
    ('Calming Chamomile Oatmeal', 'anxious', 'breakfast',
    'Oats, chamomile tea, honey, banana, cinnamon, almonds',
    'Cook oats in chamomile tea, top with calming ingredients.'),
    
    ('Avocado Toast', 'anxious', 'brunch',
    'Sourdough bread, avocado, eggs, microgreens, seeds, lemon',
    'Mash avocado with lemon, top with soft-boiled egg and seeds.'),
    
    ('Grounding Root Vegetable Soup', 'anxious', 'lunch',
    'Root vegetables, ginger, turmeric, coconut milk, herbs',
    'Simmer until vegetables are tender, blend until smooth.'),
    
    ('Lavender Shortbread', 'anxious', 'afternoon',
    'Butter, flour, lavender, sugar, vanilla, salt',
    'Bake delicate cookies infused with calming lavender.'),
    
    ('Comfort Risotto', 'anxious', 'dinner',
    'Arborio rice, mushrooms, parmesan, white wine, butter, thyme',
    'Stir slowly until creamy, fold in mushrooms and cheese.'),
    
    ('Calming Tea Latte', 'anxious', 'latenight',
    'Chamomile tea, warm milk, honey, cinnamon, nutmeg',
    'Steep tea in warm spiced milk, sweeten with honey.'),
    
    ('Spiced Nuts', 'anxious', 'snack',
    'Mixed nuts, rosemary, sea salt, olive oil, honey',
    'Roast with herbs until fragrant and golden.'),
    
    ('Warm Apple Crisp', 'anxious', 'dessert',
    'Apples, oats, cinnamon, butter, brown sugar, vanilla ice cream',
    'Bake until bubbly and golden, serve warm with ice cream.'),

    /* Romantic Recipes */
    ('Rose Petal Pancakes', 'romantic', 'breakfast',
    'Pancake batter, rose water, edible rose petals, honey, berries',
    'Make delicate pancakes, garnish with rose petals and berries.'),
    
    ('Champagne Brunch', 'romantic', 'brunch',
    'Champagne, orange juice, smoked salmon, cream cheese, capers',
    'Arrange an elegant brunch spread with bubbles and delicate bites.'),
    
    ('Heart-Shaped Ravioli', 'romantic', 'lunch',
    'Pasta dough, ricotta, spinach, nutmeg, truffle oil',
    'Shape pasta into hearts, fill with creamy ricotta mixture.'),
    
    ('Chocolate Covered Strawberries', 'romantic', 'afternoon',
    'Fresh strawberries, dark chocolate, white chocolate, gold dust',
    'Dip strawberries in tempered chocolate, decorate with gold.'),
    
    ('Romantic Pasta', 'romantic', 'dinner',
    'Homemade pasta, truffle oil, wild mushrooms, cream, parmesan',
    'Toss fresh pasta in luxurious sauce, finish with shaved truffle.'),
    
    ('Midnight Chocolate Fondue', 'romantic', 'latenight',
    'Dark chocolate, cream, fruit, cake pieces, berries',
    'Melt chocolate with cream, serve with dippers.'),
    
    ('Love Letter Cookies', 'romantic', 'snack',
    'Sugar cookies, royal icing, edible flowers, gold leaf',
    'Decorate cookies with romantic messages and flowers.'),
    
    ('Dreamy Soufflé', 'romantic', 'dessert',
    'Dark chocolate, eggs, sugar, butter, vanilla bean, berries',
    'Bake until perfectly risen, serve immediately with berries.'),

    /* Contemplative Recipes */
    ('Zen Garden Smoothie Bowl', 'contemplative', 'breakfast',
    'Dragon fruit, coconut milk, banana, matcha, black sesame seeds',
    'Create a peaceful pattern with toppings on smooth base.'),
    
    ('Mindful Meditation Bowl', 'contemplative', 'brunch',
    'Brown rice, soft-boiled egg, seaweed, pickled vegetables',
    'Arrange ingredients mindfully, eat with full attention.'),
    
    ('Forest Mushroom Soup', 'contemplative', 'lunch',
    'Wild mushrooms, thyme, cream, truffle oil, sourdough',
    'Simmer slowly, serve with crusty bread for dipping.'),
    
    ('Japanese Tea Ceremony', 'contemplative', 'afternoon',
    'Matcha green tea, wagashi sweets, seasonal garnish',
    'Prepare tea with focused attention and seasonal awareness.'),
    
    ('Seasonal Grain Bowl', 'contemplative', 'dinner',
    'Ancient grains, roasted vegetables, miso dressing, microgreens',
    'Compose bowl thoughtfully with seasonal ingredients.'),
    
    ('Moonlight Meditation Tea', 'contemplative', 'latenight',
    'White tea, jasmine, honey, lemon, mint',
    'Steep tea gently, sip slowly under moonlight.'),
    
    ('Rice Paper Rolls', 'contemplative', 'snack',
    'Rice paper, vegetables, herbs, tofu, peanut sauce',
    'Roll mindfully, arrange in a peaceful pattern.'),
    
    ('Matcha Green Tea Cake', 'contemplative', 'dessert',
    'Matcha powder, white chocolate, cream, pistachios',
    'Create subtle layers of green tea flavor.')
`;

// 创建数据库连接
const db = new sqlite3.Database(dbPath, (err) => {
    if (err) {
        console.error('Error opening database:', err);
        process.exit(1);
    }
    console.log('Connected to database');
    // 连接成功后初始化数据库
    initializeDatabase();
});

// Get random recipe by mood
app.get('/api/recipe/:mood/:time', async (req, res) => {
    const mood = req.params.mood;
    const time = req.params.time;
    
    console.log(`Searching for recipe with mood: ${mood}, time: ${time}`);

    try {
        // 首先检查数据库连接
        if (!db) {
            throw new Error('Database connection not available');
        }

        // 使用 Promise 包装数据库操作
        const getRecipe = () => {
            return new Promise((resolve, reject) => {
                db.get(
                    'SELECT * FROM recipes WHERE mood = ? AND time = ? ORDER BY RANDOM() LIMIT 1',
                    [mood, time],
                    (err, recipe) => {
                        if (err) reject(err);
                        else resolve(recipe);
                    }
                );
            });
        };

        // 获取食谱
        const recipe = await getRecipe();
        
        if (!recipe) {
            // 如果没找到特定组合的食谱，返回该心情下的任意食谱
            const fallbackRecipe = await new Promise((resolve, reject) => {
                db.get(
                    'SELECT * FROM recipes WHERE mood = ? ORDER BY RANDOM() LIMIT 1',
                    [mood],
                    (err, recipe) => {
                        if (err) reject(err);
                        else resolve(recipe);
                    }
                );
            });

            if (fallbackRecipe) {
                console.log(`Found fallback recipe for mood: ${mood}`);
                return res.json(fallbackRecipe);
            }
        }

        // 如果找到了特定组合的食谱，直接返回
        if (recipe) {
            console.log(`Found recipe: ${recipe.name}`);
            return res.json(recipe);
        }

        // 如果连 fallback 都没找到，返回 404
        res.status(404).json({
            error: 'No recipe found for this combination',
            mood: mood,
            time: time
        });

    } catch (error) {
        console.error('Database error:', error);
        res.status(500).json({
            error: 'Internal server error',
            details: error.message
        });
    }
});

// 将数据库初始化改为异步函数
async function initializeDatabase() {
    console.log('Starting database initialization...');
    
    try {
        // 检查表是否存在
        const table = await new Promise((resolve, reject) => {
            db.get("SELECT name FROM sqlite_master WHERE type='table' AND name='recipes'", (err, table) => {
                if (err) reject(err);
                else resolve(table);
            });
        });

        console.log('Table check result:', table);

        if (!table) {
            console.log('Creating new recipes table...');
            await new Promise((resolve, reject) => {
                db.serialize(() => {
                    db.run(createTableSQL, (err) => {
                        if (err) {
                            reject(err);
                            return;
                        }
                        console.log('Table created successfully');

                        db.exec(recipesSQL, (err) => {
                            if (err) reject(err);
                            else {
                                console.log('Initial recipes added successfully!');
                                resolve();
                            }
                        });
                    });
                });
            });
        } else {
            // 检查现有记录
            const count = await new Promise((resolve, reject) => {
                db.get("SELECT COUNT(*) as count FROM recipes", (err, result) => {
                    if (err) reject(err);
                    else resolve(result.count);
                });
            });
            console.log('Current recipe count:', count);
        }
    } catch (error) {
        console.error('Database initialization error:', error);
        process.exit(1);
    }
}

// 修改启动服务器的函数
function startServer() {
    const server = app.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`);
    }).on('error', (err) => {
        if (err.code === 'EADDRINUSE') {
            console.log(`Port ${PORT} is busy. Please try these solutions:`);
            console.log('1. Kill all Node processes and try again:');
            console.log('   Windows: taskkill /F /IM node.exe');
            console.log('   Mac/Linux: pkill node');
            console.log(`2. Or set a different port using PORT environment variable:`);
            console.log('   Windows: set PORT=3001 && npm run dev');
            console.log('   Mac/Linux: PORT=3001 npm run dev');
        } else {
            console.error('Server error:', err);
        }
        process.exit(1);
    });

    // 优雅关闭
    process.on('SIGTERM', gracefulShutdown);
    process.on('SIGINT', gracefulShutdown);

    function gracefulShutdown() {
        console.log('\nStarting graceful shutdown...');
        server.close(() => {
            console.log('Server closed');
            db.close(() => {
                console.log('Database connection closed');
                process.exit(0);
            });
        });

        // 如果 10 秒内没有完成关闭，强制退出
        setTimeout(() => {
            console.error('Could not close connections in time, forcefully shutting down');
            process.exit(1);
        }, 10000);
    }
}

// 初始化数据库并启动服务器
initializeDatabase();
startServer();