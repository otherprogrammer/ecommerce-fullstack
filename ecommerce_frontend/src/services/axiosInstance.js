import axios from 'axios';
import { API_BASE_URL } from '../config';

// Importa las funciones de authService, ya que el interceptor necesita acceso a refreshToken y logout
import * as authService from './auth'; 

const axiosInstance = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Variable para controlar si ya estamos refrescando un token
let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
    failedQueue.forEach(prom => {
        if (error) {
            prom.reject(error);
        } else {
            prom.resolve(token);
        }
    });
    failedQueue = [];
};

// 1. Interceptor de Solicitudes (Request Interceptor)
// Añade el token de acceso a cada petición antes de que se envíe
axiosInstance.interceptors.request.use(
    (config) => {
        const accessToken = localStorage.getItem('access_token');
        if (accessToken) {
            config.headers.Authorization = `Bearer ${accessToken}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// 2. Interceptor de Respuestas (Response Interceptor)
// Maneja errores 401 para refrescar el token automáticamente
axiosInstance.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;

        // Si la respuesta es 401 (Unauthorized)
        // y no es la petición de login/registro o de refresco de token (para evitar bucles)
        if (error.response.status === 401 && !originalRequest._retry && 
            !(originalRequest.url.includes('/api/token/') || originalRequest.url.includes('/api/token/refresh/'))) {
            
            originalRequest._retry = true; // Marca la petición original para no reintentarla infinitamente

            if (isRefreshing) {
                // Si ya estamos refrescando, añadimos la petición a la cola para reintentarla después
                return new Promise(function(resolve, reject) {
                    failedQueue.push({ resolve, reject });
                })
                .then(token => {
                    originalRequest.headers['Authorization'] = 'Bearer ' + token;
                    return axiosInstance(originalRequest);
                })
                .catch(err => {
                    return Promise.reject(err);
                });
            }

            isRefreshing = true; // Indica que estamos iniciando el proceso de refresco

            const refreshToken = localStorage.getItem('refresh_token');

            if (refreshToken) {
                try {
                    const response = await authService.refreshToken(refreshToken);
                    const newAccessToken = response.access;
                    localStorage.setItem('access_token', newAccessToken); // Almacena el nuevo token de acceso

                    // Si tu backend rota el refresh token (Simple JWT lo hace por defecto si no lo deshabilitas)
                    // localStorage.setItem('refresh_token', response.refresh);

                    originalRequest.headers['Authorization'] = `Bearer ${newAccessToken}`;
                    processQueue(null, newAccessToken); // Resuelve todas las peticiones en cola
                    isRefreshing = false;
                    return axiosInstance(originalRequest); // Reintenta la petición original
                } catch (refreshError) {
                    console.error("Refresh token failed, logging out:", refreshError);
                    processQueue(refreshError); // Rechaza todas las peticiones en cola
                    isRefreshing = false;
                    authService.logout(); // Si el refresco falla, redirige a login
                    return Promise.reject(refreshError);
                }
            } else {
                // No hay refresh token, no podemos refrescar, redirigir a login
                processQueue(new Error("No refresh token available")); // Rechaza todas las peticiones en cola
                isRefreshing = false;
                authService.logout();
                return Promise.reject(error);
            }
        }

        // Para cualquier otro tipo de error, simplemente lo propagamos
        return Promise.reject(error);
    }
);

export default axiosInstance;