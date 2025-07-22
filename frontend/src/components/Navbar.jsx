import React from 'react'
import { NavLink } from 'react-router-dom'
import useAuthStore from '../store/useAuthStore'

const Navbar = () => {
    const { isAuthenticaeted } = useAuthStore()
    return (
        <nav className='bg-slate-500 text-white h-12 flex justify-center items-center gap-5'>
            <NavLink to='/'>Home</NavLink>
            <NavLink to='/recipes'>Recipes</NavLink>
            {isAuthenticaeted
                ? <NavLink to='/auth'>Sign In</NavLink>
                : <NavLink to='/profile'>Profile</NavLink>}
        </nav>
    )
}

export default Navbar
