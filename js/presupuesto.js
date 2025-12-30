//Resalatado de la sección activa en el menú
window.onload = function () {
    document.getElementById("act").style.textDecoration = "underline #999966";
}
// Navegación fija al hacer scroll
$(window).on("scroll", function () {
    if ($(window).scrollTop() > 130) {
        $('#nav-bar').addClass('fixed-nav');
    } else {
        $('#nav-bar').removeClass('fixed-nav');
    }
});
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

const vletras = /^[A-Za-zÁÉÍÓÚÜÑáéíóúüñ\s]+$/;
const vtel = /^[0-9]{9}$/;
const vemail = /^[_a-z0-9-]+(.[_a-z0-9-]+)*@[_a-z0-9]+(.[_a-z0-9-]+)*(.[a-z]){2,3}$/;

const form = document.getElementById("form-presupuesto");
form.addEventListener("submit", function (event) {
    event.preventDefault();
    //variables
    //datos
    const nomb = document.getElementById("nombre").value;
    const apell = document.getElementById("apellido").value;
    const tel = document.getElementById("telefono").value;
    const email = document.getElementById("email").value;

    //validaciones

    if (nomb === "" || !vletras.test(nomb)) {
        alert("Por favor introduzca bien su nombre");
        return false;
    }
    if (apell === "" || !vletras.test(apell)) {
        alert("Por favor introduzca bien su apellido");
        return false;
    }
    if (tel === "" || !vtel.test(tel)) {
        alert("Por favor introduzca bien su número de telefono");
        return false;
    }
    if (email === "" || !vemail.test(email)) {
        alert("Por favor introduzca un email valido")
        return false;
    }
    alert("Su solicitud ha sido enviada correctamente");
    form.submit();
}
)

