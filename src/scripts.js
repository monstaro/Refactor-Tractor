import $ from 'jquery';
import Recipe from './recipe.js';
import Pantry from './pantry.js';
import Cookbook from './cookbook.js'
import User from './user.js';
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
  createCookbook()
  createCards(cookbook.recipes)
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
let fullRecipeInfo = $(".recipe-instructions");
let main = $("main");
let menuOpen = false;
let pantryBtn = $(".my-pantry-btn");
let pantryInfo = [];
let favedRecipesBtn = $(".faved-recipes-btn");
let recipesToCookBtn = $('.recipes-to-cook-btn')
let searchForm = $("#search");
let searchInput = $("#search-input");
let showPantryRecipes = $(".drop-menu");
let tagList = $(".tag-list");
let user;
let cookbook;




allRecipesBtn.on("click", showAllRecipes);
tagList.on("click", findCheckedBoxes);
main.on("click", checkIcon);
pantryBtn.on("click", toggleMenu);
favedRecipesBtn.on("click", showFavedRecipes);
recipesToCookBtn.on('click', showRecipesToCook)
// searchBtn.on("click", searchRecipes);
// ^^ unneccesary functionality?
showPantryRecipes.on("click", findCheckedPantryBoxes);
searchForm.on("input", searchRecipes);




// GENERATE A USER ON LOAD
function generateUser() {
  user = new User(users[Math.floor(Math.random() * users.length)]);
  let firstName = user.name.split(" ")[0];
  let welcomeMsg = `
    <div class="welcome-msg">
      <h1>Welcome ${firstName}!</h1>
    </div>`;
  $(".banner-image").append(welcomeMsg);
  findPantryInfo();
}

// GENERATE A COOKBOOK ON LOAD

function createCookbook() {
  cookbook = new Cookbook(recipeData, ingredientsData);
}

// CREATE RECIPE CARDS
function createCards(recipes) {
  main.empty()
  recipes.forEach(recipe => {
    let shortRecipeName = recipe.name;
    if (recipe.name.length > 40) {
      shortRecipeName = recipe.name.substring(0, 40) + "...";
    }
    addToDom(recipe, shortRecipeName)
  });
}

function addToDom(recipeInfo, shortRecipeName) {
  let tag = (recipeInfo.tags[0]) ?  recipeInfo.tags[0] : 'No Tags';
  let heartImage = (recipeInfo.favorite) ? "./images/heart-full.svg" : "./images/heart.svg";
  let hatImage = (recipeInfo.toCook) ? "./images/chef-filled.svg" : "./images/chef.svg";
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
          <img src="${hatImage}" alt="unfilled to-cook icon" class="unfilled-to-cook" />
        </button>
        <button>
          <img src="${heartImage}" alt="unfilled favorite icon" class="unfilled-heart" />
        </button>
      </div>
    </div>`
  main.prepend( cardHtml);
}

// FILTER BY RECIPE TAGS
function findTags() {
  let tags = [];
  cookbook.recipes.forEach(recipe => {
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
    tagList.append(tagHtml);
  });
}

function capitalize(words) {
  return words.split(" ").map(word => {
    return word.charAt(0).toUpperCase() + word.slice(1);
  }).join(" ");
}

function findCheckedBoxes() {
  let tagCheckboxes = $(".checked-tag");
  let checkboxInfo = Array.from(tagCheckboxes)
  let selectedTags = checkboxInfo.filter(box => {
    return box.checked;
  })
  let editedSelectedTags = selectedTags.map(tag => tag.id);
  findTaggedRecipes(editedSelectedTags);
}

function findTaggedRecipes(selected) {
  showAllRecipes()
  let filteredResults = cookbook.filterRecipes('!!!', selected)
  if (filteredResults.length > 0) {
    createCards(filteredResults);
  }

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

// possible to refactor to jQuery?


function addToMyFavorites() {
  let cardId = parseInt(event.target.closest(".recipe-card").id)
  let recipe = cookbook.findRecipe(cardId)
  if (user.favoriteRecipes.includes(recipe)) {
    user.removeRecipe(recipe);
  } else {
    user.saveRecipe(recipe);
  }
  let image = (user.favoriteRecipes.includes(recipe)) ? "./images/heart-full.svg" : "./images/heart.svg";
  event.target.src = image;
}


function addToRecipesToCook() {
  let cardId = parseInt(event.target.closest(".recipe-card").id)
  let recipe = cookbook.findRecipe(cardId)
  if (!user.recipesToCook.includes(recipe)) {
    user.decideToCook(recipe);
  } else {
    user.decideNotToCook(recipe);
  }
  let image = (user.recipesToCook.includes(recipe)) ? "./images/chef-filled.svg" : "./images/chef.svg";
  event.target.src = image;
}


function showFavedRecipes() {
  createCards(user.favoriteRecipes)
  showMyRecipesBanner();
}


function showRecipesToCook() {
  createCards(user.recipesToCook)
  showMyRecipesBanner();
}

// CREATE RECIPE INSTRUCTIONS
function openRecipeInfo(event) {
  main.prepend(fullRecipeInfo)
  fullRecipeInfo.empty()
  fullRecipeInfo.css('display', 'inline')
  let recipeId = event.path.find(e => e.id).id;
  let recipe = cookbook.findRecipe(Number(recipeId));
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
  $(`#${recipe.id}`).css('background-image', `url(${recipe.image}`)
}

function generateIngredients(recipe) {
  return recipe.ingredients.map(ingrd => {
    return `${capitalize(ingrd.name)} (${ingrd.quantity.amount} ${ingrd.quantity.unit})`
  }).join(", ");
}

function generateInstructions(recipe) {
  let instructionsList = "";
  let instructions = recipe.instructions.map(instruction => {
    return instruction.instruction
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
  $(".welcome-msg").css("display", "none")
  $(".my-recipes-banner").css('display', 'block')
}

function showWelcomeBanner() {
  $(".welcome-msg").css('display', "flex")
  $(".my-recipes-banner").css('display', "none")
}

// SEARCH RECIPES

function searchRecipes() {
  createCards(cookbook.filterRecipes(searchInput.val(), []))
}


function toggleMenu() {
  var menuDropdown = $(".drop-menu");
  menuOpen = !menuOpen;
  if (menuOpen) {
    menuDropdown.css('display', 'none')
  } else {
    menuDropdown.css('display', 'block')
  }
}

function showAllRecipes() {
  createCards(cookbook.recipes)
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
    $(".pantry-list").prepend(ingredientHtml);
  });
}

function findCheckedPantryBoxes() {
  let pantryCheckboxes = $(".pantry-checkbox");
  let pantryCheckboxInfo = Array.from(pantryCheckboxes)

  let selectedIngredients = pantryCheckboxInfo.filter(box => {
    return box.checked;
  })
  let modifiedSelectedIngredients = selectedIngredients.map(item => {
    return item.id;
  })

  showAllRecipes();
  if (modifiedSelectedIngredients.length > 0) {
    let recipesIngred = cookbook.filterRecipes('!!!', modifiedSelectedIngredients);
    createCards(recipesIngred)
  }
}



//For later use `You have ${item.amount} ${unit} of ${ingredientName}, you need ${requiredAmount} ${ingredient.quantity.unit} to make this reicpe.`
