let estudiantes = [
];

const findAll = () => estudiantes;

const findById = (id) => estudiantes.find(e => e.id === String(id));

const findByMatricula = (matricula) => estudiantes.find(e => e.matricula === String(matricula));

const add = (newEstudiante) => {
    const newId = (estudiantes.length + 1).toString();
    newEstudiante.id = newId;
    estudiantes.push(newEstudiante);
    return newEstudiante;
};

const save = (id, data) => {
    const index = estudiantes.findIndex(e => e.id === String(id));
    if (index !== -1) {
        estudiantes[index] = { ...estudiantes[index], ...data };
        return estudiantes[index];
    }
    return null;
};

const erase = (id) => {
    const index = estudiantes.findIndex(e => e.id === String(id));
    if (index !== -1) {
        estudiantes.splice(index, 1);
        return true;
    }
    return false;
};

const inscribirEnCurso = (estudianteId, cursoId) => {
    const estudiante = findById(estudianteId);
    if (estudiante && !estudiante.cursos.includes(cursoId)) {
        estudiante.cursos.push(cursoId);
        return true;
    }
    return false;
};

const eliminarDeCurso = (estudianteId, cursoId) => {
    const estudiante = findById(estudianteId);
    if (estudiante) {
        estudiante.cursos = estudiante.cursos.filter(curso => curso !== cursoId);
        return true;
    }
    return false;
};

module.exports = {
    findAll,
    findById,
    findByMatricula,
    add,
    save,
    erase,
    inscribirEnCurso,
    eliminarDeCurso,
};
