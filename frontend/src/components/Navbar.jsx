import React from 'react'
import { NavLink } from 'react-router-dom'
import useAuthStore from '../store/useAuthStore'
import logo from '../assets/ounje.svg'

const Navbar = () => {
    const { isAuthenticated } = useAuthStore()
    console.log(isAuthenticated)
    return (
        <nav className='bg-white w-1/2 max-w-[550px] rounded-full my-3 px-9 mx-auto shadow text-[#222] h-16 flex justify-between items-center gap-5'>
            <NavLink to='/'>
                <img src={logo} alt="app logo" />
            </NavLink>
            <div className="flex gap-4">
                <NavLink to='/'>Home</NavLink>
                <NavLink to='/recipes'>Recipes</NavLink>
                {isAuthenticated
                    ? <NavLink to='/profile'>Profile</NavLink>
                    : ''
                }
            </div>
            {isAuthenticated
                ? (
                    <button className='bg-[#222] px-3 py-2 cursor-pointer hover:opacity-75 rounded-full text-white'>
                        Logout
                    </button>
                )
                : <NavLink to='/auth'>Sign In</NavLink>
            }
        </nav>
    )
}

export default Navbar
