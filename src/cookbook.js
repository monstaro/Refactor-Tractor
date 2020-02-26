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
      currentRecipe.identifyIngredients(this.allIngredients);
      return currentRecipe;
    });
  }

  findRecipe(id) {
    return this.recipes.find(recipe => recipe.id === id);
  }

  filterTags(tags, arr) {
    let found = []
    let foundPerWord = arr.forEach(word => {
      found = found.concat(tags.filter(tag => tag.toLowerCase().includes(word.toLowerCase())));
    });
    return found.length > 0;

  }

  filterIngredients(ingredients, str, arr) {
    let found;
    found = ingredients.filter(ingredient => ingredient.name.toLowerCase().includes(str.toLowerCase()));
    if (arr.length > 0) {
      arr.forEach(word => {
       found = found.concat(ingredients.filter(ingredient => ingredient.name.toLowerCase().includes(word.toLowerCase())));
     });
    }
    return found.length > 0;
  }

  filterRecipes(str, arr) {
    return this.recipes.filter(recipe => {
      let recipeNameIncludes = recipe.name.toLowerCase().includes(str.toLowerCase());
      let ingredientsIncludes = this.filterIngredients(recipe.ingredients, str, arr);
      let tagsIncludes = this.filterTags(recipe.tags, arr);
      if (recipeNameIncludes || ingredientsIncludes || tagsIncludes) {
        return recipe;
      }
    });
  }
}
module.exports = Cookbook;
