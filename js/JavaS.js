const noticiasSection = document.querySelector("#noticias");
const rutaJsonNoticias = "assets/data/noticias.json";

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

function renderNoticias(listaNoticias) {
    if (!noticiasSection) {
        return;
    }

    const fragmento = document.createDocumentFragment();

    listaNoticias.forEach((post) => {
        const articulo = document.createElement("article");
        articulo.className = "noticia";
        articulo.innerHTML = `
            <h3>${post.titulo}</h3>
            <p>${post.contenido}</p>
            <p class="noticia-fecha">Publicado el: ${post.fecha}</p>
        `;
        fragmento.appendChild(articulo);
    });

    noticiasSection.appendChild(fragmento);
}

async function cargarNoticias() {
    if (!noticiasSection) {
        return;
    }

    try {
        const respuesta = await fetch(rutaJsonNoticias);
        if (!respuesta.ok) {
            throw new Error("No se pudieron cargar las noticias.");
        }

        const noticias = await respuesta.json();
        renderNoticias(noticias);
    } catch {
        noticiasSection.innerHTML += "<p>No se pudieron cargar las noticias en este momento.</p>";
    }
}

document.addEventListener("DOMContentLoaded", () => {
    activarEnlaceActual();
    activarNavFija();
    cargarNoticias();
});
