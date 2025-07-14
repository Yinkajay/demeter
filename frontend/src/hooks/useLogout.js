import useAuthStore from "../store/useAuthStore"

const useLogout = () => {
    const { logout } = useAuthStore()

    return () => {
        logout()
        localStorage.removeItem('token')
        localStorage.removeItem('user')
    }
}

export default useLogout