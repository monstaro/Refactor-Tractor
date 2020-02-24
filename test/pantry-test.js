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

describe('Pantry', function() {

  beforeEach(function () {
    userInfo = userData[0];
    user = new User(userInfo);
    pantry = new Pantry(userInfo);
    recipeInfo = new Recipe(sampleRecipeData[0]);
    sampleRecipe = new Recipe(sampleRecipeData[1]);
    haveIngredientsRecipe = new Recipe(sampleRecipeData[2]);
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

    expect(pantry.comparePantryToRecipe(haveIngredientsRecipe)).to.equal(true)
    
    expect(pantry.comparePantryToRecipe(sampleRecipe)).to.equal(false)
  })
  describe('Checking Ingredients Needed', function () {
    
    it('should tell the amount of ingredients still needed to cook a meal', () => {
      sampleRecipe.identifyIngredients(ingredientsData);


      pantry.determineIngredientQuantityNeeded(sampleRecipe)

      expect(pantry.missingIngredients).to.deep.equal([{name: 'wheat flour', missingAmount: 4996, id: 20081, unit: 'c', cost: 142}])
  
      
    })
    it('IF the pantry has none of the ingredients it should tell the amount of ingredients still needed to cook a meal', () => {
      recipeInfo.identifyIngredients(ingredientsData);
      pantry.determineIngredientQuantityNeeded(recipeInfo)
      expect(pantry.missingIngredients).to.deep.equal([
        {
          "cost": 528,
          "id": 1012047,
          "missingAmount": 24,
          "name": "fine sea salt",
          "unit": "servings"
        },
        {
          "cost": 253,
          "id": 10019903,
          "missingAmount": 2,
          "name": "semi sweet chips",
          "unit": "c"
        }
      ])
    })
    it('should be able to have all the ingredients', () => {
      pantry.determineIngredientQuantityNeeded(haveIngredientsRecipe)
      expect(pantry.missingIngredients).to.deep.equal([])
    })

  })
  
});
