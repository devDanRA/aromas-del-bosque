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
const JsonGalery = '../assets/data/producto.json';

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
    });

// Navegación fija al hacer scrollwindow.onload = function () {
document.getElementById("act").style.textDecoration = "underline #999966";