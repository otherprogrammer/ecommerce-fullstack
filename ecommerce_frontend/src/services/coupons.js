import axiosInstance from './axiosInstance';

// Obtener todos los cupones (solo admin)
export const getCoupons = async () => {
    try {
        const response = await axiosInstance.get('/coupons/');
        return response.data.results || response.data;
    } catch (error) {
        throw error.response?.data || { detail: 'Error al obtener cupones' };
    }
};

// Crear nuevo cupón (solo admin)
export const createCoupon = async (couponData) => {
    try {
        const response = await axiosInstance.post('/coupons/', couponData);
        return response.data;
    } catch (error) {
        throw error.response?.data || { detail: 'Error al crear cupón' };
    }
};

// Actualizar cupón (solo admin)
export const updateCoupon = async (id, couponData) => {
    try {
        const response = await axiosInstance.put(`/coupons/${id}/`, couponData);
        return response.data;
    } catch (error) {
        throw error.response?.data || { detail: 'Error al actualizar cupón' };
    }
};

// Eliminar cupón (solo admin)
export const deleteCoupon = async (id) => {
    try {
        const response = await axiosInstance.delete(`/coupons/${id}/`);
        return response.data;
    } catch (error) {
        throw error.response?.data || { detail: 'Error al eliminar cupón' };
    }
};

// Aplicar cupón al carrito (cualquier usuario)
export const applyCoupon = async (code, cartTotal) => {
    try {
        const response = await axiosInstance.post('/coupons/apply_coupon/', {
            code,
            cart_total: cartTotal
        });
        return response.data;
    } catch (error) {
        throw error.response?.data || { detail: 'Error al aplicar cupón' };
    }
};
