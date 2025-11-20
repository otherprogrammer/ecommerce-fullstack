import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext'; // Importa el hook useAuth

const Navbar = () => {
    const { user, logout } = useAuth(); // Obtén el usuario y la función de logout del contexto
    console.log("5. Navbar: User from AuthContext:", user); // <-- AÑADIDO PARA DEBUG
    const navigate = useNavigate();
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    const handleLogout = () => {
        logout(); // Esto también debería redirigir a /login como está configurado en AuthContext
        // navigate('/'); // AuthContext ya redirige, no necesitas esta línea aquí
    };

    return (
        <nav className="bg-dark-blue-gray text-white p-4 shadow-lg font-body"> {/* Usando tu nueva paleta y fuente */}
            <div className="container mx-auto flex justify-between items-center">
                {/* Logo / Nombre de la Tienda */}
                <Link to="/" className="text-2xl font-heading font-bold text-primary-blue hover:text-white transition-colors duration-300"> {/* Usa tu fuente de encabezado y color primario */}
                    TiendaX
                </Link>

                {/* Botón de Hamburguesa (Móvil) */}
                <div className="md:hidden">
                    <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="text-white focus:outline-none">
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16m-7 6h7"></path>
                        </svg>
                    </button>
                </div>

                {/* Navegación Principal (Escritorio) */}
                <div className="hidden md:flex space-x-6 items-center">
                    <Link to="/" className="hover:text-primary-blue transition-colors duration-300">Inicio</Link>
                    <Link to="/productos" className="hover:text-primary-blue transition-colors duration-300">Productos</Link>
                    <Link to="/carrito" className="flex items-center hover:text-primary-blue transition-colors duration-300">
                        <span className="text-xl mr-1">🛒</span> Carrito {/* Icono de carrito */}
                    </Link>

                    {/* Lógica de Autenticación */}
                    {user ? (
                        <>
                            {user.is_staff && ( // Si el usuario es admin/staff
                                <>
                                    <Link to="/productos/admin" className="hover:text-primary-blue transition-colors duration-300">Admin Productos</Link>
                                    <Link to="/categorias" className="hover:text-primary-blue transition-colors duration-300">Admin Categorías</Link>
                                    <Link to="/cupones" className="hover:text-primary-blue transition-colors duration-300">Admin Cupones</Link>
                                </>
                            )}
                            <Link to="/profile" className="hover:text-primary-blue transition-colors duration-300">Mi Cuenta</Link> {/* Ruta para perfil de usuario (puedes crearla después) */}
                            <button onClick={handleLogout} className="bg-primary-blue hover:bg-opacity-80 text-dark-blue-gray font-bold py-2 px-4 rounded-lg transition-colors duration-300">
                                Cerrar Sesión
                            </button>
                        </>
                    ) : (
                        <>
                            <Link to="/login" className="hover:text-primary-blue transition-colors duration-300">Login</Link>
                            <Link to="/register" className="bg-primary-blue hover:bg-opacity-80 text-dark-blue-gray font-bold py-2 px-4 rounded-lg transition-colors duration-300">
                                Registrarse
                            </Link>
                        </>
                    )}
                </div>
            </div>

            {/* Menú Móvil Desplegable */}
            {isMobileMenuOpen && (
                <div className="md:hidden bg-dark-blue-gray text-white py-2 px-4 space-y-2 mt-2 border-t border-gray-700"> {/* Con borde superior */}
                    <Link to="/" className="block hover:text-primary-blue transition-colors duration-300 py-1">Inicio</Link>
                    <Link to="/productos" className="block hover:text-primary-blue transition-colors duration-300 py-1">Productos</Link>
                    <Link to="/carrito" className="block flex items-center hover:text-primary-blue transition-colors duration-300 py-1">
                        <span className="text-xl mr-1">🛒</span> Carrito
                    </Link>
                    {user ? (
                        <>
                            {user.is_staff && (
                                <>
                                    <Link to="/productos/admin" className="block hover:text-primary-blue transition-colors duration-300 py-1">Admin Productos</Link>
                                    <Link to="/categorias" className="block hover:text-primary-blue transition-colors duration-300 py-1">Admin Categorías</Link>
                                    <Link to="/cupones" className="block hover:text-primary-blue transition-colors duration-300 py-1">Admin Cupones</Link>
                                </>
                            )}
                            <Link to="/profile" className="block hover:text-primary-blue transition-colors duration-300 py-1">Mi Cuenta</Link>
                            <button onClick={handleLogout} className="block w-full text-left bg-primary-blue hover:bg-opacity-80 text-dark-blue-gray font-bold py-2 px-4 rounded-lg transition-colors duration-300 mt-2">
                                Cerrar Sesión
                            </button>
                        </>
                    ) : (
                        <>
                            <Link to="/login" className="block hover:text-primary-blue transition-colors duration-300 py-1">Login</Link>
                            <Link to="/register" className="block w-full text-left bg-primary-blue hover:bg-opacity-80 text-dark-blue-gray font-bold py-2 px-4 rounded-lg transition-colors duration-300 mt-2">
                                Registrarse
                            </Link>
                        </>
                    )}
                </div>
            )}
        </nav>
    );
};

export default Navbar;