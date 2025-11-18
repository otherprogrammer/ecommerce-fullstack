import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const ProtectedRoute = ({ children, requireAuth = true }) => {
    const { user } = useAuth();

    // Si la ruta requiere autenticación y no hay usuario, redirigir a login
    if (requireAuth && !user) {
        return <Navigate to="/login" replace />;
    }

    // Si todo está bien, renderizar el componente hijo
    return children;
};

export default ProtectedRoute;
