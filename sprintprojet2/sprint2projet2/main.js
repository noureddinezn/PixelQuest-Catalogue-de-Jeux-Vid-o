



async function fetchGames() {
      try {
        const res = await fetch('https://debuggers-games-api.duckdns.org/api/games');
        const data = await res.json();

        const gamesContainer = document.getElementById('games-container');
        const games = data.results; 
       
        const featuredGame = games[2];
        document.getElementById('slide-image').src = featuredGame.background_image;
        document.getElementById('slide-nom').textContent = featuredGame.name;
        document.getElementById('slide-desc').textContent = featuredGame.description.slice(0, 120) + "...";

        games.forEach(game => {
          const card = document.createElement('div');
          card.className = "bg-white rounded-lg shadow p-4 flex flex-col items-center";

    
        const img = document.createElement('img');
        img.src = game.background_image;
        img.alt = game.name;
        img.className = "w-full h-40 object-cover rounded mb-4";
        card.appendChild(img);

        
        const title = document.createElement('h2');
        title.textContent = game.name;
        title.className = "font-bold text-lg mb-2 text-center";
        card.appendChild(title);

        
        const desc = document.createElement('p');
        desc.textContent = game.description ? game.description.slice(0, 80) + '...' : '';
        desc.className = "text-sm text-gray-600 mb-2 text-center";
        card.appendChild(desc);

    
        const genreSpan = document.createElement('span');
        genreSpan.textContent = game.genres.map(g => g.name).join(', ');
        genreSpan.className = "bg-red-500 text-white px-3 py-1 rounded text-sm";
        card.appendChild(genreSpan);

          gamesContainer.appendChild(card);
        });

      } catch (error) {
        console.error('Erreur :', error);
      }
    }

fetchGames();
