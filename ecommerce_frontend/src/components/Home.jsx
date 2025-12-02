import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import * as categoriesService from '../services/categories';
import * as productsService from '../services/products';
import { useAuth } from '../context/AuthContext';
import ProductCard from './ProductCard';
import LoadingSpinner from './LoadingSpinner';

const Home = () => {
    const { user } = useAuth();
    const [categories, setCategories] = useState([]);
    const [featuredProducts, setFeaturedProducts] = useState([]);
    const [loadingCategories, setLoadingCategories] = useState(true);
    const [loadingProducts, setLoadingProducts] = useState(true);

    // Mapeo de iconos para las categorías
    const categoryIcons = {
        'electronica': '💻',
        'ropa-moda': '👕',
        'hogar-jardin': '🏠',
        'salud-belleza': '💄',
        'alimentos-bebidas': '🍎',
        'deportes-fitness': '⚽',
        'juguetes-juegos': '🎮',
        'libros-medios': '📚'
    };

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const data = await categoriesService.getCategories();
                setCategories(data);
            } catch (error) {
                console.error('Error al cargar categorías:', error);
            } finally {
                setLoadingCategories(false);
            }
        };

        const fetchFeaturedProducts = async () => {
            try {
                const data = await productsService.getProducts();
                // Tomar los primeros 8 productos como "destacados"
                const productsArray = Array.isArray(data) ? data : (data.results || []);
                setFeaturedProducts(productsArray.slice(0, 8));
            } catch (error) {
                console.error('Error al cargar productos destacados:', error);
            } finally {
                setLoadingProducts(false);
            }
        };

        fetchCategories();
        fetchFeaturedProducts();
    }, []);

    const features = [
        { 
            icon: (
                <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M13 10V3L4 14h7v7l9-11h-7z"/>
                </svg>
            ),
            title: 'Envíos Rápidos',
            description: 'Entrega en 24-48 horas a nivel nacional'
        },
        { 
            icon: (
                <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z"/>
                </svg>
            ),
            title: 'Soporte 24/7',
            description: 'Atención personalizada todos los días'
        },
        { 
            icon: (
                <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"/>
                </svg>
            ),
            title: 'Compra Segura',
            description: 'Tus datos siempre protegidos'
        },
        { 
            icon: (
                <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M16 15v-1a4 4 0 00-4-4H8m0 0l3 3m-3-3l3-3m9 14V5a2 2 0 00-2-2H6a2 2 0 00-2 2v16l4-2 4 2 4-2 4 2z"/>
                </svg>
            ),
            title: 'Devoluciones Gratis',
            description: '30 días para cambios y devoluciones'
        },
    ];

    const stats = [
        { number: '10K+', label: 'Clientes Felices' },
        { number: '5K+', label: 'Productos' },
        { number: '99%', label: 'Satisfacción' },
        { number: '24/7', label: 'Soporte' },
    ];

    return (
        <div className="bg-light-background font-body">
            {/* Hero Section */}
            <section className="relative bg-gradient-to-br from-dark-blue-gray via-gray-800 to-dark-blue-gray text-white overflow-hidden">
                {/* Background Pattern */}
                <div className="absolute inset-0 opacity-10">
                    <div className="absolute inset-0" style={{
                        backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
                    }}></div>
                </div>
                
                <div className="container mx-auto px-4 py-20 lg:py-32 relative">
                    <div className="flex flex-col lg:flex-row items-center justify-between gap-12">
                        <div className="lg:w-1/2 text-center lg:text-left">
                            <span className="inline-block bg-primary-blue bg-opacity-20 text-primary-blue text-sm font-semibold px-4 py-2 rounded-full mb-6 animate-pulse">
                                ✨ Nuevos productos cada semana
                            </span>
                            <h1 className="text-4xl md:text-5xl lg:text-6xl font-heading font-bold mb-6 leading-tight">
                                Bienvenido a{' '}
                                <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-blue to-cyan-400">
                                    TiendaX
                                </span>
                            </h1>
                            <p className="text-lg md:text-xl text-gray-300 mb-8 max-w-xl mx-auto lg:mx-0">
                                Descubre una experiencia de compra única con productos de calidad premium, 
                                precios increíbles y el mejor servicio al cliente.
                            </p>
                            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                                <Link
                                    to="/productos"
                                    className="group inline-flex items-center justify-center bg-gradient-to-r from-primary-blue to-cyan-400 text-white font-bold py-4 px-8 rounded-xl text-lg hover:shadow-2xl hover:shadow-primary-blue/30 transition-all duration-300 transform hover:scale-105"
                                >
                                    Explorar Productos
                                    <svg className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3"/>
                                    </svg>
                                </Link>
                                {!user && (
                                    <Link
                                        to="/register"
                                        className="inline-flex items-center justify-center border-2 border-white text-white font-bold py-4 px-8 rounded-xl text-lg hover:bg-white hover:text-dark-blue-gray transition-all duration-300"
                                    >
                                        Crear Cuenta
                                    </Link>
                                )}
                            </div>
                        </div>
                        
                        {/* Hero Image/Illustration */}
                        <div className="lg:w-1/2 relative">
                            <div className="relative w-full max-w-lg mx-auto">
                                <div className="absolute top-0 -left-4 w-72 h-72 bg-primary-blue rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob"></div>
                                <div className="absolute top-0 -right-4 w-72 h-72 bg-cyan-400 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob animation-delay-2000"></div>
                                <div className="absolute -bottom-8 left-20 w-72 h-72 bg-success-green rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob animation-delay-4000"></div>
                                <div className="relative bg-white bg-opacity-10 backdrop-blur-lg rounded-2xl p-8 shadow-2xl">
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="bg-white rounded-xl p-4 shadow-lg transform hover:scale-105 transition-transform duration-300">
                                            <div className="text-4xl mb-2">📦</div>
                                            <p className="text-dark-blue-gray font-semibold">+5000</p>
                                            <p className="text-gray-500 text-sm">Productos</p>
                                        </div>
                                        <div className="bg-white rounded-xl p-4 shadow-lg transform hover:scale-105 transition-transform duration-300">
                                            <div className="text-4xl mb-2">⭐</div>
                                            <p className="text-dark-blue-gray font-semibold">4.9/5</p>
                                            <p className="text-gray-500 text-sm">Valoración</p>
                                        </div>
                                        <div className="bg-white rounded-xl p-4 shadow-lg transform hover:scale-105 transition-transform duration-300">
                                            <div className="text-4xl mb-2">🚚</div>
                                            <p className="text-dark-blue-gray font-semibold">24-48h</p>
                                            <p className="text-gray-500 text-sm">Entrega</p>
                                        </div>
                                        <div className="bg-white rounded-xl p-4 shadow-lg transform hover:scale-105 transition-transform duration-300">
                                            <div className="text-4xl mb-2">💳</div>
                                            <p className="text-dark-blue-gray font-semibold">Seguro</p>
                                            <p className="text-gray-500 text-sm">Pago</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                
                {/* Wave Divider */}
                <div className="absolute bottom-0 left-0 right-0">
                    <svg viewBox="0 0 1440 120" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M0 120L60 105C120 90 240 60 360 45C480 30 600 30 720 37.5C840 45 960 60 1080 67.5C1200 75 1320 75 1380 75L1440 75V120H1380C1320 120 1200 120 1080 120C960 120 840 120 720 120C600 120 480 120 360 120C240 120 120 120 60 120H0Z" fill="#ECEFF1"/>
                    </svg>
                </div>
            </section>

            {/* Stats Section */}
            <section className="py-8 -mt-8 relative z-10">
                <div className="container mx-auto px-4">
                    <div className="bg-white rounded-2xl shadow-xl p-6 grid grid-cols-2 md:grid-cols-4 gap-6">
                        {stats.map((stat, index) => (
                            <div key={index} className="text-center">
                                <p className="text-3xl md:text-4xl font-heading font-bold text-primary-blue">{stat.number}</p>
                                <p className="text-medium-text-gray text-sm mt-1">{stat.label}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Categories Section */}
            <section className="py-16">
                <div className="container mx-auto px-4">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl md:text-4xl font-heading font-bold text-dark-blue-gray mb-4">
                            Explora por Categorías
                        </h2>
                        <p className="text-medium-text-gray max-w-2xl mx-auto">
                            Encuentra exactamente lo que buscas navegando por nuestras categorías cuidadosamente organizadas
                        </p>
                    </div>
                    
                    {loadingCategories ? (
                        <LoadingSpinner text="Cargando categorías..." />
                    ) : (
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
                            {categories.map((category) => (
                                <Link
                                    key={category.id}
                                    to={`/productos?category=${category.slug}`}
                                    className="group bg-white p-6 rounded-2xl shadow-lg hover:shadow-2xl transform hover:-translate-y-2 transition-all duration-300 flex flex-col items-center justify-center text-center border border-transparent hover:border-primary-blue"
                                >
                                    <span className="text-5xl mb-4 group-hover:scale-110 transition-transform duration-300">
                                        {categoryIcons[category.slug] || '📦'}
                                    </span>
                                    <h3 className="text-dark-blue-gray font-semibold text-lg group-hover:text-primary-blue transition-colors duration-300">
                                        {category.name}
                                    </h3>
                                    <span className="mt-2 text-sm text-primary-blue opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center">
                                        Ver productos
                                        <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"/>
                                        </svg>
                                    </span>
                                </Link>
                            ))}
                        </div>
                    )}
                </div>
            </section>

            {/* Featured Products Section */}
            <section className="py-16 bg-white">
                <div className="container mx-auto px-4">
                    <div className="flex flex-col md:flex-row justify-between items-center mb-12">
                        <div>
                            <h2 className="text-3xl md:text-4xl font-heading font-bold text-dark-blue-gray mb-2">
                                Productos Destacados
                            </h2>
                            <p className="text-medium-text-gray">
                                Los favoritos de nuestros clientes
                            </p>
                        </div>
                        <Link 
                            to="/productos"
                            className="mt-4 md:mt-0 inline-flex items-center text-primary-blue font-semibold hover:text-dark-blue-gray transition-colors duration-300"
                        >
                            Ver todos los productos
                            <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3"/>
                            </svg>
                        </Link>
                    </div>

                    {loadingProducts ? (
                        <LoadingSpinner text="Cargando productos..." />
                    ) : featuredProducts.length === 0 ? (
                        <div className="text-center py-12">
                            <p className="text-medium-text-gray text-lg">No hay productos disponibles aún.</p>
                            <Link to="/productos" className="text-primary-blue hover:underline mt-2 inline-block">
                                Ir a productos
                            </Link>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                            {featuredProducts.map((product) => (
                                <ProductCard key={product.id} product={product} />
                            ))}
                        </div>
                    )}
                </div>
            </section>

            {/* Features Section */}
            <section className="py-16">
                <div className="container mx-auto px-4">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl md:text-4xl font-heading font-bold text-dark-blue-gray mb-4">
                            ¿Por qué elegirnos?
                        </h2>
                        <p className="text-medium-text-gray max-w-2xl mx-auto">
                            Nos comprometemos a brindarte la mejor experiencia de compra online
                        </p>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                        {features.map((feature, index) => (
                            <div 
                                key={index} 
                                className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 group text-center"
                            >
                                <div className="inline-flex items-center justify-center w-20 h-20 bg-primary-blue bg-opacity-10 text-primary-blue rounded-2xl mb-6 group-hover:bg-primary-blue group-hover:text-white transition-all duration-300">
                                    {feature.icon}
                                </div>
                                <h3 className="text-xl font-heading font-bold text-dark-blue-gray mb-3">
                                    {feature.title}
                                </h3>
                                <p className="text-medium-text-gray">
                                    {feature.description}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-16 bg-gradient-to-r from-primary-blue to-cyan-400">
                <div className="container mx-auto px-4 text-center">
                    <h2 className="text-3xl md:text-4xl font-heading font-bold text-white mb-6">
                        ¿Listo para empezar a comprar?
                    </h2>
                    <p className="text-white text-opacity-90 text-lg mb-8 max-w-2xl mx-auto">
                        Únete a miles de clientes satisfechos y descubre por qué somos tu tienda online favorita
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <Link
                            to="/productos"
                            className="inline-flex items-center justify-center bg-white text-primary-blue font-bold py-4 px-8 rounded-xl text-lg hover:bg-dark-blue-gray hover:text-white transition-all duration-300 shadow-lg"
                        >
                            Explorar Tienda
                        </Link>
                        {!user && (
                            <Link
                                to="/register"
                                className="inline-flex items-center justify-center border-2 border-white text-white font-bold py-4 px-8 rounded-xl text-lg hover:bg-white hover:text-primary-blue transition-all duration-300"
                            >
                                Crear Cuenta Gratis
                            </Link>
                        )}
                    </div>
                </div>
            </section>
        </div>
    );
};

export default Home;
