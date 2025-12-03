import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import NotificationBell from './NotificationBell';

const Navbar = () => {
    const { user, logout } = useAuth();
    const { cart } = useCart();
    const navigate = useNavigate();
    const location = useLocation();
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    const cartItemsCount = cart.reduce((total, item) => total + item.quantity, 0);

    const handleLogout = () => {
        logout();
        setIsMobileMenuOpen(false);
    };

    const isActive = (path) => {
        return location.pathname === path;
    };

    const NavLink = ({ to, children, className = '' }) => (
        <Link
            to={to}
            className={`relative px-3 py-2 rounded-lg transition-all duration-300 ${
                isActive(to)
                    ? 'text-primary-blue bg-white bg-opacity-10'
                    : 'hover:text-primary-blue hover:bg-white hover:bg-opacity-5'
            } ${className}`}
            onClick={() => setIsMobileMenuOpen(false)}
        >
            {children}
            {isActive(to) && (
                <span className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-primary-blue rounded-full"></span>
            )}
        </Link>
    );

    return (
        <nav className="bg-dark-blue-gray text-white shadow-lg font-body sticky top-0 z-50">
            <div className="container mx-auto px-4">
                <div className="flex justify-between items-center h-16">
                    {/* Logo */}
                    <Link 
                        to="/" 
                        className="flex items-center space-x-2 text-2xl font-heading font-bold text-primary-blue hover:text-white transition-colors duration-300"
                    >
                        <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/>
                        </svg>
                        <span>TiendaX</span>
                    </Link>

                    {/* Desktop Navigation */}
                    <div className="hidden md:flex items-center space-x-1">
                        <NavLink to="/">Inicio</NavLink>
                        <NavLink to="/productos">Productos</NavLink>
                        
                        {/* Cart with badge */}
                        <Link
                            to="/carrito"
                            className={`relative flex items-center px-3 py-2 rounded-lg transition-all duration-300 ${
                                isActive('/carrito')
                                    ? 'text-primary-blue bg-white bg-opacity-10'
                                    : 'hover:text-primary-blue hover:bg-white hover:bg-opacity-5'
                            }`}
                        >
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"/>
                            </svg>
                            <span className="ml-1">Carrito</span>
                            {cartItemsCount > 0 && (
                                <span className="absolute -top-1 -right-1 bg-success-green text-white text-xs font-bold w-5 h-5 flex items-center justify-center rounded-full animate-pulse">
                                    {cartItemsCount > 99 ? '99+' : cartItemsCount}
                                </span>
                            )}
                        </Link>

                        {/* Auth section */}
                        {user ? (
                            <>
                                {user.is_staff && (
                                    <div className="relative group">
                                        <button className="flex items-center px-3 py-2 rounded-lg hover:text-primary-blue hover:bg-white hover:bg-opacity-5 transition-all duration-300">
                                            <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"/>
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
                                            </svg>
                                            Admin
                                            <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"/>
                                            </svg>
                                        </button>
                                        {/* Dropdown */}
                                        <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-xl py-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 transform origin-top-right scale-95 group-hover:scale-100">
                                            <Link to="/productos/admin" className="block px-4 py-2 text-dark-blue-gray hover:bg-light-background hover:text-primary-blue transition-colors">
                                                📦 Productos
                                            </Link>
                                            <Link to="/categorias" className="block px-4 py-2 text-dark-blue-gray hover:bg-light-background hover:text-primary-blue transition-colors">
                                                📁 Categorías
                                            </Link>
                                            <Link to="/cupones" className="block px-4 py-2 text-dark-blue-gray hover:bg-light-background hover:text-primary-blue transition-colors">
                                                🎟️ Cupones
                                            </Link>
                                        </div>
                                    </div>
                                )}
                                
                                {/* Notification Bell */}
                                <NotificationBell />
                                
                                <NavLink to="/profile">
                                    <span className="flex items-center">
                                        <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/>
                                        </svg>
                                        {user.username}
                                    </span>
                                </NavLink>
                                
                                <button 
                                    onClick={handleLogout} 
                                    className="ml-2 bg-gradient-to-r from-primary-blue to-cyan-400 hover:from-cyan-400 hover:to-primary-blue text-white font-semibold py-2 px-4 rounded-lg transition-all duration-300 shadow-md hover:shadow-lg transform hover:scale-105"
                                >
                                    Cerrar Sesión
                                </button>
                            </>
                        ) : (
                            <>
                                <NavLink to="/login">Iniciar Sesión</NavLink>
                                <Link
                                    to="/register"
                                    className="ml-2 bg-gradient-to-r from-primary-blue to-cyan-400 hover:from-cyan-400 hover:to-primary-blue text-white font-semibold py-2 px-4 rounded-lg transition-all duration-300 shadow-md hover:shadow-lg transform hover:scale-105"
                                >
                                    Registrarse
                                </Link>
                            </>
                        )}
                    </div>

                    {/* Mobile Menu Button */}
                    <div className="md:hidden flex items-center space-x-4">
                        {/* Mobile Cart Icon */}
                        <Link to="/carrito" className="relative">
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"/>
                            </svg>
                            {cartItemsCount > 0 && (
                                <span className="absolute -top-2 -right-2 bg-success-green text-white text-xs font-bold w-5 h-5 flex items-center justify-center rounded-full">
                                    {cartItemsCount > 99 ? '99+' : cartItemsCount}
                                </span>
                            )}
                        </Link>
                        
                        <button 
                            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} 
                            className="text-white focus:outline-none p-2 hover:bg-white hover:bg-opacity-10 rounded-lg transition-colors"
                        >
                            {isMobileMenuOpen ? (
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"/>
                                </svg>
                            ) : (
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16m-7 6h7"/>
                                </svg>
                            )}
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile Menu */}
            <div className={`md:hidden overflow-hidden transition-all duration-300 ${isMobileMenuOpen ? 'max-h-screen' : 'max-h-0'}`}>
                <div className="bg-gray-800 px-4 py-4 space-y-2 border-t border-gray-700">
                    <Link 
                        to="/" 
                        className="block py-3 px-4 rounded-lg hover:bg-white hover:bg-opacity-10 transition-colors"
                        onClick={() => setIsMobileMenuOpen(false)}
                    >
                        🏠 Inicio
                    </Link>
                    <Link 
                        to="/productos" 
                        className="block py-3 px-4 rounded-lg hover:bg-white hover:bg-opacity-10 transition-colors"
                        onClick={() => setIsMobileMenuOpen(false)}
                    >
                        📦 Productos
                    </Link>
                    <Link 
                        to="/carrito" 
                        className="flex items-center py-3 px-4 rounded-lg hover:bg-white hover:bg-opacity-10 transition-colors"
                        onClick={() => setIsMobileMenuOpen(false)}
                    >
                        🛒 Carrito
                        {cartItemsCount > 0 && (
                            <span className="ml-2 bg-success-green text-white text-xs font-bold px-2 py-1 rounded-full">
                                {cartItemsCount}
                            </span>
                        )}
                    </Link>
                    
                    {user ? (
                        <>
                            {user.is_staff && (
                                <div className="border-t border-gray-700 pt-2 mt-2">
                                    <p className="px-4 py-2 text-gray-400 text-sm font-semibold">Administración</p>
                                    <Link 
                                        to="/productos/admin" 
                                        className="block py-3 px-4 rounded-lg hover:bg-white hover:bg-opacity-10 transition-colors"
                                        onClick={() => setIsMobileMenuOpen(false)}
                                    >
                                        📦 Admin Productos
                                    </Link>
                                    <Link 
                                        to="/categorias" 
                                        className="block py-3 px-4 rounded-lg hover:bg-white hover:bg-opacity-10 transition-colors"
                                        onClick={() => setIsMobileMenuOpen(false)}
                                    >
                                        📁 Admin Categorías
                                    </Link>
                                    <Link 
                                        to="/cupones" 
                                        className="block py-3 px-4 rounded-lg hover:bg-white hover:bg-opacity-10 transition-colors"
                                        onClick={() => setIsMobileMenuOpen(false)}
                                    >
                                        🎟️ Admin Cupones
                                    </Link>
                                </div>
                            )}
                            <div className="border-t border-gray-700 pt-2 mt-2">
                                <Link 
                                    to="/profile" 
                                    className="block py-3 px-4 rounded-lg hover:bg-white hover:bg-opacity-10 transition-colors"
                                    onClick={() => setIsMobileMenuOpen(false)}
                                >
                                    👤 Mi Cuenta ({user.username})
                                </Link>
                                <button 
                                    onClick={handleLogout} 
                                    className="w-full text-left py-3 px-4 rounded-lg bg-primary-blue hover:bg-opacity-80 transition-colors mt-2"
                                >
                                    🚪 Cerrar Sesión
                                </button>
                            </div>
                        </>
                    ) : (
                        <div className="border-t border-gray-700 pt-2 mt-2 space-y-2">
                            <Link 
                                to="/login" 
                                className="block py-3 px-4 rounded-lg hover:bg-white hover:bg-opacity-10 transition-colors text-center"
                                onClick={() => setIsMobileMenuOpen(false)}
                            >
                                Iniciar Sesión
                            </Link>
                            <Link 
                                to="/register" 
                                className="block py-3 px-4 rounded-lg bg-primary-blue hover:bg-opacity-80 transition-colors text-center font-semibold"
                                onClick={() => setIsMobileMenuOpen(false)}
                            >
                                Registrarse
                            </Link>
                        </div>
                    )}
                </div>
            </div>
        </nav>
    );
};

export default Navbar;