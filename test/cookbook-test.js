import { expect } from 'chai';
import Cookbook from '../src/cookbook.js';
import Recipe from '../src/recipe.js';
import ingredientsData from '../src/data/ingredient-data';
import data from '../src/data/recipe-data.js';

describe('Cookbook', function () {
  let cookbook;
  let sampleRecipe;
  beforeEach(function () {
    cookbook = new Cookbook(data, ingredientsData);
    sampleRecipe = new Recipe(data[1]);
    sampleRecipe.identifyIngredients(ingredientsData);
  });

  it('is a cookbook', function () {
    expect(cookbook).to.be.an.instanceof(Cookbook);
  });

  it('should be able to add all recipes to the cookbook', function(){
    expect(cookbook.recipes[1]).to.deep.equal(sampleRecipe);
  });


  it('should be able to find a recipe', function(){
    expect(cookbook.findRecipe(678353)).to.deep.equal(sampleRecipe);
  });

  it('should be able to filter recipes by ingredient', function(){
    expect(cookbook.filterRecipes('apple')).to.deep.equal([
      cookbook.recipes[1],
      cookbook.recipes[4],
      cookbook.recipes[8],
      cookbook.recipes[12],
      cookbook.recipes[27],
      cookbook.recipes[48]
    ]);
    console.log(cookbook.recipes[8].ingredients);
  });

});
