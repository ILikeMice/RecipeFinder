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

async function completeIngredient() { // Igredient search autocomplete dropdown
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

        let dropdownContent = document.querySelector(".dropcontent");
        document.querySelector(".dropdown").style.display = results.length ? "block" : "none";
        dropdownContent.innerHTML = '';

        results.forEach(result => {
            let item = document.createElement('div');
            item.className = "dropdown-item";
            item.textContent = result;
            item.addEventListener("click", () => {
                let ingredientdiv = document.createElement("div");
                ingredientdiv.addEventListener("click", () => {
                    ingredientdiv.remove();
                });
                ingredientdiv.className = "ingredient";
                ingredientdiv.innerHTML = result
                document.querySelector(".ingredientdiv ul").appendChild(ingredientdiv);
                dropdownContent.innerHTML = "";
                document.querySelector(".dropdown").style.display = "none";
                document.getElementById("search").value = "";
            });
            dropdownContent.appendChild(item);
        });
    } catch (error) {
        console.error("Error:", error);
        alert("An error occurred while fetching data.");
    }
}

const searchInput = document.getElementById('search');
searchInput.addEventListener('input', completeIngredient);

window.addEventListener('click', function(event) { // show/hide dropdown on focus/unfocused seachbar
    if (!event.target.matches('.dropdown-item') && !event.target.matches('#search')) {
        document.querySelector(".dropdown").style.display = "none";
    } else {
        document.querySelector(".dropdown").style.display = "block";
    }
});

async function findRecipes() { // Main recipe search function
    ingredients = [];
    for (let i = 0; i < document.querySelector(".ingredientdiv ul").children.length; i++) {
        ingredients.push(document.querySelector(".ingredientdiv ul").children[i].innerHTML);
    }
    console.log(ingredients);

    let url = "https://api.spoonacular.com/recipes/complexSearch?includeIngredients=" + ingredients.join(",") + "&number=5&apiKey=367f065fb39d414ebfedb65c1074c83b&addRecipeInformation=true&fillIngredients=true";

    try {
        const response = await fetch(url);
        const data = await response.json();

        console.log(data);

        if (!Array.isArray(data.results)) {
            console.error("Unexpected API response format:", data);
            alert("Failed to fetch recipes. Please try again.");
            return;
        }

        let recipelistdiv = document.querySelector(".recipesdiv");
        recipelistdiv.innerHTML = ""; 

        data.results.forEach(recipe => {
            let recipediv = document.createElement("div");
            recipediv.className = "recipe";

            let img = document.createElement("img");
            img.src = recipe.image;

            let recipetxt = document.createElement("div");
            recipetxt.className = "recipetxt";

            let recipetitle = document.createElement("span");
            recipetitle.className = "recipetitle";
            recipetitle.textContent = recipe.title;

            let recipedesc = document.createElement("span");
            recipedesc.className = "recipedesc";
            recipedesc.innerHTML = recipe.summary || "Description not available.";

            recipetxt.appendChild(recipetitle);
            recipetxt.appendChild(recipedesc);

            let viewbtn = document.createElement("button");
            viewbtn.className = "viewbtn";
            viewbtn.textContent = "View";
            viewbtn.addEventListener("click", () => {
                viewRecipe(recipe.title)
            });

            recipediv.appendChild(img);
            recipediv.appendChild(recipetxt);
            recipediv.appendChild(viewbtn);

            recipelistdiv.appendChild(recipediv);
        });

        adjustRecipeHeight();
    } catch (error) {
        console.error("Error fetching recipes:", error);
        alert("An error occurred while fetching recipes. Please try again.");
    }
}

setInterval(() => { // Check eevry 5sec incase a function fails once
    adjustRecipeHeight();
}, 5000);

async function viewRecipe(name) {
    document.querySelector(".viewparent").style.display = "block";


}