import React, { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import * as authService from '../services/auth'; // Asegúrate de que esta importación esté como está

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
            const decoded = JSON.parse(jsonPayload);
            console.log("1. Decoded JWT Payload in AuthContext:", decoded); // <-- AÑADIDO PARA DEBUG
            return decoded;
        } catch (error) {
            console.error("Error decodificando JWT:", error);
            return null;
        }
    };

    useEffect(() => {
        const loadUserFromToken = async () => {
            const accessToken = localStorage.getItem('access_token');
            if (accessToken) {
                const decodedToken = decodeJwt(accessToken);
                // Comprobar si el token decodificado es válido y no ha expirado
                if (decodedToken && decodedToken.exp * 1000 > Date.now()) {
                    setUser({
                        username: decodedToken.username,
                        is_staff: decodedToken.is_staff || false
                    });
                    console.log("2. User state from loaded token in AuthContext (initial load/valid):", { username: decodedToken.username, is_staff: decodedToken.is_staff || false });
                } else {
                    // Si el token ha expirado o es inválido, intentar refrescarlo
                    const refreshToken = localStorage.getItem('refresh_token');
                    if (refreshToken) {
                        try {
                            const data = await authService.refreshToken(refreshToken);
                            localStorage.setItem('access_token', data.access);
                            const newDecodedToken = decodeJwt(data.access);
                            setUser({
                                username: newDecodedToken.username,
                                is_staff: newDecodedToken.is_staff || false
                            });
                            console.log("3. User state after token refresh in AuthContext:", { username: newDecodedToken.username, is_staff: newDecodedToken.is_staff || false });
                        } catch (error) {
                            console.error("Error refreshing token in AuthContext:", error);
                            // Si el refresco falla, limpiar tokens y redirigir
                            authService.logout(); // Limpia localStorage
                            setUser(null); // Limpia el estado de React
                            navigate('/login'); // Redirige
                        }
                    } else {
                        // No hay token de refresco, limpiar tokens y redirigir
                        authService.logout(); // Limpia localStorage
                        setUser(null); // Limpia el estado de React
                        navigate('/login'); // Redirige
                    }
                }
            }
            setLoading(false);
        };

        loadUserFromToken();
    }, [navigate]); // Añade navigate a las dependencias para que useEffect no muestre advertencias

    const login = async (username, password) => {
        try {
            setLoading(true);
            const data = await authService.login(username, password);
            localStorage.setItem('access_token', data.access);
            localStorage.setItem('refresh_token', data.refresh);
            const decodedToken = decodeJwt(data.access);
            setUser({
                username: decodedToken.username,
                email: decodedToken.email,
                is_staff: decodedToken.is_staff || false
            });
            console.log("4. User state after direct login in AuthContext:", { username: decodedToken.username, is_staff: decodedToken.is_staff || false });
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
            const data = await authService.register(userData.username, userData.email, userData.password, userData.password2); 
            setLoading(false);
            return data;
        } catch (error) {
            setLoading(false);
            console.error("Registration failed:", error);
            throw error;
        }
    };

    const logout = () => {
        authService.logout(); // Llama a la función de auth.js para limpiar localStorage
        setUser(null); // Limpia el estado del usuario en el contexto
        navigate('/login'); // Redirige al usuario
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center h-screen bg-light-background">
                <div className="text-primary-blue text-lg font-bold">Cargando...</div>
            </div>
        );
    }

    return (
        <AuthContext.Provider value={{ user, login, register, logout }}>
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