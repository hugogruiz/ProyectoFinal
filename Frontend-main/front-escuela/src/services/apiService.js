import axios from 'axios';

const API_URL = 'https://localhost:4000';

const apiService = {
    // Estudiantes
    getAllAlumnos() {
        return axios.get(`${API_URL}/estudiantes`);
    },
    getCursosDeAlumno(id) {
        return axios.get(`${API_URL}/estudiantes/${id}/cursos`);
    },
    getMaestrosDeAlumno(id) {
        return axios.get(`${API_URL}/estudiantes/${id}/profesores`);
    },
    addAlumno(data) {
        return axios.post(`${API_URL}/estudiantes`, data);
    },
    deleteAlumno(id) {
        return axios.delete(`${API_URL}/estudiantes/${id}`);
    },
    async getCursosDeAlumnoWithDetails(estudianteId) {
        return axios.get(`${API_URL}/estudiantes/${estudianteId}/cursos?include=profesores,alumnos`);
    },
    // Cursos
    getAllCursos() {
        return axios.get(`${API_URL}/cursos`);
    },
    getCursoById(id) {
        return axios.get(`${API_URL}/cursos/${id}`);
    },
    getEstudiantesDeCurso(id) {
        return axios.get(`${API_URL}/cursos/${id}/estudiantes`);
    },
    getMaestrosDeCurso(id) {
        return axios.get(`${API_URL}/cursos/${id}/profesores`);
    },
    addCurso(data) {
        return axios.post(`${API_URL}/cursos`, data);
    },
    deleteCurso(id) {
        return axios.delete(`${API_URL}/cursos/${id}`);
    },
    getProfesoresDelCurso(cursoId) {
        return axios.get(`${API_URL}/cursos/${cursoId}/profesores`);
    },
    inscribirAlumnoACurso(data) {
        return axios.post(`${API_URL}/cursos/inscribirEstudiante`, data);
    },
    asignarProfesorACurso(data) {
        return axios.post(`${API_URL}/cursos/asignarProfesor`, data);
    },
    eliminarProfesorDeCurso(data) {
        return axios.post(`${API_URL}/cursos/eliminarProfesorDeCurso`, data);
    },
    eliminarAlumnoDeCurso(data) {
        return axios.post(`${API_URL}/cursos/eliminarEstudiante`, data);
    },
    // Maestros
    getAllMaestros() {
        return axios.get(`${API_URL}/profesores`);
    },
    getCursosDeMaestro(id) {
        return axios.get(`${API_URL}/profesores/${id}/cursos`);
    },
    addMaestro(data) {
        return axios.post(`${API_URL}/profesores`, data);
    },
    deleteMaestro(id) {
        return axios.delete(`${API_URL}/profesores/${id}`);
    },
    getEstudiantesDeProfesor(profesorId) {
        return axios.get(`${API_URL}/profesores/${profesorId}/estudiantes`);
    },
};

export default apiService;
