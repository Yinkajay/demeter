const pool = require("../db");


const getAllRecipes = async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM recipes ORDER BY id')
        res.status(200).json({ data: result.rows, number: result.rowCount })
    } catch (error) {
        console.log(error)
        res.status(500).json({ error: 'Failed to fetch recipes' });
    }
}

const getRecipeById = async (req, res) => {
    const id = req.params.id
    // const queryStr = `SELECT * from recipes WHERE id=${id}`
    const queryStr = 'SELECT * FROM recipes where id = $1'
    const values = [id]
    try {
        const result = await pool.query(queryStr, values)
        res.status(200).json({ staus: 'success', result: result.rows })
        console.log(id)
    } catch (error) {
        console.log(error)
        res.status(500).json({ error: 'Failed to get recipes' });
    }
}

const createRecipe = async (req, res) => {
    const { title, description, cook_time, instructions, image_urls, ingredients, user: { id: user_id } } = req.body

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
        const values = [title, description, cook_time, instructions, image_urls, user_id]
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

const addIngredientsToRecipe = () => { }


module.exports = { getAllRecipes, createRecipe, getRecipeById, updateRecipe, deleteRecipe }