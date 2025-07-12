const express = require('express')
const { getAllRecipes, createRecipe, getRecipeById, updateRecipe, deleteRecipe } = require('../controllers/recipeController')
const router = express.Router()


router
    .get('/', getAllRecipes)
    .get('/:id', getRecipeById)
    .post('/', createRecipe)
    .put('/:id', updateRecipe)
    // .patch('/:id/ingredients', )
    .delete('/:id', deleteRecipe)



module.exports = router