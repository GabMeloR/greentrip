
// Controle de sessão local
let usuarioAtual = JSON.parse(localStorage.getItem("usuario")) || null;
let comentarios = JSON.parse(localStorage.getItem("comentarios")) || [];

// GALERIA DINÂMICA POR TRILHA

let images = [];
let currentIndex = 0;

function debug(msg, data) {
  try { console.log(`[GALERIA] ${msg}`, data ?? ""); } catch(e){}
}

document.addEventListener("DOMContentLoaded", () => {
  const params = new URLSearchParams(window.location.search);
  const id = params.get("id");
  debug("URL id =", id);

  const thumb = document.querySelector(".thumb");
  if (!thumb) {
    debug("Elemento .thumb não encontrado na página.");
  }

  // Verifica trilhas.js
  if (!id) {
    debug("Nenhum ?id= na URL. Galeria só carrega em trilha.html com ?id=...");
    tentarUsarThumbComoImagem();
    return;
  }
  if (typeof trilhas === "undefined") {
    debug("Objeto 'trilhas' indisponível. Verifique a ORDEM dos scripts (trilhas.js antes de galeria.js).");
    tentarUsarThumbComoImagem();
    return;
  }
  if (!trilhas[id]) {
    debug(`Trilha '${id}' não encontrada em trilhas.js.`);
    tentarUsarThumbComoImagem();
    return;
  }

  // Carrega as imagens a partir de trilhas.js
  images = Array.isArray(trilhas[id].galeria) ? trilhas[id].galeria.slice() : [];
  debug("Imagens carregadas da trilha:", images);

  // Fallback: se não houver galeria no trilhas.js, tenta pegar o background da thumb
  if ((!images || images.length === 0) && thumb) {
    const bg = getComputedStyle(thumb).backgroundImage; // url("...") ou none
    const match = /url\(["']?(.*?)["']?\)/.exec(bg || "");
    if (match && match[1]) {
      images = [match[1]];
      debug("Fallback: usando imagem da thumb como galeria.", images);
    }
  }

  // Ajusta a capa para a primeira imagem
  if (thumb && images.length) {
    thumb.style.backgroundImage = `url('${images[0]}')`;
  }
});

function tentarUsarThumbComoImagem() {
  const thumb = document.querySelector(".thumb");
  if (!thumb) return;
  const bg = getComputedStyle(thumb).backgroundImage;
  const match = /url\(["']?(.*?)["']?\)/.exec(bg || "");
  if (match && match[1]) {
    images = [match[1]];
    debug("Sem trilhas/galeria: usando somente a imagem da thumb.", images);
  }
}

function openGallery() {
  debug("Abrindo galeria", { images, currentIndex });
  if (!images || images.length === 0) {
    alert("Nenhuma imagem disponível para esta trilha.");
    return;
  }
  const modal = document.getElementById("galleryModal");
  const img = document.getElementById("galleryImage");
  if (!modal || !img) {
    debug("Modal ou #galleryImage não encontrados no DOM.");
    return;
  }
  modal.style.display = "flex";
  img.src = images[currentIndex];
}

function closeGallery() {
  const modal = document.getElementById("galleryModal");
  if (modal) modal.style.display = "none";
}

function changeImage(direction) {
  if (!images || images.length === 0) return;
  currentIndex = (currentIndex + direction + images.length) % images.length;
  const img = document.getElementById("galleryImage");
  if (img) img.src = images[currentIndex];
  debug("Troca de imagem", { currentIndex, src: images[currentIndex] });
}

// COMENTÁRIOS

function renderComentarios() {
  const lista = document.getElementById("comentarios-lista");
  if (!lista) return;

  lista.innerHTML = "";

  if (comentarios.length === 0) {
    lista.innerHTML = `<p class="no-comments">Nenhum comentário ainda. Seja o primeiro!</p>`;
    return;
  }

  comentarios.forEach((comentario) => {
    const div = document.createElement("div");
    div.classList.add("comentario");
    div.innerHTML = `
      <strong>${comentario.usuario}</strong>
      <p>${comentario.texto}</p>
      <small>🕒 ${comentario.hora}</small>
    `;
    lista.prepend(div);
  });
}

function exibirAreaComentarios() {
  const area = document.getElementById("comment-area");
  if (!area) return;

  if (usuarioAtual) {
    area.innerHTML = `
      <form class="comment-form" onsubmit="enviarComentario(event)">
        <textarea id="comentario" placeholder="Escreva seu comentário..." required></textarea>
        <button type="submit" class="btn primary">Enviar</button>
      </form>
    `;
  } else {
    area.innerHTML = `
      <p style="text-align:center; color:#555;">
        Você precisa <a href="login.html" style="color:var(--accent); font-weight:500;">fazer login</a> para comentar.
      </p>
    `;
  }
}

function enviarComentario(event) {
  event.preventDefault();
  const textarea = document.getElementById("comentario");
  const texto = textarea.value.trim();
  if (!texto) return;

  const novoComentario = {
    usuario: usuarioAtual.nome,
    texto,
    hora: new Date().toLocaleString("pt-BR", {
      hour: "2-digit",
      minute: "2-digit"
    }),
  };

  comentarios.push(novoComentario);
  localStorage.setItem("comentarios", JSON.stringify(comentarios));
  textarea.value = "";
  renderComentarios();
}

// AVALIAÇÕES DE USUÁRIOS (para páginas de trilhas)
// 


function configurarAvaliacao() {
  const starContainers = document.querySelectorAll(".stars");
  if (!starContainers.length) return;

  const avaliacoes = JSON.parse(localStorage.getItem("avaliacoes")) || {};

  starContainers.forEach(container => {
    const trilhaId = container.dataset.id;
    const stars = container.querySelectorAll("i");
    const mediaSpan = document.querySelector("#media-avaliacao span");

    atualizarMedia(trilhaId, mediaSpan);

    stars.forEach(star => {
      star.addEventListener("mouseover", () => {
        stars.forEach(s => s.classList.remove("hovered"));
        for (let i = 0; i < star.dataset.value; i++) {
          stars[i].classList.add("hovered");
        }
      });

      star.addEventListener("mouseleave", () => {
        stars.forEach(s => s.classList.remove("hovered"));
      });

      star.addEventListener("click", () => {
        if (!usuarioAtual) {
          alert("Faça login para avaliar!");
          return;
        }

        const nota = Number(star.dataset.value);
        if (!avaliacoes[trilhaId]) avaliacoes[trilhaId] = [];

        const jaAvaliou = avaliacoes[trilhaId].find(a => a.usuario === usuarioAtual.email);
        if (jaAvaliou) {
          jaAvaliou.nota = nota;
        } else {
          avaliacoes[trilhaId].push({ usuario: usuarioAtual.email, nota });
        }

        localStorage.setItem("avaliacoes", JSON.stringify(avaliacoes));
        atualizarMedia(trilhaId, mediaSpan);
        alert(`Obrigado pela sua avaliação de ${nota} estrelas!`);
      });
    });
  });
}

function atualizarMedia(trilhaId, mediaSpan) {
  const avaliacoes = JSON.parse(localStorage.getItem("avaliacoes")) || {};
  const lista = avaliacoes[trilhaId] || [];

  if (!mediaSpan) return;
  if (lista.length === 0) {
    mediaSpan.textContent = "–";
    return;
  }

  const media = lista.reduce((acc, a) => acc + a.nota, 0) / lista.length;
  mediaSpan.textContent = media.toFixed(1);
}

// EXIBIR MÉDIAS E QUANTIDADES NA PÁGINA INICIAL


function carregarMediasIndex() {
  const avaliacoes = JSON.parse(localStorage.getItem("avaliacoes")) || {};
  const cards = document.querySelectorAll(".trail-card");

  cards.forEach(card => {
    const id = card.dataset.id;
    const mediaSpan = card.querySelector(".media-valor");
    const qtdSpan = card.querySelector(".qtd-avaliacoes");

    if (!mediaSpan || !qtdSpan) return;

    if (!avaliacoes[id] || avaliacoes[id].length === 0) {
      mediaSpan.textContent = "–";
      qtdSpan.textContent = "(0)";
      return;
    }

    const lista = avaliacoes[id];
    const media = lista.reduce((acc, a) => acc + a.nota, 0) / lista.length;

    mediaSpan.textContent = media.toFixed(1);
    qtdSpan.textContent = `(${lista.length})`;
  });

  const select = document.getElementById("sort");
  if (select) {
    select.addEventListener("change", () => {
      const container = document.querySelector(".trails-grid");
      const cardsArray = Array.from(cards);

      if (select.value === "Mais bem avaliadas") {
        cardsArray.sort((a, b) => {
          const idA = a.dataset.id;
          const idB = b.dataset.id;
          const mediaA = calcularMedia(avaliacoes[idA]);
          const mediaB = calcularMedia(avaliacoes[idB]);
          return mediaB - mediaA;
        });
      }

      container.innerHTML = "";
      cardsArray.forEach(c => container.appendChild(c));
    });
  }

  function calcularMedia(lista) {
    if (!lista || lista.length === 0) return 0;
    return lista.reduce((acc, a) => acc + a.nota, 0) / lista.length;
  }
}


// INICIALIZAÇÃO GERAL

document.addEventListener("DOMContentLoaded", () => {
  exibirAreaComentarios();
  renderComentarios();
  configurarAvaliacao();
  carregarMediasIndex();

  // Controle de login/logout
  // Controle de login/logout
const usuario = JSON.parse(localStorage.getItem("usuario"));

// pega os botões pelo texto que está escrito neles
const botoes = Array.from(document.querySelectorAll(".controls .btn.primary"));
const btnEntrar = botoes.find(btn => btn.textContent.trim() === "Entrar");
const btnInscrever = botoes.find(btn => btn.textContent.trim() === "Inscrever-se");

// agora o restante permanece igual…
if (btnEntrar && btnInscrever) {
  if (usuario) {
    btnEntrar.textContent = "Sair";
    btnInscrever.style.display = "none";

    btnEntrar.onclick = () => {
      if (confirm("Deseja sair da sua conta?")) {
        localStorage.removeItem("usuario");
        window.location.reload();
      }
    };
  } else {
    btnEntrar.onclick = () => {
      window.location.href = "login.html";
    };
  }
}

});
