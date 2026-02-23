const productosSelect = document.getElementById("productos");
const presupuestoInput = document.getElementById("presupuesto");
const plazoInput = document.getElementById("plazo");
const mensajeFormulario = document.getElementById("mensajeFormulario");
const form = document.getElementById("form-presupuesto");

const packCheckbox = document.getElementById("pack");
const cardCheckbox = document.getElementById("card");
const deliveryCheckbox = document.getElementById("delivery");

const PRECIO_PACK = 5;
const PRECIO_CARD = 3;
const PRECIO_DELIVERY = 15;

const patronNombre = /^[A-Za-zÁÉÍÓÚÜÑáéíóúüñ]+(?:\s+[A-Za-zÁÉÍÓÚÜÑáéíóúüñ]+)*$/;
const patronTelefono = /^[0-9]{9}$/;
const patronEmail = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

const rutaJsonProductos = "../assets/data/producto.json";

let infusiones = [];
let precioBase = 0;

function activarEnlaceActual() {
    const active = document.getElementById("act");
    if (active) {
        active.style.textDecoration = "underline #999966";
    }
}

function activarNavFija() {
    const nav = document.getElementById("nav-bar");
    if (!nav) {
        return;
    }

    const actualizarNav = () => {
        if (window.scrollY > 130) {
            nav.classList.add("fixed-nav");
        } else {
            nav.classList.remove("fixed-nav");
        }
    };

    window.addEventListener("scroll", actualizarNav);
    actualizarNav();
}

function mostrarMensaje(texto, tipo) {
    if (!mensajeFormulario) {
        return;
    }

    mensajeFormulario.textContent = texto;
    mensajeFormulario.classList.remove("error", "ok");
    if (tipo) {
        mensajeFormulario.classList.add(tipo);
    }
}

function limpiarMensaje() {
    if (!mensajeFormulario) {
        return;
    }

    mensajeFormulario.textContent = "";
    mensajeFormulario.classList.remove("error", "ok");
}

function llenarSelect() {
    infusiones.forEach((infusion) => {
        const opcion = document.createElement("option");
        opcion.value = infusion.id;
        opcion.textContent = infusion.title;
        productosSelect.appendChild(opcion);
    });
}

async function cargarProductos() {
    try {
        const respuesta = await fetch(rutaJsonProductos);
        if (!respuesta.ok) {
            throw new Error("No se pudo cargar el catálogo de productos.");
        }

        infusiones = await respuesta.json();
        llenarSelect();
    } catch {
        mostrarMensaje("No se pudo cargar el catálogo de productos. Inténtalo de nuevo.", "error");
    }
}

function calcularPrecio() {
    let precioFinal = precioBase;
    const meses = Number.parseInt(plazoInput.value, 10);

    if (meses >= 12) {
        precioFinal *= 0.9;
    } else if (meses >= 6) {
        precioFinal *= 0.95;
    } else if (meses >= 2) {
        precioFinal *= 0.98;
    }

    if (packCheckbox.checked) {
        precioFinal += PRECIO_PACK;
    }

    if (cardCheckbox.checked) {
        precioFinal += PRECIO_CARD;
    }

    if (deliveryCheckbox.checked) {
        precioFinal += PRECIO_DELIVERY;
    }

    presupuestoInput.value = `${precioFinal.toFixed(2)} €`;
}

function validarCampoTexto(valor, etiquetaCampo) {
    const limpio = valor.trim();

    if (!limpio) {
        return `${etiquetaCampo} es obligatorio y no puede contener solo espacios.`;
    }

    if (!patronNombre.test(limpio)) {
        return `${etiquetaCampo} solo puede incluir letras y espacios entre palabras.`;
    }

    return "";
}

function validarFormulario(event) {
    event.preventDefault();
    limpiarMensaje();

    const nombreInput = document.getElementById("nombre");
    const apellidoInput = document.getElementById("apellido");
    const telefonoInput = document.getElementById("telefono");
    const emailInput = document.getElementById("email");
    const condicionesCheckbox = document.getElementById("condiciones");

    const nombre = nombreInput.value;
    const apellido = apellidoInput.value;
    const telefono = telefonoInput.value.trim();
    const email = emailInput.value.trim();

    const errorNombre = validarCampoTexto(nombre, "El nombre");
    if (errorNombre) {
        mostrarMensaje(errorNombre, "error");
        nombreInput.focus();
        return;
    }

    const errorApellido = validarCampoTexto(apellido, "Los apellidos");
    if (errorApellido) {
        mostrarMensaje(errorApellido, "error");
        apellidoInput.focus();
        return;
    }

    if (/[A-Za-zÁÉÍÓÚÜÑáéíóúüñ]/.test(telefono)) {
        mostrarMensaje("El teléfono no puede contener letras, solo números.", "error");
        telefonoInput.focus();
        return;
    }

    if (!patronTelefono.test(telefono)) {
        mostrarMensaje("El teléfono debe contener exactamente 9 dígitos numéricos.", "error");
        telefonoInput.focus();
        return;
    }

    if (!patronEmail.test(email)) {
        mostrarMensaje("El correo electrónico no tiene un formato válido.", "error");
        emailInput.focus();
        return;
    }

    if (!productosSelect.value) {
        mostrarMensaje("Debes seleccionar una infusión para calcular y enviar el presupuesto.", "error");
        productosSelect.focus();
        return;
    }

    if (!condicionesCheckbox.checked) {
        mostrarMensaje("Debes aceptar las condiciones legales y de privacidad para continuar.", "error");
        condicionesCheckbox.focus();
        return;
    }

    form.submit();
}

function registrarEventos() {
    productosSelect.addEventListener("change", (event) => {
        const productoEncontrado = infusiones.find((infusion) => infusion.id === event.target.value);

        if (productoEncontrado) {
            precioBase = Number.parseFloat(productoEncontrado.price);
            calcularPrecio();
        } else {
            precioBase = 0;
            presupuestoInput.value = "";
        }
    });

    [packCheckbox, cardCheckbox, deliveryCheckbox].forEach((checkbox) => {
        checkbox.addEventListener("change", () => {
            if (precioBase > 0) {
                calcularPrecio();
            }
        });
    });

    plazoInput.addEventListener("input", () => {
        if (precioBase > 0) {
            calcularPrecio();
        }
    });

    form.addEventListener("submit", validarFormulario);

    form.addEventListener("reset", () => {
        precioBase = 0;
        limpiarMensaje();
    });
}

document.addEventListener("DOMContentLoaded", () => {
    activarEnlaceActual();
    activarNavFija();
    cargarProductos();
    registrarEventos();
});
