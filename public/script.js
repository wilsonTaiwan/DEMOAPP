document.addEventListener('DOMContentLoaded', () => {
    const findRecipeButton = document.getElementById('findRecipe');
    const recipeResult = document.getElementById('recipeResult');
    const errorDiv = document.getElementById('error');
    const moodSelect = document.getElementById('mood');
    const timeSelect = document.getElementById('time');

    findRecipeButton.addEventListener('click', async () => {
        // 禁用按钮，防止重复点击
        findRecipeButton.disabled = true;
        
        try {
            const mood = moodSelect.value;
            const time = timeSelect.value;
            
            console.log(`Fetching recipe for mood: ${mood}, time: ${time}`);
            
            const response = await fetch(`/api/recipe/${mood}/${time}`);
            const data = await response.json();
            
            if (!response.ok) {
                throw new Error(data.error || `HTTP error! status: ${response.status}`);
            }
            
            // 显示食谱
            document.getElementById('recipeName').textContent = data.name;
            document.getElementById('ingredients').textContent = data.ingredients;
            document.getElementById('instructions').textContent = data.instructions;
            
            // 显示食谱区域，隐藏错误信息
            recipeResult.classList.remove('hidden');
            errorDiv.classList.add('hidden');
            
        } catch (error) {
            console.error('Error fetching recipe:', error);
            // 显示错误信息，隐藏食谱区域
            errorDiv.textContent = error.message;
            errorDiv.classList.remove('hidden');
            recipeResult.classList.add('hidden');
        } finally {
            // 重新启用按钮
            findRecipeButton.disabled = false;
        }
    });

    // 当选择改变时清除之前的结果
    moodSelect.addEventListener('change', clearResults);
    timeSelect.addEventListener('change', clearResults);

    function clearResults() {
        recipeResult.classList.add('hidden');
        errorDiv.classList.add('hidden');
    }
}); 