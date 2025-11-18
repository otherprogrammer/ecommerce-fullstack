import React from 'react';
// Elimina la importación de BrowserRouter as Router, solo necesitas Route y Routes
import { Route, Routes } from 'react-router-dom';

// Importa tus componentes de página
import Home from './components/Home.jsx';
import ProductList from './components/ProductList';
import ProductDetalle from './components/ProductDetalle';
import Cart from './components/Cart';
import Navbar from './components/Navbar';
import Checkout from './components/Checkout';
import Login from './components/Login.jsx';
import Register from './components/Register.jsx';
import CategoryAdmin from './components/CategoryAdmin.jsx';
import ProductAdmin from './components/ProductAdmin.jsx';
import Profile from './components/Profile';

function App() {
  return (
    // Ya no envuelvas con CartProvider ni Router aquí
    // Esos providers ahora están en index.js, envolviendo todo tu <App />
    <div className="flex flex-col min-h-screen bg-light-background"> {/* Usando los colores de Tailwind */}
      <Navbar /> {/* Tu Navbar aquí para que aparezca en todas las páginas */}
      <main className="flex-grow container mx-auto p-4"> {/* Contenido principal con padding y centrado */}
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/productos" element={<ProductList />} />
          <Route path="/productos/:id" element={<ProductDetalle />} />
          <Route path="/carrito" element={<Cart />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/categorias" element={<CategoryAdmin />} />
          <Route path="/productos/admin" element={<ProductAdmin />} />
          {/* Añade más rutas si tienes */}
        </Routes>
      </main>
      {/* Opcional: Si tienes un componente de Footer, lo puedes poner aquí */}
      {/* <Footer /> */}
    </div>
  );
}

export default App;
