import React from 'react';
import { Route, Routes } from 'react-router-dom';

// Importa tus componentes de página
import Home from './components/Home.jsx';
import PromoModal from './components/PromoModal';
import ProductList from './components/ProductList';
import ProductDetalle from './components/ProductDetalle';
import Cart from './components/Cart';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Checkout from './components/Checkout';
import Login from './components/Login.jsx';
import Register from './components/Register.jsx';
import CategoryAdmin from './components/CategoryAdmin.jsx';
import ProductAdmin from './components/ProductAdmin.jsx';
import CouponAdmin from './components/CouponAdmin.jsx';
import Profile from './components/Profile';
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  return (
    <div className="flex flex-col min-h-screen bg-light-background">
      <Navbar />
      <PromoModal />
      <main className="flex-grow">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route path="/productos" element={<ProductList />} />
          <Route path="/productos/:id" element={<ProductDetalle />} />
          
          {/* Rutas Protegidas - Requieren autenticación */}
          <Route path="/carrito" element={
            <ProtectedRoute>
              <Cart />
            </ProtectedRoute>
          } />
          <Route path="/checkout" element={
            <ProtectedRoute>
              <Checkout />
            </ProtectedRoute>
          } />
          <Route path="/profile" element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          } />
          <Route path="/categorias" element={
            <ProtectedRoute requireAdmin={true}>
              <CategoryAdmin />
            </ProtectedRoute>
          } />
          <Route path="/productos/admin" element={
            <ProtectedRoute requireAdmin={true}>
              <ProductAdmin />
            </ProtectedRoute>
          } />
          <Route path="/cupones" element={
            <ProtectedRoute requireAdmin={true}>
              <CouponAdmin />
            </ProtectedRoute>
          } />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}

export default App;
