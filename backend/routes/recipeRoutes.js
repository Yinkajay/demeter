const express = require('express')
const { getAllRecipes, createRecipe, getRecipeById, updateRecipe, deleteRecipe, getUserRecipes, saveRecipe, getSavedRecipes, suggestIngredients } = require('../controllers/recipeController')
const verifyToken = require('../middleware/verifyToken')
const router = express.Router()


router
    .get('/', getAllRecipes)
    .get('/user', verifyToken, getUserRecipes)
    .get('/getSavedRecipes', verifyToken, getSavedRecipes)
    .get('/ingredients/suggest', suggestIngredients)
    .get('/:id', getRecipeById)
    .post('/', verifyToken, createRecipe)
    .post('/save', verifyToken, saveRecipe)
    .put('/:id', updateRecipe)
    .delete('/:id', verifyToken, deleteRecipe)

module.exports = router