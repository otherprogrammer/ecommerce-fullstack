import axiosInstance from './axiosInstance';

// Obtener todas las categorías
export const getCategories = async () => {
    try {
        const response = await axiosInstance.get('/categories/');
        return response.data;
    } catch (error) {
        throw error.response?.data || { detail: 'Error al obtener categorías' };
    }
};

// Crear nueva categoría
export const createCategory = async (categoryData) => {
    try {
        const response = await axiosInstance.post('/categories/', categoryData);
        return response.data;
    } catch (error) {
        throw error.response?.data || { detail: 'Error al crear categoría' };
    }
};

// Actualizar categoría
export const updateCategory = async (id, categoryData) => {
    try {
        const response = await axiosInstance.put(`/categories/${id}/`, categoryData);
        return response.data;
    } catch (error) {
        throw error.response?.data || { detail: 'Error al actualizar categoría' };
    }
};

// Eliminar categoría
export const deleteCategory = async (id) => {
    try {
        const response = await axiosInstance.delete(`/categories/${id}/`);
        return response.data;
    } catch (error) {
        throw error.response?.data || { detail: 'Error al eliminar categoría' };
    }
};
