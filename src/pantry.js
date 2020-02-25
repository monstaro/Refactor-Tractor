// const Recipe = require('./recipe');




class Pantry {
  constructor(userInfo) {
    this.pantry = userInfo.pantry
    this.id = userInfo.id
    this.missingIngredients = []
  }
  
  comparePantryToRecipe(recipe) {
    this.determineIngredientQuantityNeeded(recipe)
    return this.missingIngredients.length === 0;
  }

  determineIngredientQuantityNeeded(recipe) {
    recipe.ingredients.forEach(ingredient => {
      let currentIngredient = this.pantry.find(item => {
        return item.ingredient === ingredient.id
      })
      let requiredAmount;
      if (currentIngredient) {
        requiredAmount = ingredient.quantity.amount - currentIngredient.amount 
      } else {
        requiredAmount = ingredient.quantity.amount 
      }
      if (requiredAmount > 0) {
        this.missingIngredients
          .push({name: ingredient.name, 
            missingAmount: requiredAmount,
            id: ingredient.id,
            unit: ingredient.quantity.unit,
            cost: ingredient.estimatedCostInCents
          })
      }
    })
  }

  calculateMissingIngredientCost() {
    return this.missingIngredients.reduce((totalCost, curCost) => {
      return totalCost += (curCost.cost * curCost.missingAmount)
    }, 0)
  }

  addIngredientsToPantry() {
    this.missingIngredients.forEach(ingredient => {
      fetch('https://fe-apps.herokuapp.com/api/v1/whats-cookin/1911/users/wcUsersData', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          userId: this.id,
          ingredientID: ingredient.id,
          ingredientModification: ingredient.missingAmount
        }),
      })
    .catch(err => console.log(err.message))
      this.addPantryHelper(ingredient)
    });
  }
  addPantryHelper(ingredient) {
    let a = this.pantry.find(item =>
      item.ingredient === ingredient.id
    )
    if (!a) {
      return this.pantry.push({
        ingredient: ingredient.id,
        amount: 0
      })
    }
    let index = (!a) ? this.pantry.length - 1 : this.pantry.indexOf(a)
    this.pantry[index].amount += ingredient.missingAmount
  }
}

module.exports = Pantry;
