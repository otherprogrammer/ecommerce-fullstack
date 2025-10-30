// Configuración de la URL de la API
// En desarrollo usa localhost, en producción usa la variable de entorno
export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api';