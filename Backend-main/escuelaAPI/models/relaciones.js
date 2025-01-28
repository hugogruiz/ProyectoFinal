const Estudiante = require('../models/estudiantesdb');
const Curso = require('../models/cursosdb');
const Profesor = require('../models/profesoresdb');
const sequelize = require('../config/db');

// Relaciones entre Curso y Profesor (Muchos a Muchos)
Curso.belongsToMany(Profesor, {
    through: 'ProfesorCurso',
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
});
Profesor.belongsToMany(Curso, {
    through: 'ProfesorCurso',
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
});

// Relaciones entre Curso y Estudiante (Muchos a Muchos)
Curso.belongsToMany(Estudiante, {
    through: 'EstudianteCurso',
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
});
Estudiante.belongsToMany(Curso, {
    through: 'EstudianteCurso',
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
});

// Sincronizar los modelos
sequelize.sync({ force: false })
    .then(() => console.log('Base de datos sincronizada.'))
    .catch(err => console.error('Error al sincronizar la base de datos:', err));

module.exports = { Estudiante, Curso, Profesor };
