import { useEffect, useState } from "react"

export const Profile = () => {
    const [user, setUser] = useState(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)

    useEffect(() => {
        const token = localStorage.getItem("token")
        fetch("/api/users/me", {
            headers: {
                "Authorization": `Bearer ${token}`
            }
        })
        .then(async res => {
            if (!res.ok) {
                const error = await res.json()
                throw new Error(error.message || "Error al obtener perfil")
            }
            return res.json()
        })
        .then(data => setUser(data.user)) // nota: data.user porque el backend envía { message, user }
        .catch(err => setError(err.message))
        .finally(() => setLoading(false))
    }, [])

    if (loading) return <p>Cargando...</p>
    if (error) return <p>Error: {error}</p>
    if (!user) return <p>No hay datos de usuario</p>

    return (
        <div>
            <h1>Perfil</h1>
            <p>Nombre: {user.fullName}</p>
            <p>Email: {user.email}</p>
        </div>
    )
}