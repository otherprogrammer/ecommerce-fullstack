import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import LoadingSpinner from './LoadingSpinner';

const Profile = () => {
    const { user, loading, logout, updateProfile, refreshUserData } = useAuth();
    const navigate = useNavigate();
    const [profileData, setProfileData] = useState(null);
    const [activeTab, setActiveTab] = useState('profile');
    const [isEditing, setIsEditing] = useState(false);
    const [editForm, setEditForm] = useState({});
    const [saving, setSaving] = useState(false);
    const [message, setMessage] = useState({ type: '', text: '' });

    useEffect(() => {
        if (!loading && !user) {
            navigate('/login');
        } else if (user) {
            setProfileData(user);
            setEditForm({
                first_name: user.first_name || '',
                last_name: user.last_name || '',
                email: user.email || '',
                phone_number: user.phone_number || '',
                address: user.address || '',
                document_id: user.document_id || ''
            });
        }
    }, [user, loading, navigate]);

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    const handleEditChange = (e) => {
        setEditForm({
            ...editForm,
            [e.target.name]: e.target.value
        });
    };

    const handleSaveProfile = async () => {
        setSaving(true);
        setMessage({ type: '', text: '' });
        
        try {
            await updateProfile(editForm);
            setProfileData({ ...profileData, ...editForm });
            setIsEditing(false);
            setMessage({ type: 'success', text: '¡Perfil actualizado correctamente!' });
            setTimeout(() => setMessage({ type: '', text: '' }), 3000);
        } catch (error) {
            console.error('Error al actualizar perfil:', error);
            const errorMsg = error.detail || error.email?.[0] || error.phone_number?.[0] || 'Error al actualizar el perfil';
            setMessage({ type: 'error', text: errorMsg });
        } finally {
            setSaving(false);
        }
    };

    const handleCancelEdit = () => {
        setIsEditing(false);
        setEditForm({
            first_name: profileData.first_name || '',
            last_name: profileData.last_name || '',
            email: profileData.email || '',
            phone_number: profileData.phone_number || '',
            address: profileData.address || '',
            document_id: profileData.document_id || ''
        });
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-light-background">
                <LoadingSpinner size="large" text="Cargando perfil..." />
            </div>
        );
    }

    if (!user || !profileData) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-light-background px-4">
                <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full text-center">
                    <div className="w-16 h-16 mx-auto mb-4 bg-red-100 rounded-full flex items-center justify-center">
                        <svg className="w-8 h-8 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/>
                        </svg>
                    </div>
                    <h2 className="text-xl font-heading font-bold text-dark-blue-gray mb-2">Sesión no válida</h2>
                    <p className="text-medium-text-gray mb-6">Por favor, inicia sesión para ver tu perfil.</p>
                    <Link
                        to="/login"
                        className="inline-block bg-primary-blue text-white font-bold py-3 px-6 rounded-xl hover:bg-opacity-90 transition-all"
                    >
                        Iniciar Sesión
                    </Link>
                </div>
            </div>
        );
    }

    // Mock order data
    const orders = [
        { id: 'ORD-001', date: '2024-11-28', status: 'Entregado', total: 159.90, items: 3 },
        { id: 'ORD-002', date: '2024-11-15', status: 'Entregado', total: 89.50, items: 2 },
    ];

    return (
        <div className="min-h-screen bg-light-background py-8">
            <div className="container mx-auto px-4">
                {/* Header */}
                <div className="bg-gradient-to-r from-primary-blue to-dark-blue-gray rounded-2xl p-8 mb-8 text-white">
                    <div className="flex flex-col md:flex-row items-center gap-6">
                        <div className="w-24 h-24 bg-white/20 rounded-full flex items-center justify-center text-4xl font-bold backdrop-blur-sm">
                            {profileData.username?.charAt(0).toUpperCase() || 'U'}
                        </div>
                        <div className="text-center md:text-left">
                            <h1 className="text-3xl font-heading font-bold mb-1">
                                ¡Hola, {profileData.username}!
                            </h1>
                            <p className="text-white/80">{profileData.email}</p>
                            <div className="mt-3 flex flex-wrap justify-center md:justify-start gap-2">
                                {profileData.is_staff && (
                                    <span className="inline-flex items-center px-3 py-1 bg-success-green/20 text-success-green rounded-full text-sm font-medium">
                                        <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"/>
                                        </svg>
                                        Administrador
                                    </span>
                                )}
                                <span className="inline-flex items-center px-3 py-1 bg-white/10 rounded-full text-sm">
                                    <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"/>
                                    </svg>
                                    {orders.length} pedidos
                                </span>
                            </div>
                        </div>
                        <div className="md:ml-auto">
                            <button
                                onClick={handleLogout}
                                className="inline-flex items-center px-4 py-2 bg-white/10 hover:bg-white/20 rounded-lg font-medium transition-colors"
                            >
                                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"/>
                                </svg>
                                Cerrar Sesión
                            </button>
                        </div>
                    </div>
                </div>

                <div className="flex flex-col lg:flex-row gap-8">
                    {/* Sidebar */}
                    <div className="lg:w-64 shrink-0">
                        <div className="bg-white rounded-2xl shadow-lg overflow-hidden sticky top-24">
                            <nav className="p-2">
                                {[
                                    { id: 'profile', icon: 'M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z', label: 'Mi Perfil' },
                                    { id: 'orders', icon: 'M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2', label: 'Mis Pedidos' },
                                    { id: 'settings', icon: 'M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z M15 12a3 3 0 11-6 0 3 3 0 016 0z', label: 'Configuración' },
                                ].map(item => (
                                    <button
                                        key={item.id}
                                        onClick={() => setActiveTab(item.id)}
                                        className={`w-full flex items-center px-4 py-3 rounded-xl text-left font-medium transition-all ${
                                            activeTab === item.id 
                                                ? 'bg-primary-blue text-white' 
                                                : 'text-medium-text-gray hover:bg-light-background'
                                        }`}
                                    >
                                        <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={item.icon}/>
                                        </svg>
                                        {item.label}
                                    </button>
                                ))}
                            </nav>
                        </div>
                    </div>

                    {/* Main Content */}
                    <div className="flex-grow">
                        {/* Profile Tab */}
                        {activeTab === 'profile' && (
                            <div className="bg-white rounded-2xl shadow-lg p-6 md:p-8 animate-fade-in">
                                {/* Messages */}
                                {message.text && (
                                    <div className={`mb-6 p-4 rounded-xl flex items-center gap-3 ${
                                        message.type === 'success' 
                                            ? 'bg-green-50 border border-green-200 text-green-700' 
                                            : 'bg-red-50 border border-red-200 text-red-700'
                                    }`}>
                                        <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            {message.type === 'success' ? (
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
                                            ) : (
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
                                            )}
                                        </svg>
                                        <span>{message.text}</span>
                                    </div>
                                )}

                                <div className="flex items-center justify-between mb-6">
                                    <h2 className="text-2xl font-heading font-bold text-dark-blue-gray">Información Personal</h2>
                                    {!isEditing ? (
                                        <button 
                                            onClick={() => setIsEditing(true)}
                                            className="text-primary-blue hover:text-dark-blue-gray font-medium text-sm flex items-center transition-colors"
                                        >
                                            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"/>
                                            </svg>
                                            Editar
                                        </button>
                                    ) : (
                                        <div className="flex gap-2">
                                            <button 
                                                onClick={handleCancelEdit}
                                                className="text-gray-500 hover:text-gray-700 font-medium text-sm flex items-center transition-colors"
                                            >
                                                Cancelar
                                            </button>
                                            <button 
                                                onClick={handleSaveProfile}
                                                disabled={saving}
                                                className="bg-primary-blue text-white px-4 py-2 rounded-lg font-medium text-sm flex items-center transition-colors hover:bg-opacity-90 disabled:opacity-50"
                                            >
                                                {saving ? (
                                                    <>
                                                        <svg className="animate-spin w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24">
                                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"/>
                                                        </svg>
                                                        Guardando...
                                                    </>
                                                ) : (
                                                    <>
                                                        <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"/>
                                                        </svg>
                                                        Guardar
                                                    </>
                                                )}
                                            </button>
                                        </div>
                                    )}
                                </div>
                                
                                {isEditing ? (
                                    /* Edit Mode */
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div className="space-y-2">
                                            <label className="text-sm font-medium text-dark-blue-gray">Nombre</label>
                                            <input
                                                type="text"
                                                name="first_name"
                                                value={editForm.first_name}
                                                onChange={handleEditChange}
                                                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-blue focus:border-transparent transition-all"
                                                placeholder="Tu nombre"
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-sm font-medium text-dark-blue-gray">Apellido</label>
                                            <input
                                                type="text"
                                                name="last_name"
                                                value={editForm.last_name}
                                                onChange={handleEditChange}
                                                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-blue focus:border-transparent transition-all"
                                                placeholder="Tu apellido"
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-sm font-medium text-dark-blue-gray">Correo electrónico</label>
                                            <input
                                                type="email"
                                                name="email"
                                                value={editForm.email}
                                                onChange={handleEditChange}
                                                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-blue focus:border-transparent transition-all"
                                                placeholder="correo@ejemplo.com"
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-sm font-medium text-dark-blue-gray">Teléfono</label>
                                            <input
                                                type="tel"
                                                name="phone_number"
                                                value={editForm.phone_number}
                                                onChange={handleEditChange}
                                                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-blue focus:border-transparent transition-all"
                                                placeholder="+51 999 999 999"
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-sm font-medium text-dark-blue-gray">DNI/Documento</label>
                                            <input
                                                type="text"
                                                name="document_id"
                                                value={editForm.document_id}
                                                onChange={handleEditChange}
                                                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-blue focus:border-transparent transition-all"
                                                placeholder="12345678"
                                            />
                                        </div>
                                        <div className="md:col-span-2 space-y-2">
                                            <label className="text-sm font-medium text-dark-blue-gray">Dirección</label>
                                            <textarea
                                                name="address"
                                                value={editForm.address}
                                                onChange={handleEditChange}
                                                rows="2"
                                                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-blue focus:border-transparent transition-all resize-none"
                                                placeholder="Av. Principal 123, Lima"
                                            />
                                        </div>
                                    </div>
                                ) : (
                                    /* View Mode */
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div className="space-y-1">
                                            <label className="text-sm text-medium-text-gray">Nombre de usuario</label>
                                            <p className="text-dark-blue-gray font-semibold text-lg">{profileData.username}</p>
                                        </div>
                                        <div className="space-y-1">
                                            <label className="text-sm text-medium-text-gray">Correo electrónico</label>
                                            <p className="text-dark-blue-gray font-semibold text-lg">{profileData.email || <span className="text-gray-400 font-normal">No registrado</span>}</p>
                                        </div>
                                        <div className="space-y-1">
                                            <label className="text-sm text-medium-text-gray">Teléfono</label>
                                            <p className="text-dark-blue-gray font-semibold text-lg">
                                                {profileData.phone_number || <span className="text-gray-400 font-normal">No registrado</span>}
                                            </p>
                                        </div>
                                        <div className="space-y-1">
                                            <label className="text-sm text-medium-text-gray">DNI/Documento</label>
                                            <p className="text-dark-blue-gray font-semibold text-lg">
                                                {profileData.document_id || <span className="text-gray-400 font-normal">No registrado</span>}
                                            </p>
                                        </div>
                                        <div className="md:col-span-2 space-y-1">
                                            <label className="text-sm text-medium-text-gray">Dirección</label>
                                            <p className="text-dark-blue-gray font-semibold text-lg">
                                                {profileData.address || <span className="text-gray-400 font-normal">No registrada</span>}
                                            </p>
                                        </div>
                                    </div>
                                )}

                                {/* Quick Actions */}
                                <div className="mt-8 pt-6 border-t border-gray-100">
                                    <h3 className="text-lg font-semibold text-dark-blue-gray mb-4">Acciones rápidas</h3>
                                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                        <Link
                                            to="/productos"
                                            className="flex flex-col items-center p-4 bg-light-background rounded-xl hover:bg-primary-blue/10 transition-colors group"
                                        >
                                            <svg className="w-8 h-8 text-primary-blue mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"/>
                                            </svg>
                                            <span className="text-sm font-medium text-dark-blue-gray group-hover:text-primary-blue">Ver Productos</span>
                                        </Link>
                                        <Link
                                            to="/carrito"
                                            className="flex flex-col items-center p-4 bg-light-background rounded-xl hover:bg-primary-blue/10 transition-colors group"
                                        >
                                            <svg className="w-8 h-8 text-primary-blue mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"/>
                                            </svg>
                                            <span className="text-sm font-medium text-dark-blue-gray group-hover:text-primary-blue">Mi Carrito</span>
                                        </Link>
                                        <button
                                            onClick={() => setActiveTab('orders')}
                                            className="flex flex-col items-center p-4 bg-light-background rounded-xl hover:bg-primary-blue/10 transition-colors group"
                                        >
                                            <svg className="w-8 h-8 text-primary-blue mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"/>
                                            </svg>
                                            <span className="text-sm font-medium text-dark-blue-gray group-hover:text-primary-blue">Mis Pedidos</span>
                                        </button>
                                        <button
                                            onClick={() => setActiveTab('settings')}
                                            className="flex flex-col items-center p-4 bg-light-background rounded-xl hover:bg-primary-blue/10 transition-colors group"
                                        >
                                            <svg className="w-8 h-8 text-primary-blue mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"/>
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
                                            </svg>
                                            <span className="text-sm font-medium text-dark-blue-gray group-hover:text-primary-blue">Configuración</span>
                                        </button>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Orders Tab */}
                        {activeTab === 'orders' && (
                            <div className="bg-white rounded-2xl shadow-lg p-6 md:p-8 animate-fade-in">
                                <h2 className="text-2xl font-heading font-bold text-dark-blue-gray mb-6">Historial de Pedidos</h2>
                                
                                {orders.length > 0 ? (
                                    <div className="space-y-4">
                                        {orders.map(order => (
                                            <div key={order.id} className="border border-gray-100 rounded-xl p-4 hover:shadow-md transition-shadow">
                                                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                                                    <div>
                                                        <div className="flex items-center gap-3 mb-2">
                                                            <span className="font-bold text-dark-blue-gray">{order.id}</span>
                                                            <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                                                                order.status === 'Entregado' ? 'bg-success-green/10 text-success-green' :
                                                                order.status === 'En camino' ? 'bg-yellow-100 text-yellow-700' :
                                                                'bg-primary-blue/10 text-primary-blue'
                                                            }`}>
                                                                {order.status}
                                                            </span>
                                                        </div>
                                                        <p className="text-sm text-medium-text-gray">
                                                            {new Date(order.date).toLocaleDateString('es-PE', { 
                                                                year: 'numeric', month: 'long', day: 'numeric' 
                                                            })}
                                                        </p>
                                                        <p className="text-sm text-medium-text-gray">{order.items} productos</p>
                                                    </div>
                                                    <div className="text-right">
                                                        <p className="text-2xl font-bold text-primary-blue">S/. {order.total.toFixed(2)}</p>
                                                        <button className="text-sm text-primary-blue hover:underline mt-1">
                                                            Ver detalles
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="text-center py-12">
                                        <div className="w-20 h-20 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
                                            <svg className="w-10 h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"/>
                                            </svg>
                                        </div>
                                        <p className="text-xl font-semibold text-dark-blue-gray mb-2">Sin pedidos aún</p>
                                        <p className="text-medium-text-gray mb-6">Cuando realices tu primera compra, aparecerá aquí.</p>
                                        <Link
                                            to="/productos"
                                            className="inline-flex items-center bg-primary-blue text-white font-bold py-3 px-6 rounded-xl hover:bg-opacity-90 transition-all"
                                        >
                                            Explorar Productos
                                        </Link>
                                    </div>
                                )}
                            </div>
                        )}

                        {/* Settings Tab */}
                        {activeTab === 'settings' && (
                            <div className="bg-white rounded-2xl shadow-lg p-6 md:p-8 animate-fade-in">
                                <h2 className="text-2xl font-heading font-bold text-dark-blue-gray mb-6">Configuración</h2>
                                
                                <div className="space-y-6">
                                    {/* Notifications */}
                                    <div className="border-b border-gray-100 pb-6">
                                        <h3 className="text-lg font-semibold text-dark-blue-gray mb-4">Notificaciones</h3>
                                        <div className="space-y-4">
                                            <label className="flex items-center justify-between cursor-pointer">
                                                <span className="text-medium-text-gray">Notificaciones por email</span>
                                                <div className="relative">
                                                    <input type="checkbox" className="sr-only peer" defaultChecked />
                                                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-blue"></div>
                                                </div>
                                            </label>
                                            <label className="flex items-center justify-between cursor-pointer">
                                                <span className="text-medium-text-gray">Ofertas y promociones</span>
                                                <div className="relative">
                                                    <input type="checkbox" className="sr-only peer" defaultChecked />
                                                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-blue"></div>
                                                </div>
                                            </label>
                                        </div>
                                    </div>

                                    {/* Security */}
                                    <div className="border-b border-gray-100 pb-6">
                                        <h3 className="text-lg font-semibold text-dark-blue-gray mb-4">Seguridad</h3>
                                        <button className="text-primary-blue hover:text-dark-blue-gray font-medium transition-colors">
                                            Cambiar contraseña →
                                        </button>
                                    </div>

                                    {/* Danger Zone */}
                                    <div>
                                        <h3 className="text-lg font-semibold text-red-500 mb-4">Zona de peligro</h3>
                                        <button className="text-red-500 hover:text-red-600 font-medium transition-colors">
                                            Eliminar mi cuenta
                                        </button>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Profile;