// =====================================================
// painel.js — Minhas publicações | GreenTrip
// =====================================================

// Verifica login
document.addEventListener("DOMContentLoaded", () => {
  const usuario = JSON.parse(localStorage.getItem("usuario"));

  const lista = document.getElementById("lista-publicacoes");

  if (!usuario) {
    lista.innerHTML = `
      <p style="font-size:18px; color:#555; text-align:center; padding:40px;">
        Você precisa fazer login para ver suas publicações.<br><br>
        <a href="login.html" class="btn primary" style="padding:10px 20px;">Fazer login</a>
      </p>
    `;
    return;
  }

  carregarPublicacoes(usuario.email);
});

// =====================================================
// Carrega as trilhas criadas pelo usuário
// =====================================================

function carregarPublicacoes(emailUsuario) {
  const lista = document.getElementById("lista-publicacoes");

  // 🔥 ALTERAÇÃO AQUI — usamos 'publicacoes'
  const trilhas = JSON.parse(localStorage.getItem("publicacoes")) || [];

  // Filtra trilhas do usuário
  const minhas = trilhas.filter(t => t.usuarioCriador === emailUsuario);

  if (minhas.length === 0) {
    lista.innerHTML = `
      <p style="font-size:18px; color:#777; text-align:center; padding:40px;">
        Você ainda não publicou nenhuma trilha.<br><br>
        <a href="publicar.html" class="btn primary" style="padding:10px 20px;">Publicar agora</a>
      </p>
    `;
    return;
  }

  lista.innerHTML = ""; // limpa

  minhas.forEach(trilha => {
    const id = "pub_" + trilha.id;

    const card = document.createElement("article");
    card.classList.add("trail-card");

    card.innerHTML = `
      <div class="thumb" style="background-image: url('${trilha.imagem}')"></div>
      
      <div class="card-body">
        <h3 class="title">${trilha.nome}</h3>
        <p class="meta">${trilha.distancia}</p>

        <div class="tags">
          <span class="tag">Publicação</span>
        </div>

        <div class="card-footer">
          <a class="btn ghost" href="trilha.html?id=${id}">Ver detalhes</a>
          <button class="btn ghost" onclick="editarTrilha('${trilha.id}')">Editar</button>
          <button class="btn ghost" style="color:#c53030;border-color:#c53030;" 
            onclick="excluirTrilha('${trilha.id}')">
            Excluir
          </button>
        </div>
      </div>
    `;

    lista.appendChild(card);
  });
}

// =====================================================
// Excluir trilha
// =====================================================

function excluirTrilha(id) {
  if (!confirm("Tem certeza que deseja excluir esta publicação?")) return;

  let trilhas = JSON.parse(localStorage.getItem("publicacoes")) || [];

  trilhas = trilhas.filter(t => t.id !== id);

  localStorage.setItem("publicacoes", JSON.stringify(trilhas));

  alert("Publicação excluída com sucesso!");
  window.location.reload();
}

// =====================================================
// Editar trilha
// =====================================================

function editarTrilha(id) {
  window.location.href = `editar.html?id=${id}`;
}
