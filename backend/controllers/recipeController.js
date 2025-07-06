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
    const queryStr = `SELECT * from recipes WHERE id=${id}`
    try {
        const result = await pool.query(queryStr)
        res.status(200).json({ staus: 'success', result: result.rows })
        console.log(id)
    } catch (error) {
        console.log(error)
        res.status(500).json({ error: 'Failed to get recipes' });
    }
}

const createRecipe = async (req, res) => {
    const { title, description, cook_time, instructions } = req.body
    const queryStr = 'INSERT INTO recipes (title,description,cook_time,instructions) VALUES ($1,$2,$3,$4) RETURNING *'
    const values = [title, description, cook_time, instructions]

    try {
        const result = await pool.query(queryStr, values)
        res.status(201).json({ status: 'success', recipe: result.rows })
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