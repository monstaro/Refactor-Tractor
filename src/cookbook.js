const Recipe = require('./recipe');
class Cookbook {
  constructor(recipes) {
    this.recipes = this.populateRecipes(recipes);
  }

  populateRecipes(recipes) {
    // console.log(recipes[0]);
    return recipes.map(item => {
      return new Recipe(item);
    });
  }

  findRecipe(id) {
    console.log(this.recipes);
    return this.recipes.find(recipe => recipe.id === id);
  }

  filterRecipes(str) {
    return this.recipes.filter(recipe => {
      return 
    });
  }
}
module.exports = Cookbook;
