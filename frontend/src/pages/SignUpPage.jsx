import { useState } from 'react'
import { z } from 'zod'
import { TvIcon } from '@heroicons/react/24/outline'
import { NavLink, useNavigate } from 'react-router-dom'
import { AlertSuccess } from '../components/AlertSuccess.jsx'
import { signup } from '../api/auth.js'
import { useProfile } from '../hooks/useProfileHook'
import { useUserStore } from '../store/userStore.js'
import { InputForm } from '../components/InputForm.jsx'
import { AlertError } from '../components/AlertError.jsx'
import { Button } from '../components/Button.jsx'

// Esquema de validación con Zod
const signUpSchema = z.object({
  fullName: z.string().min(2, 'El nombre debe tener al menos 2 caracteres'),
  email: z.string().email('Correo electrónico inválido'),
  password: z.string().min(6, 'La contraseña debe tener al menos 6 caracteres'),
})



export const SignUpPage = () => {

  const [showAlert, setShowAlert] = useState(false);
  const [formData, setFormData] = useState({ fullName: "", email: "", password: "" });
  const [errorMsg, setErrorMsg] = useState('');
  const [loading, setLoading] = useState(false);
  const [validationErrors, setValidationErrors] = useState({});
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setErrorMsg("");
  };
  const setToken = useUserStore(state => state.setToken);
  const { load: loadProfile } = useProfile();

  const handleSubmit = async (event) => {
    event.preventDefault();
    setValidationErrors({});
    setErrorMsg("");
    // Validación con Zod
    const result = signUpSchema.safeParse(formData);
    if (!result.success) {
      // Mapear errores de Zod
      const fieldErrors = {};
      result.error.errors.forEach(err => {
        fieldErrors[err.path[0]] = err.message;
      });
      setValidationErrors(fieldErrors);
      return;
    }
    try {
      setLoading(true);
      const { token } = await signup(formData);
      if (token) {
        setToken(token)
        try { await loadProfile() } catch { /* ignore profile load errors */ }
      }
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
          <form id="sign-up-form" onSubmit={handleSubmit} className="space-y-5">
            <div className="">
              <InputForm
                fieldName="fullName"
                displayLabel="Name"
                inputType='text'
                required={true}
                placeholder="Enter your name"
                handleOnChange={handleChange}
                value={formData.fullName}
                autoComplete="name"
              />
              {validationErrors.fullName && (
                <p className="text-xs text-red-600 mt-1">{validationErrors.fullName}</p>
              )}


              <div>
                <InputForm
                  fieldName="email"
                  displayLabel="Email"
                  inputType='email'
                  placeholder="Enter your email"
                  handleOnChange={handleChange}
                  value={formData.email}
                  required={true}
                  autoComplete="email"
                />
                {validationErrors.email && (
                  <p className="text-xs text-red-600 mt-1">{validationErrors.email}</p>
                )}
              </div>

              <div>
                <InputForm
                  fieldName="password"
                  displayLabel="Password"
                  inputType='password'
                  placeholder="Enter your password"
                  handleOnChange={handleChange}
                  value={formData.password}
                  required={true}
                  autoComplete="new-password"
                />
                {validationErrors.password && (
                  <p className="text-xs text-red-600 mt-1">{validationErrors.password}</p>
                )}
              </div>
              {/* <div className="mt-2 text-xs text-left">
                <a href="#" className="font-semibold text-indigo-600 hover:text-indigo-500">
                  Forgot password?
                </a>
              </div> */}
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
