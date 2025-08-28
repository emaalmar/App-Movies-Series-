import { useState } from 'react';
import { TvIcon } from '@heroicons/react/24/outline';
import { NavLink, useNavigate } from 'react-router-dom';
import { AlertError } from '../components/AlertError.jsx';
import { InputForm } from '../components/InputForm.jsx';
import { Button } from '../components/Button.jsx';
import { signinRequest } from '../api/auth.js';

export const SignIn = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg('');
    try {
      const res = await signinRequest(formData);
      navigate("/home");
    } catch (error) {
      setErrorMsg(error?.response?.data?.message || 'Error en la solicitud de inicio de sesión');
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
            <InputForm
              fieldName="email"
              displayLabel="Email address"
              inputType='email'
              placeholder="Enter your email"
              handleOnChange={handleChange}
              value={formData.email}
              required={true}
            />
            <InputForm
              fieldName="password"
              displayLabel="Password"
              inputType='password'
              placeholder="Enter your password"
              handleOnChange={handleChange}
              value={formData.password}
              required={true}
            />
            <AlertError message={errorMsg} />
            <Button type="submit" loading={loading} loadingText='Signing in...'> Sign In </Button>
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
  );
};