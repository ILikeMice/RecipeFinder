function loadRecipeDivs() { // gets all the liked recipes and puts them into divs
    let recipes = localStorage.getItem("liked");
    if (recipes) {
        recipes = JSON.parse(recipes);
    } else {
        recipes = [];
    }
    const recipesDiv = document.querySelector(".recipesdiv");
    recipesDiv.innerHTML = "";

    recipes.forEach((recipe, index) => {
        const recipeDiv = document.createElement("div");
        recipeDiv.className = "recipe";
        recipeDiv.id = `${index}`;
        recipeDiv.onclick = () => {
            viewRecipe(recipe.id);           
        }

        const img = document.createElement("img");
        img.src = recipe.image;
        img.alt = recipe.title;

        const recipeText = document.createElement("div");
        recipeText.className = "recipetxt";

        const recipeTitle = document.createElement("span");
        recipeTitle.className = "recipetitle";
        recipeTitle.textContent = recipe.title;

        const recipeDesc = document.createElement("span");
        recipeDesc.className = "recipedesc";
        recipeDesc.textContent = recipe.summary.replace(/<[^>]+>/g, "") // regex for hyperlinks etc since they lead to invalid urls
        
        recipeText.appendChild(recipeTitle);
        recipeText.appendChild(recipeDesc);

        const likeButton = document.createElement("button");
        likeButton.className = "viewbtn";
        likeButton.onclick = () => likeRecpie(index);

        const likeImg = document.createElement("img");
        likeImg.src = "https://icons.hackclub.com/api/icons/black/like";
        likeButton.appendChild(likeImg);

        recipeDiv.appendChild(img);
        recipeDiv.appendChild(recipeText);

        recipesDiv.appendChild(recipeDiv);
    });
}

window.addEventListener("load", loadRecipeDivs)

function viewRecipe(id) { // same as the vireRecipe function in script.js, opens a window with extended info
    let recipes = JSON.parse(localStorage.getItem("liked"));
    let recipe = recipes.find(r => r.id == id);

    if (!recipe) {
        console.error("Recipe not found");
        return;
    }

    let viewParent = document.querySelector(".viewparent");
    viewParent.style.display = "block";

    let viewDiv = document.querySelector(".viewimg");

    viewDiv.querySelector(".viewtitle").innerText = recipe.title;

    viewDiv.querySelector(".readypill").innerText = `Ready in ${recipe.readyInMinutes} minutes`;
    viewDiv.querySelector(".servingpill").innerText = `${recipe.servings} servings`;
    viewDiv.querySelector(".pricepill").innerText = `Price per Serving: $${(recipe.pricePerServing / 100).toFixed(2)}`;

    let ingredients = "Ingredients:\n";
    recipe.extendedIngredients.forEach(ingredient => {
        ingredients += `  - ${ingredient.name}\n`;
    });

    let steps = "Preparation Steps:\n";
    if (recipe.analyzedInstructions.length > 0) {
        recipe.analyzedInstructions[0].steps.forEach(step => {
            steps += `  ${step.number}. ${step.step}\n\n`;
        });
    } else {
        steps += "No preparation steps available.";
    }

    viewDiv.querySelector(".viewdesc").innerText = `${ingredients}\n\n${steps}`;
}

window.addEventListener('click', function(event) { 

    if (event.target.matches(".viewparent")) {
        document.querySelector(".viewparent").style.display = "none";
    }
});