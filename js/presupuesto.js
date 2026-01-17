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
//añadir opciones del select dinámicamente y añadir precio al input
const productosSelect = document.getElementById("productos");
const presupuestoInput = document.getElementById("presupuesto");
let infusiones = [];
const Jsonp = '../assets/data/producto.json';

async function cargarProductos() {
    try {
        const respuesta = await fetch(Jsonp);
        infusiones = await respuesta.json();
        llenarSelect();
    } catch (error) {
        console.error("error cargando json");
    };
}

function llenarSelect() {
    infusiones.forEach(infusion => {
        const opcion = document.createElement("option");
        opcion.value = infusion.id;
        opcion.textContent = infusion.title;
        productosSelect.appendChild(opcion);
    })
}

productosSelect.addEventListener("change", (evento) => {
    const productoEncontrado = infusiones.find(infusion => infusion.id == evento.target.value);
    if (productoEncontrado) {
        presupuestoInput.value = `${productoEncontrado.price}`
    } else {
        presupuestoInput.value = "";
    }
});
cargarProductos();

const form = document.getElementById("form-presupuesto");
const vletras = /^[A-Za-zÁÉÍÓÚÜÑáéíóúüñ\s]+$/;
const vtel = /^[0-9]{9}$/;
const vemail = /^[_a-z0-9-]+(.[_a-z0-9-]+)*@[_a-z0-9]+(.[_a-z0-9-]+)*(.[a-z]){2,3}$/;

form.addEventListener("submit", function (event) {
    event.preventDefault();
    //variables de datos
    const nomb = document.getElementById("nombre").value;
    const apell = document.getElementById("apellido").value;
    const tel = document.getElementById("telefono").value;
    const email = document.getElementById("email").value;

    //validaciones de datos

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
