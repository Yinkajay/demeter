const pool = require("../db");


const getAllRecipes = async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM recipes ORDER BY id')
        res.status(200).json({ data: result.rows, number: result.rowCount })
    } catch (error) {
        console.log(error.stack)
        res.status(500).json({ error: 'Failed to fetch recipes' });
    }
}

const getRecipeById = async (req, res) => {
    const id = req.params.id
    // const queryStr = `SELECT * from recipes WHERE id=${id}`
    try {
        const queryStr = 'SELECT * FROM recipes where id = $1'
        const values = [id]
        const result = await pool.query(queryStr, values)

        if (result.rowCount === 0) {
            return res.status(404).json({ error: 'Recipe not found' })
        }

        const ingredientsQuery = `SELECT ingredients.name FROM recipe_ingredients JOIN ingredients on recipe_ingredients.ingredient_id = ingredients.id WHERE recipe_ingredients.recipe_id = $1`


        const recipe = result.rows[0]
        const ingredients = (await pool.query(ingredientsQuery, values)).rows.map(ing => ing.name)
        recipe.ingredients = ingredients

        console.log(recipe)
        res.status(200).json({ status: 'success', result: recipe })
    } catch (error) {
        console.log(error.stack)
        res.status(500).json({ error: 'Failed to get recipes' });
    }
}

const getUserRecipes = async (req, res) => {
    console.log(req)
    const id = req.user.id
    console.log('user is ---', id)
    try {
        const getRecipesQuery = 'SELECT * FROM recipes WHERE user_id = $1'
        const values = [id]
        const result = await pool.query(getRecipesQuery, values)
        console.log(result)
        const recipes = result.rows

        res.status(200).json({ status: 'success', data: recipes })
    } catch (error) {
        console.log(error.stack)
        res.status(500).json({ error: 'Failed to get user recipes' })
    }
}

const createRecipe = async (req, res) => {
    const userId = req.user.id
    const { title, description, cook_time, instructions, image_urls, ingredients } = req.body

    const ingredientIds = []
    for (const ingredient of ingredients) {
        console.log(ingredient.name)
        const name = ingredient.name.toLowerCase().trim();
        const ingredientQuery = 'SELECT * FROM ingredients where LOWER(name) = $1'
        const values = [name]

        const checkIngredient = await pool.query(ingredientQuery, values)
        console.log(checkIngredient)

        if (checkIngredient.rowCount === 0) {
            const addIngStr = 'INSERT INTO ingredients (name) VALUES ($1) RETURNING *'
            const addIngredient = await pool.query(addIngStr, values)
            console.log('-------ADDED THIS', addIngredient)
            ingredientIds.push(addIngredient.rows[0].id)
        } else {
            ingredientIds.push(checkIngredient.rows[0].id)
        }
    }

    console.log(ingredientIds)

    try {
        const queryStr = 'INSERT INTO recipes (title,description,cook_time,instructions, image_urls, user_id) VALUES ($1,$2,$3,$4,$5,$6) RETURNING *'
        const values = [title, description, cook_time, instructions, image_urls, userId]
        const finalResult = await pool.query(queryStr, values)
        console.log('--------------------FINAL ADD---------------', finalResult)

        for (let ingredientId of ingredientIds) {
            const addIngToNewTableQuery = 'INSERT INTO recipe_ingredients (recipe_id, ingredient_id) VALUES ($1,$2)'
            const values = [finalResult.rows[0].id, ingredientId]
            const result = await pool.query(addIngToNewTableQuery, values)
        }
        res.status(201).json({ status: 'success', recipe: finalResult.rows })
    } catch (error) {
        console.log(error)
        res.status(500).json({ error: error || 'Failed to add recipe' })
    }
}

const updateRecipe = async (req, res) => {
    const id = req.params.id
    const { title, description, cook_time, instructions } = req.body
    const values = [title, description, cook_time, instructions, id]
    const queryStr = `UPDATE recipes SET title=$1, description=$2, cook_time = $3, instructions=$4 WHERE id = $5 RETURNING *`
    try {
        const result = await pool.query(queryStr, values)
        console.log(result.rows)
        console.log(result.rows[0])
        res.status(200).json(result.rows)
    } catch (error) {
        console.log(error)
        res.status(500).json({ error: error || 'Failed to update recipe' })
    }
}

const deleteRecipe = async (req, res) => {
    const id = req.params.id
    const queryStr = `DELETE FROM recipes where id = $1`
    const values = [id]
    try {
        const result = await pool.query(queryStr, values)
        console.log(result)
        if (result.rowCount == 0) {
            return res.status(404).json({ error: 'Recipe not found' })
        }
        res.status(200).json({ message: 'Recipe successfully deleted' })
    } catch (error) {
        console.log(error)
        res.status(500).json({ error: error || 'Failed to delete recipe' })
    }
}

const saveRecipe = async (req, res) => {
    const userId = req.user.id
    const { recipeId } = req.body
    console.log(userId)
    console.log(recipeId)

    try {
        // First check if the recipe is saved by the user
        const checkStatusQuery = 'SELECT * FROM saved_recipes WHERE user_id = $1 AND recipe_id = $2'
        const checkValues = [userId, recipeId]

        const statusCheck = await pool.query(checkStatusQuery, checkValues)
        console.log(statusCheck)
        const isSaved = statusCheck.rowCount > 0
        console.log(isSaved)

        if (isSaved) {
            console.log('-----------IT EXISTED------------')
            const unsaveRecipeQuery = `DELETE FROM saved_recipes where user_id = $1 AND recipe_id = $2`

            const unsave = await pool.query(unsaveRecipeQuery, checkValues)
            return res.status(200).json({ status: 'success', message: 'Recipe successfully unsaved', saved: false })
        }

        const saveRecipeQuery = 'INSERT into saved_recipes (user_id, recipe_id) VALUES ($1, $2)'
        const values = [userId, recipeId]

        const save = await pool.query(saveRecipeQuery, values)

        res.status(200).json({ status: 'success', message: 'Recipe successfully saved', saved: true })
    } catch (error) {
        console.log(error.stack)
        res.status(500).json({ error })
    }
}

const getSavedRecipes = async (req, res) => {
    const userId = req.user.id

    try {
        const getRecipesQuery = 'SELECT recipes.*, saved_recipes.user_id FROM recipes JOIN saved_recipes on recipes.id = saved_recipes.recipe_id where saved_recipes.user_id = $1'
        const values = [userId]

        const { rows: recipes } = await pool.query(getRecipesQuery, values)

        res.status(200).json({ status: 'success', savedRecipes: recipes })
    } catch (error) {
        console.log(error.stack)
        res.status(500).json({ error })
    }
}

const suggestIngredients = async (req, res) => {
    const { q } = req.query
    if (!q) return res.status(200).json([])
    try {

        const query = 'SELECT * FROM INGREDIENTS where name ILIKE $1'
        const values = [`${q}%`]

        const { rows } = await pool.query(query, values)
        console.log(rows)
        res.status(200).json({ status: 'success', data: rows })
    } catch (error) {
        console.log(error.stack)
        res.status(500).json({ error })
    }
}

module.exports = { getAllRecipes, createRecipe, getRecipeById, updateRecipe, deleteRecipe, getUserRecipes, saveRecipe, getSavedRecipes, suggestIngredients }