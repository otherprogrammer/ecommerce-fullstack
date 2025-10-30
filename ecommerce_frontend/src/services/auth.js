import axios from 'axios';
import { API_BASE_URL } from '../config'; // Importa la URL base desde config.js

const API_URL_REGISTER = `${API_BASE_URL}/accounts/register/`;
const API_URL_LOGIN_JWT = `${API_BASE_URL}/token/`;
const API_URL_REFRESH_JWT = `${API_BASE_URL}/token/refresh/`;


export const register = async (username, email, password, password2) => {
    try {
        const response = await axios.post(API_URL_REGISTER, {
            username,
            email,
            password,
            password2
        });
        return response.data;
    } catch (error) {
        throw error.response?.data || { detail: error.message || 'Error desconocido en registro' };
    }
};

export const login = async (username, password) => {
    try {
        const response = await axios.post(API_URL_LOGIN_JWT, {
            username,
            password
        });
        return response.data;
    } catch (error) {
        throw error.response?.data || { detail: error.message || 'Credenciales incorrectas o error desconocido' };
    }
};

export const refreshToken = async (refresh_token) => {
    try {
        const response = await axios.post(API_URL_REFRESH_JWT, {
            refresh: refresh_token
        });
        return response.data;
    } catch (error) {
        throw error.response?.data || { detail: error.message || 'Error al refrescar token' };
    }
};

// Esta es la función de logout que limpia el localStorage.
// El interceptor la llamará directamente cuando el token de refresco falle.
export const logout = () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    console.log("Tokens eliminados del localStorage por auth.js."); // Para depuración
};