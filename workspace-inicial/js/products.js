let products = [];
// Función para obtener la URL de la categoría específica
function getCategoryURL(catID) {
  // La función toma el argumento catID
  return `${PRODUCTS_URL}${catID}${EXT_TYPE}`; //y devuelve una URL construida usando ese verificador

}

// Función para crear el contenido HTML de un producto
function createProductHTML(product) {
  //Toma un objeto 'product' como argumento y crea el contenido HTML que representa al producto
  return `
    <div class="d-flex align-items-center product">
      <img src="${product.image}" alt="${product.name}" style="width: 25%;" class="mr-3 product-image">
      <div style="width:100%;">
        <h5 style="margin-left: 5px;" class="fw-bold display-8 product-title">${product.name}</h5>
        <p style="margin-left: 5px;" class="product-price"> ${product.currency} ${product.cost}</p>
        <p style="margin-left: 5px;" class="product-description">${product.description}</p>
        <p style="margin-left: 5px;" class="text-end">${product.soldCount} vendidos</p>
      </div>
    </div>
  `;
}

// Función para cargar los productos desde la URL
async function loadProductsFromURL(url) {
  try {
    const response = await fetch(url); // Hacemos la solicitud a la URL usando fetch
    const data = await response.json(); // Convertimos la respuesta JSON en un objeto JavaScript
    return data.products; // Devuelve la lista de productos desde la propeidad 'products' de ese objeto
  } catch (error) {
    console.error("Error al obtener los productos:", error); // Si hay un error, imprimimos el mensaje de error en consola
    return [];
  }
}

// Función para agregar productos al contenedor
function displayProducts(products, container) {
  console.log(products);
  // Limpiar el contenido existente en el contenedor
  container.innerHTML = "";

  // La función toma la lista products y un contenedor HTML (container) como argumentos
  products.forEach((product) => {
    // Iteramos a través de la lista de productos, crea los elementos para cada producto y los agrega al contenedor
    const productCard = document.createElement("div");
    productCard.className =
      "list-group-item product-item d-flex justify-content-between align-items-center";
    productCard.innerHTML = createProductHTML(product);

    // Agregamos un controlador de eventos al hacer click en el producto
    productCard.addEventListener('click', () => {
      // Obtenemos el identificador del producto y lo guardamos en el almacenamiento local
      localStorage.setItem('selectedProductId', product.id);
      
      // Redirigimos al usuario a product-info.html
      window.location.href = 'product-info.html';
    });
    
    container.appendChild(productCard);
  });
}

// Función para cargar y mostrar productos en el contenedor
async function loadAndDisplayProducts() {
  // Obtenemos el contenedor de productos del HTML
  productContainer = document.getElementById("product-list");

  // Obtenemos el identificador de categoría del almacenamiento local
  const catID = localStorage.getItem("catID");
  if (!catID) {
    // Si el identificador no está presente, muestra un mensaje de error
    console.error(
      "Identificador de categoría no encontrado en el almacenamiento local."
    );
    return;
  }

  const url = getCategoryURL(catID); // Si el identificador está presente, construye la URL de la categoría
  products = await loadProductsFromURL(url); // Almacena los productos cargados en la variable products
  displayProducts(products, productContainer); // y los muestra en el contendor
}

// Función para filtrar productos por rango de precio
function filterByPrice(products, minPrice, maxPrice) {
  // Utilizamos el método 'filter' para iterar sobre los productos y devolver solo aquellos que cumplan la condición dada
  return products.filter((product) => {
    // Convierte el precio del producto a un número de punto flotante
    const productPrice = parseFloat(product.cost);
    // Devuelve 'true' si el precio del producto está dentro del rango especificado
    return productPrice >= minPrice && productPrice <= maxPrice;
  });
}

// Función para ordenar productos por precio ascendente
function sortByAscPrice(products) {
  return products
    .slice() // Creamos una copia de la lista de productos para no modificar la original
    .sort((a, b) => parseFloat(a.cost) - parseFloat(b.cost)); // Comparamos los precios y ordenamos de manera ascendente
}

// Función para ordenar productos por precio descendente
function sortByDescPrice(products) {
  return products
    .slice()
    .sort((a, b) => parseFloat(b.cost) - parseFloat(a.cost)); // Comparamos los precios y ordenamos de manera descendente
}

// Función para ordenar productos por relevancia descendente (cantidad vendida)
function sortByDescRelevance(products) {
  return products.slice().sort((a, b) => b.soldCount - a.soldCount); // Comparamos las cantidades vendidas y ordenamos de manera descendente
}

document.addEventListener("DOMContentLoaded", () => {
  const rangeFilterButton = document.getElementById("rangeFilterCount");
  const clearRangeFilterButton = document.getElementById("clearRangeFilter");

  // Evento click en el botón de filtrar
  rangeFilterButton.addEventListener("click", async () => {
    // Obtiene los valores de los campos de entrada de rango de precio
    const minPrice =
      parseFloat(document.getElementById("rangeFilterCountMin").value) || 0;
    const maxPrice =
      parseFloat(document.getElementById("rangeFilterCountMax").value) ||
      Infinity;

    try {
      const catID = localStorage.getItem("catID"); // Obtiene el identificador de categoría del almacenamiento local
      if (!catID) {
        console.error(
          "Identificador de categoría no encontrado en el almacenamiento local."
        );
        return;
      }

      const url = getCategoryURL(catID); // Construye la URL de la categoría usando el identificador
      const products = await loadProductsFromURL(url); // Carga los productos desde la URL
      let filteredProducts = filterByPrice(products, minPrice, maxPrice); // Filtra los productos por rango de precio usando la función 'filterByPrice'

      productContainer = document.getElementById("product-list"); // Obtenemos el contenedor de productos
      productContainer.innerHTML = ""; // Limpiamos el contenido existente

      // Mostramos los productos filtrados en el contenedor
      displayProducts(filteredProducts, productContainer);
    } catch (error) {
      console.error("Error al cargar y mostrar los productos:", error);
    }
  });

  // Evento click en el botón de limpiar
  clearRangeFilterButton.addEventListener("click", async () => {
    try {
      const catID = localStorage.getItem("catID");
      if (!catID) {
        console.error(
          "Identificador de categoría no encontrado en el almacenamiento local."
        );
        return;
      }

      const url = getCategoryURL(catID);
      const products = await loadProductsFromURL(url);

      productContainer = document.getElementById("product-list");
      productContainer.innerHTML = ""; // Limpiamos el contenido existente

      // Mostramos todos los productos en el contenedor
      displayProducts(products, productContainer);

      // Restauramos los campos de entrada y botones
      document.getElementById("rangeFilterCountMin").value = "";
      document.getElementById("rangeFilterCountMax").value = "";
    } catch (error) {
      console.error("Error al cargar y mostrar los productos:", error);
    }
  });

  // Obtenemos los elementos de botón para ordenar según los criterios
  const sortAscPriceButton = document.getElementById("sortAscPrice");
  const sortDescPriceButton = document.getElementById("sortDescPrice");
  const sortDescRelevanceButton = document.getElementById("sortDescRelevance");

  // Agregamos listeners de eventos a los botones de ordenamiento
  sortAscPriceButton.addEventListener("click", () => {
    console.log("Botón de Ordenamiento A-Z clickeado"); // Imprimimos en consola para verificar el evento
    const sortedProducts = sortByAscPrice(products); // Ordenamos los productos por precio ascendente
    displayProducts(sortedProducts, productContainer); // Mostramos los productos ordenados en el contenedor
  });

  sortDescPriceButton.addEventListener("click", () => {
    console.log("Botón de Ordenamiento Z-A clickeado");
    const sortedProducts = sortByDescPrice(products); // Ordenamos los productos por precio descendente
    displayProducts(sortedProducts, productContainer);
  });

  sortDescRelevanceButton.addEventListener("click", () => {
    console.log("Botón de Ordenamiento por Relevancia clickeado");
    const sortedProducts = sortByDescRelevance(products); // Ordenamos los productos por relevancia descendente
    displayProducts(sortedProducts, productContainer);
  });

  // Obtenemos el campo de búsqueda y el contenedor de productos
  const searchInput = document.getElementById("searchInput");
  productContainer = document.getElementById("product-list");

  // Función para filtrar productos por título y descripción
  function filterBySearchTerm(products, searchTerm) {
    searchTerm = searchTerm.toLowerCase();
    return products.filter((product) => {
      const productName = product.name.toLowerCase();
      const productDescription = product.description.toLowerCase();
      return (
        productName.includes(searchTerm) || // Comprobamos si el término de búsqueda está incluido en el nombre del producto
        productDescription.includes(searchTerm) // Comprobamos si el término de búsqueda está incluido en la descripción del producto
      );
    });
  }

  // Evento input en el campo de búsqueda
  searchInput.addEventListener("input", () => {
    // Agregamos un listener cuando se introduce texto en el campo de búsqueda
    const searchTerm = searchInput.value; // Obtenemos el valor actual del campo de búsqueda
    const filteredProducts = filterBySearchTerm(products, searchTerm); // Filtramos los productos según el término de búsqueda
    displayProducts(filteredProducts, productContainer); // Mostramos los productos filtrados en el contenedor de productos
  });

  // Cargamos y mostramos productos al cargar la página
  loadAndDisplayProducts();
  
});