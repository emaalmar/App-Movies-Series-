import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { TvIcon } from '@heroicons/react/24/outline'
import { NavLink, useNavigate } from 'react-router-dom'
import { signin } from '../api/auth.js'
import { AlertError } from '../components/AlertError.jsx'
import { InputForm } from '../components/InputForm.jsx'
import { Button } from '../components/Button.jsx'
import { useAuth } from '../contexts/AuthContext'

// Esquema de validación con Zod para login
const signInSchema = z.object({
  email: z.string().email('Correo electrónico inválido'),
  password: z.string('La contraseña no puede estar vacia'),
})

export const SignInPage = () => {
  const [errorMsg, setErrorMsg] = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()
  const { setUser } = useAuth()

  const { register, handleSubmit, formState: { errors }, reset } = useForm({
    resolver: zodResolver(signInSchema),
    defaultValues: { email: '', password: '' }
  })

  const onSubmit = async (data) => {
    setErrorMsg('')
    try {
      setLoading(true)
      const { token, user } = await signin(data)
      if (token) {
        localStorage.setItem('token', token)
        setUser(user)
        reset()
        navigate('/home')
      }
    } catch (err) {
      const msg = err?.response?.data?.message || err?.message || 'Error desconocido'
      setErrorMsg(msg)
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <div className='flex min-h-full flex-col justify-center px-6 py-12 lg:px-8'>
        <div className='sm:mx-auto sm:w-full sm:max-w-sm'>
          <TvIcon className='mx-auto h-15 w-auto text-black' aria-label='Movies and TV Shows' />
          <h2 className='mt-2 text-center text-2xl/9 font-bold tracking-tight text-gray-900'>
            Sign in to your account
          </h2>
        </div>

        <div className='mt-10 text-left sm:mx-auto sm:w-full sm:max-w-sm'>

          <form id='sign-in-form' noValidate onSubmit={handleSubmit(onSubmit)} className='space-y-5'>
            <div>
              <div>
                <InputForm
                  fieldName='email'
                  displayLabel='Email address'
                  inputType='email'
                  placeholder='Enter your email'
                  {...register('email')}
                  required
                  autoComplete='email'
                />
                {errors.email && errors.email.types
                  ? (
                      Object.values(errors.email.types).map((msg, idx) => (
                        <p key={idx} className='text-xs text-red-600 mt-1'>{msg}</p>
                      ))
                    )
                  : errors.email
                    ? (
                      <p className='text-xs text-red-600 mt-1'>{errors.email.message}</p>
                      )
                    : null}
              </div>

              <div>
                <InputForm
                  fieldName='password'
                  displayLabel='Password'
                  inputType='password'
                  placeholder='Enter your password'
                  {...register('password')}
                  required
                  autoComplete='current-password'
                />
                {errors.password && errors.password.types
                  ? (
                      Object.values(errors.password.types).map((msg, idx) => (
                        <p key={idx} className='text-xs text-red-600 mt-1'>{msg}</p>
                      ))
                    )
                  : errors.password
                    ? (
                      <p className='text-xs text-red-600 mt-1'>{errors.password.message}</p>
                      )
                    : null}
              </div>
              {/* <div className="text-sm">
                  <a href="#" className="font-semibold text-indigo-600 hover:text-indigo-500">
                    Forgot password?
                  </a>
                </div> */}
            </div>
            <AlertError message={errorMsg} />
            <div>
              <Button type='submit' loading={loading} loadingText='Signing in...'> Sign In </Button>
            </div>
          </form>

          <p className='mt-10 text-center text-sm/6 text-gray-500'>
            Not a member?{' '}
            <NavLink to='/signup' className='font-semibold text-indigo-600 hover:text-indigo-500'>
              Sign Up
            </NavLink>
          </p>
        </div>
      </div>
    </>
  )
}
