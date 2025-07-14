import { useEffect, useState } from "react"
import useAuthStore from "../store/useAuthStore"
import EditableField from "../components/EditableField"
import { uploadToCloudinary } from "../lib/cloudinary"

const Profile = () => {
    const { token, setUser, user } = useAuthStore()
    const [userData, setUserData] = useState(null)

    const fetchProfileData = async () => {
        try {
            const result = await fetch('http://localhost:5000/api/auth/profile', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                }
            })

            const response = await result.json()
            setUser(response.data)
            setUserData(response.data)
            console.log(response)
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
            const imageUrl = uploadToCloudinary(file)
            await handleProfileFieldUpdate({ profile_image_url: imageUrl })
        } catch (error) {
            console.log('Image upload failed', error)
        }
    }

    useEffect(() => {
        fetchProfileData()
    }, [])

    if (!userData) {
        return <p>Loading...</p>
    }

    return (
        <div>
            <section className=" p-2 border my-2">
                <img className="rounded-full border w-[120px]" src={userData?.profile_image_url || ''} alt="profile picture" />

                <input type="file" accept="image/*" onChange={handleImageChange} />

                {/* <h3>Username - {userData?.username}</h3> */}
                <EditableField label='Username' value={userData.username} onSave={(data) => handleProfileFieldUpdate({ username: data })} />
                <EditableField label='Bio' value={userData.bio} onSave={(data) => handleProfileFieldUpdate({ bio: data })} />
                <div className="">
                    <h3 className='block font-medium'>Email</h3>
                    <p>{userData.email}</p>
                </div>
                {/* <EditableField label='Email' value={userData.email} onSave={(data) => handleProfileFieldUpdate({ email: data })} /> */}
            </section>
        </div>
    )
}

export default Profile
