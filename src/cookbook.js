const Recipe = require('./recipe');
class Cookbook {
  constructor(recipes, ingredientsData) {
    this.allIngredients = ingredientsData;
    this.recipes = this.populateRecipes(recipes);
  }

  populateRecipes(recipes) {
    // console.log(this.allIngredients);
    return recipes.map(item => {
      let currentRecipe = new Recipe(item);
      // console.log(currentRecipe);
      currentRecipe.identifyIngredients(this.allIngredients);
      return currentRecipe;
    });
  }

  findRecipe(id) {
    return this.recipes.find(recipe => recipe.id === id);
  }

  filterTags(tags, str) {
    let found = tags.filter(tag => tag.toLowerCase().includes(str.toLowerCase()));
    return found.length > 0;
  }

  filterIngredients(ingredients, str) {
    let found = ingredients.filter(ingredient => ingredient.name.toLowerCase().includes(str.toLowerCase()));
    return found.length > 0;
  }

  filterRecipes(str) {
    return this.recipes.filter((recipe, index) => {
      let recipeName = recipe.name;
      let ingredients = recipe.ingredients;
      let tags = recipe.tags;
      if (recipeName.includes(str) || this.filterIngredients(ingredients, str) || this.filterTags(tags, str)) {
        return recipe;
      }

    });
  }
}
module.exports = Cookbook;
