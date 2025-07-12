import { Link } from "react-router-dom"

const RecipeCard = ({ recipe }) => {
  return (
    <Link to={`/recipe/${recipe.id}`} className='h-72 w-56 rounded-md bg-white flex flex-col shadow hover:scale-102'>
      <div className="flex h-full items-center justify-center">
        <p>🥘</p>
      </div>
      <div className="mt-auto w-full p-3 rounded-md border   border-gray-200">
        <p className="text-xs text-gray-500">
          {recipe.cook_time} mins ⏱️
        </p>
        <h4 className='font-semibold'>{recipe.title}</h4>
        <p className="text-sm">{recipe.description.slice(0,50)}...</p>
      </div>
    </Link>
  )
}

export default RecipeCard
