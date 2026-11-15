const API_URL = "https://rickandmortyapi.com/api/character";

const characterGrid = document.getElementById("character-grid");
const feedback = document.getElementById("feedback");
const totalCount = document.getElementById("total-count");
const searchInput = document.getElementById("search-input");
const statusFilter = document.getElementById("status-filter");
const favoritesToggle = document.getElementById("favorites-toggle");
const prevButton = document.getElementById("prev-button");
const nextButton = document.getElementById("next-button");
const pageLabel = document.getElementById("page-label");

let currentPage = 1;
let characters = [];
let nextPageUrl = null;
let previousPageUrl = null;
let showingFavorites = false;
let favorites = JSON.parse(localStorage.getItem("rickFavorites")) || [];

function translateStatus(status) {
  const translations = { Alive: "Vivo", Dead: "Morto", unknown: "Desconhecido" };
  return translations[status] || status;
}

function createCharacterCard(character) {
  // Cada card é montado com createElement: nenhum card fica escrito no HTML.
  const card = document.createElement("article");
  card.classList.add("character-card");

  const imageWrap = document.createElement("div");
  imageWrap.classList.add("card-image-wrap");

  const image = document.createElement("img");
  image.classList.add("card-image");
  image.src = character.image;
  image.alt = `Imagem de ${character.name}`;
  image.loading = "lazy";

  const status = document.createElement("span");
  status.classList.add("status");
  if (character.status === "Alive") status.classList.add("alive");
  if (character.status === "Dead") status.classList.add("dead");

  const statusDot = document.createElement("i");
  statusDot.classList.add("status-dot");
  status.append(statusDot, document.createTextNode(translateStatus(character.status)));

  const favoriteButton = document.createElement("button");
  favoriteButton.classList.add("favorite-button");
  favoriteButton.type = "button";
  favoriteButton.textContent = favorites.includes(character.id) ? "♥" : "♡";
  favoriteButton.classList.toggle("is-favorite", favorites.includes(character.id));
  favoriteButton.setAttribute("aria-label", `Favoritar ${character.name}`);
  favoriteButton.addEventListener("click", () => toggleFavorite(character.id));

  imageWrap.append(image, status, favoriteButton);

  const content = document.createElement("div");
  content.classList.add("card-content");

  const name = document.createElement("h3");
  name.textContent = character.name;

  const info = document.createElement("div");
  info.classList.add("card-info");

  const details = [
    ["Espécie", character.species],
    ["Gênero", character.gender],
    ["Origem", character.origin.name],
    ["Localização", character.location.name]
  ];

  details.forEach(([label, value]) => {
    const row = document.createElement("div");
    row.classList.add("info-row");
    const labelElement = document.createElement("span");
    const valueElement = document.createElement("span");
    labelElement.textContent = label;
    valueElement.textContent = value;
    row.append(labelElement, valueElement);
    info.appendChild(row);
  });

  content.append(name, info);
  card.append(imageWrap, content);
  return card;
}

function renderCharacters(list) {
  characterGrid.innerHTML = "";
  const filteredList = list.filter((character) => {
    const matchesName = character.name.toLowerCase().includes(searchInput.value.toLowerCase());
    const matchesStatus = !statusFilter.value || character.status === statusFilter.value;
    const matchesFavorite = !showingFavorites || favorites.includes(character.id);
    return matchesName && matchesStatus && matchesFavorite;
  });

  totalCount.textContent = filteredList.length;
  if (filteredList.length === 0) {
    feedback.textContent = showingFavorites
      ? "Você ainda não favoritou personagens desta página."
      : "Nenhum personagem encontrado com esses filtros.";
    return;
  }

  feedback.textContent = showingFavorites ? "Exibindo seus favoritos desta página." : "Personagens recebidos com sucesso da API.";
  filteredList.forEach((character) => {
    const card = createCharacterCard(character);
    // appendChild adiciona o card criado ao elemento que funciona como grade.
    characterGrid.appendChild(card);
  });
}

function toggleFavorite(id) {
  if (favorites.includes(id)) {
    favorites = favorites.filter((favoriteId) => favoriteId !== id);
  } else {
    favorites.push(id);
  }
  localStorage.setItem("rickFavorites", JSON.stringify(favorites));
  renderCharacters(characters);
}

async function loadCharacters(page = 1) {
  feedback.textContent = "Conectando ao multiverso...";
  characterGrid.innerHTML = "";
  try {
    const response = await fetch(`${API_URL}?page=${page}`);
    if (!response.ok) {
      throw new Error(`Erro HTTP: ${response.status}`);
    }
    const data = await response.json();
    characters = data.results;
    nextPageUrl = data.info.next;
    previousPageUrl = data.info.prev;
    currentPage = page;

    pageLabel.textContent = `Página ${currentPage} de ${data.info.pages}`;
    prevButton.disabled = !previousPageUrl;
    nextButton.disabled = !nextPageUrl;
    renderCharacters(characters);
    console.log("Dados recebidos da API:", data);
  } catch (error) {
    feedback.textContent = "Não foi possível carregar os personagens. Verifique sua conexão e tente novamente.";
    console.error("Falha ao consultar a API:", error);
  }
}

searchInput.addEventListener("input", () => renderCharacters(characters));
statusFilter.addEventListener("change", () => renderCharacters(characters));
favoritesToggle.addEventListener("click", () => {
  showingFavorites = !showingFavorites;
  favoritesToggle.classList.toggle("active", showingFavorites);
  favoritesToggle.setAttribute("aria-pressed", String(showingFavorites));
  favoritesToggle.textContent = showingFavorites ? "♥ Ver todos" : "♡ Favoritos";
  renderCharacters(characters);
});
prevButton.addEventListener("click", () => {
  if (previousPageUrl) loadCharacters(currentPage - 1);
});
nextButton.addEventListener("click", () => {
  if (nextPageUrl) loadCharacters(currentPage + 1);
});

loadCharacters();
