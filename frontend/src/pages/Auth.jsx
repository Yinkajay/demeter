import { useState } from 'react'
import LoginForm from '../components/LoginForm'
import SignupForm from '../components/SignupForm'

const Auth = () => {
    const [formToShow, setFormToShow] = useState('login')



    return (
        <div className='w-[60%] md:w-[40%] shadow p-4 mx-auto mt-[100px]'>
            <div className="w-[80%] rounded-full p-1 my-3 mx-auto bg-[#4C3814] flex ">
                <button onClick={()=>setFormToShow('login')} className={`${formToShow == 'login' ? 'bg-white' : 'text-white'} rounded-full p-1 cursor-pointer font-semibold flex-1 flex justify-center items-center`}>Log in</button>
                <button onClick={()=>setFormToShow('signup')} className={`${formToShow == 'login' ? 'text-white' : 'bg-white'} rounded-full p-1 cursor-pointer font-semibold flex-1 flex justify-center items-center`}>Sign Up</button>
            </div>
            {formToShow == 'login'
                ? <LoginForm />
                : <SignupForm />}
        </div>
    )
}

export default Auth
