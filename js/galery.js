// Mantiene el menú visible al hacer scroll en la página de galería.
$(window).on("scroll", function () {
    if ($(window).scrollTop() > 130) {
        $('#nav-bar').addClass('fixed-nav');
    } else {
        $('#nav-bar').removeClass('fixed-nav');
    }
});
// Contenedor donde se pintan las tarjetas de producto.
const galery = document.getElementById("grid-galery");
// URL absoluta al JSON para evitar problemas de ruta en producción.
const scriptSrc = document.currentScript ? document.currentScript.src : 'js/galery.js';
const JsonGalery = new URL('../assets/data/producto.json', scriptSrc).href;

fetch(JsonGalery)
    .then(res => res.json())
    .then(products => {
        // Renderiza cada producto como tarjeta.
        products.forEach(product => {
            galery.innerHTML += `
            <div class="card-galery">
                <div class="card-img">
                    <img src="${product.img}" alt="${product.title}">
                </div>
                <h3>${product.title}</h3>
                <p>${product.price}</p>
            </div>
            `
        });
    })
    .catch(error => {
        console.error(error);
        // Mensaje de fallback si falla la carga de datos.
        if (galery) {
            galery.innerHTML = '<p>No se pudo cargar la galería.</p>';
        }
    });

// Resalta el enlace activo en la navegación.
window.onload = function () {
    const active = document.getElementById("act");
    if (active) {
        active.style.textDecoration = "underline #999966";
    }
};
