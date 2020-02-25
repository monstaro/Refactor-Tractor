import $ from 'jquery';
import User from './user';
import Recipe from './recipe';
import './css/base.scss';
import './css/styles.scss';
import './images/apple-logo.png'
import './images/apple-logo-outline.png'
import './images/heart.svg'
import './images/heart-full.svg'
import './images/cookbook.png'
import './images/seasoning.png'
import './images/search.png'
import './images/chef.svg'
import './images/chef-filled.svg'




let urls = ['https://fe-apps.herokuapp.com/api/v1/whats-cookin/1911/users/wcUsersData', 'https://fe-apps.herokuapp.com/api/v1/whats-cookin/1911/ingredients/ingredientsData', 'https://fe-apps.herokuapp.com/api/v1/whats-cookin/1911/recipes/recipeData']

const onLoadHelper = () => {
  createCards()
  findTags()
  generateUser()
}

let users = fetch(urls[0])
  .then(response => response.json())
  .catch(err => err.message)
let ingredientsData = fetch(urls[1])
  .then(response => response.json())
  .catch(err => err.message)
let recipeData = fetch(urls[2])
  .then(response => response.json())
  .catch(err => err.message)

Promise.all([users, ingredientsData, recipeData])
  .then(data => {
    users = data[0].wcUsersData
    ingredientsData = data[1].ingredientsData
    recipeData = data[2].recipeData
  })
  .then(onLoadHelper)
  .catch(err => err.message)



let allRecipesBtn = $(".show-all-btn");
let filterBtn = $(".filter-btn");
let fullRecipeInfo = $(".recipe-instructions");
let main = document.querySelector("main"); 
// ^^ doesn't work w jquery for some reason
let menuOpen = false;
let pantryBtn = $(".my-pantry-btn");
let pantryInfo = [];
let recipes = [];
let favedRecipesBtn = $(".faved-recipes-btn");
let recipesToCookBtn = $('.recipes-to-cook-btn')
let searchBtn = $(".search-btn");
let searchForm = document.querySelector("#search");
let searchInput = document.querySelector("#search-input");
let showPantryRecipes = document.querySelector(".show-pantry-recipes-btn");
let tagList = document.querySelector(".tag-list");
let user;




allRecipesBtn.on("click", showAllRecipes);
filterBtn.on("click", findCheckedBoxes);
main.addEventListener("click", checkIcon);
pantryBtn.on("click", toggleMenu);
favedRecipesBtn.on("click", showFavedRecipes);
recipesToCookBtn.on('click', showRecipesToCook)
searchBtn.on("keypress", searchRecipes);
showPantryRecipes.addEventListener("click", findCheckedPantryBoxes);
searchForm.addEventListener("keypress", pressEnterSearch);




// GENERATE A USER ON LOAD
function generateUser() {
  user = new User(users[Math.floor(Math.random() * users.length)]);
  let firstName = user.name.split(" ")[0];
  let welcomeMsg = `
    <div class="welcome-msg">
      <h1>Welcome ${firstName}!</h1>
    </div>`;
  document.querySelector(".banner-image").insertAdjacentHTML("afterbegin",
    welcomeMsg);
  findPantryInfo();
}

// CREATE RECIPE CARDS
function createCards() {
  recipeData.forEach(recipe => {
    let recipeInfo = new Recipe(recipe);
    let shortRecipeName = recipeInfo.name;
    recipes.push(recipeInfo);
    if (recipeInfo.name.length > 40) {
      shortRecipeName = recipeInfo.name.substring(0, 40) + "...";
    }
    addToDom(recipeInfo, shortRecipeName)
  });
}

function addToDom(recipeInfo, shortRecipeName) {
  let tag = (recipeInfo.tags[0]) ?  recipeInfo.tags[0] : 'No Tags';
  let cardHtml = `
    <div class="recipe-card" id=${recipeInfo.id}>
      <h3 maxlength="40">${shortRecipeName}</h3>
      <div class="card-photo-container">
        <img src=${recipeInfo.image} class="card-photo-preview" alt="${recipeInfo.name} recipe" title="${recipeInfo.name} recipe">
        <div class="text">
          <div>Click for Instructions</div>
        </div>
      </div>
      <h4>${tag}</h4>
      <div class="recipe-card-buttons">
        <button>
          <img src="./images/chef.svg" alt="unfilled to-cook icon" class="unfilled-to-cook" />
        </button>
        <button>
          <img src="./images/heart.svg" alt="unfilled favorite icon" class="unfilled-heart" />
        </button>
      </div>
    </div>`
  main.insertAdjacentHTML("beforeend", cardHtml);
}

// FILTER BY RECIPE TAGS
function findTags() {
  let tags = [];
  recipeData.forEach(recipe => {
    recipe.tags.forEach(tag => {
      if (!tags.includes(tag)) {
        tags.push(tag);
      }
    });
  });
  tags.sort();
  listTags(tags);
}

function listTags(allTags) {
  allTags.forEach(tag => {
    let tagHtml = `<li><input type="checkbox" class="checked-tag" id="${tag}">
      <label for="${tag}">${capitalize(tag)}</label></li>`;
    tagList.insertAdjacentHTML("beforeend", tagHtml);
  });
}

function capitalize(words) {
  return words.split(" ").map(word => {
    return word.charAt(0).toUpperCase() + word.slice(1);
  }).join(" ");
}

function findCheckedBoxes() {
  let tagCheckboxes = document.querySelectorAll(".checked-tag");
  let checkboxInfo = Array.from(tagCheckboxes)
  let selectedTags = checkboxInfo.filter(box => {
    return box.checked;
  })
  findTaggedRecipes(selectedTags);
}

function findTaggedRecipes(selected) {
  let filteredResults = [];
  selected.forEach(tag => {
    let allRecipes = recipes.filter(recipe => {
      return recipe.tags.includes(tag.id);
    });
    allRecipes.forEach(recipe => {
      if (!filteredResults.includes(recipe)) {
        filteredResults.push(recipe);
      }
    })
  });
  showAllRecipes();
  if (filteredResults.length > 0) {
    filterRecipes(filteredResults);
  }
}

function filterRecipes(filtered) {
  let foundRecipes = recipes.filter(recipe => {
    return !filtered.includes(recipe);
  });
  hideUnselectedRecipes(foundRecipes)
}

function hideUnselectedRecipes(foundRecipes) {
  foundRecipes.forEach(recipe => {
    let domRecipe = document.getElementById(`${recipe.id}`);
    domRecipe.style.display = "none";
  });
}

// FAVORITE RECIPE FUNCTIONALITY

function checkIcon(e) {
  if (e.target.className === 'unfilled-to-cook') {
    addToRecipesToCook()
  }
  if (e.target.className === 'unfilled-heart') {
    addToMyFavorites()
  }
  if (e.target.className === 'card-photo-container') {

    openRecipeInfo(event)
  }
}


function addToMyFavorites() {
  let cardId = parseInt(event.target.closest(".recipe-card").id)
  if (!user.favoriteRecipes.includes(cardId)) {
    event.target.src = "./images/heart-full.svg";
    user.saveRecipe(cardId);
  } else {
    event.target.src = "./images/heart.svg";
    user.removeRecipe(cardId);
  }
}


function addToRecipesToCook() {
  let cardId = parseInt(event.target.closest(".recipe-card").id)
  if (!user.recipesToCook.includes(cardId)) {
    event.target.src = "./images/chef-filled.svg";
    user.decideToCook(cardId);
  } else {
    event.target.src = "./images/chef.svg";
    user.decideNotToCook(cardId);
  }
}


function showFavedRecipes() {
  let unsavedRecipes = recipes.filter(recipe => {
    return !user.favoriteRecipes.includes(recipe.id);
  });
  unsavedRecipes.forEach(recipe => {
    let domRecipe = document.getElementById(`${recipe.id}`);
    domRecipe.style.display = "none";
  });
  showMyRecipesBanner();
}


function showRecipesToCook() {
  let unsavedRecipes = recipes.filter(recipe => {
    return !user.recipesToCook.includes(recipe.id);
  });
  unsavedRecipes.forEach(recipe => {
    let domRecipe = document.getElementById(`${recipe.id}`);
    domRecipe.style.display = "none";
  });
  // showMyRecipesBanner();
}

// CREATE RECIPE INSTRUCTIONS
function openRecipeInfo(event) {
  fullRecipeInfo.css('display', 'inline')
  let recipeId = event.path.find(e => e.id).id;
  let recipe = recipeData.find(recipe => recipe.id === Number(recipeId));
  generateRecipeTitle(recipe, generateIngredients(recipe));
  addRecipeImage(recipe);
  generateInstructions(recipe);
  $('#exit-recipe-btn').on('click', exitRecipe)
}

function generateRecipeTitle(recipe, ingredients) {
  let recipeTitle = `
    <button id="exit-recipe-btn">X</button>
    <h3 class="recipe-title" id=${recipe.id}>${recipe.name}</h3>
    <h4>Ingredients</h4>
    <p>${ingredients}</p>`
  fullRecipeInfo.append(recipeTitle);
}

function addRecipeImage(recipe) {
  document.getElementById(`${recipe.id}`).style.backgroundImage = `url(${recipe.image})`;
}

function generateIngredients(recipe) {
  return recipe.ingredients.map(i => {
    let ingredient = ingredientsData.find(item => item.id === i.id)
    return `${capitalize(ingredient.name)} (${i.quantity.amount} ${i.quantity.unit})`
  }).join(", ");
}

function generateInstructions(recipe) {
  let instructionsList = "";
  let instructions = recipe.instructions.map(i => {
    return i.instruction
  });
  instructions.forEach(i => {
    instructionsList += `<li>${i}</li>`
  });
  fullRecipeInfo.append("<h4>Instructions</h4>");
  fullRecipeInfo.append(`<ol>${instructionsList}</ol>`);
}

function exitRecipe() {
  fullRecipeInfo.css('display', 'none')
}

// TOGGLE DISPLAYS
function showMyRecipesBanner() {
  document.querySelector(".welcome-msg").style.display = "none";
  document.querySelector(".my-recipes-banner").style.display = "block";
}

function showWelcomeBanner() {
  document.querySelector(".welcome-msg").style.display = "flex";
  document.querySelector(".my-recipes-banner").style.display = "none";
}

// SEARCH RECIPES
function pressEnterSearch(event) {
  // event.preventDefault();
  searchRecipes();
}

function searchRecipes() {
  console.log('f')
  showAllRecipes();
  let searchedRecipes = recipeData.filter(recipe => {
    return recipe.name.toLowerCase().includes(searchInput.value.toLowerCase());
  });
  filterNonSearched(createRecipeObject(searchedRecipes));
}

function filterNonSearched(filtered) {
  let found = recipes.filter(recipe => {
    let ids = filtered.map(f => f.id);
    return !ids.includes(recipe.id)
  })
  hideUnselectedRecipes(found);
}

function createRecipeObject(recipes) {
  recipes = recipes.map(recipe => new Recipe(recipe));
  return recipes
}

function toggleMenu() {
  var menuDropdown = document.querySelector(".drop-menu");
  menuOpen = !menuOpen;
  if (menuOpen) {
    menuDropdown.style.display = "block";
  } else {
    menuDropdown.style.display = "none";
  }
}

function showAllRecipes() {
  recipes.forEach(recipe => {
    let domRecipe = document.getElementById(`${recipe.id}`);
    domRecipe.style.display = "block";
  });
  showWelcomeBanner();
}

// CREATE AND USE PANTRY
function findPantryInfo() {
  user.pantry.forEach(item => {
    let itemInfo = ingredientsData.find(ingredient => {
      return ingredient.id === item.ingredient;
    });
    let originalIngredient = pantryInfo.find(ingredient => {
      if (itemInfo) {
        return ingredient.name === itemInfo.name;
      }
    });
    if (itemInfo && originalIngredient) {
      originalIngredient.count += item.amount;
    } else if (itemInfo) {
      pantryInfo.push({
        name: itemInfo.name,
        count: item.amount
      });
    }
  });
  displayPantryInfo(pantryInfo.sort((a, b) => a.name.localeCompare(b.name)));
}

function displayPantryInfo(pantry) {
  pantry.forEach(ingredient => {
    let ingredientHtml = `<li><input type="checkbox" class="pantry-checkbox" id="${ingredient.name}">
      <label for="${ingredient.name}">${ingredient.name}, ${ingredient.count}</label></li>`;
    document.querySelector(".pantry-list").insertAdjacentHTML("beforeend",
      ingredientHtml);
  });
}

function findCheckedPantryBoxes() {
  let pantryCheckboxes = document.querySelectorAll(".pantry-checkbox");
  let pantryCheckboxInfo = Array.from(pantryCheckboxes)
  let selectedIngredients = pantryCheckboxInfo.filter(box => {
    return box.checked;
  })
  showAllRecipes();
  if (selectedIngredients.length > 0) {
    findRecipesWithCheckedIngredients(selectedIngredients);
  }
}

function findRecipesWithCheckedIngredients(selected) {
  let recipeChecker = (arr, target) => target.every(v => arr.includes(v));
  let ingredientNames = selected.map(item => {
    return item.id;
  })
  recipes.forEach(recipe => {
    let allRecipeIngredients = [];
    recipe.ingredients.forEach(ingredient => {
      allRecipeIngredients.push(ingredient.name);
    });
    if (!recipeChecker(allRecipeIngredients, ingredientNames)) {
      let domRecipe = document.getElementById(`${recipe.id}`);
      domRecipe.style.display = "none";
    }
  })
}


//For later use `You have ${item.amount} ${unit} of ${ingredientName}, you need ${requiredAmount} ${ingredient.quantity.unit} to make this reicpe.`