import React, { useState, useEffect } from 'react';
import axiosInstance from '../services/axiosInstance';
import { useLocation, useSearchParams } from 'react-router-dom';
import ProductCard from './ProductCard';
import LoadingSpinner from './LoadingSpinner';

const ProductList = () => {
    const [products, setProducts] = useState([]);
    const [allProducts, setAllProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchParams, setSearchParams] = useSearchParams();
    const [searchTerm, setSearchTerm] = useState('');
    const [sortBy, setSortBy] = useState('name');
    const [viewMode, setViewMode] = useState('grid');
    const location = useLocation();

    const categorySlug = searchParams.get('category');

    useEffect(() => {
        const fetchProducts = async () => {
            setLoading(true);
            setError(null);
            try {
                let url = '/products/';
                if (categorySlug) {
                    url += `?category__slug=${categorySlug}`;
                }
                const response = await axiosInstance.get(url);
                const productsData = response.data.results || response.data;
                const productsArray = Array.isArray(productsData) ? productsData : [];
                setAllProducts(productsArray);
                setProducts(productsArray);
            } catch (err) {
                console.error("Error fetching products:", err);
                setError('No se pudieron cargar los productos. Inténtalo de nuevo más tarde.');
            } finally {
                setLoading(false);
            }
        };

        fetchProducts();
    }, [location.search, categorySlug]);

    // Filter and sort products
    useEffect(() => {
        let filtered = [...allProducts];

        // Search filter
        if (searchTerm) {
            filtered = filtered.filter(product =>
                product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                (product.description && product.description.toLowerCase().includes(searchTerm.toLowerCase())) ||
                (product.category_name && product.category_name.toLowerCase().includes(searchTerm.toLowerCase()))
            );
        }

        // Sort
        filtered.sort((a, b) => {
            switch (sortBy) {
                case 'price_asc':
                    return parseFloat(a.price) - parseFloat(b.price);
                case 'price_desc':
                    return parseFloat(b.price) - parseFloat(a.price);
                case 'name':
                default:
                    return a.name.localeCompare(b.name);
            }
        });

        setProducts(filtered);
    }, [searchTerm, sortBy, allProducts]);

    const clearCategory = () => {
        setSearchParams({});
    };

    if (loading) {
        return (
            <div className="min-h-[60vh] flex items-center justify-center bg-light-background">
                <LoadingSpinner size="large" text="Cargando productos..." />
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-[60vh] flex items-center justify-center px-4">
                <div className="bg-red-50 border-l-4 border-red-500 text-red-700 p-6 rounded-lg shadow-lg max-w-lg w-full">
                    <div className="flex items-center mb-2">
                        <svg className="w-6 h-6 mr-2" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd"/>
                        </svg>
                        <h3 className="font-bold">Error</h3>
                    </div>
                    <p>{error}</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-light-background pb-12">
            {/* Header Section */}
            <div className="bg-gradient-to-r from-dark-blue-gray to-gray-700 text-white py-12">
                <div className="container mx-auto px-4">
                    <h1 className="text-4xl md:text-5xl font-heading font-bold text-center mb-4">
                        {categorySlug ? `Categoría: ${categorySlug.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}` : 'Nuestros Productos'}
                    </h1>
                    <p className="text-center text-gray-300 max-w-2xl mx-auto">
                        Descubre nuestra amplia selección de productos de alta calidad a los mejores precios
                    </p>
                    {categorySlug && (
                        <div className="text-center mt-4">
                            <button
                                onClick={clearCategory}
                                className="inline-flex items-center px-4 py-2 bg-white bg-opacity-20 hover:bg-opacity-30 rounded-full text-sm transition-colors duration-300"
                            >
                                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"/>
                                </svg>
                                Ver todos los productos
                            </button>
                        </div>
                    )}
                </div>
            </div>

            {/* Filters and Search */}
            <div className="container mx-auto px-4 py-6">
                <div className="bg-white rounded-xl shadow-lg p-4 mb-8">
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                        {/* Search */}
                        <div className="relative flex-1 max-w-md">
                            <input
                                type="text"
                                placeholder="Buscar productos..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-blue focus:border-transparent transition-all duration-300"
                            />
                            <svg className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
                            </svg>
                            {searchTerm && (
                                <button
                                    onClick={() => setSearchTerm('')}
                                    className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                                >
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"/>
                                    </svg>
                                </button>
                            )}
                        </div>

                        {/* Sort and View Options */}
                        <div className="flex items-center gap-4">
                            {/* Sort */}
                            <div className="flex items-center gap-2">
                                <label className="text-sm text-medium-text-gray whitespace-nowrap">Ordenar por:</label>
                                <select
                                    value={sortBy}
                                    onChange={(e) => setSortBy(e.target.value)}
                                    className="px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-blue bg-white text-dark-blue-gray"
                                >
                                    <option value="name">Nombre</option>
                                    <option value="price_asc">Precio: Menor a Mayor</option>
                                    <option value="price_desc">Precio: Mayor a Menor</option>
                                </select>
                            </div>

                            {/* View Toggle */}
                            <div className="hidden md:flex items-center bg-gray-100 rounded-lg p-1">
                                <button
                                    onClick={() => setViewMode('grid')}
                                    className={`p-2 rounded-md transition-colors duration-200 ${viewMode === 'grid' ? 'bg-white shadow text-primary-blue' : 'text-gray-500 hover:text-dark-blue-gray'}`}
                                >
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"/>
                                    </svg>
                                </button>
                                <button
                                    onClick={() => setViewMode('list')}
                                    className={`p-2 rounded-md transition-colors duration-200 ${viewMode === 'list' ? 'bg-white shadow text-primary-blue' : 'text-gray-500 hover:text-dark-blue-gray'}`}
                                >
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 10h16M4 14h16M4 18h16"/>
                                    </svg>
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Results count */}
                    <div className="mt-4 pt-4 border-t border-gray-100">
                        <p className="text-sm text-medium-text-gray">
                            {products.length === 0 ? 'No se encontraron productos' : 
                             products.length === 1 ? '1 producto encontrado' : 
                             `${products.length} productos encontrados`}
                            {searchTerm && ` para "${searchTerm}"`}
                        </p>
                    </div>
                </div>

                {/* Products Grid */}
                {products.length === 0 ? (
                    <div className="text-center py-16">
                        <div className="inline-block p-6 bg-white rounded-full shadow-lg mb-6">
                            <svg className="w-16 h-16 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"/>
                            </svg>
                        </div>
                        <h3 className="text-2xl font-heading font-bold text-dark-blue-gray mb-2">
                            No hay productos disponibles
                        </h3>
                        <p className="text-medium-text-gray mb-6">
                            {searchTerm ? 'Intenta con otros términos de búsqueda' : 'Vuelve pronto para ver nuevos productos'}
                        </p>
                        {searchTerm && (
                            <button
                                onClick={() => setSearchTerm('')}
                                className="inline-flex items-center px-6 py-3 bg-primary-blue text-white font-semibold rounded-lg hover:bg-opacity-90 transition-colors duration-300"
                            >
                                Limpiar búsqueda
                            </button>
                        )}
                    </div>
                ) : (
                    <div className={`grid gap-6 ${
                        viewMode === 'grid' 
                            ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4' 
                            : 'grid-cols-1 md:grid-cols-2'
                    }`}>
                        {products.map((product) => (
                            <ProductCard key={product.id} product={product} />
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default ProductList;