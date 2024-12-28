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
    ('Morning Sunshine Smoothie Bowl', 'happy', 'breakfast',
    'Mango, banana, orange juice, greek yogurt, granola, honey, chia seeds',
    'Blend fruits with yogurt until smooth, top with granola, drizzle with honey, and sprinkle chia seeds.'),

    ('Contemplative Coffee Oatmeal', 'contemplative', 'breakfast',
    'Steel-cut oats, espresso, almond milk, dark chocolate chips, sea salt, maple syrup',
    'Cook oats with coffee-infused almond milk, top with melted dark chocolate and a pinch of sea salt.'),

    ('Energetic Lunch Bowl', 'energetic', 'lunch',
    'Quinoa, grilled chicken, avocado, cherry tomatoes, lime, cilantro, chili flakes',
    'Layer quinoa base with protein and fresh ingredients, finish with a zesty lime dressing.'),

    ('Comfort Dinner Risotto', 'anxious', 'dinner',
    'Arborio rice, mushrooms, parmesan, white wine, butter, fresh thyme',
    'Slowly stir rice with warm broth until creamy, fold in sautéed mushrooms and cheese.'),

    ('Romantic Dinner Pasta', 'romantic', 'dinner',
    'Homemade pasta, truffle oil, wild mushrooms, cream, parmesan, fresh herbs',
    'Toss fresh pasta in a luxurious truffle cream sauce, garnish with shaved parmesan and herbs.'),

    ('Midnight Comfort Ramen', 'melancholic', 'latenight',
    'Ramen noodles, miso broth, soft-boiled egg, nori, green onions, corn',
    'Prepare rich miso broth, cook noodles until tender, top with traditional garnishes.'),

    ('Happy Hour Tapas', 'happy', 'afternoon',
    'Spanish olives, manchego cheese, crusty bread, tomato spread, jamón',
    'Arrange a colorful spread of Mediterranean favorites for a cheerful afternoon snack.'),

    ('Dreamy Dessert Soufflé', 'romantic', 'dessert',
    'Dark chocolate, eggs, sugar, butter, vanilla bean, powdered sugar',
    'Carefully fold whipped egg whites into chocolate base, bake until perfectly risen.')
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
        // 使用 Promise 包装数据库操作
        const getRecipe = () => {
            return new Promise((resolve, reject) => {
                const query = 'SELECT * FROM recipes WHERE mood = ? AND time = ? ORDER BY RANDOM() LIMIT 1';
                db.get(query, [mood, time], (err, recipe) => {
                    if (err) reject(err);
                    else resolve(recipe);
                });
            });
        };

        // 获取所有组合用于调试
        const getAllCombinations = () => {
            return new Promise((resolve, reject) => {
                db.all("SELECT mood, time FROM recipes", [], (err, rows) => {
                    if (err) reject(err);
                    else resolve(rows);
                });
            });
        };

        // 先获取所有组合
        const combinations = await getAllCombinations();
        console.log('Available combinations:', combinations);

        // 然后查找特定食谱
        const recipe = await getRecipe();
        
        if (!recipe) {
            console.log('No recipe found for this combination');
            return res.status(404).json({ 
                error: 'No recipe found for this mood and time combination',
                mood: mood,
                time: time,
                availableCombinations: combinations
            });
        }

        res.json(recipe);

    } catch (error) {
        console.error('Database error:', error);
        res.status(500).json({ 
            error: error.message,
            details: 'Database query failed',
            mood: mood,
            time: time
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