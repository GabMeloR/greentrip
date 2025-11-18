// -------------------------------------------------------
// EDITAR PUBLICAÇÃO — GreenTrip (com edição de galeria)
// -------------------------------------------------------

document.addEventListener("DOMContentLoaded", () => {

  const params = new URLSearchParams(window.location.search);
  const id = params.get("id");

  if (!id) {
    alert("Publicação não encontrada.");
    window.location.href = "minhas-publicacoes.html";
    return;
  }

  // Lê as duas possíveis chaves do localStorage
  let trilhas =
    JSON.parse(localStorage.getItem("publicacoes")) ||
    JSON.parse(localStorage.getItem("trilhasPublicadas")) ||
    [];

  let trilha = trilhas.find(t => t.id === id);

  if (!trilha) {
    alert("Esta publicação não existe.");
    window.location.href = "minhas-publicacoes.html";
    return;
  }

  // Preencher campos
  document.getElementById("nome").value = trilha.nome;
  document.getElementById("distancia").value = trilha.distancia;
  document.getElementById("localizacao").value = trilha.localizacao;
  document.getElementById("descricao").value = trilha.descricao;
  document.getElementById("preview").src = trilha.imagem;

  // -------------------------------
  // EXIBIR GALERIA
  // -------------------------------
  const galeriaDiv = document.getElementById("galeria");

  function renderGaleria() {
    galeriaDiv.innerHTML = "";

    (trilha.galeria || []).forEach((img, index) => {
      const div = document.createElement("div");
      div.classList.add("galeria-item");

      div.innerHTML = `
        <img src="${img}">
        <button class="btn-remover-img" onclick="removerImagem(${index})">×</button>
      `;

      galeriaDiv.appendChild(div);
    });
  }

  window.removerImagem = (index) => {
    trilha.galeria.splice(index, 1);
    renderGaleria();
  };

  renderGaleria();


  // -------------------------------
  // TROCAR IMAGEM PRINCIPAL
  // -------------------------------
  document.getElementById("fileInput").addEventListener("change", (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      document.getElementById("preview").src = reader.result;
    };
    reader.readAsDataURL(file);
  });

  // -------------------------------
  // ADICIONAR IMAGENS NA GALERIA
  // -------------------------------
  document.getElementById("galeriaInput").addEventListener("change", (e) => {
    const files = Array.from(e.target.files);

    files.forEach(file => {
      const reader = new FileReader();
      reader.onload = () => {
        trilha.galeria.push(reader.result);
        renderGaleria();
      };
      reader.readAsDataURL(file);
    });
  });

  // -------------------------------
  // SALVAR ALTERAÇÕES
  // -------------------------------
  document.getElementById("form-editar").addEventListener("submit", (e) => {
    e.preventDefault();

    trilha.nome = document.getElementById("nome").value;
    trilha.distancia = document.getElementById("distancia").value;
    trilha.localizacao = document.getElementById("localizacao").value;
    trilha.descricao = document.getElementById("descricao").value;
    trilha.imagem = document.getElementById("preview").src;

    // salva em ambas as chaves
    localStorage.setItem("publicacoes", JSON.stringify(trilhas));
    localStorage.setItem("trilhasPublicadas", JSON.stringify(trilhas));

    alert("Publicação atualizada com sucesso!");
    window.location.href = "minhas-publicacoes.html";
  });

});
