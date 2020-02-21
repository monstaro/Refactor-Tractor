import { expect } from 'chai';

import Recipe from '../src/recipe.js';
import data from '../src/data/recipe-data.js';
import ingredientsData from '../src/data/ingredient-data.js'

describe('Recipe', function() {
  let recipe;
  let recipeInfo;


  beforeEach(function() {
    recipeInfo = data[0];
    recipe = new Recipe(recipeInfo);
  })

  it('is a function', function() {
    expect(Recipe).to.be.a('function');
  });

  it('should be an instance of Recipe', function() {
    expect(recipe).to.be.an.instanceof(Recipe);
  });

  it('should initialize with an id', function() {
    expect(recipe.id).to.eq(595736);
  });

  it('should initialize with an name', function() {
    expect(recipe.name).to.eq('Loaded Chocolate Chip Pudding Cookie Cups');
  });

  it('should initialize with an image', function() {
    expect(recipe.image).to.eq('https://spoonacular.com/recipeImages/595736-556x370.jpg');
  });

  it('should initialize with an array of ingredients', function() {
    const ingredient = {
      "id": 20081,
      "name": "all purpose flour",
      "quantity": {
        "amount": 1.5,
        "unit": "c"
      }
    }
    expect(recipe.ingredients[0]).to.deep.eq(ingredient);
  });
  it('should be able to find the ingredients data needed', () => {
    expect(recipe.ingredients.length).to.equal(11)
    recipe.identifyIngredients(ingredientsData)
    expect(recipe.ingredients[0]).to.deep.equal({
      id: 20081,
      name: 'wheat flour',
      estimatedCostInCents: 142,
      quantity: { amount: 1.5, unit: 'c' }
    })
    expect(recipe.ingredients.length).to.equal(11)
  })
  it('should calculate the total cost of all of the ingredients', function() {
    recipe.identifyIngredients(ingredientsData)
    expect(recipe.calculateIngredientsCost()).to.eq(5921);
  });
  it('should have a list of all of the ingredients', () => {
    expect(recipe.listIngredients()).to.deep.equal([
      "all purpose flour",
      "baking soda",
      "egg",
      "granulated sugar",
      "instant vanilla pudding mix",
      "light brown sugar",
      "salt",
      "sea salt",
      "semisweet chocolate chips",
      "unsalted butter",
      "vanilla extract",
    ])
  })
  it('should return a set of instructions', () => {
    expect(recipe.instructions).to.deep.equal(data[0].instructions)
  })
});
