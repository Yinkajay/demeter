import { useNavigate } from "react-router-dom"
import useAuth from "./useAuth"
import { useEffect } from "react"

const useRequireAuth = () => {
    const navigate = useNavigate()
    const { isAuthenticated } = useAuth()

    // const requireAuth = () => {
    //     if (!isAuthenticated) {
    //         navigate('/auth')
    //     }
    // }
    // return

    useEffect(() => {
        if (!isAuthenticated) {
            navigate('/auth')
        }
    }, [isAuthenticated, navigate])
}

export default useRequireAuth