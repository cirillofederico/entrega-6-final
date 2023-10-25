function cerrarSesion() {
  localStorage.removeItem("isLoggedIn"); // Eliminar el valor de inicio de sesión
  localStorage.removeItem("username"); // Eliminar el nombre de usuario
  window.location.href = "login.html"; // Redirige al inicio de sesión
}
// Obtén los elementos necesarios
const perfilButton = document.getElementById("perfil-button");
const perfilMenu = document.getElementById("perfil-menu");
// Agrega un evento click al botón de perfil
perfilButton.addEventListener("click", () => {
// Cambia la visibilidad del menú desplegable
if (perfilMenu.style.display === "block") {
  perfilMenu.style.display = "none";
} else {
  perfilMenu.style.display = "block";
}
});
// Cierra el menú si se hace clic en cualquier parte del documento
document.addEventListener("click", (event) => {
if (!perfilButton.contains(event.target) && !perfilMenu.contains(event.target)) {
  perfilMenu.style.display = "none";
}
});

// Mostrar el nombre del usuario si está autenticado
document.addEventListener("DOMContentLoaded", function(){
const username = localStorage.getItem("username");
if (username) {
  perfilButton.textContent = `${username}`;
}
});