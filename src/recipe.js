class Recipe {
  constructor(recipe) {
    this.id = recipe.id;
    this.name = recipe.name;
    this.image = recipe.image;
    this.tags = recipe.tags;
    this.ingredients = recipe.ingredients;
  }
  identifyIngredients(ingredients) {
    this.ingredients = this.ingredients.map(ingredient => {
      let currentIngredient = ingredients.find(item => {
        return item.id === ingredient.id
      })
      currentIngredient['quantity'] = ingredient.quantity
      return currentIngredient
    })
  }
  calculateIngredientsCost() {
    
  }
  listIngredients() {

  }
  getInstructions() {
    
  }
}

module.exports = Recipe;
