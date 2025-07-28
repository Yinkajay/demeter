import React from 'react'
import { NavLink, useLocation, useNavigate } from 'react-router-dom'
import useAuthStore from '../store/useAuthStore'
import logo from '../assets/ounje.svg'

const Navbar = () => {
    const { isAuthenticated, logout } = useAuthStore()
    const location = useLocation()
    const navigate= useNavigate()

    const isHome = location.pathname === '/';
    console.log(location)

    const handleLogout = ()=>{
        logout()
        navigate('/')
    }
    return (
        <nav className={`${isHome ? 'fixed z-500 left-1/2 -translate-x-1/2' : ''}  bg-white w-1/2 max-w-[550px] rounded-full my-5 px-9 mx-auto shadow-md  text-[#222] h-16 flex justify-between items-center gap-5`}>
            <NavLink to='/'>
                <img src={logo} alt="app logo" />
            </NavLink>
            <div className="flex gap-4">
                <NavLink to='/' className={({ isActive }) => isActive ? 'font-semibold' : ''}>Home</NavLink>
                <NavLink to='/recipes' className={({ isActive }) => isActive ? 'font-semibold' : ''}>Recipes</NavLink>
                {isAuthenticated
                    ? <NavLink to='/profile' className={({ isActive }) => isActive ? 'font-semibold' : ''}>Profile</NavLink>
                    : ''
                }
            </div>
            {isAuthenticated
                ? (
                    <button onClick={handleLogout} className='bg-[#222] px-3 py-2 cursor-pointer hover:opacity-75 rounded-full text-white'>
                        Logout
                    </button>
                )
                : <NavLink to='/auth' className='bg-[#222] px-3 py-2 cursor-pointer hover:opacity-75 rounded-full text-white'>Sign In</NavLink>
            }
        </nav>
    )
}

export default Navbar
