import React, { useEffect, useState } from 'react'
import { BsClock } from 'react-icons/bs'
import { useParams } from 'react-router-dom'

const RecipeDetail = () => {
  const [recipe, setRecipe] = useState('')
  const params = useParams()

  const getRecipe = async (id) => {
    const response = await fetch(`http://localhost:5000/api/recipes/${id}`, {
      method: 'GET'
    })
    const recipe = await response.json()
    console.log(recipe.result)
    setRecipe(recipe.result)
  }

  useEffect(() => {
    getRecipe(params.id)
  }, [])

  if (!recipe) {
    return <p>Loading...</p>
  }

  return (
    <div>
      <div className="text-center">
        <h1 className='mt-3 text-3xl font-bold font-quintessential'>{recipe.title}</h1>
        <p className='my-2'>{recipe.description}</p>
      </div>
      <section className="shadow p-4">
        <p className='' >Time to cook - <span>{recipe.cook_time} minutes <BsClock className='inline translate-y-[-2px]' /> </span></p>
        <div className='my-2'>
          <h2 className='font-semibold text-lg'>Ingredients</h2>
          {recipe?.ingredients.map((ingredient, index) => (
            <div key={index} className="">
              - {ingredient.charAt(0).toUpperCase() + ingredient.slice(1)}
            </div>
          ))}
        </div>
        <div className="my-2">
          <h2 className='font-semibold text-lg'>Instructions</h2>
          {recipe?.instructions.map((instruction, index) => (
            <div key={index} className="">
              <p className='text-sm font-semibold'>Step - {index + 1}</p>
              <p> {instruction}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}

export default RecipeDetail
