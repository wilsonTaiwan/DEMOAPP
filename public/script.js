document.addEventListener('DOMContentLoaded', () => {
    const findRecipeButton = document.getElementById('findRecipe');
    const recipeResult = document.getElementById('recipeResult');
    const errorDiv = document.getElementById('error');

    findRecipeButton.addEventListener('click', async () => {
        findRecipeButton.disabled = true;
        recipeResult.classList.add('hidden');
        errorDiv.classList.add('hidden');
        
        try {
            const mood = document.getElementById('mood').value;
            const time = document.getElementById('time').value;
            
            console.log(`Fetching recipe for mood: ${mood}, time: ${time}`);
            
            const response = await fetch(`/api/recipe/${encodeURIComponent(mood)}/${encodeURIComponent(time)}`, {
                headers: {
                    'Accept': 'application/json'
                }
            });
            
            const data = await response.json();
            
            if (!response.ok) {
                throw new Error(typeof data.error === 'string' ? data.error : 'Failed to fetch recipe');
            }
            
            if (!data || !data.name) {
                throw new Error('Invalid recipe data received');
            }
            
            document.getElementById('recipeName').textContent = data.name;
            document.getElementById('ingredients').textContent = data.ingredients;
            document.getElementById('instructions').textContent = data.instructions;
            
            recipeResult.classList.remove('hidden');
            
        } catch (error) {
            console.error('Error:', error);
            errorDiv.textContent = error.message || 'An error occurred while fetching the recipe';
            errorDiv.classList.remove('hidden');
        } finally {
            findRecipeButton.disabled = false;
        }
    });
}); 