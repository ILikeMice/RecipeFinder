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

    if (event.target.matches(".viewparent")) {
        document.querySelector(".viewparent").style.display = "none";
    }
});

async function findRecipes() { // Main recipe search function
    ingredients = [];
    for (let i = 0; i < document.querySelector(".ingredientdiv ul").children.length; i++) {
        ingredients.push(document.querySelector(".ingredientdiv ul").children[i].innerHTML);
    }
    console.log(ingredients);

    let url = "https://api.spoonacular.com/recipes/complexSearch?includeIngredients=" + ingredients.join(",") + "&number=5&apiKey=367f065fb39d414ebfedb65c1074c83b&addRecipeInformation=true&fillIngredients=true&addRecipeInstructions=true";

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

        let recipelist = {};
        let count = 0;
        data.results.forEach(recipe => {
            count++;
            recipelist[count] = recipe;
            let recipediv = document.createElement("div");
            recipediv.className = "recipe";
            recipediv.id = count;

            let img = document.createElement("img");
            img.src = recipe.image;

            let recipetxt = document.createElement("div");
            recipetxt.className = "recipetxt";
            recipetxt.addEventListener("click", () => {
                viewRecipe(count);
            });

            let recipetitle = document.createElement("span");
            recipetitle.className = "recipetitle";
            recipetitle.textContent = recipe.title;

            let recipedesc = document.createElement("span");
            recipedesc.className = "recipedesc";
            recipedesc.innerHTML = recipe.summary.replace(/<[^>]+>/g, "") // regex for hyperlinks etc since they lead to invalid urls;
            

            recipetxt.appendChild(recipetitle);
            recipetxt.appendChild(recipedesc);

            let viewbtn = document.createElement("button");
            viewbtn.className = "viewbtn";
            viewbtn.onclick = () => {
                likeRecpie(viewbtn.parentElement.id);
            }

            let likeimg = document.createElement("img");
            likeimg.src = "https://icons.hackclub.com/api/icons/black/like"
            JSON.parse(localStorage.getItem("liked")).forEach((liked) => {
                console.log(liked.id, recipe.id);
                if (liked.id == recipe.id) {
                    likeimg.src = "https://icons.hackclub.com/api/icons/black/like-fill"
                }
            });

            viewbtn.appendChild(likeimg);
            recipediv.appendChild(img);
            recipediv.appendChild(recipetxt);
            recipediv.appendChild(viewbtn);

            recipelistdiv.appendChild(recipediv);
        });

        localStorage.setItem("recipes", JSON.stringify(recipelist)); // For later use (api has about 150 daily calls)

        adjustRecipeHeight();
    } catch (error) {
        console.error("Error fetching recipes:", error);
        alert("An error occurred while fetching recipes. Please try again.");
    }
}

setInterval(() => { // Check incase a function fails
    adjustRecipeHeight();
}, 1000);


function viewRecipe(id) {
    document.querySelector(".viewparent").style.display = "block";
    let recpie = JSON.parse(localStorage.getItem("recipes"))[id.toString()]

    let viewdiv = document.querySelector(".viewimg");

    viewdiv.querySelector(".readypill").innerText = `Ready in ${recpie.readyInMinutes} minutes`;
    viewdiv.querySelector(".servingpill").innerText = `${recpie.servings} servings`;
    viewdiv.querySelector(".pricepill").innerText = `Price per Serving: $${(recpie.pricePerServing / 100).toFixed(1)}`;

    viewdiv.querySelector(".viewtitle").innerHTML = recpie.title;

    let ingredients = "Ingredients: \n";
    recpie.extendedIngredients.forEach(ingredient => {
        ingredients += "    -" + ingredient.name + "\n";
    });

    let steps = "Preparation Steps: \n";
    recpie.analyzedInstructions[0].steps.forEach(step => {
        steps += "    " + step.number + ". " + step.step + "\n\n";
    });

    document.querySelector(".viewdesc").innerHTML = ingredients + "\n\n" + steps;
}

function likeRecpie(id) { // "favourite" recipe
    let liked = localStorage.getItem("liked");

    if (liked) {
        liked = JSON.parse(liked);
    } else {
        liked = []; 
    }

    const recipe = JSON.parse(localStorage.getItem("recipes"))[id.toString()];

    
    if (liked.some(item => item.id === recipe.id)) {
        liked = liked.filter(item => item.id !== recipe.id);
        localStorage.setItem("liked", JSON.stringify(liked));
        document.getElementById(id).querySelector(".viewbtn img").src = "https://icons.hackclub.com/api/icons/black/like";
        console.log("Recipe unliked");
        return;
    }

    
    liked.push(recipe);

    liked = liked.filter((item, index, self) => index === self.findIndex(t => t.id === item.id));

    localStorage.setItem("liked", JSON.stringify(liked));
    document.getElementById(id).querySelector(".viewbtn img").src = "https://icons.hackclub.com/api/icons/black/like-fill";
    console.log("Recipe liked");
}