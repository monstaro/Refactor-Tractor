import { expect } from 'chai';

import User from '../src/user.js';
import userData from '../src/data/users-data.js';
import recipeData from '../src/data/recipe-data.js';
import Pantry from '../src/pantry.js';
import Recipe from '../src/recipe.js';
import sampleRecipeData from '../src/data/sample-recipe.js';

import ingredientsData from '../src/data/ingredient-data.js'



let pantry;
let userInfo;
let user;
let recipeInfo;
let sampleRecipe;
let haveIngredientsRecipe;
let pantryInfo;

describe('Pantry', function() {

  beforeEach(function () {
    userInfo = userData[0];
    user = new User(userInfo);
    pantry = new Pantry(userInfo);
    recipeInfo = new Recipe(recipeData[0]);
    sampleRecipe = new Recipe(sampleRecipeData[1])
    haveIngredientsRecipe = new Recipe(sampleRecipeData[2])
  });

  it('should be a function', function() {
    expect(Pantry).to.be.a('function');
  });
  it('should contain a users pantry', () => {
    expect(pantry.pantry[0]).to.deep.equal({
      "ingredient": 11477,
      "amount": 1
    })
  })
  it('should be able to determnie if the pantry has enough ingredients to cook a given meal', () => {

    expect(pantry.comparePantryToRecipe(recipeInfo)).to.equal(false)
    expect(pantry.comparePantryToRecipe(sampleRecipe)).to.equal(true)
  })
  it('should tell the amount of ingredients still needed to cook a meal', () => {
    pantry.determineIngredientQuantityNeeded(sampleRecipe)
    expect(pantry.missingIngredients).to.deep.equal([{name: 'all purpose flour', missingAmount: 4996, id: 20081, unit: 'c'}])
  })
  it('IF the pantry has none of the ingredients it should tell the amount of ingredients still needed to cook a meal', () => {

    pantry.determineIngredientQuantityNeeded(recipeInfo)
    expect(pantry.missingIngredients).to.deep.equal([
      {
        "id": 1012047,
        "missingAmount": 24,
        "name": "sea salt",
        "unit": "servings"
      },
      {
        "id": 10019903,
        "missingAmount": 2,
        "name": "semisweet chocolate chips",
        "unit": "c"
      }
    ])
  })
  it('should be able to have all the ingredients', () => {
    pantry.determineIngredientQuantityNeeded(haveIngredientsRecipe)
    expect(pantry.missingIngredients).to.deep.equal([])
  })
});
