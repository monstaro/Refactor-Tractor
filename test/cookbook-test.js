import { expect } from 'chai';
import Cookbook from '../src/cookbook.js';
import Recipe from '../src/recipe.js';
import data from '../src/data/recipe-data.js';

describe('Cookbook', function () {
  let cookbook;
  beforeEach(function(){
    cookbook = new Cookbook(data);
  });

  it('is a cookbook', function () {
    expect(cookbook).to.be.an.instanceof(Cookbook);
  });

  it('should be able to add all recipes to the cookbook', function(){
    expect(cookbook.recipes[1]).to.deep.equal(new Recipe(data[1]));
  });


  it('should be able to find a recipe', function(){
    expect(cookbook.findRecipe(678353)).to.deep.equal(data[1]);
  });

  it('should be able to filter recipes by ingredient', function(){

  });

});
