const express = require('express')
const { getAllRecipes, createRecipe, getRecipeById, updateRecipe, deleteRecipe } = require('../controllers/recipeController')
const router = express.Router()


router
    .get('/', getAllRecipes)
    .get('/:id', getRecipeById)
    .post('/', createRecipe)
    .post('/:id/ingredients', )
    .put('/:id', updateRecipe)
    .delete('/:id', deleteRecipe)



module.exports = router