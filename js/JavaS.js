// Carga dinámica de noticias en la home desde el JSON local.
const noticiasSection = document.querySelector('#noticias');
// Construye una URL absoluta a partir de la ubicación real del script.
// Esto evita errores de rutas al publicar en GitHub Pages.
const scriptSrc = document.currentScript ? document.currentScript.src : 'js/JavaS.js';
const rutaJson = new URL('../assets/data/noticias.json', scriptSrc).href;

if (noticiasSection) {
    fetch(rutaJson)
    .then(res => {
        if (!res.ok) {
            throw new Error(`No se pudo cargar noticias.json (${res.status})`);
        }
        return res.json();
    })
    .then(noticias => {
        noticias.forEach(post => {
            noticiasSection.innerHTML += `
                    <article class="noticia">
                        <h3>${post.titulo}</h3>
                        <p>${post.contenido}</p>
                        <span>Publicado el: ${post.fecha}</span>
                    </article>
                    `;
        });
    })
    .catch(error => {
        console.error(error);
        // Mensaje visible para depurar fallos de carga en producción.
        noticiasSection.innerHTML += `<p>No se pudieron cargar las noticias. (${rutaJson})</p>`;
    });
}
// Convierte el nav en fijo al superar cierto scroll vertical.
$(window).on("scroll", function () {
    if ($(window).scrollTop() > 130) {
        $('#nav-bar').addClass('fixed-nav');
    } else {
        $('#nav-bar').removeClass('fixed-nav');
    }
});
// Resalta la opción activa en el menú principal.
window.onload = function () {
    const active = document.getElementById("act");
    if (active) {
        active.style.textDecoration = "underline #999966";
    }
}
