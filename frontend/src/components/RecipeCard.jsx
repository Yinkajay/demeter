import { Link } from "react-router-dom"
import { IoIosHeart, IoIosHeartEmpty } from "react-icons/io";
import useRecipeStore from "../store/useRecipeStore";
import useAuthStore from "../store/useAuthStore";

const RecipeCard = ({ recipe }) => {
  const { savedRecipeIds, toggleSavedRecipe, setRecipeIds } = useRecipeStore()
  const { token } = useAuthStore()

  const handleSaveToggle = async (e) => {
    e.preventDefault()
    e.stopPropagation()

    try {
      const result = await fetch('http://localhost:5000/api/recipes/save', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          recipeId: recipe.id
        })
      })

      if(!result.ok){

        console.log('Request failed:',result.statusText)
      }
      const response = await result.json()
      console.log(response)

      setRecipeIds(
        response.saved
          ? [...savedRecipeIds, recipe.id]
          : savedRecipeIds.filter((id) => id !== recipe.id)
      );

    } catch (error) {

    }
    console.log('clicked')
  }

  return (
    <Link to={`/recipe/${recipe.id}`} className='relative h-72 w-56 rounded-md bg-white flex flex-col shadow hover:scale-101'>
      <button onClick={handleSaveToggle} className="absolute top-2 right-2">{savedRecipeIds.includes(recipe.id) ? <IoIosHeart size={20} /> : <IoIosHeartEmpty size={20} />}</button>
      <div className="flex h-full items-center justify-center">
        <p>🥘</p>
      </div>
      <div className="mt-auto w-full p-3 rounded-md border   border-gray-200">
        <p className="text-xs text-gray-500">
          {recipe.cook_time} mins ⏱️
        </p>
        <h4 className='font-semibold'>{recipe.title}</h4>
        <p className="text-sm">{recipe.description.slice(0, 50)}...</p>
      </div>
    </Link>
  )
}

export default RecipeCard
