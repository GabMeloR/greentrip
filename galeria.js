// ===========================================
// CONTROLE DE SESSÃO
// ===========================================
let usuarioAtual = JSON.parse(localStorage.getItem("usuario")) || null;

// ===========================================
// CARREGAR TODAS AS TRILHAS NO INDEX
// ===========================================

function carregarTodasTrilhas() {
  const container = document.getElementById("lista-trilhas");
  if (!container) return;

  container.innerHTML = "";

  // 1. TRILHAS OFICIAIS
  if (typeof trilhas !== "undefined") {
    for (const id in trilhas) {
      const t = trilhas[id];
      container.appendChild(criarCard(id, t));
    }
  }

  // 2. TRILHAS PUBLICADAS PELO USUÁRIO
  const publicacoes = JSON.parse(localStorage.getItem("publicacoes")) || [];

  publicacoes.forEach(pub => {
    const id = "pub_" + pub.id;
    container.appendChild(criarCard(id, pub));
  });
}

// ===========================================
// CRIAR CARD NO PADRÃO GREEN TRIP
// ===========================================

function criarCard(id, trilha) {
  const card = document.createElement("article");
  card.classList.add("trail-card");
  card.dataset.id = id;

  card.innerHTML = `
    <div class="thumb" style="background-image: url('${trilha.imagem}')"></div>

    <div class="card-body">
      <h3 class="title">${trilha.nome}</h3>
      <p class="meta">${trilha.distancia}</p>

      <div class="tags">
        <span class="tag">${trilha.localizacao}</span>
      </div>

      <div class="card-footer">
        <div class="rating">
          ⭐ <span class="media-valor">–</span>
          <span class="qtd-avaliacoes">(0)</span>
        </div>

        <a class="btn ghost" href="trilha.html?id=${id}">
          Ver detalhes
        </a>
      </div>
    </div>
  `;

  return card;
}

// ===========================================
// GALERIA PARA PÁGINAS trilha.html
// ===========================================

let images = [];
let currentIndex = 0;

function openGallery() {
  if (!images.length) return;
  document.getElementById("galleryModal").style.display = "flex";
  document.getElementById("galleryImage").src = images[currentIndex];
}

function closeGallery() {
  document.getElementById("galleryModal").style.display = "none";
}

function changeImage(dir) {
  currentIndex = (currentIndex + dir + images.length) % images.length;
  document.getElementById("galleryImage").src = images[currentIndex];
}

// ===========================================
// INICIALIZAR A HOME E AS GALERIAS
// ===========================================

document.addEventListener("DOMContentLoaded", () => {
  // Carregar trilhas no index
  carregarTodasTrilhas();

  // Carregar avaliações
  if (typeof carregarMediasIndex === "function") {
    carregarMediasIndex();
  }

  // Carregar imagens da trilha quando estiver em trilha.html
  const params = new URLSearchParams(window.location.search);
  const id = params.get("id");

  if (id) {
    const publicacoes = JSON.parse(localStorage.getItem("publicacoes")) || [];
    let trilha = trilhas[id] || publicacoes.find(t => "pub_" + t.id === id);

    if (trilha && trilha.galeria) {
      images = trilha.galeria;
      currentIndex = 0;
    }
  }
});
