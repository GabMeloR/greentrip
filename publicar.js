// Impedir acesso sem login
const usuario = JSON.parse(localStorage.getItem("usuario"));
if (!usuario) {
  alert("Você precisa estar logado para publicar uma trilha.");
  window.location.href = "login.html";
}

document.getElementById("imagem").addEventListener("change", function(e) {
  const file = e.target.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = () => {
    const preview = document.getElementById("preview");
    preview.src = reader.result;
    preview.style.display = "block";
  };
  reader.readAsDataURL(file);
});

document.getElementById("form-publicar").addEventListener("submit", function(e) {
  e.preventDefault();

  const nome = document.getElementById("nome").value.trim();
  const distancia = document.getElementById("distancia").value.trim();
  const descricao = document.getElementById("descricao").value.trim();
  const localizacao = document.getElementById("localizacao").value.trim();
  const mapa = document.getElementById("mapa").value.trim();

  const preview = document.getElementById("preview");

  // Galeria opcional
  const arquivosGaleria = document.getElementById("galeria").files;
  const galeria = [];

  if (arquivosGaleria.length > 0) {
    for (let file of arquivosGaleria) {
      const reader = new FileReader();
      reader.onload = (ev) => {
        galeria.push(ev.target.result);
        localStorage.setItem("galeriaTemp", JSON.stringify(galeria));
      };
      reader.readAsDataURL(file);
    }
  }

  // Trilha que será salva
  const trilha = {
    nome,
    distancia,
    descricao,
    localizacao,
    imagem: preview.src,  // salva a imagem principal em base64
    galeria: JSON.parse(localStorage.getItem("galeriaTemp")) || [],
    mapa,
    usuarioCriador: usuario.email,
    id: "pub-" + Date.now()  // ID único
  };

  // Salvar no localStorage
  const publicacoes = JSON.parse(localStorage.getItem("publicacoes")) || [];
  publicacoes.push(trilha);
  localStorage.setItem("publicacoes", JSON.stringify(publicacoes));
  localStorage.removeItem("galeriaTemp");

  alert("Trilha publicada com sucesso!");
  window.location.href = "index.html";
});
