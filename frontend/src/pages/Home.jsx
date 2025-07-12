import { useEffect, useState } from 'react'
import RecipeCard from '../components/RecipeCard'

const Home = () => {
    const [recipes, setRecipes] = useState('')
    const getAllRecipes = async () => {
        try {
            const result = await fetch('http://localhost:5000/api/recipes', {
                method: 'GET'
            })
            const response = await result.json()
            setRecipes(response.data)
            console.log(response)
        } catch (error) {
            console.log('Fetch failed -', error)
        }
    }


    useEffect(() => {
        getAllRecipes()
    }, [])

    return (
        <>
            <section className=' p-5 flex gap-4 flex-wrap'>
                {recipes && (
                    (recipes.map((recipe, index) => (
                        <RecipeCard key={recipe.id} recipe={recipe} />
                    )))
                )}
            </section>
        </>
    )
}

export default Home
