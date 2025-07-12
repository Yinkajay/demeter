import React from 'react'
import { NavLink } from 'react-router-dom'

const Navbar = () => {
    return (
        <nav className='bg-slate-500 text-white h-12 flex justify-center items-center gap-5'>
            <NavLink to='/'>Home</NavLink>
            <NavLink to='/recipes'>Recipes</NavLink>
            <NavLink to='/auth'>Sign In</NavLink>
        </nav>
    )
}

export default Navbar
