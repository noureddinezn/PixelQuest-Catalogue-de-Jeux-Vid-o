const API_URL = 'https://debuggers-games-api.duckdns.org/api/games';
let allGames = [];
const favs = JSON.parse(localStorage.getItem('favorites')) || [];

const containerf = document.getElementById('favorites-container');
const noFav = document.getElementById('no-favorites');

const container = document.getElementById('games-container');
const genreSelect = document.getElementById('genre-filter');
const searchInput = document.getElementById('search-input');

const slideImage = document.getElementById('slide-image');
const slideName = document.getElementById('slide-nom');
const slideDesc = document.getElementById('slide-desc');
const slideOpen = document.getElementById('slide-open');

const modal = document.getElementById('game-modal');
const modalImage = document.getElementById('modal-image');
const modalTitle = document.getElementById('modal-title');
const modalDescription = document.getElementById('modal-description');
const modalGenres = document.getElementById('modal-genres');
const closeModal = document.getElementById('close-modal');
const addFavorite = document.getElementById('add-favorite');
const openLink = document.getElementById('open-link');

let currentGame = null;

async function fetchGames() {
  try {
    const res = await fetch(API_URL);
    const data = await res.json();

    allGames = data.results || [];

    displaySlide(allGames);
    displayGames(allGames);
    populateGenres(allGames);

  } catch (err) {
    container.innerHTML = `<p class="text-center text-red-400 col-span-full">Erreur de chargement</p>`;
  }
}

function displaySlide(games) {
  if (!games.length) return;

  const g = games[Math.floor(Math.random() * games.length)];

  slideImage.src = g.background_image;
  slideName.textContent = g.name;
  slideDesc.textContent = g.description?.slice(0, 150) || "Aucune description";
  slideOpen.onclick = () => openModal(g);
}

function populateGenres(games) {
  const set = new Set();
  games.forEach(g => (g.genres || []).forEach(x => set.add(x.name)));

  set.forEach(name => {
    const opt = document.createElement('option');
    opt.value = name;
    opt.textContent = name;
    genreSelect.appendChild(opt);
  });
}

function displayGames(list) {
  container.innerHTML = '';

  list.forEach(g => {
    const div = document.createElement('div');
    div.className = "bg-[#111830] rounded-lg overflow-hidden shadow hover:scale-105 transition";

    div.innerHTML = `
      <img src="${g.background_image}" class="w-full h-40 object-cover">
      <div class="p-3">
        <h3 class="font-semibold text-blue-300 mb-1">${g.name}</h3>
        <p class="text-sm text-gray-300 mb-3">${g.description?.slice(0, 80) || ''}</p>
        <div class="flex justify-between">
          <button class="details px-3 py-1 bg-white/10 rounded hover:bg-white/20">Détails</button>
          <button class="fav px-3 py-1 bg-gradient-to-r from-blue-600 to-violet-600 rounded">❤</button>
        </div>
      </div>
    `;

    div.querySelector('.details').onclick = () => openModal(g);
    div.querySelector('.fav').onclick = () => addToFavorites(g);

    container.appendChild(div);
  });
}

function filterGames() {
  const genre = genreSelect.value;
  const q = searchInput.value.toLowerCase();

  const filtered = allGames.filter(g => {
    const okGenre = !genre || (g.genres || []).some(x => x.name === genre);
    const okSearch = g.name.toLowerCase().includes(q);
    return okGenre && okSearch;
  });

  displayGames(filtered);
}

function openModal(g) {
  currentGame = g;

  modalImage.src = g.background_image;
  modalTitle.textContent = g.name;
  modalGenres.textContent = (g.genres || []).map(x => x.name).join(', ');
  modalDescription.textContent = g.description || "Aucune description";
  openLink.href = g.website || "#";

  modal.classList.remove('hidden');
}

closeModal.onclick = () => modal.classList.add('hidden');

function addToFavorites(g) {
  if (!favs.some(f => f.id === g.id)) {
    favs.push(g);
    localStorage.setItem('favorites', JSON.stringify(favs));
    alert(`${g.name} ajouté aux favoris`);
  } else {
    alert(`${g.name} est déjà favori`);
  }
}


function displayFavorites() {
  if (!containerf) return;

  if (!favs.length) {
    noFav.classList.remove('hidden');
    return;
  }

  favs.forEach((g, idx) => {
    const card = document.createElement('div');
    card.className = 'bg-[#081527] rounded-lg p-4 shadow-lg border border-white/5 flex flex-col';

    card.innerHTML = `
      <img src="${g.background_image}" alt="${g.name}" class="w-full h-40 object-cover rounded mb-3">
      <h3 class="font-semibold mb-1">${g.name}</h3>
      <p class="text-sm text-gray-300 mb-3 line-clamp-3">${g.description ? g.description.slice(0,120) : 'Aucune description.'}</p>
      <div class="mt-auto flex items-center justify-between gap-2">
        <button class="remove-btn px-3 py-2 rounded bg-red-600 hover:bg-red-700">Supprimer</button>
        <button class="details-btn px-3 py-2 text-sm rounded bg-white/5">Détails</button>
      </div>
    `;

    card.querySelector('.remove-btn').onclick = () => {
      favs.splice(idx, 1);
      localStorage.setItem('favorites', JSON.stringify(favs));
      location.reload();
    };

    card.querySelector('.details-btn').onclick = () => openModal(g);

    containerf.appendChild(card);
  });
}

genreSelect.onchange = filterGames;
searchInput.oninput = filterGames;

fetchGames();
displayFavorites();
