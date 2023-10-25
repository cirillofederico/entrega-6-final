document.addEventListener("DOMContentLoaded", async () => {
  let username = localStorage.getItem("username"); // Obtener el nombre de usuario
  const commentsByProduct = {};
  let apiComments = []; // Esta variable almacenará los comentarios de la API
  let localStorageComments = {}; // Almacena los comentarios del almacenamiento local

  // Obtenemos el identificador del producto guardado en el almacenamiento local
  const selectedProductId = localStorage.getItem("selectedProductId");

  // Verificamos si se ha seleccionado un producto válido
  if (!selectedProductId) {
    // Si no hay un identificador de producto válido, muestra un mensaje de error o redirige a una página de error
    console.error(
      "Identificador de producto no encontrado en el almacenamiento local."
    );

    return;
  }

  // Realizamos una solicitud para obtener la información del producto usando el identificador
  const productInfoUrl = `${PRODUCT_INFO_URL}${selectedProductId}${EXT_TYPE}`;

  try {
    const response = await fetch(productInfoUrl);
    const product = await response.json();

    // Una vez que obtenemos la información del producto, la mostramos en la página
    const productInfoContainer = document.getElementById("product-info");
    productInfoContainer.classList.add(
      "card",
      "rounded-3",
      "m-4",
      "shadow",
      "darkModeProduct"
    );
    // Creamos un botón de "Agregar al carrito"
    const addToCartButton = document.createElement("button");
    addToCartButton.textContent = "Agregar al carrito";
    addToCartButton.classList.add("btn", "btn-success", "m-2", "darkModeButton");

    // Agregamos un evento "click" al botón "Agregar al carrito"
    addToCartButton.addEventListener("click", () => {
      // Creamos un objeto que representa el producto a agregar al carrito
      const productToAddToCart = {
        id: selectedProductId, // Usar el ID del producto
        image: product.images
          ? (Array.isArray(product.images) && product.images.length > 0
            ? product.images[0]
            : product.images)
          : product.image,
        name: product.name,
        unitCost: product.cost,
        currency: product.currency,
        count: 1, // Inicialmente, el producto se agrega con una cantidad de 1
      };

      // Verificamos si ya hay productos en el carrito (en localStorage)
      let cartItems = JSON.parse(localStorage.getItem("cart")) || [];

      // Verificamos si el producto ya existe en el carrito
      const existingProductIndex = cartItems.findIndex(item => item.id === productToAddToCart.id);

      if (existingProductIndex !== -1) {
        // Si el producto ya está en el carrito, aumentamos su cantidad en 1
        cartItems[existingProductIndex].count++;
      } else {
        // Si el producto no existe en el carrito, lo agregamos al arreglo de productos del carrito
        cartItems.push(productToAddToCart);
      }

      // Almacenamos el carrito actualizado en el localStorage
      localStorage.setItem("cart", JSON.stringify(cartItems));

      // Notificamos al usuario que el producto se ha añadido al carrito
      alert("El producto ha sido añadido al carrito.");

    });

    // Agregamos el botón de "Agregar al carrito" al contenedor de product-info
    productInfoContainer.appendChild(addToCartButton);


    // Creamos un elemento div para el carrusel
    const carouselContainer = document.createElement("div");
    carouselContainer.classList.add("carousel", "slide");
    carouselContainer.id = "product-carousel"; // Asigna un ID al carrusel
    carouselContainer.setAttribute("data-ride", "carousel");

    // Creamos la lista de imágenes del carrusel
    const carouselInner = document.createElement("div");
    carouselInner.classList.add("carousel-inner");

    // Iteramos a través del array 'images' y creamos elementos 'div' para cada imagen
    product.images.forEach((imageUrl, index) => {
      const carouselItem = document.createElement("div");
      carouselItem.classList.add("carousel-item");

      if (index === 0) {
        carouselItem.classList.add("active");
      }

      const productImage = document.createElement("img");
      productImage.src = imageUrl;
      productImage.classList.add(
        "d-block",
        "w-50",
        "mx-auto",
        "m-4",
        "rounded"
      ); // Clases para imágenes responsivas

      carouselItem.appendChild(productImage);
      carouselInner.appendChild(carouselItem);

    });

    // Agregamos el carrusel al contenedor de información del producto
    carouselContainer.appendChild(carouselInner);
    productInfoContainer.appendChild(carouselContainer);

    const productNameElement = document.createElement("h1");
    productNameElement.textContent = product.name;
    productNameElement.classList.add("card-title", "display-4", "text-danger");

    const productDescriptionElement = document.createElement("p");
    productDescriptionElement.textContent = product.description;
    productDescriptionElement.classList.add("card-text");

    const productPriceElement = document.createElement("p");
    productPriceElement.textContent = `Precio: ${product.currency} ${product.cost}`;
    productPriceElement.classList.add("card-text");

    const productSoldElement = document.createElement("p");
    productSoldElement.textContent = `Cantidad de productos vendidos: ${product.soldCount}`;
    productSoldElement.classList.add(
      "card-text",
      "text-secondary",
      "mb-4",
      "darkModeSold"
    );

    // Agregamos los elementos de texto al contenedor de información del producto
    productInfoContainer.appendChild(productNameElement);
    productInfoContainer.appendChild(productDescriptionElement);
    productInfoContainer.appendChild(productPriceElement);
    productInfoContainer.appendChild(productSoldElement);

    // Inicializamos el carrusel utilizando jQuery
    $(document).ready(function () {
      $("#product-carousel").carousel();
    });

    // Función para generar estrellas en función de la puntuación
    function createStarRating(score) {
      const starContainer = document.createElement("div");
      starContainer.classList.add("star-rating");

      for (let i = 1; i <= 5; i++) {
        const star = document.createElement("span");
        star.classList.add("fa", "fa-star");

        if (i <= score) {
          star.classList.add("checked");
        }

        starContainer.appendChild(star);
      }

      return starContainer;
    }

    // Obtenemos y mostramos los comentarios del producto
    const productCommentsUrl = `${PRODUCT_INFO_COMMENTS_URL}${selectedProductId}${EXT_TYPE}`;
    const commentsResponse = await fetch(productCommentsUrl);
    apiComments = await commentsResponse.json();

    // Obtenemos los comentarios del almacenamiento local, si existen
    if (localStorage.getItem("comments")) {
      localStorageComments = JSON.parse(localStorage.getItem("comments")) || {};
    }

    // Creamos una sección para mostrar los comentarios
    const commentsSection = document.createElement("div");
    commentsSection.classList.add("mt-4");

    // Creamos una cabecera para los comentarios
    const commentsHeader = document.createElement("h3");
    commentsHeader.textContent = "Comentarios de los usuarios";
    commentsHeader.classList.add("text-primary", "darkModeTitle");
    commentsSection.appendChild(commentsHeader);

    // Iteramos sobre los comentarios y los mostramos
    apiComments.forEach((comment) => {
      const commentCard = document.createElement("div");
      commentCard.classList.add(
        "card",
        "mb-3",
        "w-50",
        "mx-auto",
        "darkModeComments",
        "responsiveComments"
        );

      const commentCardBody = document.createElement("div");
      commentCardBody.classList.add("card-body");

      const commentText = document.createElement("p");
      commentText.textContent = comment.comment;

      const commentUser = document.createElement("p");
      commentUser.textContent = comment.user;
      commentUser.classList.add(
        "text-start",
        "fw-bold",
        "d-inline",
        "m-4",
        "responsiveComment"
      );

      const commentDate = document.createElement("p");
      commentDate.textContent = comment.dateTime;
      commentDate.classList.add(
        "text-end",
        "d-inline",
        "m-4",
        "responsiveComment"
      );

      const commentDescription = document.createElement("p");
      commentDescription.textContent = comment.description;
      commentDescription.classList.add("m-4", "darkModeTextComments");

      const commentRating = createStarRating(comment.score); // Llama a la función para crear las estrellas

      commentCardBody.appendChild(commentText);
      commentCardBody.appendChild(commentUser);
      commentCardBody.appendChild(commentDate);
      commentCardBody.appendChild(commentDescription);
      commentCardBody.appendChild(commentRating);

      commentCard.appendChild(commentCardBody);
      commentsSection.appendChild(commentCard);
    });

    // Agregamos la sección de comentarios al contenedor de información del producto
    productInfoContainer.appendChild(commentsSection);

    // Agregamos sección para ingresar comentarios y calificación
    const commentFormContainer = document.createElement("div");
    commentFormContainer.id = "comment-form";
    commentFormContainer.classList.add("mt-4", "w-50", "mx-auto", "responsiveForm");

    // Título para la sección de comentarios
    const commentTitle = document.createElement("h3");
    commentTitle.textContent = "Deja un comentario";
    commentTitle.classList.add("text-primary", "darkModeTitle");
    commentFormContainer.appendChild(commentTitle);

    // Formulario para el comentario y la calificación
    const commentForm = document.createElement("form");
    commentForm.addEventListener("submit", (event) => {
      event.preventDefault(); // Evitar el envío real del formulario

      // Obtener el comentario y la calificación ingresados por el usuario
      const commentText = document.getElementById("comment-text").value;
      const commentRating = document.getElementById("comment-rating").value;

      // Validamos que se haya ingresado un comentario
      if (!commentText) {
        alert("Por favor, ingrese un comentario.");
        return;
      }

      // Creamos un objeto para representar el comentario
      const newComment = {
        comment: commentText,
        score: parseInt(commentRating),
        user: username,
        dateTime: new Date().toLocaleString(),
      };

      // Agregamos el comentario al objeto 'commentsByProduct'
      commentsByProduct[selectedProductId] =
        commentsByProduct[selectedProductId] || [];
      commentsByProduct[selectedProductId].push(newComment);

      // Almacenamos la lista actualizada en el almacenamiento local
      localStorageComments[selectedProductId] =
        commentsByProduct[selectedProductId];
      localStorage.setItem("comments", JSON.stringify(localStorageComments));

      // Actualizamos la vista de los comentarios
      updateCommentsView(selectedProductId);

      // Limpiamos el formulario
      commentForm.reset();
    });

    // Función para actualizar la vista de los comentarios
    function updateCommentsView(productId) {
      // Combinar los comentarios de la API y los del almacenamiento local
      const combinedComments = [
        ...apiComments,
        ...(localStorageComments[productId] || []),
      ];

      // Eliminamos todos los comentarios actuales en la vista
      const commentsSection = document.querySelector(".mt-4");
      commentsSection.innerHTML = "";

      // Recorremos la lista de comentarios combinados y los mostramos en la vista
      combinedComments.forEach((comment) => {
        // Crear elementos de la vista para cada comentario
        const commentCard = document.createElement("div");
        commentCard.classList.add(
          "card",
          "mb-3",
          "w-50",
          "mx-auto",
          "darkModeComments"
        );

        const commentCardBody = document.createElement("div");
        commentCardBody.classList.add("card-body");

        const commentUser = document.createElement("p");
        commentUser.textContent = comment.user;
        commentUser.classList.add(
          "text-start",
          "fw-bold",
          "d-inline",
          "m-4",
          "responsiveComment"
        );

        const commentDate = document.createElement("p");
        commentDate.textContent = comment.dateTime;
        commentDate.classList.add(
          "text-end",
          "d-inline",
          "m-4",
          "responsiveComment"
        );

        const commentText = document.createElement("p");
        commentText.textContent = comment.comment;

        const commentDescription = document.createElement("p");
        commentDescription.textContent = comment.description;
        commentDescription.classList.add("m-4", "darkModeTextComments");

        const commentRating = createStarRating(comment.score); // Llama a la función para crear las estrellas

        commentCardBody.appendChild(commentUser);
        commentCardBody.appendChild(commentDate);
        commentCardBody.appendChild(commentText);
        commentCardBody.appendChild(commentDescription);
        commentCardBody.appendChild(commentRating);

        commentCard.appendChild(commentCardBody);
        commentsSection.appendChild(commentCard);
      });
    }

    // Creamos los elementos HTML que componen al formulario
    // Textarea para el comentario
    const commentTextarea = document.createElement("textarea");
    commentTextarea.id = "comment-text";
    commentTextarea.classList.add("form-control", "m-2");
    commentTextarea.setAttribute("rows", "4");

    // Label para el comentario
    const commentLabel = document.createElement("label");
    commentLabel.setAttribute("for", "comment-text");
    commentLabel.classList.add("form-label", "m-2");
    commentLabel.textContent = "Tu opinión:";

    // Select para la calificación
    const commentRatingSelect = document.createElement("select");
    commentRatingSelect.id = "comment-rating";
    commentRatingSelect.classList.add("form-select", "m-2");

    // Opciones para la calificación
    const ratings = [
      "1 estrella",
      "2 estrellas",
      "3 estrellas",
      "4 estrellas",
      "5 estrellas",
    ];
    ratings.forEach((rating, index) => {
      const option = document.createElement("option");
      option.value = index + 1;
      option.textContent = rating;
      commentRatingSelect.appendChild(option);
    });

    // Label para la calificación
    const ratingLabel = document.createElement("label");
    ratingLabel.setAttribute("for", "comment-rating");
    ratingLabel.classList.add("form-label");
    ratingLabel.textContent = "Calificación:";

    // Botón para enviar el comentario
    const submitButton = document.createElement("button");
    submitButton.type = "submit";
    submitButton.classList.add(
      "btn",
      "btn-primary",
      "mt-2",
      "mb-4",
      "darkModeButton"
    );
    submitButton.textContent = "Enviar comentario";

    // Agregar elementos al formulario
    commentForm.appendChild(commentLabel);
    commentForm.appendChild(commentTextarea);
    commentForm.appendChild(ratingLabel);
    commentForm.appendChild(commentRatingSelect);
    commentForm.appendChild(submitButton);

    // Agregar formulario completo a la sección de comentarios
    commentFormContainer.appendChild(commentForm);

    // Agregar sección de comentarios al contenedor de información del producto
    productInfoContainer.appendChild(commentFormContainer);

    // Mostrar los productos relacionados
    const relatedProductsSection = document.createElement("div");
    relatedProductsSection.classList.add("mt-4");

    // Título para la sección de productos relacionados
    const relatedProductsHeader = document.createElement("h3");
    relatedProductsHeader.textContent = "Productos Relacionados";
    relatedProductsHeader.classList.add("text-primary", "darkModeTitle");
    relatedProductsSection.appendChild(relatedProductsHeader);

    // Creamos un contenedor para los productos relacionados
    const relatedProductsContainer = document.createElement("div");
    relatedProductsContainer.classList.add(
      "d-flex",
      "justify-content-center",
      "flex-wrap",
      "m-3",
      "relatedProductsStyles"
    );

    // Iteramos a través de los productos relacionados y los mostramos
    product.relatedProducts.forEach(async (relatedProduct) => {
      // Creamos un div para cada producto relacionado
      const relatedProductCard = document.createElement("div");
      relatedProductCard.classList.add("card", "m-3", "w-25", "text-center", "responsiveTest");

      // Agregamos un controlador de eventos para cada producto relacionado
      relatedProductCard.addEventListener("click", () => {
        // Guardamos el ID del producto relacionado en el almacenamiento local
        localStorage.setItem("selectedProductId", relatedProduct.id);

        // Redirigimos al usuario a la página de información del producto relacionado
        window.location.href = "product-info.html";
      });

      // Creamos el cuerpo del producto relacionado
      const relatedProductCardBody = document.createElement("div");
      relatedProductCardBody.classList.add("card-body", "w-100", "bg-dark");

      // Agregamos el nombre del producto relacionado
      const relatedProductName = document.createElement("h5");
      relatedProductName.textContent = relatedProduct.name;
      relatedProductName.classList.add("card-title", "text-info");

      // Agregamos la imagen del producto relacionado
      const relatedProductImage = document.createElement("img");
      relatedProductImage.src = relatedProduct.image;
      relatedProductImage.classList.add("card-img-top");

      // Agregamos el nombre y la imagen al cuerpo del producto relacionado
      relatedProductCardBody.appendChild(relatedProductName);
      relatedProductCardBody.appendChild(relatedProductImage);

      // Agregamos el cuerpo del producto relacionado al div del producto
      relatedProductCard.appendChild(relatedProductCardBody);

      // Agregamos el div del producto relacionado al contenedor de productos relacionados
      relatedProductsContainer.appendChild(relatedProductCard);
    });

    // Agregamos el contenedor de productos relacionados a la sección de productos relacionados
    relatedProductsSection.appendChild(relatedProductsContainer);

    // Agregamos la sección de productos relacionados al contenedor de información del producto
    productInfoContainer.appendChild(relatedProductsSection);

    // Cargar comentarios almacenados en el almacenamiento local
    if (localStorage.getItem("comments")) {
      const storedComments = JSON.parse(localStorage.getItem("comments"));

      // Verifica si hay comentarios almacenados para el producto actual
      if (storedComments[selectedProductId]) {
        commentsByProduct[selectedProductId] =
          storedComments[selectedProductId];
      }

      // Actualiza la vista de los comentarios solo para el producto actual
      updateCommentsView(selectedProductId);
    }
  } catch (error) {
    console.error(
      "Error al obtener y mostrar la información del producto:",
      error
    );
  }
});