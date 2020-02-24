// const Recipe = require('./recipe');




class Pantry {
  constructor(userInfo) {
    this.pantry = userInfo.pantry
    this.missingIngredients = []
  }
  
  comparePantryToRecipe(recipe) {
    // let recipeIngredients = recipe.ingredients.reduce((allIngredients, ingredient) => {
    //   allIngredients.push(ingredient.name)
    //   return allIngredients
    // }, []);
    // let matchingIngredients = recipe.ingredients.reduce((ingredientsList, ingredient) => {
    //   this.pantry.forEach(item => {
    //     if (!ingredientsList.includes(ingredient.name) && item.ingredient === ingredient.id) {
    //       ingredientsList.push(ingredient.name)
    //     }
    //   })
    //   return ingredientsList
    // }, [])
    // if (recipeIngredients.length === matchingIngredients.length) {
    //   return true
    // } else {
    //   return false;
    // }   
    this.determineIngredientQuantityNeeded(recipe)
    return this.missingIngredients.length === 0;
  }

  // findIngredientsNeeded(recipe) {
  //   let recipeIngredients = recipe.ingredients.reduce((allIngredients, ingredient) => {
  //     allIngredients.push(ingredient.name)
  //     return allIngredients
  //   }, []);


  //   let matchingIngredients = recipe.ingredients.reduce((ingredientsList, ingredient) => {
  //     this.pantry.forEach(item => {
  //       if (!ingredientsList.includes(ingredient.name) && item.ingredient === ingredient.id) {
  //         ingredientsList.push(ingredient.name)
  //       }
  //     })
  //     return ingredientsList
  //   }, [])
  //   return recipeIngredients.filter(ing => !matchingIngredients.includes(ing))
  // }


  
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

  determineCostOfMissingIngredients(ingredients, recipe) {

    let recipeIngredients = recipe.ingredients.reduce((allIngredients, ingredient) => {
      allIngredients.push(ingredient.id)
      return allIngredients
    }, []);

    let matchingIngredients = recipe.ingredients.reduce((ingredientsList, ingredient) => {
      this.pantry.forEach(item => {
        if (!ingredientsList.includes(ingredient.name) && item.ingredient === ingredient.id) {
          ingredientsList.push(ingredient.id)
        }
      })
      return ingredientsList
    }, [])




    //  let findDiff = recipeIngredients.filter(ing => !matchingIngredients.includes(ing)) 
    
    let neededIngredients = recipe.ingredients.filter(ing => !matchingIngredients.includes(ing.id))

    let a = neededIngredients.map(ingr => {
      ingredients.forEach(ingredient => {
        if (ingr.id === ingredient.id) {
          return ingr.cost = ingredient.estimatedCostInCents * ingr.quantity.amount
        }
      })
    })

  }
}

module.exports = Pantry;
