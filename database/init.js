const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./database/recipes.db');

// Create recipes table and insert sample data
db.serialize(() => {
    db.run(`CREATE TABLE IF NOT EXISTS recipes (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT,
        ingredients TEXT,
        instructions TEXT,
        mood TEXT
    )`);

    // Insert sample recipes
    const sampleRecipes = [
        {
            name: "Comforting Mac and Cheese",
            ingredients: "Macaroni, cheese, milk, butter, flour",
            instructions: "1. Cook macaroni\n2. Make cheese sauce\n3. Combine and bake",
            mood: "sad"
        },
        {
            name: "Energizing Smoothie Bowl",
            ingredients: "Banana, berries, yogurt, granola, honey",
            instructions: "1. Blend fruits\n2. Top with granola and honey",
            mood: "tired"
        },
        {
            name: "Spicy Tacos",
            ingredients: "Ground beef, taco seasoning, lettuce, tomatoes, cheese",
            instructions: "1. Cook beef\n2. Add seasoning\n3. Assemble tacos",
            mood: "happy"
        },
        {
            name: "Chocolate Chip Cookies",
            ingredients: "Flour, butter, chocolate chips, sugar, eggs",
            instructions: "1. Mix ingredients\n2. Bake at 350°F\n3. Enjoy warm",
            mood: "stressed"
        }
    ];

    const insert = db.prepare('INSERT INTO recipes (name, ingredients, instructions, mood) VALUES (?, ?, ?, ?)');
    sampleRecipes.forEach(recipe => {
        insert.run(recipe.name, recipe.ingredients, recipe.instructions, recipe.mood);
    });
    insert.finalize();
});

db.close(); 