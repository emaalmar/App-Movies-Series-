import { useState } from 'react'
import { TvIcon } from '@heroicons/react/24/outline'
import { NavLink, useNavigate } from 'react-router-dom'
import { AlertSucces } from '../components/AlertSuccess.jsx'
import z from 'zod'
import { api } from "../services/api.js"
import { useUserStore } from '../store/userStore.js'

const schema = z.object({
  fullName: z.string()
    .trim()
    .min(2, "El nombre debe tener al menos 2 caracteres")
    .max(100),
  email: z.string()
    .trim()
    .email("Correo electrónico inválido"),
  password: z.string()
    .min(6, "La contraseña debe tener al menos 6 caracteres")
    .max(100).refine((val) => /[A-Z]/.test(val), {
      message: "La contraseña debe contener al menos una letra mayúscula",
    })
    .refine((val) => /[0-9]/.test(val), {
      message: "La contraseña debe contener al menos un número",
    }),
})

export const SignUp = () => {

  const [showAlert, setShowAlert] = useState(false);
  const [formData, setFormData] = useState({ fullName: "", email: "", password: "" });
  const [errorMsg, setErrorMsg] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setErrorMsg("");
  };
  const setToken = useUserStore(state => state.setToken);

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      setLoading(true);
      setErrorMsg("");

      const { data } = await api.post('/auth/signup', formData);
      setToken(data.token);
      setShowAlert(true);
      navigate('/home');
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
        <AlertSucces
          title="Éxito"
          text="La operación fue exitosa"
          icon="success"
          onClose={() => setShowAlert(false)}
        />
      )}

      <div className="flex min-h-full flex-col justify-center px-6 py-12 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-sm">
          <TvIcon className="mx-auto h-15 w-auto text-black" aria-label="Movies and TV Shows" />
          <h2 className="mt-2 text-center text-2xl/9 font-bold tracking-tight text-gray-900">
            Sign up to your account
          </h2>
        </div>

        <div className="mt-10 text-left sm:mx-auto sm:w-full sm:max-w-sm">
          <form id="sign-in-form" onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label htmlFor="fullName" className="block text-sm/6 font-medium text-gray-900">
                Name
              </label>
              <div className="mt-2">
                <input
                  id="fullName"
                  name="fullName"
                  type="text"
                  required
                  autoComplete="name"
                  value={formData.fullName}
                  onChange={handleChange}
                  className="block w-full rounded-md bg-white px-1 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
                />
              </div>
            </div>

            <div>
              <label htmlFor="email" className="block text-sm/6 font-medium text-gray-900">
                Email address
              </label>
              <div className="mt-2">
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  autoComplete="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="block w-full rounded-md bg-white px-1 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between">
                <label htmlFor="password" className="block text-sm/6 font-medium text-gray-900">
                  Password
                </label>
                {/* <div className="text-sm">
                  <a href="#" className="font-semibold text-indigo-600 hover:text-indigo-500">
                    Forgot password?
                  </a>
                </div> */}
              </div>
              <div className="mt-2">
                <input
                  id="password"
                  name="password"
                  type="password"
                  required
                  autoComplete="current-password"
                  value={formData.password}
                  onChange={handleChange}
                  className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
                />
              </div>
            </div>

            <div>
              {errorMsg && <p className="text-sm text-red-600 text-center">{errorMsg}</p>}
              <button
                type="submit"
                disabled={loading}
                className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm/6 font-semibold text-white shadow-xs hover:bg-indigo-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
              >
                {loading ? 'Creating...' : 'Create Account'}
              </button>

              <p className="mt-10 text-center text-sm/6 text-gray-500">
                Already a member?{' '}
                <NavLink to="/" className="font-semibold text-indigo-600 hover:text-indigo-500">
                  Sign In
                </NavLink>
              </p>
            </div>
          </form>
        </div>
      </div>
    </>
  )
}