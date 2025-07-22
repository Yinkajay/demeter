import { useEffect, useState } from "react"
import useAuthStore from "../store/useAuthStore"
import EditableField from "../components/EditableField"
import { uploadToCloudinary } from "../lib/cloudinary"
import RecipeCard from "../components/RecipeCard"
import { useNavigate } from "react-router-dom"
import useRecipeStore from "../store/useRecipeStore"

const Profile = () => {
    const navigate = useNavigate()
    const { token, setUser, user, logout } = useAuthStore()
    const { setRecipeIds } = useRecipeStore()

    const [userData, setUserData] = useState(null)
    const [recipes, setRecipes] = useState([])
    const [savedRecipes, setSavedRecipes] = useState([])

    const fetchProfileData = async () => {
        try {
            const result = await fetch('http://localhost:5000/api/auth/profile', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                }
            })
            if (result.status === 403) {
                console.log("Unauthorized. Logging out...");
                logout();
                navigate('/auth')
                return;
            }

            if (!result.ok) {
                console.error(`Request failed with status ${result.status}`);
                return;
            }

            const response = await result.json()
            setUser(response.data)
            setUserData(response.data)
            console.log(response)
        } catch (error) {
            console.log(error)
        }
    }

    const fetchUserRecipes = async () => {
        try {
            const result = await fetch('http://localhost:5000/api/recipes/user', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                }
            })

            if (!result.ok) {
                console.error(`Request failed with status ${result.status}`);
                return;
            }
            const response = await result.json()
            setRecipes(response.data)
            console.log(response)
        } catch (error) {
            console.log(error)
        }
    }

    const fetchSavedRecipes = async () => {
        try {
            const result = await fetch('http://localhost:5000/api/recipes/getSavedRecipes', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    "Authorization": `Bearer ${token}`
                }
            })

            if (!result.ok) {
                console.error(`Request failed with status ${result.status}`)
                return
            }

            const response = await result.json()
            console.log(response)
            setSavedRecipes(response.savedRecipes)
            const newArr = (response.savedRecipes.map(recipe => recipe.id))
            console.log(newArr)
            setRecipeIds(response.savedRecipes.map(recipe => recipe.id))
        } catch (error) {
            console.log(error)
        }
    }

    const handleProfileFieldUpdate = async (fieldUpdate) => {
        const result = await fetch('http://localhost:5000/api/auth/profile', {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(fieldUpdate)
        })

        const response = await result.json()
        if (!result.ok) {
            console.log('An error occured')
            return
        }

        setUserData(response.data)
        setUser(response.data)
        console.log(response)
    }

    const handleImageChange = async (e) => {
        const file = e.target.files[0]
        if (!file) return

        try {
            const imageUrl = await uploadToCloudinary(file)
            console.log(imageUrl)
            await handleProfileFieldUpdate({ profile_image_url: imageUrl })
        } catch (error) {
            console.log('Image upload failed', error)
        }
    }

    useEffect(() => {
        fetchProfileData()
        fetchUserRecipes()
        fetchSavedRecipes()
    }, [])

    if (!userData) {
        return <p>Loading...</p>
    }

    return (
        <div className="">
            <section className="p-4 border-0 border-[#333] shadow-lg my-3 w-[90%] mx-auto    rounded-xl">
                <img className="rounded-full border w-[120px]" src={userData?.profile_image_url || ''} alt="profile picture" />

                <div className="file-upload">
                    <label className="custom-file-label" htmlFor="upload">Choose Image</label>
                    <input type="file" id="upload" accept="image/*" onChange={handleImageChange} />
                </div>

                {/* <h3>Username - {userData?.usernam e}</h3> */}
                <EditableField label='Username' value={userData.username} onSave={(data) => handleProfileFieldUpdate({ username: data })} />
                <EditableField label='Bio' value={userData.bio} onSave={(data) => handleProfileFieldUpdate({ bio: data })} />
                <div className="">
                    <h3 className='block font-medium'>Email</h3>
                    <p>{userData.email}</p>
                </div>
                <button onClick={() => navigate('/create')} className="text-sm  text-white bg-[#444] border w-max p-2 rounded my-2">Add Recipe +</button>
            </section>
            <section>
                <h2 className="text-center text-xl py-4">User Recipes</h2>
                <section className=' p-5 flex gap-4 flex-wrap'>
                    {recipes && (
                        (recipes.map((recipe, index) => (
                            <RecipeCard key={recipe.id} recipe={recipe} />
                        )))
                    )}
                </section>
            </section>
            <section>
                <h2 className="text-center text-xl py-4">Saved Recipes</h2>
                <section className=' p-5 flex gap-4 flex-wrap'>
                    {recipes && (
                        (savedRecipes.map((recipe, index) => (
                            <RecipeCard key={recipe.id} recipe={recipe} />
                        )))
                    )}
                </section>
            </section>
        </div>
    )
}

export default Profile
