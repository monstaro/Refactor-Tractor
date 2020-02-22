import { expect } from 'chai';

import User from '../src/user.js';
import userData from '../src/data/users-data.js';
import recipeData from '../src/data/recipe-data.js';
import Pantry from '../src/pantry.js';
import Recipe from '../src/recipe.js';
import sampleRecipeData from '../src/data/sample-recipe.js';


let pantry;
let userInfo;
let user;
let recipeInfo;
let sampleRecipe;

describe('Pantry', function() {

  beforeEach(function () {
    userInfo = userData[0];
    user = new User(userInfo);
    pantry = new Pantry(userInfo);
    recipeInfo = new Recipe(recipeData[0]);
    sampleRecipe = new Recipe(sampleRecipeData[1])
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
});
