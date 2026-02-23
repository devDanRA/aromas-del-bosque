const galery = document.getElementById("grid-galery");
const modal = document.getElementById("modal-galeria");
const modalImg = document.getElementById("modal-galeria-img");
const modalTitulo = document.getElementById("modal-galeria-titulo");
const modalPrecio = document.getElementById("modal-galeria-precio");
const cerrarModalBtn = document.getElementById("cerrar-modal");
const anteriorBtn = document.getElementById("modal-anterior");
const siguienteBtn = document.getElementById("modal-siguiente");

const rutaJsonProductos = "../assets/data/producto.json";

let productos = [];
let indiceActual = 0;

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

function actualizarModal() {
    const producto = productos[indiceActual];
    if (!producto) {
        return;
    }

    modalImg.src = producto.img;
    modalImg.alt = producto.title;
    modalTitulo.textContent = producto.title;
    modalPrecio.textContent = `${producto.price} €`;
}

function abrirModal(indice) {
    indiceActual = indice;
    actualizarModal();
    modal.classList.add("is-open");
    modal.setAttribute("aria-hidden", "false");
    document.body.classList.add("modal-open");
}

function cerrarModal() {
    modal.classList.remove("is-open");
    modal.setAttribute("aria-hidden", "true");
    document.body.classList.remove("modal-open");
}

function cambiarProducto(paso) {
    if (!productos.length) {
        return;
    }

    indiceActual = (indiceActual + paso + productos.length) % productos.length;
    actualizarModal();
}

function pintarGaleria() {
    const fragmento = document.createDocumentFragment();

    productos.forEach((producto, indice) => {
        const tarjeta = document.createElement("article");
        tarjeta.className = "card-galery";

        tarjeta.innerHTML = `
            <button class="card-open" type="button" data-index="${indice}" aria-label="Ver ${producto.title} ampliado">
                <div class="card-img">
                    <img src="${producto.img}" alt="${producto.title}" width="600" height="600" loading="lazy">
                </div>
            </button>
            <h2>${producto.title}</h2>
            <p>${producto.price} €</p>
        `;

        fragmento.appendChild(tarjeta);
    });

    galery.innerHTML = "";
    galery.appendChild(fragmento);
}

async function cargarProductos() {
    if (!galery) {
        return;
    }

    try {
        const respuesta = await fetch(rutaJsonProductos);
        if (!respuesta.ok) {
            throw new Error("No se pudo cargar la galería.");
        }

        productos = await respuesta.json();
        pintarGaleria();
    } catch {
        galery.innerHTML = "<p>No se pudo cargar la galería en este momento.</p>";
    }
}

function configurarEventos() {
    if (!galery || !modal) {
        return;
    }

    galery.addEventListener("click", (event) => {
        const trigger = event.target.closest(".card-open");
        if (!trigger) {
            return;
        }

        const indice = Number(trigger.dataset.index);
        if (!Number.isNaN(indice)) {
            abrirModal(indice);
        }
    });

    cerrarModalBtn.addEventListener("click", cerrarModal);
    anteriorBtn.addEventListener("click", () => cambiarProducto(-1));
    siguienteBtn.addEventListener("click", () => cambiarProducto(1));

    modal.addEventListener("click", (event) => {
        if (event.target === modal) {
            cerrarModal();
        }
    });

    document.addEventListener("keydown", (event) => {
        if (!modal.classList.contains("is-open")) {
            return;
        }

        if (event.key === "Escape") {
            cerrarModal();
        }

        if (event.key === "ArrowLeft") {
            cambiarProducto(-1);
        }

        if (event.key === "ArrowRight") {
            cambiarProducto(1);
        }
    });
}

document.addEventListener("DOMContentLoaded", () => {
    activarEnlaceActual();
    activarNavFija();
    configurarEventos();
    cargarProductos();
});
