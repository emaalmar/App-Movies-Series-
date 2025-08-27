import React from 'react'

// Botón reutilizable con soporte para loading y estilos personalizados
export const Button = ({
    type = "button",           // Tipo de botón (submit, button, etc)
    disabled = false,          // Deshabilitar el botón
    loading = false,           // Mostrar estado de carga
    loadingText = "Loading...",// Texto mientras carga
    children,                  // Texto o contenido del botón
    className = "",            // Clases extra de Tailwind
    ...props                   // Otros props (onClick, etc)
}) => {
    return (
        <button
            type={type}
            disabled={disabled || loading}
            className={
                `flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold text-white shadow-sm
                hover:bg-indigo-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600
                ${className}`
            }
            {...props}
        >
            {loading ? loadingText : children}
        </button>
    )
}

// // Ejemplo 1: Botón de guardar con loading y clase extra
// <Button
//   type="submit"
//   disabled={false}
//   loading={true}
//   loadingText="Guardando..."
//   className="mt-4"
//   onClick={() => alert('Guardando...')}
// >
//   Guardar
// </Button>

// // Ejemplo 2: Botón normal con clase personalizada
// <Button
//   type="button"
//   disabled={false}
//   loading={false}
//   className="bg-green-600 hover:bg-green-500"
//   onClick={() => alert('¡Hola!')}
// >
//   Click aquí
// </Button>

// // Ejemplo 3: Botón deshabilitado
// <Button
//   type="button"
//   disabled={true}
//   loading={false}
// >
//   Deshabilitado
// </Button>