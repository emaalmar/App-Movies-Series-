import { useEffect, useState } from "react"
import { useUserStore } from "../store/userStore.js"
import { api } from "../services/api.js"
import { InputForm } from "../components/InputForm.jsx"
import { AlertError } from "../components/AlertError.jsx"
import { Button } from "../components/Button.jsx"

const initialProfileState = {
    fullName: '',
    email: '',
    password: ''
};

export const ProfilePage = () => {
    const [formData, setFormData] = useState(initialProfileState);
    const [errorMsg, setErrorMsg] = useState('');
    const token = useUserStore(state => state.token);

    useEffect(() => {
        const getUserData = async () => {
            if (!token) {
                setErrorMsg('No hay token de autenticación');
                return;
            }
            try {
                const { data } = await api.get('/users/me', {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });
                setFormData({
                    fullName: data.user.fullName,
                    email: data.user.email,
                    password: data.user.passwordHash || ''
                });
            } catch (err) {
                const msg = err?.response?.data?.message || err?.message || 'Error al cargar datos';
                setErrorMsg(msg);
            }
        };
        getUserData();
    }, [token]);

    // Para edición futura
    // const handleChange = (e) => {
    //     setFormData({ ...formData, [e.target.name]: e.target.value });
    //     setErrorMsg("");
    // };

    return (
        <div className="flex min-h-full flex-col justify-center px-6 py-12 lg:px-8">
            <div className="sm:mx-auto sm:w-full sm:max-w-sm">
                <h1 className="mt-2 text-center text-2xl font-bold tracking-tight text-gray-900">
                    Perfil
                </h1>
            </div>
            <div className="mt-10 text-left sm:mx-auto sm:w-full sm:max-w-sm">
                <form className="space-y-5 bg-white rounded-lg shadow p-6">
                    <InputForm
                        fieldName="fullName"
                        displayLabel="Nombre"
                        inputType="text"
                        value={formData.fullName}
                        handleOnChange={() => {}}
                        disabled={true}
                        autoComplete="name"
                    />
                    <InputForm
                        fieldName="email"
                        displayLabel="Email"
                        inputType="email"
                        value={formData.email}
                        handleOnChange={() => {}}
                        disabled={true}
                        autoComplete="email"
                    />
                    <InputForm
                        fieldName="password"
                        displayLabel="Contraseña"
                        inputType="password"
                        value="********"
                        handleOnChange={() => {}}
                        disabled={true}
                        autoComplete="current-password"
                    />
                    {errorMsg && (
                        <AlertError message={errorMsg} />
                    )}

                    <Button type="submit" disabled={true}>Editar
                    </Button>
                </form>
            </div>
        </div>
    );
}
