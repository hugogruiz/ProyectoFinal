const { Curso, Estudiante, Profesor } = require('../models/relaciones');


const getCursos = async (req, res) => {
    try {
        const cursos = await Curso.findAll();
        res.status(200).json(cursos);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al obtener los cursos' });
    }
};


const getCursoById = async (req, res) => {
    const id = parseInt(req.params.id);
    try {
        const curso = await Curso.findByPk(id, { include: [Estudiante, Profesor] });
        if (!curso) {
            return res.status(404).send('Curso no encontrado');
        }
        res.status(200).json(curso);
    } catch (error) {
        res.status(500).send('Error al obtener el curso');
    }
};

const createCurso = async (req, res) => {
    try {
        const nuevoCurso = await Curso.create(req.body);
        res.status(201).json(nuevoCurso);
    } catch (error) {
        res.status(500).send('Error al crear el curso');
    }
};

const updateCurso = async (req, res) => {
    const id = parseInt(req.params.id);
    try {
        const curso = await Curso.findByPk(id);
        if (!curso) {
            return res.status(404).send('Curso no encontrado');
        }
        await curso.update(req.body);
        res.status(200).send('Curso actualizado');
    } catch (error) {
        res.status(500).send('Error al actualizar el curso');
    }
};

const patchCurso = async (req, res) => {
    const id = parseInt(req.params.id);
    try {
        const curso = await Curso.findByPk(id);
        if (!curso) {
            return res.status(404).send('Curso no encontrado');
        }
        await curso.update(req.body);
        res.status(200).send('Curso modificado');
    } catch (error) {
        res.status(500).send('Error al modificar el curso');
    }
};

const deleteCurso = async (req, res) => {
    const id = parseInt(req.params.id);
    try {
        const curso = await Curso.findByPk(id);
        if (!curso) {
            return res.status(404).send('Curso no encontrado');
        }
        await curso.destroy();
        res.status(200).send('Curso eliminado');
    } catch (error) {
        res.status(500).send('Error al eliminar el curso');
    }
};

const inscribirEstudiante = async (req, res) => {
    const { estudianteId, cursoId } = req.body;

    try {
        console.log("Entró a la función");
        console.log('Datos recibidos:', { estudianteId, cursoId });

        // Verificar si el curso existe
        const curso = await Curso.findByPk(cursoId);
        console.log('Curso encontrado:', curso);

        // Verificar si el estudiante existe
        const estudiante = await Estudiante.findByPk(estudianteId);
        console.log('Estudiante encontrado:', estudiante);

        // Validar si alguno no fue encontrado
        if (!curso || !estudiante) {
            console.error('Curso o estudiante no encontrado.');
            return res.status(404).send('Curso o estudiante no encontrado');
        }

        // Verificar si el método addEstudiante está disponible
        if (typeof curso.addEstudiante !== 'function') {
            console.error('El método addEstudiante no está disponible en el objeto curso.');
            return res.status(500).send('Error en la asociación del estudiante con el curso');
        }

        // Inscribir al estudiante en el curso
        await curso.addEstudiante(estudiante);
        console.log(`Estudiante ${estudianteId} inscrito correctamente en el curso ${cursoId}.`);
        res.status(200).send('Estudiante inscrito correctamente en el curso');

    } catch (error) {
        console.error('Error al inscribir al estudiante en el curso:', error);
        res.status(500).send('Error al inscribir al estudiante en el curso');
    }
};


const eliminarEstudiante = async (req, res) => {
    const { estudianteId, cursoId } = req.body;
    try {
        const curso = await Curso.findByPk(cursoId);
        const estudiante = await Estudiante.findByPk(estudianteId);

        if (!curso || !estudiante) {
            return res.status(404).send('Curso o estudiante no encontrado');
        }

        await curso.removeEstudiante(estudiante);
        res.status(200).send('Estudiante eliminado correctamente del curso');
    } catch (error) {
        res.status(500).send('Error al eliminar al estudiante del curso');
    }
};

const asignarProfesor = async (req, res) => {
    const { profesorId, cursoId } = req.body;
    try {
        const curso = await Curso.findByPk(cursoId);
        const profesor = await Profesor.findByPk(profesorId);

        if (!curso || !profesor) {
            return res.status(404).send('Curso o profesor no encontrado');
        }

        await curso.addProfesor(profesor);
        res.status(200).send('Profesor asignado correctamente al curso');
    } catch (error) {
        res.status(500).send('Error al asignar al profesor al curso');
    }
};

const eliminarProfesorDeCurso = async (req, res) => {
    const { profesorId, cursoId } = req.body;
    try {
        const curso = await Curso.findByPk(cursoId);
        const profesor = await Profesor.findByPk(profesorId);

        if (!curso || !profesor) {
            return res.status(404).send('Curso o profesor no encontrado');
        }

        await curso.removeProfesor(profesor);
        res.status(200).send('Profesor eliminado correctamente del curso');
    } catch (error) {
        res.status(500).send('Error al eliminar al profesor del curso');
    }
};

const getCursosDeEstudiante = async (req, res) => {
    const estudianteId = parseInt(req.params.estudianteId);
    try {
        const estudiante = await Estudiante.findByPk(estudianteId, { include: { model: Curso, through: { attributes: [] } } });

        if (!estudiante) {
            return res.status(404).send('Estudiante no encontrado');
        }

        res.status(200).json(estudiante.Cursos);
    } catch (error) {
        console.error('Error al obtener los cursos del estudiante:', error);
        res.status(500).send('Error al obtener los cursos del estudiante');
    }
};


const getProfesoresDeEstudiante = async (req, res) => {
    const estudianteId = parseInt(req.params.estudianteId);
    try {
        const estudiante = await Estudiante.findByPk(estudianteId, { include: { model: Curso, include: Profesor } });

        if (!estudiante || !estudiante.Cursos) {
            return res.status(404).send('Estudiante o cursos no encontrados');
        }

        const profesores = estudiante.Cursos.flatMap(curso => curso.Profesores);
        res.status(200).json(profesores);
    } catch (error) {
        res.status(500).send('Error al obtener los profesores del estudiante');
    }
};

const getCursosDeProfesor = async (req, res) => {
    const profesorId = parseInt(req.params.profesorId);
    try {
        const profesor = await Profesor.findByPk(profesorId, { include: Curso });

        if (!profesor) {
            return res.status(404).send('Profesor no encontrado');
        }

        res.status(200).json(profesor.Cursos);
    } catch (error) {
        res.status(500).send('Error al obtener los cursos del profesor');
    }
};

const getEstudiantesDeProfesor = async (req, res) => {
    const profesorId = parseInt(req.params.profesorId);

    try {
        const profesor = await Profesor.findByPk(profesorId, {
            include: {
                model: Curso,
                include: Estudiante,
            },
        });

        if (!profesor || !profesor.Cursos) {
            return res.status(404).send('Profesor o cursos no encontrados');
        }

        // Mapeamos los cursos y estudiantes para incluir la información del curso
        const estudiantes = profesor.Cursos.flatMap(curso =>
            curso.Estudiantes.map(estudiante => ({
                id: estudiante.id,
                nombre: estudiante.nombre,
                matricula: estudiante.matricula,
                curso: curso.nombre, // Adjuntamos el nombre del curso
            }))
        );

        res.status(200).json(estudiantes);
    } catch (error) {
        console.error('Error al obtener los estudiantes del profesor:', error);
        res.status(500).send('Error al obtener los estudiantes del profesor');
    }
};

const getEstudiantesDeCurso = async (req, res) => {
    const cursoId = parseInt(req.params.id);
    try {
      const curso = await Curso.findByPk(cursoId, {
        include: {
          model: Estudiante,
          attributes: ['id', 'nombre', 'matricula'],
        },
      });
  
      if (!curso) {
        return res.status(404).json({ message: 'Curso no encontrado' });
      }
  
      res.status(200).json(curso.Estudiantes); // Retornar los estudiantes asociados al curso
    } catch (error) {
      console.error('Error al obtener los estudiantes del curso:', error);
      res.status(500).json({ message: 'Error al obtener los estudiantes del curso' });
    }
  };

const getProfesorDelCurso = async (req, res) => {
    const cursoId = parseInt(req.params.cursoId);
    try {
        const curso = await Curso.findByPk(cursoId, { include: Profesor });

        if (!curso) {
            return res.status(404).send('Curso no encontrado');
        }

        console.log('Curso encontrado:', curso.nombre);
        console.log('Profesores asociados:', curso.Profesors);

        res.status(200).json(curso.Profesors);
    } catch (error) {
        console.error('Error al obtener los profesores del curso:', error);
        res.status(500).send('Error al obtener los profesores del curso');
    }
};




module.exports = {
    getCursos,
    getCursoById,
    createCurso,
    updateCurso,
    patchCurso,
    deleteCurso,
    inscribirEstudiante,
    eliminarEstudiante,
    asignarProfesor,
    eliminarProfesorDeCurso,
    getCursosDeEstudiante,
    getProfesoresDeEstudiante,
    getCursosDeProfesor,
    getEstudiantesDeProfesor,
    getProfesorDelCurso,
    getEstudiantesDeCurso
};
