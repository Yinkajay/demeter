import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'

const RecipeDetail = () => {
  const [recipe, setRecipe] = useState('')
  const params = useParams()

  const getRecipe = async (id) => {
    const response = await fetch(`http://localhost:5000/api/recipes/${id}`, {
      method: 'GET'
    })
    const recipe = await response.json()
    console.log(recipe.result[0])
    setRecipe(recipe.result[0])
  }

  useEffect(() => {
    getRecipe(params.id)
  }, [])

  if (!recipe) {
    return <p>Loading...</p>
  }

  return (
    <div>
      <h1 className='text-center my-6 text-3xl font-bold font-quintessential'>{recipe.title}</h1>

      <div className="border-2 mx-3">
        <h2 className=''>Ingredients</h2>

      </div>
    </div>
  )
}

export default RecipeDetail
