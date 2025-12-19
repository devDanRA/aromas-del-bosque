// Galería dinámica
const galery = document.getElementById("grid-galery");
const JsonGalery = '../assets/data/galeria.json';

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