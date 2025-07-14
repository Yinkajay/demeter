import { create } from "zustand";
import { persist } from "zustand/middleware";

// const useAuthStore = create(persist((set) => ({
//     user: null,
//     token: null,
//     isAuthenticated: false,

//     login: (user, token) =>
//         set(() => ({
//             user,
//             token,
//             isAuthenticated: true
//         })),

//     logout: () =>
//         set(() => ({
//             user: null,
//             token: null,
//             isAuthenticated: false
//         })),
// })))

const useAuthStore = create(
    persist(
        (set) => ({
            user: null,
            token: null,
            isAuthenticated: false,
            setUser: (userData) =>
                set(() => ({
                    user: userData
                })),
            login: (token) =>
                set(() => ({
                    token,
                    isAuthenticated: true
                })),
            logout: () =>
                set(() => ({
                    user: null,
                    token: null,
                    isAuthenticated: false
                }))

        }),
        { name: 'auth-storage' }
    )
)


export default useAuthStore