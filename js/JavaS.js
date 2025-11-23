//añadir json al local storage
const noticiasSection = document.querySelector('#noticias');
fetch('./js/noticias.json')
    .then(res => res.json())
    .then(noticias => {
        noticias.forEach(post => {
            noticiasSection.innerHTML += `
                    <article class="noticia">
                        <h2>${post.titulo}</h2>
                        <p>${post.contenido}</p>
                        <span>Publicado el: ${post.fecha}</span>
                    </article>
                    `;
        });
    });

