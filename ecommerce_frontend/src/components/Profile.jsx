import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
// Importa axiosInstance si vas a hacer llamadas para editar el perfil, por ahora no es estrictamente necesario
// import axiosInstance from '../services/axiosInstance'; 

const Profile = () => {
    const { user, loading } = useAuth(); // Obtén el usuario y el estado de carga del contexto
    const navigate = useNavigate();
    const [profileData, setProfileData] = useState(null); // Estado para los datos del perfil si los cargas de la API

    useEffect(() => {
        // Redirigir si el usuario no está autenticado (o si el contexto aún está cargando y no hay user)
        if (!loading && !user) {
            navigate('/login'); // Redirige al login si no hay usuario
        } else if (user) {
            // Si el usuario está disponible en el contexto, úsalo directamente
            setProfileData(user);
            // Si necesitas cargar datos adicionales del perfil del backend que no están en el token
            // por ejemplo, phone_number, address que no siempre se ponen en el token
            // descomentar y adaptar la siguiente lógica:
            // const fetchUserProfile = async () => {
            //     try {
            //         const response = await axiosInstance.get(`/accounts/profile/${user.id}/`); // Asume un endpoint de perfil
            //         setProfileData(response.data);
            //     } catch (error) {
            //         console.error("Error fetching user profile:", error);
            //         // Manejar el error, tal vez mostrar un mensaje
            //     }
            // };
            // fetchUserProfile();
        }
    }, [user, loading, navigate]);

    if (loading) {
        return (
            <div className="flex justify-center items-center h-screen bg-light-background">
                <p className="text-primary-blue text-lg font-bold">Cargando perfil...</p>
            </div>
        );
    }

    if (!user || !profileData) {
        // Si no hay user después de cargar (lo cual navigate('/') debería manejar), o profileData no está listo
        return (
            <div className="flex justify-center items-center h-screen bg-red-100 border border-red-300 text-red-700 p-4 rounded-md mx-auto max-w-lg mt-8">
                <p className="text-xl font-semibold">No se pudo cargar el perfil del usuario. Por favor, inicia sesión.</p>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-8 font-body min-h-[calc(100vh-80px)]">
            <h1 className="text-4xl font-heading font-bold text-dark-blue-gray mb-8 text-center">Mi Cuenta</h1>

            <div className="bg-white p-8 rounded-lg shadow-xl max-w-2xl mx-auto">
                <h2 className="text-3xl font-heading font-semibold text-primary-blue mb-6">Detalles de la cuenta</h2>
                
                <div className="space-y-4 text-dark-blue-gray text-lg">
                    <div className="flex justify-between items-center border-b border-light-background pb-3">
                        <span className="font-semibold">Usuario:</span>
                        <span>{profileData.username}</span>
                    </div>
                    <div className="flex justify-between items-center border-b border-light-background pb-3">
                        <span className="font-semibold">Email:</span>
                        <span>{profileData.email}</span>
                    </div>
                    {/* Campos adicionales si están disponibles en profileData y quieres mostrarlos */}
                    {profileData.phone_number && (
                        <div className="flex justify-between items-center border-b border-light-background pb-3">
                            <span className="font-semibold">Teléfono:</span>
                            <span>{profileData.phone_number}</span>
                        </div>
                    )}
                    {profileData.address && (
                        <div className="flex justify-between items-center border-b border-light-background pb-3">
                            <span className="font-semibold">Dirección:</span>
                            <span>{profileData.address}</span>
                        </div>
                    )}
                    {profileData.document_id && (
                        <div className="flex justify-between items-center border-b border-light-background pb-3">
                            <span className="font-semibold">DNI/Documento:</span>
                            <span>{profileData.document_id}</span>
                        </div>
                    )}
                    <div className="flex justify-between items-center">
                        <span className="font-semibold">Tipo de Usuario:</span>
                        <span>{profileData.is_staff ? 'Administrador' : 'Cliente'}</span>
                    </div>
                </div>

                {/* Botón para editar perfil (futura funcionalidad) */}
                {/* <div className="mt-8 text-center">
                    <button
                        className="bg-primary-blue text-white font-bold py-3 px-6 rounded-lg text-lg
                                   hover:bg-opacity-80 transition-colors duration-300 shadow-md"
                        onClick={() => alert('Funcionalidad de edición de perfil pendiente')}
                    >
                        Editar Perfil
                    </button>
                </div> */}
            </div>
            
            {/* Sección de Historial de Pedidos (futura funcionalidad) */}
            {/* <div className="mt-12 bg-white p-8 rounded-lg shadow-xl max-w-2xl mx-auto">
                <h2 className="text-3xl font-heading font-semibold text-primary-blue mb-6">Historial de Pedidos</h2>
                <p className="text-medium-text-gray">No hay pedidos registrados todavía.</p>
                
                {/* Aquí iría la lógica para listar los pedidos del usuario }
            </div> */}
        </div>
    );
};

export default Profile;