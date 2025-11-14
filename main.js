const API_URL = 'https://debuggers-games-api.duckdns.org/api/games';
let allGames = [];
let favorites = JSON.parse(localStorage.getItem('favorites')) || [];

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
  } catch {
    container.innerHTML = `<p class="text-center text-red-400 col-span-full">Erreur de chargement</p>`;
  } finally {
 
  }
}

function displaySlide(games){
  if(!games.length) return;
  const g = games[Math.floor(Math.random()*games.length)];
  slideImage.src = g.background_image;
  slideName.textContent = g.name;
  slideDesc.textContent = g.description?.slice(0,150) || 'Aucune description';
  slideOpen.onclick = ()=>openModal(g);
}

function populateGenres(games){
  const set = new Set();
  games.forEach(g => (g.genres||[]).forEach(x=>set.add(x.name)));
  set.forEach(name=>{
    const opt = document.createElement('option');
    opt.value = name;
    opt.textContent = name;
    genreSelect.appendChild(opt);
  });
}

function displayGames(list){
  container.innerHTML = '';

  list.forEach(g=>{
    const div = document.createElement('div');
    div.className = "bg-[#111830] rounded-lg overflow-hidden shadow hover:scale-105 transition";
    div.innerHTML = `
      <img src="${g.background_image}" class="w-full h-40 object-cover">
      <div class="p-3">
        <h3 class="font-semibold text-blue-300 mb-1">${g.name}</h3>
        <p class="text-sm text-gray-300 mb-3">${g.description?.slice(0,80)||''}</p>
        <div class="flex justify-between">
          <button class="details px-3 py-1 bg-white/10 rounded hover:bg-white/20">Détails</button>
          <button class="fav px-3 py-1 bg-gradient-to-r from-blue-600 to-violet-600 rounded">❤</button>
        </div>
      </div>`;
    div.querySelector('.details').onclick = ()=>openModal(g);
    div.querySelector('.fav').onclick = ()=>addToFavorites(g);
    container.appendChild(div);
  });
}

function filterGames(){
  const genre = genreSelect.value;
  const q = searchInput.value.toLowerCase();
  const f = allGames.filter(g=>{
    const okGenre = !genre || (g.genres||[]).some(x=>x.name===genre);
    const okSearch = g.name.toLowerCase().includes(q);
    return okGenre && okSearch;
  });
  displayGames(f);
}

function openModal(g){
  currentGame=g;
  modalImage.src=g.background_image;
  modalTitle.textContent=g.name;
  modalGenres.textContent=(g.genres||[]).map(x=>x.name).join(', ');
  modalDescription.textContent=g.description||'Aucune description';
  openLink.href=g.website||'#';
  modal.classList.remove('hidden');
}
closeModal.onclick=()=>modal.classList.add('hidden');

function addToFavorites(g){
  if(!favorites.some(f=>f.id===g.id)){
    favorites.push(g);
    localStorage.setItem('favorites',JSON.stringify(favorites));
    alert(`${g.name} ajouté aux favoris`);
  } else alert(`${g.name} est déjà favori`);
}

genreSelect.onchange=filterGames;
searchInput.oninput=filterGames;
fetchGames();
