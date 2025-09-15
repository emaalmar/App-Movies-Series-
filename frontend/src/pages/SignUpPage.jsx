import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { TvIcon } from '@heroicons/react/24/outline'
import { NavLink, useNavigate } from 'react-router-dom'
import { AlertSuccess } from '../components/AlertSuccess.jsx'
import { signup } from '../api/auth.js'
import { InputForm } from '../components/InputForm.jsx'
import { AlertError } from '../components/AlertError.jsx'
import { Button } from '../components/Button.jsx'
import { useAuth } from '../contexts/AuthContext'


const signUpSchema = z.object({
  fullName: z.string().trim().min(2, 'El nombre debe tener al menos 2 caracteres').max(100),
  email: z.string().email('Correo electrónico inválido'),
  password: z.string()
    .min(6, 'La contraseña debe tener al menos 6 caracteres')
    .max(100, 'La contraseña es demasiado larga')
    .regex(/[A-Z]/, 'La contraseña debe contener al menos una letra mayúscula')
    .regex(/[0-9]/, 'La contraseña debe contener al menos un número'),
})

export const SignUpPage = () => {

  const [showAlert, setShowAlert] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { setUser } = useAuth();

  const { register, handleSubmit, formState: { errors }, reset } = useForm({
    resolver: zodResolver(signUpSchema),
    defaultValues: { fullName: '', email: '', password: '' }
  });

  const onSubmit = async (data) => {
    setErrorMsg("");
    try {
      setLoading(true);
      const { token, user } = await signup(data);
      if (token) {
        localStorage.setItem('token', token);
        if (user) setUser(user);
      }
      setShowAlert(true);
      navigate('/home');
      reset();
    } catch (err) {
      const msg = err?.response?.data?.message || err?.message || 'Error desconocido';
      setErrorMsg(msg);
    } finally {
      setLoading(false);
    }
  }
  return (
    <>
      {showAlert && (
        <AlertSuccess
          title="Éxito"
          text="Tu cuenta fue creada correctamente"
          icon="success"
          onClose={() => setShowAlert(false)}
        />
      )}

      <div className="flex min-h-full flex-col justify-center px-6 py-12 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-sm">
          <TvIcon className="mx-auto h-16 w-auto text-black" aria-label="Movies and TV Shows" />
          <h2 className="mt-2 text-center text-2xl font-bold tracking-tight text-gray-900">
            Sign up to your account
          </h2>
        </div>

        <div className="mt-10 text-left sm:mx-auto sm:w-full sm:max-w-sm">
          <form id="sign-up-form" onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            <div className="">
              <InputForm
                fieldName="fullName"
                displayLabel="Name"
                inputType='text'
                required={true}
                placeholder="Enter your name"
                {...register('fullName')}
                autoComplete="name"
              />
              {errors.fullName && errors.fullName.types ? (
                Object.values(errors.fullName.types).map((msg, idx) => (
                  <p key={idx} className="text-xs text-red-600 mt-1">{msg}</p>
                ))
              ) : errors.fullName ? (
                <p className="text-xs text-red-600 mt-1">{errors.fullName.message}</p>
              ) : null}

              <div>
                <InputForm
                  fieldName="email"
                  displayLabel="Email"
                  inputType='email'
                  placeholder="Enter your email"
                  {...register('email')}
                  required={true}
                  autoComplete="email"
                />
                {errors.email && errors.email.types ? (
                  Object.values(errors.email.types).map((msg, idx) => (
                    <p key={idx} className="text-xs text-red-600 mt-1">{msg}</p>
                  ))
                ) : errors.email ? (
                  <p className="text-xs text-red-600 mt-1">{errors.email.message}</p>
                ) : null}
              </div>

              <div>
                <InputForm
                  fieldName="password"
                  displayLabel="Password"
                  inputType='password'
                  placeholder="Enter your password"
                  {...register('password')}
                  required={true}
                  autoComplete="new-password"
                />
                {errors.password && errors.password.types ? (
                  Object.values(errors.password.types).map((msg, idx) => (
                    <p key={idx} className="text-xs text-red-600 mt-1">{msg}</p>
                  ))
                ) : errors.password ? (
                  <p className="text-xs text-red-600 mt-1">{errors.password.message}</p>
                ) : null}
              </div>
            </div>

            {errorMsg && <AlertError message={errorMsg} />}

            <Button
              type="submit"
              disabled={loading}
              loading={loading}
              loadingText="Creating..."
            >
              Create Account
            </Button>

            <p className="mt-10 text-center text-sm text-gray-500">
              Already a member?{' '}
              <NavLink to="/" className="font-semibold text-indigo-600 hover:text-indigo-500">
                Sign In
              </NavLink>
            </p>
          </form>
        </div>
      </div>
    </>
  );

}
