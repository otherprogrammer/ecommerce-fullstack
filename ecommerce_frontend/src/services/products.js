import axiosInstance from './axiosInstance';

// Obtener todos los productos
export const getProducts = async (params = {}) => {
    try {
        const response = await axiosInstance.get('/products/', { params });
        // DRF devuelve objeto paginado: {count, next, previous, results}
        return response.data.results || response.data;
    } catch (error) {
        throw error.response?.data || { detail: 'Error al obtener productos' };
    }
};

// Obtener un producto por ID
export const getProductById = async (id) => {
    try {
        const response = await axiosInstance.get(`/products/${id}/`);
        return response.data;
    } catch (error) {
        throw error.response?.data || { detail: 'Error al obtener producto' };
    }
};

// Crear nuevo producto
export const createProduct = async (productData) => {
    try {
        const response = await axiosInstance.post('/products/', productData);
        return response.data;
    } catch (error) {
        throw error.response?.data || { detail: 'Error al crear producto' };
    }
};

// Actualizar producto
export const updateProduct = async (id, productData) => {
    try {
        const response = await axiosInstance.put(`/products/${id}/`, productData);
        return response.data;
    } catch (error) {
        throw error.response?.data || { detail: 'Error al actualizar producto' };
    }
};

// Eliminar producto
export const deleteProduct = async (id) => {
    try {
        const response = await axiosInstance.delete(`/products/${id}/`);
        return response.data;
    } catch (error) {
        throw error.response?.data || { detail: 'Error al eliminar producto' };
    }
};
