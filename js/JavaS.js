//añadir json al local storage
const noticiasSection = document.querySelector('#noticias');
fetch('./js/noticias.json')
    .then(res => res.json())
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
    });
// Navegación fija al hacer scroll
$(window).on("scroll", function () {
    if ($(window).scrollTop() > 140) {
        $('#nav-bar').addClass('fixed-nav');
    } else {
        $('#nav-bar').removeClass('fixed-nav');
    }
});
//mantener activo un enlace del menú
$('#nav-bar a').on('click', function () {
    $('#nav-bar a').removeClass('active');
    $(this).addClass('active');
});