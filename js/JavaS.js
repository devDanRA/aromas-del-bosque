//añadir json al local storage
const noticiasSection = document.querySelector('#noticias');
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
        noticiasSection.innerHTML += `<p>No se pudieron cargar las noticias. (${rutaJson})</p>`;
    });
}
// Navegación fija al hacer scroll
$(window).on("scroll", function () {
    if ($(window).scrollTop() > 130) {
        $('#nav-bar').addClass('fixed-nav');
    } else {
        $('#nav-bar').removeClass('fixed-nav');
    }
});
// Subrayar el enlace activo en el menú de navegación
window.onload = function () {
    document.getElementById("act").style.textDecoration = "underline #999966";
}
