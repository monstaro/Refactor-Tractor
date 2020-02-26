class Recipe {
  constructor(recipe) {
    this.name = recipe.name;
    this.id = recipe.id;
    this.image = recipe.image;
    this.tags = recipe.tags;
    this.ingredients = recipe.ingredients;
    this.instructions = recipe.instructions;
    this.favorite = false;
    this.toCook = false;
  }

  identifyIngredients(ingredients) {
    this.ingredients = this.ingredients.map(ingredient => {
      let currentIngredient = ingredients.find(item => {
        return item.id === ingredient.id;
      });
      currentIngredient['quantity'] = ingredient.quantity;
      return currentIngredient;
    });
  }

  calculateIngredientsCost() {
    return this.ingredients.reduce((cost, curCost) => {
      return cost + curCost.estimatedCostInCents;
    }, 0);
  }

  listIngredients() {
    return this.ingredients.map(ingredient => ingredient.name);
  }
}

module.exports = Recipe;
