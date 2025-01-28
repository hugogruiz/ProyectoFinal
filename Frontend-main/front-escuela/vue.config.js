const { defineConfig } = require('@vue/cli-service');
const path = require('path');
const fs = require('fs');

module.exports = defineConfig({
  transpileDependencies: true,
  configureWebpack: {
    resolve: {
      fallback: {
        https: require.resolve('https-browserify'),
        http: require.resolve('stream-http'),
        url: require.resolve('url/'),
      },
    },
  },
  devServer: {
    https: {
      key: fs.readFileSync('./key.pem'),
      cert: fs.readFileSync('./cert.pem'),
    },
    port: 8080, // O el puerto que prefieras
    headers: {
      // Aquí agregamos el encabezado COOP
      "Cross-Origin-Opener-Policy": "same-origin-allow-popups",
      // Si es necesario, también puedes agregar COEP:
      "Cross-Origin-Embedder-Policy": "require-corp",
    },
  },
});
