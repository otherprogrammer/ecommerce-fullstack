import React, { createContext, useContext, useState, useEffect } from 'react';
import axiosInstance from '../services/axiosInstance'; 
import { useAuth } from './AuthContext';

// Creamos el contexto
const CartContext = createContext(null);

// Proveedor del contexto
export const CartProvider = ({ children }) => {
    const { user } = useAuth();
    
    // Función para obtener la clave del carrito específica del usuario
    const getCartKey = () => {
        return user ? `cart_${user.username}` : 'cart_guest';
    };

    // Inicializamos el carrito, intentando cargarlo desde localStorage con clave específica por usuario
    const [cart, setCart] = useState(() => {
        try {
            const cartKey = user ? `cart_${user.username}` : 'cart_guest';
            const localCart = localStorage.getItem(cartKey);
            return localCart ? JSON.parse(localCart) : [];
        } catch (error) {
            console.error("Error loading cart from localStorage:", error);
            return [];
        }
    });

    // Efecto para guardar el carrito en localStorage con clave específica del usuario
    useEffect(() => {
        try {
            const cartKey = getCartKey();
            localStorage.setItem(cartKey, JSON.stringify(cart));
        } catch (error) {
            console.error("Error saving cart to localStorage:", error);
        }
    }, [cart, user]);

    // Efecto para cargar el carrito correcto cuando cambia el usuario
    useEffect(() => {
        try {
            const cartKey = getCartKey();
            const localCart = localStorage.getItem(cartKey);
            setCart(localCart ? JSON.parse(localCart) : []);
        } catch (error) {
            console.error("Error loading cart on user change:", error);
            setCart([]);
        }
    }, [user]);

    // Función para agregar al carrito (adaptada a los nombres esperados por Cart.jsx y ProductDetalle.jsx)
    const addToCart = async (productToAdd, quantityToAdd = 1) => {
        setCart(prevCart => {
            const existingItemIndex = prevCart.findIndex(item => item.product.id === productToAdd.id);

            let newCart;
            if (existingItemIndex > -1) {
                // Si el producto ya está en el carrito, actualiza la cantidad
                const existingItem = prevCart[existingItemIndex];
                const newQuantityInCart = existingItem.quantity + quantityToAdd;

                // Solo si el stock en la base de datos lo permite
                if (newQuantityInCart <= productToAdd.stock) {
                    newCart = prevCart.map((item, index) =>
                        index === existingItemIndex
                            ? { ...item, quantity: newQuantityInCart }
                            : item
                    );
                    // Actualizar el stock en el backend (reduce stock)
                    axiosInstance.patch(`/products/${productToAdd.id}/`, {
                        stock: productToAdd.stock - quantityToAdd,
                    }).catch(error => console.error("Error updating product stock on add to cart:", error));
                } else {
                    alert(`No hay suficiente stock para añadir ${quantityToAdd} unidades. Stock disponible: ${productToAdd.stock - existingItem.quantity}`);
                    newCart = prevCart; // No cambia el carrito si no hay stock
                }
            } else {
                // Si el producto no está en el carrito, lo agrega (si hay stock disponible)
                if (quantityToAdd <= productToAdd.stock) {
                    newCart = [...prevCart, { product: productToAdd, quantity: quantityToAdd }];
                    // Actualizar el stock en el backend (reduce stock)
                    axiosInstance.patch(`/products/${productToAdd.id}/`, {
                        stock: productToAdd.stock - quantityToAdd,
                    }).catch(error => console.error("Error updating product stock on initial add to cart:", error));
                } else {
                    alert(`No hay suficiente stock para añadir ${quantityToAdd} unidades. Stock disponible: ${productToAdd.stock}`);
                    newCart = prevCart; // No cambia el carrito si no hay stock
                }
            }
            return newCart;
        });
    };

    // Función para eliminar del carrito (adapta a los nombres esperados)
    const removeFromCart = async (productId) => {
        setCart(prevCart => {
            const itemToRemove = prevCart.find(item => item.product.id === productId);
            if (itemToRemove) {
                // Devolver stock al backend
                axiosInstance.patch(`/products/${productId}/`, {
                    stock: itemToRemove.product.stock + itemToRemove.quantity,
                }).catch(error => console.error("Error returning product stock on remove from cart:", error));
            }
            return prevCart.filter(item => item.product.id !== productId);
        });
    };

    // Función para actualizar la cantidad de productos en el carrito (adapta a los nombres esperados)
    // Asume que newQuantity es la cantidad FINAL deseada, no el incremento/decremento
    const updateQuantity = async (productId, newQuantity) => {
        setCart(prevCart => {
            return prevCart.map(item => {
                if (item.product.id === productId) {
                    const oldQuantity = item.quantity;
                    const stockDifference = oldQuantity - newQuantity; // Diferencia de stock a ajustar en el backend

                    if (newQuantity <= 0) { // Si la cantidad es 0 o menos, elminar el item
                         // Devolver stock total del item antes de eliminarlo
                         axiosInstance.patch(`/products/${productId}/`, {
                            stock: item.product.stock + oldQuantity,
                        }).catch(error => console.error("Error returning product stock on zero quantity:", error));
                        return null; // Marca para filtrar
                    }
                    
                    if (newQuantity > item.product.stock + oldQuantity) { // stock actual del producto + cantidad que ya tiene en carrito
                        alert(`No hay suficiente stock para aumentar a ${newQuantity}. Stock total disponible: ${item.product.stock + oldQuantity}`);
                        return item; // No actualizar si no hay stock suficiente
                    }

                    // Actualizar stock en el backend
                    axiosInstance.patch(`/products/${productId}/`, {
                        stock: item.product.stock + stockDifference, // Resta si la newQuantity es mayor, suma si es menor
                    }).catch(error => console.error("Error updating product stock on quantity change:", error));

                    return { ...item, quantity: newQuantity };
                }
                return item;
            }).filter(item => item !== null); // Filtra los items marcados para eliminar
        });
    };

    // Función para limpiar el carrito (y devolver stock al backend)
    const clearCart = async () => {
        // Itera sobre el carrito para devolver el stock al backend antes de vaciarlo
        for (const item of cart) {
            try {
                await axiosInstance.patch(`/products/${item.product.id}/`, {
                    stock: item.product.stock + item.quantity,
                });
            } catch (error) {
                console.error(`Error returning stock for product ${item.product.name}:`, error);
            }
        }
        setCart([]);
    };

    // Función para obtener el total del carrito (adapta a los nombres esperados)
    const getTotalPrice = () => {
        return cart.reduce((total, item) => {
            // Asegúrate de que item.product.price y item.quantity son números
            const price = parseFloat(item.product.price);
            const quantity = parseInt(item.quantity);
            if (!isNaN(price) && !isNaN(quantity)) {
                return total + (price * quantity);
            }
            return total;
        }, 0);
    };

    return (
        <CartContext.Provider value={{ cart, addToCart, removeFromCart, updateQuantity, clearCart, getTotalPrice }}>
            {children}
        </CartContext.Provider>
    );
};

// Hook para usar el contexto
export const useCart = () => {
    const context = useContext(CartContext);
    if (context === undefined) {
        throw new Error('useCart must be used within a CartProvider');
    }
    return context;
};