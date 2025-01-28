const express = require('express');
const cors = require('cors'); // Importar el paquete cors
const fs = require('fs'); // Importar el módulo fs para leer archivos
const https = require('https'); // Importar el módulo https

const app = express();
const port = 4000;

// Cargar certificados SSL
const sslOptions = {
    key: fs.readFileSync('../escuelaAPI/server.key'), // Ruta a tu archivo .key
    cert: fs.readFileSync('../escuelaAPI/server.cert'), // Ruta a tu archivo .cert
};

// Configuración de CORS
const corsOptions = {
    origin: 'https://localhost:8080', // URL del frontend
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
};

// Permitir certificados auto-firmados en desarrollo
process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

// Habilitar CORS con las opciones configuradas
app.use(cors(corsOptions));

// Middleware para parsear JSON
app.use(express.json());

// Rutas de tu aplicación
const router = require('./routes/index');
app.use(router);

// Iniciar el servidor HTTPS
https
    .createServer(sslOptions, app)
    .listen(port, () => {
        console.log(`Servidor escuchando por HTTPS en el puerto: ${port}`);
    })
    .on('error', err => {
        console.log('Error al iniciar el servidor HTTPS:', err);
    });
