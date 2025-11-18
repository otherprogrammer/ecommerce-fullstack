import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const ProtectedRoute = ({ children, requireAuth = true, requireAdmin = false }) => {
    const { user } = useAuth();

    // Si la ruta requiere autenticación y no hay usuario, redirigir a login
    if (requireAuth && !user) {
        return <Navigate to="/login" replace />;
    }

    // Si la ruta requiere admin y el usuario no es staff, mostrar mensaje
    if (requireAdmin && user && !user.is_staff) {
        return (
            <div className="container mx-auto px-4 py-8 text-center">
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded max-w-md mx-auto mt-8">
                    <h2 className="text-xl font-bold mb-2">Acceso Denegado</h2>
                    <p>Solo administradores pueden ver esta página.</p>
                </div>
            </div>
        );
    }

    // Si todo está bien, renderizar el componente hijo
    return children;
};

export default ProtectedRoute;
