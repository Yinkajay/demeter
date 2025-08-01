import { useState } from "react"
import { useForm } from "react-hook-form"
import { useNavigate } from "react-router-dom"
import useAuthStore from "../store/useAuthStore"

const LoginForm = () => {
  const { register, handleSubmit, formState: { errors } } = useForm()
  const [isSubmitting, setIsSubmitting] = useState(false)
  // const router = useRouter
  const navigate = useNavigate()
  const { login } = useAuthStore()

  const submitHandler = async (data) => {
    console.log(data)

    try {
      setIsSubmitting(true)
      const result = await fetch('http://localhost:5000/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: data.email,
          password: data.password
        })
      })

      const response = await result.json()
      if (!result.ok) {
        console.error("Login error:", response.error);
        return;
      }

      // await new Promise(resolve => setTimeout(resolve, 3000));
      console.log(response)
      const token = response.token
      const userInfo = response.user

      login(response.token)
      localStorage.setItem('token', token)
      localStorage.setItem('user', JSON.stringify(userInfo))
      navigate('/profile')

    } catch (error) {
      console.log('Login Failed', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="p-4">
      <h2 className="text-2xl">Welcome Back</h2>
      <p className="text-[#2b2b2bac]">Log in to access your account and continue where you left off.</p>
      <form onSubmit={handleSubmit(submitHandler)} className="flex flex-col gap-2">
        <div className="flex flex-col gap-1">
          <label htmlFor="email" className="text-sm font-medium">
            Email
          </label>
          <input
            id="email"
            type="email"
            name="email"
            className="border p-2 rounded-md focus:outline-none focus:ring-0"
            placeholder="Enter your email"
            required
            {...register("email")}
          />
        </div>
        <div className="flex flex-col gap-1">
          <label htmlFor="email" className="text-sm font-medium">
            Password
          </label>
          <input
            id="password"
            type="password"
            name="password"
            className="border p-2 rounded-md focus:outline-none focus:ring-0"
            placeholder="Enter your password"
            {...register("password", {
              required: "Password is required",
              minLength: {
                value: 6,
                message: "Password must be at least 6 characters"
              }
            })}
          />
          {errors.password && (
            <span className="text-sm text-red-500">
              {errors.password.message}
            </span>
          )}
        </div>
        <button disabled={isSubmitting} className="bg-[#4C3814] text-white w-full my-3 py-2 rounded border-2 border-[#4C3814] hover:bg-white hover:text-[#4C3814] transition" type="submit">Log In</button>
      </form>
    </div>
  )
}

export default LoginForm
