import React from 'react';
import { Link } from 'react-router-dom';

const Home = () => {
    const popularCategories = [
        { name: 'Electrónica', slug: 'electronica', icon: '💻' },
        { name: 'Ropa', slug: 'ropa', icon: '👕' },
        { name: 'Hogar', slug: 'hogar', icon: '🏠' },
        { name: 'Belleza', slug: 'belleza', icon: '💄' },
        { name: 'Alimentos', slug: 'alimentos', icon: '🍎' },
    ];

    const reasons = [
        { icon: '🚀', text: 'Envíos rápidos a todo el país' },
        { icon: '📞', text: 'Soporte 24/7 para todas tus dudas' },
        { icon: '🔒', text: 'Seguridad en tus compras garantizada' },
        { icon: '✨', text: 'Productos de calidad, precios increíbles' },
    ];

    return (
        <div className="bg-light-background font-body pb-12">
            <section className="bg-white py-20 text-center shadow-md mb-8">
                <div className="container mx-auto px-4">
                    <h1 className="text-5xl font-heading font-bold text-dark-blue-gray mb-6 leading-tight">
                        ¡Bienvenido a <span className="text-primary-blue">TiendaX</span>!
                    </h1>
                    <p className="text-lg text-medium-text-gray mb-8 max-w-2xl mx-auto">
                        Descubre una experiencia de compra inigualable con productos de calidad y precios increíbles.
                    </p>
                    <div className="space-x-4">
                        <Link
                            to="/productos"
                            className="bg-primary-blue text-white font-bold py-3 px-8 rounded-lg text-lg hover:bg-opacity-80 transition-colors duration-300 shadow-lg"
                        >
                            Ver productos
                        </Link>
                        <Link
                            to="/register"
                            className="border-2 border-primary-blue text-primary-blue font-bold py-3 px-8 rounded-lg text-lg hover:bg-primary-blue hover:text-white transition-colors duration-300 shadow-md"
                        >
                            Regístrate
                        </Link>
                    </div>
                </div>
            </section>
            <section className="py-16 bg-light-background mb-8">
                <div className="container mx-auto px-4 text-center">
                    <h2 className="text-4xl font-heading font-bold text-dark-blue-gray mb-10">Categorías Populares</h2>
                    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6">
                        {popularCategories.map((category) => (
                            <Link
                                key={category.slug}
                                to={`/productos?category=${category.slug}`}
                                className="bg-white p-6 rounded-lg shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300 flex flex-col items-center justify-center text-dark-blue-gray font-medium text-lg hover:bg-primary-blue hover:text-white"
                            >
                                <span className="text-4xl mb-2 text-primary-blue">{category.icon}</span>
                                {category.name}
                            </Link>
                        ))}
                    </div>
                </div>
            </section>
            <section className="py-16 bg-white shadow-inner">
                <div className="container mx-auto px-4 text-center">
                    <h2 className="text-4xl font-heading font-bold text-dark-blue-gray mb-10">¿Por qué elegirnos?</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                        {reasons.map((reason, index) => (
                            <div key={index} className="flex flex-col items-center p-6 bg-light-background rounded-lg shadow-md">
                                <span className="text-5xl mb-4 text-primary-blue">{reason.icon}</span>
                                <p className="text-lg text-dark-blue-gray font-semibold text-center">{reason.text}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>
        </div>
    );
};

export default Home;
