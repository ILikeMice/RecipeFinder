function adjustRecipeHeight() { // Function to make the recipe image and button the same height as the text field bc css couldnt do it
    let recipes = document.querySelectorAll('.recipe');

    recipes.forEach(recipe => {
        let recipetxt = recipe.querySelector('.recipetxt');
        let recipetxtHeight = recipetxt.offsetHeight;

        recipe.style.height = `${recipetxtHeight}px`;

        let img = recipe.querySelector('img');
        let viewbtn = recipe.querySelector('.viewbtn');

        if (img) img.style.height = `${recipetxtHeight}px`;
        if (viewbtn) viewbtn.style.height = `${recipetxtHeight}px`;
    });
}

window.addEventListener('load', adjustRecipeHeight);
window.addEventListener('resize', adjustRecipeHeight);

async function completeIngredient() {
    let input = document.getElementById("search").value.toLowerCase();
    let url = `https://api.spoonacular.com/food/ingredients/autocomplete?query=${input}&number=5&apiKey=367f065fb39d414ebfedb65c1074c83b`;

    try {
        const res = await fetch(url);

        if (!res.ok) {
            alert("Error fetching data: " + res.statusText);
            return;
        }

        let json = await res.json();
        let results = json.map(item => item.name);
        console.log(results);
    } catch (error) {
        console.error("Error:", error);
        alert("An error occurred while fetching data.");
    }
}