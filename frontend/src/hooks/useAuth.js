import useAuthStore from "../store/useAuthStore"


const useAuth = () => {
    const { user, token, isAuthenticated, login, logout } = useAuthStore()

    return { user, token, isAuthenticated, login, logout }
}

export default useAuth