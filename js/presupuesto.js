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
// referencias al DOM
const productosSelect = document.getElementById("productos");
const presupuestoInput = document.getElementById("presupuesto");
const plazoInput = document.getElementById("plazo");
const PRECIO_PACK = 5;
const PRECIO_CARD = 3;
const PRECIO_DELIVERY = 15;

const packCheckbox = document.getElementById("pack");
const cardCheckbox = document.getElementById("card");
const deliveryCheckbox = document.getElementById("delivery");

// datos
let infusiones = [];
let precioBase = 0;

const Jsonp = '../assets/data/producto.json';

// cargar productos
async function cargarProductos() {
    try {
        const respuesta = await fetch(Jsonp);
        infusiones = await respuesta.json();
        llenarSelect();
    } catch (error) {
        console.error("Error cargando el JSON", error);
    }
}

// llenar el select
function llenarSelect() {
    infusiones.forEach(infusion => {
        const opcion = document.createElement("option");
        opcion.value = infusion.id;
        opcion.textContent = infusion.title;
        productosSelect.appendChild(opcion);
    });
}

// cuando cambia el producto
productosSelect.addEventListener("change", (evento) => {
    const productoEncontrado = infusiones.find(
        infusion => infusion.id == evento.target.value
    );

    if (productoEncontrado) {
        precioBase = parseFloat(productoEncontrado.price);
        calcularPrecio();
    } else {
        precioBase = 0;
        presupuestoInput.value = "";
    }
});

// calcular precio con descuento por meses
function calcularPrecio() {
    let precioFinal = precioBase;

    const meses = parseInt(plazoInput.value);

    // Descuentos por plazo
    if (meses >= 12) {
        precioFinal *= 0.90; // 10%
    } else if (meses >= 6) {
        precioFinal *= 0.95; // 5%
    } else if (meses >= 2) {
        precioFinal *= 0.98; // 2%
    }

    // Extras
    if (packCheckbox.checked) {
        precioFinal += PRECIO_PACK;
    }
    if (cardCheckbox.checked) {
        precioFinal += PRECIO_CARD;
    }
    if (deliveryCheckbox.checked) {
        precioFinal += PRECIO_DELIVERY;
    }

    presupuestoInput.value = precioFinal.toFixed(2) + " €";
}
packCheckbox.addEventListener("change", calcularPrecio);
cardCheckbox.addEventListener("change", calcularPrecio);
deliveryCheckbox.addEventListener("change", calcularPrecio);

// cuando cambian los meses
plazoInput.addEventListener("input", () => {
    if (precioBase > 0) {
        calcularPrecio();
    }
});

// arrancar
cargarProductos();
console.log(typeof precioBase, precioBase);

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
    const condicionesCheckbox = document.getElementById("condiciones");

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

    if (!condicionesCheckbox.checked) {
        alert("Debes aceptar las condiciones legales para continuar");
        return;
    }

    alert("Su solicitud ha sido enviada correctamente");
    form.submit();
}
);