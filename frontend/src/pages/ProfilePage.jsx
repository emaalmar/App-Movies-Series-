import { useEffect, useState } from "react"
import { useProfile } from "../hooks/useProfileHook"
import { InputForm } from "../components/InputForm.jsx"
import { AlertError } from "../components/AlertError.jsx"
import { AlertSuccess } from "../components/AlertSuccess.jsx"
import { Button } from "../components/Button.jsx"

const initialProfileState = {
    fullName: '',
    email: '',
    password: ''
};

export const ProfilePage = () => {
    const [formData, setFormData] = useState(initialProfileState)
    const { profile, error, updateProfile, updatePassword, load } = useProfile()
    const [editing, setEditing] = useState(false)
    const [saving, setSaving] = useState(false)
    const [successMsg, setSuccessMsg] = useState('')

    // password form
    const [currentPassword, setCurrentPassword] = useState('')
    const [newPassword, setNewPassword] = useState('')
    const [pwLoading, setPwLoading] = useState(false)
    const [pwError, setPwError] = useState('')

    useEffect(() => {
        if (profile) {
            setFormData({
                fullName: profile.fullName,
                email: profile.email,
                password: profile.passwordHash || ''
            })
        }
    }, [profile])

    useEffect(() => {
        if (successMsg) {
            const t = setTimeout(() => setSuccessMsg(''), 3000)
            return () => clearTimeout(t)
        }
    }, [successMsg])

    // Para edición futura
    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value })
    }

    const handleCancelEdit = () => {
        // reset to profile values
        if (profile) {
            setFormData({ fullName: profile.fullName, email: profile.email, password: '' })
        }
        setEditing(false)
    }

    const handleSave = async (e) => {
        e.preventDefault()
        setSaving(true)
        try {
            // basic client-side validation
            if (!formData.email || formData.email.trim() === '') {
                setPwError('El correo no puede estar vacío')
                setSaving(false)
                return
            }
            const data = { fullName: formData.fullName, email: formData.email }
            await updateProfile(data)
            setSuccessMsg('Perfil actualizado')
            setEditing(false)
            await load()
        } catch (err) {
            // show error via AlertError below
            console.error('updateProfile error', err)
            const msg = err?.response?.data?.message || err?.message || 'Error al actualizar perfil'
            // reuse pwError area for errors, or display general error
            setPwError(msg)
        } finally {
            setSaving(false)
        }
    }

    const handleChangePassword = async (e) => {
        e.preventDefault()
        setPwError('')
        setPwLoading(true)
        try {
            // client validation
            if (!currentPassword || currentPassword.trim() === '') {
                setPwError('La contraseña actual no puede estar vacía')
                setPwLoading(false)
                return
            }
            if (!newPassword || newPassword.trim().length < 6) {
                setPwError('La nueva contraseña debe tener al menos 6 caracteres')
                setPwLoading(false)
                return
            }
            await updatePassword(currentPassword, newPassword)
            setSuccessMsg('Contraseña actualizada')
            setCurrentPassword('')
            setNewPassword('')
        } catch (err) {
            setPwError(err?.response?.data?.message || err?.message || 'Error al cambiar contraseña')
        } finally {
            setPwLoading(false)
        }
    }

    return (
        <div className="flex min-h-full flex-col justify-center px-6 py-12 lg:px-8">
            <div className="sm:mx-auto sm:w-full sm:max-w-sm">
                <h1 className="mt-2 text-center text-2xl font-bold tracking-tight text-gray-900">
                    Perfil
                </h1>
            </div>
            <div className="mt-10 text-left sm:mx-auto sm:w-full sm:max-w-sm">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-lg font-semibold">Información</h2>
                    {!editing ? (
                        <Button onClick={() => setEditing(true)}>Editar</Button>
                    ) : (
                        <Button onClick={handleCancelEdit}>Cancelar</Button>
                    )}
                </div>

                <form onSubmit={handleSave} className="space-y-5 bg-white rounded-lg shadow p-6">
                    <InputForm
                        fieldName="fullName"
                        displayLabel="Nombre"
                        inputType="text"
                        value={formData.fullName}
                        handleOnChange={handleChange}
                        disabled={!editing}
                        autoComplete="name"
                    />
                    <InputForm
                        fieldName="email"
                        displayLabel="Email"
                        inputType="email"
                        value={formData.email}
                        handleOnChange={handleChange}
                        disabled={false}
                        autoComplete="email"
                    />

                    {error && <AlertError message={error} />}
                    {successMsg && <AlertSuccess title="Éxito" text={successMsg} onClose={() => setSuccessMsg('')} />}

                    <div className="flex items-center space-x-3">
                        <Button type="submit" disabled={saving}>Guardar</Button>
                        <Button type="button" onClick={handleCancelEdit} disabled={saving}>Cancelar</Button>
                    </div>
                </form>

                <div className="mt-6 bg-white rounded-lg shadow p-6">
                    <h3 className="text-lg font-medium mb-2">Cambiar contraseña</h3>
                    <form onSubmit={handleChangePassword} className="space-y-3">
                        <InputForm fieldName="currentPassword" displayLabel="Contraseña actual" inputType="password" value={currentPassword} handleOnChange={(e) => setCurrentPassword(e.target.value)} />
                        <InputForm fieldName="newPassword" displayLabel="Nueva contraseña" inputType="password" value={newPassword} handleOnChange={(e) => setNewPassword(e.target.value)} />
                        {pwError && <AlertError message={pwError} />}
                        <div>
                            <Button type="submit" loading={pwLoading}>Cambiar contraseña</Button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}
