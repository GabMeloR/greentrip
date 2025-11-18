const trilhas = {
  jupia: {
    nome: "Cachoeira Salto do Rio Feliciano",
    distancia: "Trilha de 400 m",
    descricao: "Cachoeira localizada na área rural de Jupiá, o local é privado porém com acesso livre para visitação. Possui uma queda d'água de aproximadamente 5 metros de altura, formando uma piscina natural ideal para banho e lazer. A trilha até a cachoeira é média e de fácil acesso, tornando-se uma ótima opção para famílias e visitantes que buscam contato com a natureza.",
    localizacao: "Jupiá - SC",
    imagem: "image/cachjupia.jpg",
    galeria: [
      "image/cachjupia.jpg",
      "image/cachjupia2.jpg",
      "image/cachjupia3.jpg"
    ],
    mapa: '<iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d24678.885176455027!2d-52.8004566256836!3d-26.410137999999996!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x94fab5bd41969463%3A0xca9fef64af5266f1!2sCachoeira%20Salto%20do%20Rio%20Feliciano!5e1!3m2!1spt-BR!2sbr!4v1763219282934!5m2!1spt-BR!2sbr" width="600" height="450" style="border:0;" allowfullscreen="" loading="lazy" referrerpolicy="no-referrer-when-downgrade"></iframe>'
  },
  
  aborigene: {
    nome: "Sítio Aborígene",
    distancia: "Acesso a duas cachoeiras, trilha de 300 e 400 m",
    descricao: "Trilhas bem demarcadas e limpas facilitando o acesso as cachoeiras. É necessário agendar a visitação com antecedência. O sítio oferece atividades de agricultura regenerativa, ecoturismo, hospedagem, agrofloresta, apicultura, meliponicultura e fungicultura.",
    localizacao: "São Lourenço do Oeste - SC",
    imagem: "image/aborigene.jpg",
    galeria: [
      "image/aborigene.jpg",
      "image/aborigene2.jpg",
      "image/aborigene3.jpg"
    ],
    mapa: `<iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3086.085792473537!2d-52.81359572457944!3d-26.364281976978315!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x94fab1bafc759d35%3A0xf83ea03dae59dcb7!2sSitio%20Aborigene%20-%20Agricultura%20Regenerativa%20Ecoturismo%20Hospedagem%20Agrofloresta%20Apicultura%20Meliponicultura%20Fungicultura!5e1!3m2!1spt-BR!2sbr!4v1763306050199!5m2!1spt-BR!2sbr" width="600" height="450" style="border:0;" allowfullscreen="" loading="lazy" referrerpolicy="no-referrer-when-downgrade"></iframe>`
  },

  tresvoltas: {
    nome: "Cachoeira do Bicaré",
    distancia: "Trilha de 100 m",
    descricao: "Cachoeira de fácil acesso, com piscina natural e ótima para banho.",
    localizacao: "Saudades - SC",
    imagem: "image/tresvoltas.jpg",
    mapa: `<iframe src="https://www.google.com/maps/embed?..."></iframe>`
  },

  
};

// Carregar trilhas criadas por usuários e unir com trilhas fixas
function obterTodasAsTrilhas() {
  const fixas = trilhas; // trilhas.js original
  const publicadas = JSON.parse(localStorage.getItem("trilhasPublicadas")) || [];

  let dinamicas = {};

  publicadas.forEach(t => {
    dinamicas[t.id] = {
      nome: t.nome,
      distancia: t.distancia,
      descricao: t.descricao,
      localizacao: t.localizacao,
      imagem: t.imagem,
      galeria: t.galeria,
      latitude: t.latitude,
      longitude: t.longitude
    };
  });

  return { ...fixas, ...dinamicas };
}
// =====================================================