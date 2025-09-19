import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useProfileContext } from '../contexts/ProfileContext'
import { InputForm } from '../components/InputForm.jsx'
import { AlertError } from '../components/AlertError.jsx'
import { AlertSuccess } from '../components/AlertSuccess.jsx'
import { Button } from '../components/Button.jsx'
import { useAuth } from '../contexts/AuthContext'

// Esquema de validación con Zod para perfil
const profileSchema = z.object({
  fullName: z.string().min(2, 'El nombre debe tener al menos 2 caracteres'),
  email: z.string().email('Correo electrónico inválido'),
})

const passwordSchema = z.object({
  currentPassword: z.string().min(1, 'La contraseña actual no puede estar vacía'),
  newPassword: z.string()
    .min(6, 'La nueva contraseña debe tener al menos 6 caracteres')
    .max(100, 'La contraseña es demasiado larga')
    .regex(/[A-Z]/, 'La contraseña debe contener al menos una letra mayúscula')
    .regex(/[0-9]/, 'La contraseña debe contener al menos un número'),
})

export const ProfilePage = () => {
  const { user, loading } = useAuth()
  const { profile, updateProfile, changePassword, loading: profileLoading } = useProfileContext()
  const [editing, setEditing] = useState(false)
  const [saving, setSaving] = useState(false)
  const [successMsg, setSuccessMsg] = useState('')
  const [pwError, setPwError] = useState('')
  const [profileError, setProfileError] = useState('') // Estado para el error de perfil

  // Formulario de perfil
  const { register: registerProfile, handleSubmit: handleSubmitProfile, formState: { errors: errorsProfile }, reset: resetProfile } = useForm({
    resolver: zodResolver(profileSchema),
    defaultValues: { fullName: '', email: '' }
  })

  // Formulario de cambio de contraseña
  const { register: registerPw, handleSubmit: handleSubmitPw, formState: { errors: errorsPw }, reset: resetPw } = useForm({
    resolver: zodResolver(passwordSchema),
    defaultValues: { currentPassword: '', newPassword: '' }
  })

  useEffect(() => {
    if (profile) {
      resetProfile({ fullName: profile.fullName, email: profile.email })
    }
  }, [profile, resetProfile])

  useEffect(() => {
    if (successMsg) {
      const t = setTimeout(() => setSuccessMsg(''), 3000)
      return () => clearTimeout(t)
    }
  }, [successMsg])

  const handleCancelEdit = () => {
    if (profile) {
      resetProfile({ fullName: profile.fullName, email: profile.email })
    }
    setEditing(false)
  }

  const onSaveProfile = async (data) => {
    setSaving(true)
    setProfileError('')
    try {
      await updateProfile({ fullName: data.fullName, email: data.email })
      setSuccessMsg('Perfil actualizado')
      setEditing(false)
      setPwError('')
    } catch (err) {
      const msg = err?.response?.data?.message || err?.message || 'Error al actualizar perfil'
      setPwError('')
      setProfileError(msg)
    } finally {
      setSaving(false)
    }
  }

  const onChangePassword = async (data) => {
    setPwError('')
    try {
      await changePassword(data.currentPassword, data.newPassword)
      setSuccessMsg('Contraseña actualizada')
      resetPw()
    } catch (err) {
      const msg = err?.response?.data?.message || err?.message || 'Error al cambiar contraseña'
      setPwError(msg)
    }
  }

  if (loading || profileLoading) return <div className='text-center mt-10'>Cargando...</div>
  if (!user) return <div className='text-center mt-10'>No autenticado</div>

  return (
    <div className='flex min-h-full flex-col justify-center px-6 py-12 lg:px-8'>
      <div className='sm:mx-auto sm:w-full sm:max-w-sm'>
        <h1 className='mt-2 text-center text-2xl font-bold tracking-tight text-gray-900'>
          Perfil
        </h1>
      </div>
      <div className='mt-10 text-left sm:mx-auto sm:w-full sm:max-w-sm'>

        <form onSubmit={handleSubmitProfile(onSaveProfile)} className='space-y-5 bg-white rounded-lg shadow p-6' noValidate>
          <div className='flex justify-center items-center mb-4 space-x-4'>
            <h2 className='text-lg font-semibold'>Información</h2>
          </div>
          {profileError && <AlertError message={profileError} />}
          <InputForm
            fieldName='fullName'
            displayLabel='Nombre'
            inputType='text'
            {...registerProfile('fullName')}
            disabled={!editing}
            autoComplete='name'
          />
          {errorsProfile.fullName && errorsProfile.fullName.types
            ? (
                Object.values(errorsProfile.fullName.types).map((msg, idx) => (
                  <p key={idx} className='text-xs text-red-600 mt-1'>{msg}</p>
                ))
              )
            : errorsProfile.fullName
              ? (
                <p className='text-xs text-red-600 mt-1'>{errorsProfile.fullName.message}</p>
                )
              : null}
          <InputForm
            fieldName='email'
            displayLabel='Email'
            inputType='email'
            {...registerProfile('email')}
            disabled={!editing}
            autoComplete='email'
          />
          {errorsProfile.email && errorsProfile.email.types
            ? (
                Object.values(errorsProfile.email.types).map((msg, idx) => (
                  <p key={idx} className='text-xs text-red-600 mt-1'>{msg}</p>
                ))
              )
            : errorsProfile.email
              ? (
                <p className='text-xs text-red-600 mt-1'>{errorsProfile.email.message}</p>
                )
              : null}

          {successMsg && <AlertSuccess title='Éxito' text={successMsg} onClose={() => setSuccessMsg('')} />}

          {!editing
            ? (
              <Button
                className=''
                type='button'
                onClick={() => setEditing(true)}
                disabled={saving}
              >
                Editar
              </Button>
              )
            : (
              <>
                <Button
                  className=''
                  type='submit'
                  disabled={saving}
                >
                  Guardar
                </Button>
                <Button
                  className=''
                  type='button'
                  onClick={handleCancelEdit}
                  disabled={saving}
                >
                  Cancelar
                </Button>
              </>
              )}
        </form>

        <div className='mt-6 bg-white rounded-lg shadow p-6'>
          <h3 className='text-lg font-medium flex justify-center items-center mb-4 space-x-4'>Cambiar contraseña</h3>
          <form onSubmit={handleSubmitPw(onChangePassword)} className='space-y-3' noValidate autoComplete='on'>
            {/* Campo oculto para username para accesibilidad/autocompletado */}
            <input type='text' name='username' autoComplete='username' style={{ display: 'none' }} tabIndex={-1} aria-hidden='true' />
            <InputForm fieldName='currentPassword' displayLabel='Contraseña actual' inputType='password' autoComplete='current-password' {...registerPw('currentPassword')} />
            {errorsPw.currentPassword && errorsPw.currentPassword.types
              ? (
                  Object.values(errorsPw.currentPassword.types).map((msg, idx) => (
                    <p key={idx} className='text-xs text-red-600 mt-1'>{msg}</p>
                  ))
                )
              : errorsPw.currentPassword
                ? (
                  <p className='text-xs text-red-600 mt-1'>{errorsPw.currentPassword.message}</p>
                  )
                : null}
            <InputForm fieldName='newPassword' displayLabel='Nueva contraseña' inputType='password' autoComplete='new-password' {...registerPw('newPassword')} />
            {errorsPw.newPassword && errorsPw.newPassword.types
              ? (
                  Object.values(errorsPw.newPassword.types).map((msg, idx) => (
                    <p key={idx} className='text-xs text-red-600 mt-1'>{msg}</p>
                  ))
                )
              : errorsPw.newPassword
                ? (
                  <p className='text-xs text-red-600 mt-1'>{errorsPw.newPassword.message}</p>
                  )
                : null}
            {pwError && <AlertError message={pwError} />}
            <div>
              <Button type='submit'>Cambiar contraseña</Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
