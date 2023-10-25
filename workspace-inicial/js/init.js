const CATEGORIES_URL = "https://japceibal.github.io/emercado-api/cats/cat.json";
const PUBLISH_PRODUCT_URL = "https://japceibal.github.io/emercado-api/sell/publish.json";
const PRODUCTS_URL = "https://japceibal.github.io/emercado-api/cats_products/";
const PRODUCT_INFO_URL = "https://japceibal.github.io/emercado-api/products/";
const PRODUCT_INFO_COMMENTS_URL = "https://japceibal.github.io/emercado-api/products_comments/";
const CART_INFO_URL = "https://japceibal.github.io/emercado-api/user_cart/";
const CART_BUY_URL = "https://japceibal.github.io/emercado-api/cart/buy.json";
const EXT_TYPE = ".json";

let showSpinner = function(){
  document.getElementById("spinner-wrapper").style.display = "block";
}

let hideSpinner = function(){
  document.getElementById("spinner-wrapper").style.display = "none";
}

let getJSONData = function(url){
    let result = {};
    showSpinner();
    return fetch(url)
    .then(response => {
      if (response.ok) {
        return response.json();
      }else{
        throw Error(response.statusText);
      }
    })
    .then(function(response) {
          result.status = 'ok';
          result.data = response;
          hideSpinner();
          return result;
    })
    .catch(function(error) {
        result.status = 'error';
        result.data = error;
        hideSpinner();
        return result;
    });
}


function cerrarSesion() {
  localStorage.removeItem("isLoggedIn"); // Eliminar el valor de inicio de sesión
  localStorage.removeItem("isLoggedIn"); // Eliminar el valor de inicio de sesión
  window.location.href = "login.html"; // Redirigir al inicio de sesión
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

// Manejo del ícono de dark mode
const moonIcon = document.getElementById("moonIcon");
const body = document.body;

moonIcon.addEventListener("click", () => {
  body.classList.toggle("dark-mode");
  saveDarkModeState(body.classList.contains("dark-mode"));
});

function saveDarkModeState(isDarkMode) {
  localStorage.setItem("darkMode", isDarkMode);
}

// Cargar estado de modo oscuro al cargar la página
window.addEventListener("load", () => {
  const isDarkMode = localStorage.getItem("darkMode") === "true";
  if (isDarkMode) {
    body.classList.add("dark-mode");
  }
});