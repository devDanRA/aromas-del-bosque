//Resalatado de la sección activa en el menú
window.onload = function () {
    document.getElementById("act").style.textDecoration = "underline #999966";
}
//añadir opciones del select dinámicamente
const selectp = document.getElementById("pres-script");
const Jsonp = '../assets/data/producto.json';

fetch(Jsonp)
    .then(res => res.json())
    .then(products => {
        products.forEach(product => {
            selectp.innerHTML += `
            <option name="${product.title}">${product.title}</option>
        `
        });
    });

//Requerimientos
function enviarPresupuesto() {
    const name = document.getElementById("name").value;
    const lastname = document.getElementById("lastname").value;
    const email = document.getElementById("email").value;
    const phone = document.getElementById("phone").value;
    const product;
    const price;
    const plazo = document.getElementById("plazo").value;
    const wrapping = document.getElementById("packs").checked;
    const card = document.getElementById("card").checked;
    const delivery = document.getElementById("delivery").checked;
}
