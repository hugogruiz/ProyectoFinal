const { Sequelize } = require('sequelize');
const mysql = require('mysql2/promise');

const sequelize = new Sequelize('Escuela', 'root', '12345678', {
    host: 'localhost',
    dialect: 'mysql',
    logging: false
});


// Crear la base de datos si no existe
async function initializeDatabase() {
    const connection = await mysql.createConnection({ 
        host: 'localhost',
        user: 'root',
        password: '12345678'
    });
    await connection.query('CREATE DATABASE IF NOT EXISTS escuela;');
    console.log('Base de datos "escuela" verificada/creada.');
}

// Exporta la instancia de Sequelize
async function connectSequelize() {
    await initializeDatabase();
    await sequelize.authenticate();
    console.log('Conexión exitosa a la base de datos.');
}

connectSequelize();

module.exports = sequelize;  // Exporta la instancia de Sequelize