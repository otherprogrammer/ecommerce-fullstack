/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        heading: ['Poppins', 'sans-serif'], // Para títulos (H1, H2, etc.)
        body: ['Roboto', 'sans-serif'],     // Para texto general, párrafos, botones
      },
      colors: {
        // Definimos colores personalizados con nombres más descriptivos
        'primary-blue': '#00BCD4',     // Un turquesa vibrante (similar a Tailwind cyan-500)
        'dark-blue-gray': '#37474F',   // Gris oscuro azulado para texto principal y fondo de navbar
        'success-green': '#8BC34A',    // Un verde brillante para acciones de éxito (ej. agregar al carrito)
        'light-background': '#ECEFF1', // Gris muy claro para fondos de sección
        'medium-text-gray': '#78909C', // Gris medio para texto secundario
        'white': '#FFFFFF',            // Blanco puro
      }
    },
  },
  plugins: [],
}