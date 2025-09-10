
export const InputForm = ({
    fieldName,// nombre del campo en formData (ej: "email")
    displayLabel,// texto que ve el usuario (ej: "Correo electrónico")
    inputType = "text",// tipo de input (ej: "email", "password")
    placeholder,
    handleOnChange,// función para actualizar el estado del formulario
    value,
    required = false,
    autoComplete
}) => {
    const inputValue = typeof value === 'object' ? value[fieldName] : value;

    return (
        <div>
            <label
                htmlFor={fieldName}
                className="block text-sm/6 font-medium text-gray-900"
            >
                {displayLabel || fieldName}
            </label>
            <div className="mt-2">
                <input
                    id={fieldName}
                    name={fieldName}
                    type={inputType}
                    required={required}
                    placeholder={placeholder || ''}
                    value={inputValue}
                    onChange={handleOnChange}
                    autoComplete={autoComplete}
                    className="block w-full rounded-md bg-white px-1 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
                />
            </div>
        </div>
    )
}

//     <>
//       {showAlert && (
//         <AlertSucces
//           title="Éxito"
//           text="Tu cuenta fue creada correctamente"
//           icon="success"
//           onClose={() => setShowAlert(false)}
//         />
//       )}

//       <div className="flex min-h-full flex-col justify-center px-6 py-12 lg:px-8">
//         <div className="sm:mx-auto sm:w-full sm:max-w-sm">
//           <TvIcon className="mx-auto h-15 w-auto text-black" aria-label="Movies and TV Shows" />
//           <h2 className="mt-2 text-center text-2xl/9 font-bold tracking-tight text-gray-900">
//             Sign up to your account
//           </h2>
//         </div>

//         <div className="mt-10 text-left sm:mx-auto sm:w-full sm:max-w-sm">
//           <form id="sign-in-form" onSubmit={handleSubmit} className="space-y-5">
//             <div>
//               <label htmlFor="fullName" className="block text-sm/6 font-medium text-gray-900">
//                 Name
//               </label>
//               <div className="mt-2">
//                 <input
//                   id="fullName"
//                   name="fullName"
//                   type="text"
//                   required
//                   autoComplete="name"
//                   value={formData.fullName}
//                   onChange={handleChange}
//                   className="block w-full rounded-md bg-white px-1 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
//                 />
//               </div>
//             </div>

//             <div>
//               <label htmlFor="email" className="block text-sm/6 font-medium text-gray-900">
//                 Email address
//               </label>
//               <div className="mt-2">
//                 <input
//                   id="email"
//                   name="email"
//                   type="email"
//                   required
//                   autoComplete="email"
//                   value={formData.email}
//                   onChange={handleChange}
//                   className="block w-full rounded-md bg-white px-1 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
//                 />
//               </div>
//             </div>

//             <div>
//               <div className="flex items-center justify-between">
//                 <label htmlFor="password" className="block text-sm/6 font-medium text-gray-900">
//                   Password
//                 </label>
//                 {/* <div className="text-sm">
//                   <a href="#" className="font-semibold text-indigo-600 hover:text-indigo-500">
//                     Forgot password?
//                   </a>
//                 </div> */}
//               </div>
//               <div className="mt-2">
//                 <input
//                   id="password"
//                   name="password"
//                   type="password"
//                   required
//                   autoComplete="current-password"
//                   value={formData.password}
//                   onChange={handleChange}
//                   className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
//                 />
//               </div>
//             </div>

//             <div>
//               {errorMsg && <p className="text-sm text-red-600 text-center">{errorMsg}</p>}
//               <button
//                 type="submit"
//                 disabled={loading}
//                 className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm/6 font-semibold text-white shadow-xs hover:bg-indigo-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
//               >
//                 {loading ? 'Creating...' : 'Create Account'}
//               </button>

//               <p className="mt-10 text-center text-sm/6 text-gray-500">
//                 Already a member?{' '}
//                 <NavLink to="/" className="font-semibold text-indigo-600 hover:text-indigo-500">
//                   Sign In
//                 </NavLink>
//               </p>
//             </div>
//           </form>
//         </div>
//       </div>
//     </>
//   )