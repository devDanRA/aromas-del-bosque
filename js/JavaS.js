//añadir json al local storage
const noticiasSection = document.querySelector('#noticias');
const rutaJson = 'assets/noticias.json';
fetch(rutaJson)
    .then(res => res.json())
    .then(noticias => {
        console.log(noticias);

        noticias.forEach(post => {
            noticiasSection.innerHTML += `
                    <article class="noticia">
                        <h3>${post.titulo}</h3>
                        <p>${post.contenido}</p>
                        <span>Publicado el: ${post.fecha}</span>
                    </article>
                    `;
        });
    });
// Navegación fija al hacer scroll
$(window).on("scroll", function () {
    if ($(window).scrollTop() > 140) {
        $('#nav-bar').addClass('fixed-nav');
    } else {
        $('#nav-bar').removeClass('fixed-nav');
    }
});

