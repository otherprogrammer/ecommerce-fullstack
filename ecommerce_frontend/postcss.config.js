module.exports = {
    plugins: [
      require('tailwindcss'),
      require('autoprefixer'),
      require('postcss-flexbugs-fixes'),
      require('postcss-preset-env')({
        stage: 3, // o el valor que más te convenga
        features: {
          'nesting-rules': true, // Ejemplo, si necesitas anidación CSS
        },
      }),
    ],
  }
  