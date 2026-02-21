// Navegación fija al hacer scroll
$(window).on("scroll", function () {
    if ($(window).scrollTop() > 130) {
        $('#nav-bar').addClass('fixed-nav');
    } else {
        $('#nav-bar').removeClass('fixed-nav');
    }
});
// Galería dinámica
const galery = document.getElementById("grid-galery");
const scriptSrc = document.currentScript ? document.currentScript.src : 'js/galery.js';
const JsonGalery = new URL('../assets/data/producto.json', scriptSrc).href;

fetch(JsonGalery)
    .then(res => res.json())
    .then(products => {
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
        if (galery) {
            galery.innerHTML = '<p>No se pudo cargar la galería.</p>';
        }
    });

window.onload = function () {
    const active = document.getElementById("act");
    if (active) {
        active.style.textDecoration = "underline #999966";
    }
};
