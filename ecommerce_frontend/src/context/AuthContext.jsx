import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import * as authService from '../services/auth';
import axiosInstance from '../services/axiosInstance';
import { API_BASE_URL } from '../config';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    const decodeJwt = (token) => {
        if (!token) return null;
        try {
            const base64Url = token.split('.')[1];
            const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
            const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
                return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
            }).join(''));
            return JSON.parse(jsonPayload);
        } catch (error) {
            console.error("Error decodificando JWT:", error);
            return null;
        }
    };

    // Función para obtener datos completos del usuario desde el backend
    const fetchUserProfile = async () => {
        try {
            const response = await axiosInstance.get('/accounts/profile/');
            return response.data;
        } catch (error) {
            console.error("Error fetching user profile:", error);
            return null;
        }
    };

    // Función para actualizar perfil del usuario
    const updateProfile = async (profileData) => {
        try {
            const response = await axiosInstance.patch('/accounts/profile/update/', profileData);
            const updatedUser = { ...user, ...response.data };
            setUser(updatedUser);
            return response.data;
        } catch (error) {
            console.error("Error updating profile:", error);
            throw error.response?.data || error;
        }
    };

    useEffect(() => {
        const loadUserFromToken = async () => {
            const accessToken = localStorage.getItem('access_token');
            if (accessToken) {
                const decodedToken = decodeJwt(accessToken);
                // Comprobar si el token decodificado es válido y no ha expirado
                if (decodedToken && decodedToken.exp * 1000 > Date.now()) {
                    // Obtener datos completos del usuario
                    const profileData = await fetchUserProfile();
                    setUser({
                        username: decodedToken.username,
                        email: decodedToken.email || profileData?.email,
                        is_staff: decodedToken.is_staff || false,
                        phone_number: profileData?.phone_number,
                        address: profileData?.address,
                        document_id: profileData?.document_id,
                        first_name: profileData?.first_name,
                        last_name: profileData?.last_name,
                    });
                } else {
                    // Si el token ha expirado o es inválido, intentar refrescarlo
                    const refreshToken = localStorage.getItem('refresh_token');
                    if (refreshToken) {
                        try {
                            const data = await authService.refreshToken(refreshToken);
                            localStorage.setItem('access_token', data.access);
                            // Si el backend rota refresh tokens, guardar el nuevo
                            if (data.refresh) {
                                localStorage.setItem('refresh_token', data.refresh);
                            }
                            const newDecodedToken = decodeJwt(data.access);
                            const profileData = await fetchUserProfile();
                            setUser({
                                username: newDecodedToken.username,
                                email: newDecodedToken.email || profileData?.email,
                                is_staff: newDecodedToken.is_staff || false,
                                phone_number: profileData?.phone_number,
                                address: profileData?.address,
                                document_id: profileData?.document_id,
                                first_name: profileData?.first_name,
                                last_name: profileData?.last_name,
                            });
                        } catch (error) {
                            console.error("Error refreshing token in AuthContext:", error);
                            authService.logout();
                            setUser(null);
                            // No redirigir automáticamente, dejar que el usuario navegue
                        }
                    } else {
                        authService.logout();
                        setUser(null);
                    }
                }
            }
            setLoading(false);
        };

        loadUserFromToken();
    }, []); // Remover navigate de dependencias para evitar loops

    const login = async (username, password) => {
        try {
            setLoading(true);
            const data = await authService.login(username, password);
            localStorage.setItem('access_token', data.access);
            localStorage.setItem('refresh_token', data.refresh);
            const decodedToken = decodeJwt(data.access);
            
            // Obtener datos completos del usuario después del login
            const profileData = await fetchUserProfile();
            setUser({
                username: decodedToken.username,
                email: decodedToken.email || profileData?.email,
                is_staff: decodedToken.is_staff || false,
                phone_number: profileData?.phone_number,
                address: profileData?.address,
                document_id: profileData?.document_id,
                first_name: profileData?.first_name,
                last_name: profileData?.last_name,
            });
            setLoading(false);
            return data;
        } catch (error) {
            setLoading(false);
            console.error("Login failed:", error);
            throw error;
        }
    };

    const register = async (userData) => {
        try {
            setLoading(true);
            const data = await authService.register(userData); 
            setLoading(false);
            // Registro exitoso - el usuario debe ir a login
            return data;
        } catch (error) {
            setLoading(false);
            console.error("Registration failed:", error);
            // Propagar el error tal como viene del servicio (ya formateado)
            throw error;
        }
    };

    const logout = () => {
        authService.logout();
        setUser(null);
        navigate('/login');
    };

    // Refrescar datos del usuario (útil después de editar perfil)
    const refreshUserData = async () => {
        const profileData = await fetchUserProfile();
        if (profileData) {
            setUser(prev => ({ ...prev, ...profileData }));
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center h-screen bg-light-background">
                <div className="text-primary-blue text-lg font-bold">Cargando...</div>
            </div>
        );
    }

    return (
        <AuthContext.Provider value={{ user, login, register, logout, updateProfile, refreshUserData, loading }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};