document.addEventListener("DOMContentLoaded", () => {
  const usuario = JSON.parse(localStorage.getItem("usuario"));
  const lista = document.getElementById("lista-publicacoes");

  if (!usuario) {
    lista.innerHTML = `
      <p style="color:#444; font-size:18px;">
        Você precisa <a href="login.html" style="color:var(--accent)">fazer login</a> para ver suas publicações.
      </p>`;
    return;
  }

  const todasPublicacoes = JSON.parse(localStorage.getItem("publicacoes")) || [];

  // filtrar só as publicações do usuário
  const minhas = todasPublicacoes.filter(pub => pub.usuarioCriador === usuario.email);

  if (minhas.length === 0) {
    lista.innerHTML = `<p style="color:#555;">Você ainda não publicou nenhuma trilha.</p>`;
    return;
  }

  // montar os cards
  minhas.forEach(pub => {
    const id = "pub_" + pub.id;

    const card = document.createElement("article");
    card.classList.add("trail-card");
    card.dataset.id = id;

    card.innerHTML = `
      <div class="thumb" style="background-image:url('${pub.imagem}')"></div>

      <div class="card-body">
        <h3 class="title">${pub.nome}</h3>
        <p class="meta">${pub.distancia}</p>

        <div class="tags">
          <span class="tag">${pub.localizacao}</span>
        </div>

        <div class="card-footer">
          <a class="btn ghost" href="trilha.html?id=${id}">Ver detalhes</a>
          <button class="btn ghost" onclick="editarPublicacao('${pub.id}')">Editar</button>
          <button class="btn ghost" onclick="excluirPublicacao('${pub.id}')">Excluir</button>
        </div>
      </div>
    `;

    lista.appendChild(card);
  });
});
