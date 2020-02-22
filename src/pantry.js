// const Recipe = require('./recipe');




class Pantry {
  constructor(userInfo) {
    this.pantry = userInfo.pantry
  }
  
  comparePantryToRecipe(recipe) {
    let recipeIngredients = recipe.ingredients.reduce((allIngredients, ingredient) => {
      allIngredients.push(ingredient.name)
      return allIngredients
    }, []);


  

    let matchingIngredients = recipe.ingredients.reduce((ingredientsList, ingredient) => {
      this.pantry.forEach(item => {
        if (!ingredientsList.includes(ingredient.name) && item.ingredient === ingredient.id) {
          ingredientsList.push(ingredient.name)
        }
      })
      return ingredientsList
    }, [])



    // let findDiff = recipeIngredients.filter(ing => !matchingIngredients.includes(ing))

    if (recipeIngredients.length === matchingIngredients.length) {
      return true
    } else {
      return false;
    }
  }


  
  determineIngredientQuantityNeeded(recipe) {

    // if (!this.matchingIngredients) {
    //   let pantryAmount = 0
    //   let unit;
    //   let amount;
    //   let ingredientName;
    //   let requiredAmount;
    //   recipe.ingredients.forEach(ingredient => {
    //     this.pantry.forEach(item => {
    //       if (ingredient.id === item.ingredient) {
    //         pantryAmount += item.amount;
    //         unit = ingredient.quantity.unit;
    //         requiredAmount = ingredient.quantity.amount
    //         ingredientName = ingredient.name;
    //         amount = `You have ${pantryAmount} ${unit} of ${ingredientName}, you need ${requiredAmount} ${ingredient.quantity.unit} to make this reicpe.`
    //       }
    //     })
    //   })
    //   return amount;
    // }


    if (!this.matchingIngredients) {
      let pantryAmount = 0
      let unit;
      let amount;
      let ingredientName;
      let requiredAmount;



      recipe.ingredients.forEach(ingredient => {
        this.pantry.forEach(item => {
          if (ingredient.id === item.ingredient) {
            pantryAmount += item.amount;
            unit = ingredient.quantity.unit;
            requiredAmount = ingredient.quantity.amount
            ingredientName = ingredient.name;
            amount = `You have ${pantryAmount} ${unit} of ${ingredientName}, you need ${requiredAmount} ${ingredient.quantity.unit} to make this reicpe.`
          }
        })
      })
      if (requiredAmount > pantryAmount) {
        return amount;
      }
    }
  }
}

module.exports = Pantry;
