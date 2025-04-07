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

            let recipetitle = document.createElement("span");
            recipetitle.className = "recipetitle";
            recipetitle.textContent = recipe.title;

            let recipedesc = document.createElement("span");
            recipedesc.className = "recipedesc";
            recipedesc.innerHTML = recipe.summary || "Description not available.";
            recipedesc.addEventListener("click", () => {
                viewRecipe(count);
            });

            recipetxt.appendChild(recipetitle);
            recipetxt.appendChild(recipedesc);

            let viewbtn = document.createElement("button");
            viewbtn.className = "viewbtn";
            viewbtn.textContent = "View";
            viewbtn.addEventListener("click", () => {
                addFavourite(count);
            });

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

let examplerecpie = {
    "id": 715415,
    "image": "https://img.spoonacular.com/recipes/715415-312x231.jpg",
    "imageType": "jpg",
    "title": "Red Lentil Soup with Chicken and Turnips",
    "readyInMinutes": 55,
    "servings": 8,
    "sourceUrl": "https://www.pinkwhen.com/red-lentil-soup-with-chicken-and-turnips/",
    "vegetarian": false,
    "vegan": false,
    "glutenFree": true,
    "dairyFree": true,
    "veryHealthy": true,
    "cheap": false,
    "veryPopular": true,
    "sustainable": false,
    "lowFodmap": false,
    "weightWatcherSmartPoints": 11,
    "gaps": "no",
    "preparationMinutes": 10,
    "cookingMinutes": 45,
    "aggregateLikes": 1866,
    "healthScore": 100,
    "creditsText": "pinkwhen.com",
    "license": null,
    "sourceName": "pinkwhen.com",
    "pricePerServing": 300.45,
    "extendedIngredients": [
        {
            "id": 9037,
            "aisle": "Produce",
            "image": "avocado.jpg",
            "consistency": "SOLID",
            "name": "additional toppings: avocado",
            "nameClean": "avocado",
            "original": "additional toppings: diced avocado, micro greens, chopped basil)",
            "originalName": "additional toppings: diced avocado, micro greens, chopped basil)",
            "amount": 8,
            "unit": "servings",
            "meta": [
                "diced",
                "chopped"
            ],
            "measures": {
                "us": {
                    "amount": 8,
                    "unitShort": "servings",
                    "unitLong": "servings"
                },
                "metric": {
                    "amount": 8,
                    "unitShort": "servings",
                    "unitLong": "servings"
                }
            }
        },
        {
            "id": 11124,
            "aisle": "Produce",
            "image": "sliced-carrot.png",
            "consistency": "SOLID",
            "name": "carrots",
            "nameClean": "carrot",
            "original": "3 medium carrots, peeled and diced",
            "originalName": "carrots, peeled and diced",
            "amount": 3,
            "unit": "medium",
            "meta": [
                "diced",
                "peeled"
            ],
            "measures": {
                "us": {
                    "amount": 3,
                    "unitShort": "medium",
                    "unitLong": "mediums"
                },
                "metric": {
                    "amount": 3,
                    "unitShort": "medium",
                    "unitLong": "mediums"
                }
            }
        },
        {
            "id": 10111143,
            "aisle": "Produce",
            "image": "celery.jpg",
            "consistency": "SOLID",
            "name": "celery stalks",
            "nameClean": "celery sticks",
            "original": "3 celery stalks, diced",
            "originalName": "celery stalks, diced",
            "amount": 3,
            "unit": "",
            "meta": [
                "diced"
            ],
            "measures": {
                "us": {
                    "amount": 3,
                    "unitShort": "",
                    "unitLong": ""
                },
                "metric": {
                    "amount": 3,
                    "unitShort": "",
                    "unitLong": ""
                }
            }
        },
        {
            "id": 5064,
            "aisle": "Meat",
            "image": "cooked-chicken-breast.png",
            "consistency": "SOLID",
            "name": "chicken breast",
            "nameClean": "cooked chicken breast",
            "original": "2 cups fully-cooked chicken breast, shredded (may be omitted for a vegetarian version)",
            "originalName": "fully-cooked chicken breast, shredded (may be omitted for a vegetarian version)",
            "amount": 2,
            "unit": "cups",
            "meta": [
                "shredded",
                "fully-cooked",
                "for a vegetarian version",
                "(may be omitted )"
            ],
            "measures": {
                "us": {
                    "amount": 2,
                    "unitShort": "cups",
                    "unitLong": "cups"
                },
                "metric": {
                    "amount": 280,
                    "unitShort": "g",
                    "unitLong": "grams"
                }
            }
        },
        {
            "id": 10311297,
            "aisle": "Produce",
            "image": "parsley.jpg",
            "consistency": "SOLID",
            "name": "flat leaf parsley",
            "nameClean": "flat leaf parsley",
            "original": "½ cup flat leaf Italian parsley, chopped (plus extra for garnish)",
            "originalName": "flat leaf Italian parsley, chopped (plus extra for garnish)",
            "amount": 0.5,
            "unit": "cup",
            "meta": [
                "italian",
                "chopped",
                "for garnish",
                "(plus extra )"
            ],
            "measures": {
                "us": {
                    "amount": 0.5,
                    "unitShort": "cups",
                    "unitLong": "cups"
                },
                "metric": {
                    "amount": 30,
                    "unitShort": "g",
                    "unitLong": "grams"
                }
            }
        },
        {
            "id": 11215,
            "aisle": "Produce",
            "image": "garlic.png",
            "consistency": "SOLID",
            "name": "garlic",
            "nameClean": "garlic",
            "original": "6 cloves of garlic, finely minced",
            "originalName": "garlic, finely minced",
            "amount": 6,
            "unit": "cloves",
            "meta": [
                "finely minced"
            ],
            "measures": {
                "us": {
                    "amount": 6,
                    "unitShort": "cloves",
                    "unitLong": "cloves"
                },
                "metric": {
                    "amount": 6,
                    "unitShort": "cloves",
                    "unitLong": "cloves"
                }
            }
        },
        {
            "id": 4053,
            "aisle": "Oil, Vinegar, Salad Dressing",
            "image": "olive-oil.jpg",
            "consistency": "LIQUID",
            "name": "olive oil",
            "nameClean": "olive oil",
            "original": "2 tablespoons olive oil",
            "originalName": "olive oil",
            "amount": 2,
            "unit": "tablespoons",
            "meta": [],
            "measures": {
                "us": {
                    "amount": 2,
                    "unitShort": "Tbsps",
                    "unitLong": "Tbsps"
                },
                "metric": {
                    "amount": 2,
                    "unitShort": "Tbsps",
                    "unitLong": "Tbsps"
                }
            }
        },
        {
            "id": 10011693,
            "aisle": "Canned and Jarred",
            "image": "tomatoes-canned.png",
            "consistency": "SOLID",
            "name": "canned tomatoes",
            "nameClean": "canned tomatoes",
            "original": "28 ounce-can plum tomatoes, drained and rinsed, chopped",
            "originalName": "can plum tomatoes, drained and rinsed, chopped",
            "amount": 28,
            "unit": "ounce",
            "meta": [
                "drained and rinsed",
                "chopped"
            ],
            "measures": {
                "us": {
                    "amount": 28,
                    "unitShort": "oz",
                    "unitLong": "ounces"
                },
                "metric": {
                    "amount": 793.787,
                    "unitShort": "g",
                    "unitLong": "grams"
                }
            }
        },
        {
            "id": 10016069,
            "aisle": "Pasta and Rice",
            "image": "red-lentils.png",
            "consistency": "SOLID",
            "name": "lentils",
            "nameClean": "dried red lentils",
            "original": "2 cups dried red lentils, rinsed",
            "originalName": "dried red lentils, rinsed",
            "amount": 2,
            "unit": "cups",
            "meta": [
                "dried",
                "red",
                "rinsed"
            ],
            "measures": {
                "us": {
                    "amount": 2,
                    "unitShort": "cups",
                    "unitLong": "cups"
                },
                "metric": {
                    "amount": 360,
                    "unitShort": "g",
                    "unitLong": "grams"
                }
            }
        },
        {
            "id": 1102047,
            "aisle": "Spices and Seasonings",
            "image": "salt-and-pepper.jpg",
            "consistency": "SOLID",
            "name": "salt and pepper",
            "nameClean": "salt and pepper",
            "original": "salt and black pepper, to taste",
            "originalName": "salt and black pepper, to taste",
            "amount": 8,
            "unit": "servings",
            "meta": [
                "black",
                "to taste"
            ],
            "measures": {
                "us": {
                    "amount": 8,
                    "unitShort": "servings",
                    "unitLong": "servings"
                },
                "metric": {
                    "amount": 8,
                    "unitShort": "servings",
                    "unitLong": "servings"
                }
            }
        },
        {
            "id": 11564,
            "aisle": "Produce",
            "image": "turnips.png",
            "consistency": "SOLID",
            "name": "turnip",
            "nameClean": "turnip",
            "original": "1 large turnip, peeled and diced",
            "originalName": "turnip, peeled and diced",
            "amount": 1,
            "unit": "large",
            "meta": [
                "diced",
                "peeled"
            ],
            "measures": {
                "us": {
                    "amount": 1,
                    "unitShort": "large",
                    "unitLong": "large"
                },
                "metric": {
                    "amount": 1,
                    "unitShort": "large",
                    "unitLong": "large"
                }
            }
        },
        {
            "id": 6615,
            "aisle": "Canned and Jarred",
            "image": "chicken-broth.png",
            "consistency": "LIQUID",
            "name": "vegetable stock",
            "nameClean": "vegetable stock",
            "original": "8 cups vegetable stock",
            "originalName": "vegetable stock",
            "amount": 8,
            "unit": "cups",
            "meta": [],
            "measures": {
                "us": {
                    "amount": 8,
                    "unitShort": "cups",
                    "unitLong": "cups"
                },
                "metric": {
                    "amount": 1.88,
                    "unitShort": "l",
                    "unitLong": "liters"
                }
            }
        },
        {
            "id": 10511282,
            "aisle": "Produce",
            "image": "brown-onion.png",
            "consistency": "SOLID",
            "name": "onion",
            "nameClean": "yellow onion",
            "original": "1 medium yellow onion, diced",
            "originalName": "yellow onion, diced",
            "amount": 1,
            "unit": "medium",
            "meta": [
                "diced",
                "yellow"
            ],
            "measures": {
                "us": {
                    "amount": 1,
                    "unitShort": "medium",
                    "unitLong": "medium"
                },
                "metric": {
                    "amount": 1,
                    "unitShort": "medium",
                    "unitLong": "medium"
                }
            }
        }
    ],
    "summary": "Red Lentil Soup with Chicken and Turnips might be a good recipe to expand your main course repertoire. This recipe serves 8 and costs $3.0 per serving. One serving contains <b>477 calories</b>, <b>27g of protein</b>, and <b>20g of fat</b>. It is brought to you by Pink When. 1866 people have tried and liked this recipe. It can be enjoyed any time, but it is especially good for <b>Autumn</b>. From preparation to the plate, this recipe takes approximately <b>55 minutes</b>. It is a good option if you're following a <b>gluten free and dairy free</b> diet. Head to the store and pick up salt and pepper, canned tomatoes, flat leaf parsley, and a few other things to make it today. Overall, this recipe earns a <b>spectacular spoonacular score of 99%</b>. If you like this recipe, you might also like recipes such as <a href=\"https://spoonacular.com/recipes/red-lentil-and-chicken-soup-682185\">Red Lentil and Chicken Soup</a>, <a href=\"https://spoonacular.com/recipes/red-lentil-and-chicken-soup-1058971\">Red Lentil and Chicken Soup</a>, and <a href=\"https://spoonacular.com/recipes/red-lentil-soup-34121\">Red-Lentil Soup</a>.",
    "cuisines": [],
    "dishTypes": [
        "lunch",
        "soup",
        "main course",
        "main dish",
        "dinner"
    ],
    "diets": [
        "gluten free",
        "dairy free"
    ],
    "occasions": [
        "fall",
        "winter"
    ],
    "analyzedInstructions": [
        {
            "name": "",
            "steps": [
                {
                    "number": 1,
                    "step": "To a large dutch oven or soup pot, heat the olive oil over medium heat.",
                    "ingredients": [
                        {
                            "id": 4053,
                            "name": "olive oil",
                            "localizedName": "olive oil",
                            "image": "olive-oil.jpg"
                        },
                        {
                            "id": 0,
                            "name": "soup",
                            "localizedName": "soup",
                            "image": ""
                        }
                    ],
                    "equipment": [
                        {
                            "id": 404667,
                            "name": "dutch oven",
                            "localizedName": "dutch oven",
                            "image": "https://spoonacular.com/cdn/equipment_100x100/dutch-oven.jpg"
                        }
                    ]
                },
                {
                    "number": 2,
                    "step": "Add the onion, carrots and celery and cook for 8-10 minutes or until tender, stirring occasionally.",
                    "ingredients": [
                        {
                            "id": 11124,
                            "name": "carrot",
                            "localizedName": "carrot",
                            "image": "sliced-carrot.png"
                        },
                        {
                            "id": 11143,
                            "name": "celery",
                            "localizedName": "celery",
                            "image": "celery.jpg"
                        },
                        {
                            "id": 11282,
                            "name": "onion",
                            "localizedName": "onion",
                            "image": "brown-onion.png"
                        }
                    ],
                    "equipment": [],
                    "length": {
                        "number": 10,
                        "unit": "minutes"
                    }
                },
                {
                    "number": 3,
                    "step": "Add the garlic and cook for an additional 2 minutes, or until fragrant. Season conservatively with a pinch of salt and black pepper.To the pot, add the tomatoes, turnip and red lentils. Stir to combine. Stir in the vegetable stock and increase the heat on the stove to high. Bring the soup to a boil and then reduce to a simmer. Simmer for 20 minutes or until the turnips are tender and the lentils are cooked through.",
                    "ingredients": [
                        {
                            "id": 1102047,
                            "name": "salt and pepper",
                            "localizedName": "salt and pepper",
                            "image": "salt-and-pepper.jpg"
                        },
                        {
                            "id": 6615,
                            "name": "vegetable stock",
                            "localizedName": "vegetable stock",
                            "image": "chicken-broth.png"
                        },
                        {
                            "id": 10016069,
                            "name": "red lentils",
                            "localizedName": "red lentils",
                            "image": "red-lentils.png"
                        },
                        {
                            "id": 11529,
                            "name": "tomato",
                            "localizedName": "tomato",
                            "image": "tomato.png"
                        },
                        {
                            "id": 10316069,
                            "name": "lentils",
                            "localizedName": "lentils",
                            "image": "lentils-brown.jpg"
                        },
                        {
                            "id": 11564,
                            "name": "turnip",
                            "localizedName": "turnip",
                            "image": "turnips.png"
                        },
                        {
                            "id": 11215,
                            "name": "garlic",
                            "localizedName": "garlic",
                            "image": "garlic.png"
                        },
                        {
                            "id": 0,
                            "name": "soup",
                            "localizedName": "soup",
                            "image": ""
                        }
                    ],
                    "equipment": [
                        {
                            "id": 404794,
                            "name": "stove",
                            "localizedName": "stove",
                            "image": "https://spoonacular.com/cdn/equipment_100x100/oven.jpg"
                        },
                        {
                            "id": 404752,
                            "name": "pot",
                            "localizedName": "pot",
                            "image": "https://spoonacular.com/cdn/equipment_100x100/stock-pot.jpg"
                        }
                    ],
                    "length": {
                        "number": 22,
                        "unit": "minutes"
                    }
                },
                {
                    "number": 4,
                    "step": "Add the chicken breast and parsley. Cook for an additional 5 minutes. Adjust seasoning to taste.",
                    "ingredients": [
                        {
                            "id": 5062,
                            "name": "chicken breast",
                            "localizedName": "chicken breast",
                            "image": "chicken-breasts.png"
                        },
                        {
                            "id": 1042027,
                            "name": "seasoning",
                            "localizedName": "seasoning",
                            "image": "seasoning.png"
                        },
                        {
                            "id": 11297,
                            "name": "parsley",
                            "localizedName": "parsley",
                            "image": "parsley.jpg"
                        }
                    ],
                    "equipment": [],
                    "length": {
                        "number": 5,
                        "unit": "minutes"
                    }
                },
                {
                    "number": 5,
                    "step": "Serve the soup immediately garnished with fresh parsley and any additional toppings. Enjoy!",
                    "ingredients": [
                        {
                            "id": 10511297,
                            "name": "fresh parsley",
                            "localizedName": "fresh parsley",
                            "image": "parsley.jpg"
                        },
                        {
                            "id": 0,
                            "name": "soup",
                            "localizedName": "soup",
                            "image": ""
                        }
                    ],
                    "equipment": []
                }
            ]
        }
    ],
    "spoonacularScore": 99.4273910522461,
    "spoonacularSourceUrl": "https://spoonacular.com/red-lentil-soup-with-chicken-and-turnips-715415",
    "usedIngredientCount": 0,
    "missedIngredientCount": 11,
    "missedIngredients": [
        {
            "id": 9037,
            "amount": 8,
            "unit": "servings",
            "unitLong": "servings",
            "unitShort": "servings",
            "aisle": "Produce",
            "name": "additional toppings: avocado",
            "original": "additional toppings: diced avocado, micro greens, chopped basil)",
            "originalName": "additional toppings: diced avocado, micro greens, chopped basil)",
            "meta": [
                "diced",
                "chopped"
            ],
            "extendedName": "diced additional toppings: avocado",
            "image": "https://img.spoonacular.com/ingredients_100x100/avocado.jpg"
        },
        {
            "id": 11124,
            "amount": 3,
            "unit": "medium",
            "unitLong": "mediums",
            "unitShort": "medium",
            "aisle": "Produce",
            "name": "carrots",
            "original": "3 medium carrots, peeled and diced",
            "originalName": "carrots, peeled and diced",
            "meta": [
                "diced",
                "peeled"
            ],
            "extendedName": "diced carrots",
            "image": "https://img.spoonacular.com/ingredients_100x100/sliced-carrot.png"
        },
        {
            "id": 10111143,
            "amount": 3,
            "unit": "",
            "unitLong": "",
            "unitShort": "",
            "aisle": "Produce",
            "name": "celery stalks",
            "original": "3 celery stalks, diced",
            "originalName": "celery stalks, diced",
            "meta": [
                "diced"
            ],
            "extendedName": "diced celery stalks",
            "image": "https://img.spoonacular.com/ingredients_100x100/celery.jpg"
        },
        {
            "id": 5064,
            "amount": 2,
            "unit": "cups",
            "unitLong": "cups",
            "unitShort": "cup",
            "aisle": "Meat",
            "name": "chicken breast",
            "original": "2 cups fully-cooked chicken breast, shredded (may be omitted for a vegetarian version)",
            "originalName": "fully-cooked chicken breast, shredded (may be omitted for a vegetarian version)",
            "meta": [
                "shredded",
                "fully-cooked",
                "for a vegetarian version",
                "(may be omitted )"
            ],
            "extendedName": "shredded chicken breast",
            "image": "https://img.spoonacular.com/ingredients_100x100/cooked-chicken-breast.png"
        },
        {
            "id": 10311297,
            "amount": 0.5,
            "unit": "cup",
            "unitLong": "cups",
            "unitShort": "cup",
            "aisle": "Produce",
            "name": "flat leaf parsley",
            "original": "½ cup flat leaf Italian parsley, chopped (plus extra for garnish)",
            "originalName": "flat leaf Italian parsley, chopped (plus extra for garnish)",
            "meta": [
                "italian",
                "chopped",
                "for garnish",
                "(plus extra )"
            ],
            "extendedName": "italian flat leaf parsley",
            "image": "https://img.spoonacular.com/ingredients_100x100/parsley.jpg"
        },
        {
            "id": 11215,
            "amount": 6,
            "unit": "cloves",
            "unitLong": "cloves",
            "unitShort": "cloves",
            "aisle": "Produce",
            "name": "garlic",
            "original": "6 cloves of garlic, finely minced",
            "originalName": "garlic, finely minced",
            "meta": [
                "finely minced"
            ],
            "image": "https://img.spoonacular.com/ingredients_100x100/garlic.png"
        },
        {
            "id": 10011693,
            "amount": 28,
            "unit": "ounce",
            "unitLong": "ounces",
            "unitShort": "oz",
            "aisle": "Canned and Jarred",
            "name": "canned tomatoes",
            "original": "28 ounce-can plum tomatoes, drained and rinsed, chopped",
            "originalName": "can plum tomatoes, drained and rinsed, chopped",
            "meta": [
                "drained and rinsed",
                "chopped"
            ],
            "image": "https://img.spoonacular.com/ingredients_100x100/tomatoes-canned.png"
        },
        {
            "id": 10016069,
            "amount": 2,
            "unit": "cups",
            "unitLong": "cups",
            "unitShort": "cup",
            "aisle": "Pasta and Rice",
            "name": "lentils",
            "original": "2 cups dried red lentils, rinsed",
            "originalName": "dried red lentils, rinsed",
            "meta": [
                "dried",
                "red",
                "rinsed"
            ],
            "extendedName": "red dried lentils",
            "image": "https://img.spoonacular.com/ingredients_100x100/red-lentils.png"
        },
        {
            "id": 11564,
            "amount": 1,
            "unit": "large",
            "unitLong": "large",
            "unitShort": "large",
            "aisle": "Produce",
            "name": "turnip",
            "original": "1 large turnip, peeled and diced",
            "originalName": "turnip, peeled and diced",
            "meta": [
                "diced",
                "peeled"
            ],
            "extendedName": "diced turnip",
            "image": "https://img.spoonacular.com/ingredients_100x100/turnips.png"
        },
        {
            "id": 6615,
            "amount": 8,
            "unit": "cups",
            "unitLong": "cups",
            "unitShort": "cup",
            "aisle": "Canned and Jarred",
            "name": "vegetable stock",
            "original": "8 cups vegetable stock",
            "originalName": "vegetable stock",
            "meta": [],
            "image": "https://img.spoonacular.com/ingredients_100x100/chicken-broth.png"
        },
        {
            "id": 10511282,
            "amount": 1,
            "unit": "medium",
            "unitLong": "medium",
            "unitShort": "medium",
            "aisle": "Produce",
            "name": "onion",
            "original": "1 medium yellow onion, diced",
            "originalName": "yellow onion, diced",
            "meta": [
                "diced",
                "yellow"
            ],
            "extendedName": "yellow diced onion",
            "image": "https://img.spoonacular.com/ingredients_100x100/brown-onion.png"
        }
    ],
    "likes": 0,
    "usedIngredients": [],
    "unusedIngredients": []
}

function viewRecipe(id) {
    document.querySelector(".viewparent").style.display = "block";
    // let recpie = localStorage.getItem("recpies")[id]
    recpie = examplerecpie; // testing :3

    let viewdiv = document.querySelector(".viewimg");

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