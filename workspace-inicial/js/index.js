document.addEventListener("DOMContentLoaded", function(){
  document.getElementById("autos").addEventListener("click", function() {
      localStorage.setItem("catID", 101);
      window.location = "products.html"
  });
  document.getElementById("juguetes").addEventListener("click", function() {
      localStorage.setItem("catID", 102);
      window.location = "products.html"
  });
  document.getElementById("muebles").addEventListener("click", function() {
      localStorage.setItem("catID", 103);
      window.location = "products.html"
  });
});


// Función para verificar si el usuario está autenticado
function checkAuthentication() {
  // Obtenemos el valor de la clave "isLoggedIn" del almacenamiento local
  var isLoggedIn = localStorage.getItem("isLoggedIn");
  
  // Si el usuario no está autenticado (isLoggedIn es null o falso)
  if (!isLoggedIn) {
      window.location.href = "login.html"; // Redirigimos al usuario a la página de inicio de sesión
  }
}

// Llamamos a la función cuando la página se carga
window.onload = checkAuthentication;