<template>
  <div class="home-layout">
    <!-- Barra lateral -->
    <aside class="sidebar">
      <h1 class="sidebar-title">Servidor UABC</h1>
      <p class="sidebar-subtitle">Ingeniería en Computación</p>
      <nav class="sidebar-nav">
        <router-link to="/alumnos" class="nav-item">
          Estudiantes
        </router-link>
        <router-link to="/maestros" class="nav-item">
          Profesores
        </router-link>
        <router-link to="/cursos" class="nav-item">
          Cursos
        </router-link>
      </nav>
    </aside>

    <!-- Contenido principal -->
    <main class="main-content">
      <section class="welcome">
        <h2>Bienvenido</h2>
        <p v-if="!isAuthenticated">Inicia sesión para consultar y gestionar los estudiantes, profesores y cursos.</p>
        <p v-else>¡Bienvenido, {{ userName }}!</p>
      </section>

      <!-- Botón de autenticación de Google -->
      <div v-if="!isAuthenticated" class="login-section">
        <GoogleLogin
          :clientId="googleClientId"
          buttonText="Iniciar sesión con Google"
          @success="handleGoogleSuccess"
          @error="handleGoogleError"
          class="google-login-button"
        />
      </div>
    </main>
  </div>
</template>

<script>
import { GoogleLogin } from "vue3-google-login";

export default {
  name: "HomePage",
  components: {
    GoogleLogin,
  },
  data() {
    return {
      googleClientId:
        "963144815493-vqm6oq1hs5n8qdsqt1f0k4jqq4ujtbed.apps.googleusercontent.com",
      isAuthenticated: false,
      userName: "",
    };
  },
  methods: {
    handleGoogleSuccess(response) {
      console.log("Autenticación exitosa:", response);
      this.isAuthenticated = true;
      this.userName = response.profileObj.name;
      // Aquí puedes agregar cualquier lógica adicional después del inicio de sesión
    },
    handleGoogleError(error) {
      console.error("Error en la autenticación:", error);
      alert("Error al iniciar sesión con Google.");
    },
  },
};
</script>

<style>
/* Los estilos permanecen iguales */
body {
  margin: 0;
  font-family: "Arial", sans-serif;
  color: #333;
  background: #f4f4f4;
  display: flex;
  height: 100vh;
}

.home-layout {
  display: flex;
  height: 100%;
  width: 100%;
}

.sidebar {
  width: 250px;
  background: #00a859;
  color: white;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20px;
  box-shadow: 2px 0 8px rgba(0, 0, 0, 0.1);
}

.sidebar-title {
  font-size: 1.8em;
  margin: 10px 0;
  text-align: center;
}

.sidebar-subtitle {
  font-size: 1em;
  margin-bottom: 20px;
  text-align: center;
}

.sidebar-nav {
  display: flex;
  flex-direction: column;
  gap: 10px;
  width: 100%;
}

.nav-item {
  text-decoration: none;
  color: white;
  padding: 10px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 5px;
  text-align: center;
  transition: background 0.3s;
}

.nav-item:hover {
  background: rgba(255, 255, 255, 0.2);
}

.main-content {
  flex: 1;
  padding: 40px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.welcome h2 {
  font-size: 2em;
  margin-bottom: 10px;
}

.welcome p {
  font-size: 1.2em;
  color: #555;
  margin-bottom: 30px;
}

.login-section {
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 20px;
}

.google-login-button {
  font-size: 1em !important;
  background-color: #f4f4f4 !important;
  color: #000 !important;
  border: none !important;
  padding: 10px 20px !important;
  border-radius: 5px !important;
  transition: all 0.3s ease !important;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.google-login-button:hover {
  background-color: #e0e0e0 !important;
}
</style>