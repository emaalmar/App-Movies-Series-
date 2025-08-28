// import { Navigate, Outlet } from 'react-router-dom';
// import { useUserStore } from '../store/userStore';

// function ProtectedRoute({ children, redirectTo = '/' }) {
//     const token = useUserStore(state => state.token);
//     const isAuthenticated = !!token;

//     if (!isAuthenticated) {
//         return <Navigate to={redirectTo} />;
//     }

//     return children ? children : <Outlet />;
// }

// export default ProtectedRoute;