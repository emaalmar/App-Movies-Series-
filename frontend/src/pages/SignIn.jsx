import { useState } from 'react'
import { TvIcon } from '@heroicons/react/24/outline'
import { NavLink, useNavigate } from 'react-router-dom'
import { api } from '../services/api.js';
import { useUserStore } from '../store/userStore';
import { AlertError } from '../components/AlertError.jsx'
import { InputForm } from '../components/InputForm.jsx';
import { Button } from '../components/Button.jsx';


export const SignIn = () => {

  const [formData, setFormData] = useState({ email: '', password: '' });
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

      const { data } = await api.post('/auth/signin', formData);
      setToken(data.token);
      setFormData({ email: '', password: '' });
      navigate("/home");
    } catch (err) {
      const msg = err?.response?.data?.message || err?.message || 'Error desconocido';
      setErrorMsg(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="flex min-h-full flex-col justify-center px-6 py-12 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-sm">
          <TvIcon className="mx-auto h-15 w-auto text-black" aria-label="Movies and TV Shows" />
          <h2 className="mt-2 text-center text-2xl/9 font-bold tracking-tight text-gray-900">
            Sign in to your account
          </h2>
        </div>

        <div className="mt-10 text-left sm:mx-auto sm:w-full sm:max-w-sm">
          <form id="sign-in-form" onSubmit={handleSubmit} className="space-y-5">
            <div>
              <div>
                <InputForm
                  fieldName="email"
                  displayLabel="Email address"
                  inputType='email'
                  placeholder="Enter your email"
                  handleOnChange={handleChange}
                  value={formData.email}
                  required={true}
                />
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
                />
              </div>
              {/* <div className="text-sm">
                  <a href="#" className="font-semibold text-indigo-600 hover:text-indigo-500">
                    Forgot password?
                  </a>
                </div> */}
            </div>
            <AlertError message={errorMsg} />
            <div>
                <Button type="submit" loading={loading} loadingText='Creating...'> Create Account </Button>
            </div>


          </form>

          <p className="mt-10 text-center text-sm/6 text-gray-500">
            Not a member?{' '}
            <NavLink to="/signup" className="font-semibold text-indigo-600 hover:text-indigo-500">
              Sign Up
            </NavLink>
          </p>
        </div>
      </div>
    </>
  )
}
