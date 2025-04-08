function loadRecipeDivs() {
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
        recipeDiv.id = `recipe-${index}`;

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