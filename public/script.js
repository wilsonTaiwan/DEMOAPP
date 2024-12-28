document.addEventListener('DOMContentLoaded', () => {
    const findRecipeButton = document.getElementById('findRecipe');
    const recipeResult = document.getElementById('recipeResult');
    const errorDiv = document.getElementById('error');

    findRecipeButton.addEventListener('click', async () => {
        const mood = document.getElementById('mood').value;
        const time = document.getElementById('time').value;
        
        try {
            const response = await fetch(`/api/recipe/${mood}/${time}`);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const recipe = await response.json();
            
            // Display recipe
            document.getElementById('recipeName').textContent = recipe.name;
            document.getElementById('ingredients').textContent = recipe.ingredients;
            document.getElementById('instructions').textContent = recipe.instructions;
            
            // Show recipe and hide error
            recipeResult.classList.remove('hidden');
            errorDiv.classList.add('hidden');
        } catch (error) {
            // Show error and hide recipe
            errorDiv.textContent = `Failed to fetch recipe: ${error.message}`;
            errorDiv.classList.remove('hidden');
            recipeResult.classList.add('hidden');
        }
    });
}); 