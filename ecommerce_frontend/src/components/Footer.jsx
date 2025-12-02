import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
    const currentYear = new Date().getFullYear();

    return (
        <footer className="bg-dark-blue-gray text-white font-body">
            {/* Main Footer */}
            <div className="container mx-auto px-4 py-12">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                    {/* Brand Section */}
                    <div className="space-y-4">
                        <Link to="/" className="text-3xl font-heading font-bold text-primary-blue hover:text-white transition-colors duration-300">
                            TiendaX
                        </Link>
                        <p className="text-gray-400 text-sm leading-relaxed">
                            Tu destino para compras online de calidad. Ofrecemos los mejores productos con envío rápido y atención al cliente excepcional.
                        </p>
                        <div className="flex space-x-4 pt-2">
                            <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" 
                               className="w-10 h-10 bg-gray-700 rounded-full flex items-center justify-center hover:bg-primary-blue transition-colors duration-300">
                                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M18.77 7.46H14.5v-1.9c0-.9.6-1.1 1-1.1h3V.5h-4.33C10.24.5 9.5 3.44 9.5 5.32v2.15h-3v4h3v12h5v-12h3.85l.42-4z"/>
                                </svg>
                            </a>
                            <a href="https://instagram.com" target="_blank" rel="noopener noreferrer"
                               className="w-10 h-10 bg-gray-700 rounded-full flex items-center justify-center hover:bg-primary-blue transition-colors duration-300">
                                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                                </svg>
                            </a>
                            <a href="https://twitter.com" target="_blank" rel="noopener noreferrer"
                               className="w-10 h-10 bg-gray-700 rounded-full flex items-center justify-center hover:bg-primary-blue transition-colors duration-300">
                                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
                                </svg>
                            </a>
                            <a href="https://wa.me/51999999999" target="_blank" rel="noopener noreferrer"
                               className="w-10 h-10 bg-gray-700 rounded-full flex items-center justify-center hover:bg-success-green transition-colors duration-300">
                                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                                </svg>
                            </a>
                        </div>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h3 className="text-lg font-heading font-semibold mb-4 text-white">Enlaces Rápidos</h3>
                        <ul className="space-y-3">
                            <li>
                                <Link to="/" className="text-gray-400 hover:text-primary-blue transition-colors duration-300 flex items-center">
                                    <span className="mr-2">→</span> Inicio
                                </Link>
                            </li>
                            <li>
                                <Link to="/productos" className="text-gray-400 hover:text-primary-blue transition-colors duration-300 flex items-center">
                                    <span className="mr-2">→</span> Productos
                                </Link>
                            </li>
                            <li>
                                <Link to="/carrito" className="text-gray-400 hover:text-primary-blue transition-colors duration-300 flex items-center">
                                    <span className="mr-2">→</span> Mi Carrito
                                </Link>
                            </li>
                            <li>
                                <Link to="/profile" className="text-gray-400 hover:text-primary-blue transition-colors duration-300 flex items-center">
                                    <span className="mr-2">→</span> Mi Cuenta
                                </Link>
                            </li>
                        </ul>
                    </div>

                    {/* Customer Service */}
                    <div>
                        <h3 className="text-lg font-heading font-semibold mb-4 text-white">Atención al Cliente</h3>
                        <ul className="space-y-3">
                            <li className="text-gray-400 hover:text-primary-blue transition-colors duration-300 cursor-pointer flex items-center">
                                <span className="mr-2">→</span> Preguntas Frecuentes
                            </li>
                            <li className="text-gray-400 hover:text-primary-blue transition-colors duration-300 cursor-pointer flex items-center">
                                <span className="mr-2">→</span> Política de Envíos
                            </li>
                            <li className="text-gray-400 hover:text-primary-blue transition-colors duration-300 cursor-pointer flex items-center">
                                <span className="mr-2">→</span> Devoluciones
                            </li>
                            <li className="text-gray-400 hover:text-primary-blue transition-colors duration-300 cursor-pointer flex items-center">
                                <span className="mr-2">→</span> Términos y Condiciones
                            </li>
                        </ul>
                    </div>

                    {/* Contact Info */}
                    <div>
                        <h3 className="text-lg font-heading font-semibold mb-4 text-white">Contáctanos</h3>
                        <ul className="space-y-3">
                            <li className="flex items-start space-x-3 text-gray-400">
                                <svg className="w-5 h-5 text-primary-blue mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/>
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/>
                                </svg>
                                <span>Av. Javier Prado Este 1234, Lima, Perú</span>
                            </li>
                            <li className="flex items-center space-x-3 text-gray-400">
                                <svg className="w-5 h-5 text-primary-blue flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"/>
                                </svg>
                                <span>+51 999 999 999</span>
                            </li>
                            <li className="flex items-center space-x-3 text-gray-400">
                                <svg className="w-5 h-5 text-primary-blue flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/>
                                </svg>
                                <span>contacto@tiendax.com</span>
                            </li>
                            <li className="flex items-center space-x-3 text-gray-400">
                                <svg className="w-5 h-5 text-primary-blue flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/>
                                </svg>
                                <span>Lun - Sáb: 9:00 AM - 8:00 PM</span>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>

            {/* Payment Methods & Security */}
            <div className="border-t border-gray-700">
                <div className="container mx-auto px-4 py-6">
                    <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
                        <div className="flex items-center space-x-2">
                            <span className="text-gray-400 text-sm">Métodos de pago:</span>
                            <div className="flex space-x-2">
                                <div className="bg-white rounded px-2 py-1">
                                    <span className="text-xs font-bold text-blue-600">VISA</span>
                                </div>
                                <div className="bg-white rounded px-2 py-1">
                                    <span className="text-xs font-bold text-red-500">MC</span>
                                </div>
                                <div className="bg-white rounded px-2 py-1">
                                    <span className="text-xs font-bold text-blue-800">PayPal</span>
                                </div>
                                <div className="bg-white rounded px-2 py-1">
                                    <span className="text-xs font-bold text-green-600">Yape</span>
                                </div>
                            </div>
                        </div>
                        <div className="flex items-center space-x-2 text-gray-400">
                            <svg className="w-5 h-5 text-success-green" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"/>
                            </svg>
                            <span className="text-sm">Compra 100% segura</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Copyright */}
            <div className="bg-gray-900">
                <div className="container mx-auto px-4 py-4">
                    <div className="flex flex-col md:flex-row justify-between items-center text-gray-500 text-sm">
                        <p>© {currentYear} TiendaX. Todos los derechos reservados.</p>
                        <p className="mt-2 md:mt-0">Desarrollado con ❤️ para el curso de Desarrollo de Aplicaciones Empresariales</p>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
