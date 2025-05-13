// Sample movies data with duration
const movies = [
  {
    title: "Władca Pierścieni",
    imageUrl: "https://storage.googleapis.com/pod_public/1300/106935.jpg",
    year: "2001",
    rating: "4.9/5",
    genre: "Fantasy, Przygodowy",
    description: "Młody hobbit wyrusza w niebezpieczną misję, aby zniszczyć potężny pierścień i pokonać mrocznego władcę Saurona.",
    dateAdded: "2025-04-26",
    videoUrl: "https://download.samplelib.com/mp4/sample-30s.mp4",
    duration: "2h 58m",
    categories: ["Fantasy", "Przygodowy", "Akcja"]
  },
  {
    title: "Incepcja",
    imageUrl: "https://multikino.pl/-/jssmedia/multikino/images/kultowe-kino/incepcja_2_b1-copy.jpg?mw=450&rev=b66a22b6e34e453cb20e6c03fea927aa",
    year: "2010",
    rating: "4.8/5",
    genre: "Sci-Fi, Akcja",
    description: "Dom Cobb jest mistrzem w sztuce wydobywania wartościowych informacji z umysłów ludzi podczas snu.",
    dateAdded: "2024-03-20",
    videoUrl: "https://download.samplelib.com/mp4/sample-20s.mp4",
    duration: "2h 28m",
    categories: ["Sci-Fi", "Akcja", "Thriller"]
  },
  {
    title: "Pulp Fiction",
    imageUrl: "https://static.posters.cz/image/1300/plakaty/pulp-fiction-cover-i1288.jpg",
    year: "1994",
    rating: "4.9/5",
    genre: "Kryminał, Dramat",
    description: "Przemoc i odkupienie w Los Angeles w kilku nietypowo połączonych ze sobą historiach.",
    dateAdded: "2024-02-15",
    duration: "2h 34m",
    categories: ["Kryminał", "Dramat", "Thriller"]
  },
  {
    title: "Skazani na Shawshank",
    imageUrl: "https://cdn.swiatksiazki.pl/media/catalog/product/3/7/3799906597437.jpg?store=default&image-type=large",
    year: "1994",
    rating: "4.9/5",
    genre: "Dramat",
    description: "Niesłusznie skazany bankier Andy Dufresne rozpoczyna odbywanie wyroku dożywocia w więzieniu Shawshank.",
    dateAdded: "2024-03-18",
    duration: "2h 22m",
    categories: ["Dramat", "Kryminał","Test"]
  },
  {
    title: "Zielona Mila",
    imageUrl: "https://static.profinfo.pl/storage/image/core_products/2024/6/14/580dc12dbd0a9d0f2dd241e50c55d8f8/admin/preview/14025B01622KS_HD.jpg.webp",
    year: "1999",
    rating: "4.8/5",
    genre: "Dramat, Fantasy",
    description: "Strażnik więzienny odkrywa, że skazaniec posiada nadprzyrodzone zdolności uzdrawiania.",
    dateAdded: "2024-03-10",
    duration: "3h 9m",
    categories: ["Dramat", "Fantasy", "Kryminał"]
  }
];

// Available categories
const categories = [
  "Akcja",
  "Komedia",
  "Dramat",
  "Horror",
  "Sci-Fi",
  "Fantasy",
  "Thriller",
  "Kryminał",
  "Przygodowy",
  "Animacja"
];

// Initialize Lucide icons
document.addEventListener('DOMContentLoaded', () => {
  lucide.createIcons();
});

// Watchlist functions
function getWatchlist() {
  const watchlistCookie = document.cookie
    .split('; ')
    .find(row => row.startsWith('wfo_watchlist='));
  
  if (watchlistCookie) {
    return JSON.parse(decodeURIComponent(watchlistCookie.split('=')[1]));
  }
  return [];
}

function updateWatchlistUI() {
  const watchlist = getWatchlist();
  const watchlistContainer = document.getElementById('watchlist');
  const watchlistPage = document.querySelector('.movie-row');

  if (watchlistContainer) {
    if (watchlist.length === 0) {
      watchlistContainer.innerHTML = '<div class="empty-watchlist">Twoja lista do obejrzenia jest pusta</div>';
    } else {
      const watchlistMovies = watchlist.map(id => movies[id]);
      watchlistContainer.innerHTML = watchlistMovies.map((movie, index) => {
        const originalIndex = movies.findIndex(m => m.title === movie.title);
        return createMovieCard(movie, originalIndex);
      }).join('');
    }
  }

  if (watchlistPage) {
    if (watchlist.length === 0) {
      watchlistPage.innerHTML = '<div class="empty-watchlist">Twoja lista do obejrzenia jest pusta</div>';
    } else {
      const watchlistMovies = watchlist.map(id => movies[id]);
      watchlistPage.innerHTML = watchlistMovies.map((movie, index) => {
        const originalIndex = movies.findIndex(m => m.title === movie.title);
        return createMovieCard(movie, originalIndex);
      }).join('');
    }
  }

  setupMovieOverlay();
}

function addToWatchlist(movieId) {
  const watchlist = getWatchlist();
  if (!watchlist.includes(movieId)) {
    watchlist.push(movieId);
    const expiryDate = new Date();
    expiryDate.setFullYear(expiryDate.getFullYear() + 1);
    document.cookie = `wfo_watchlist=${encodeURIComponent(JSON.stringify(watchlist))}; expires=${expiryDate.toUTCString()}; path=/`;
    updateWatchlistUI();
  }
}

function removeFromWatchlist(movieId) {
  const watchlist = getWatchlist();
  const index = watchlist.indexOf(movieId);
  if (index > -1) {
    watchlist.splice(index, 1);
    const expiryDate = new Date();
    expiryDate.setFullYear(expiryDate.getFullYear() + 1);
    document.cookie = `wfo_watchlist=${encodeURIComponent(JSON.stringify(watchlist))}; expires=${expiryDate.toUTCString()}; path=/`;
    updateWatchlistUI();
  }
}

function isInWatchlist(movieId) {
  return getWatchlist().includes(movieId);
}

// Create movie card HTML
function createMovieCard(movie, index) {
  const primaryCategory = movie.categories[0];
  const inWatchlist = isInWatchlist(index);
  const watchlistButtonClass = inWatchlist ? 'btn-primary' : 'btn-secondary';
  const watchlistText = inWatchlist ? 'Usuń z listy' : 'Dodaj do listy';
  
  return `
    <div class="movie-card" data-movie-id="${index}">
      <img src="${movie.imageUrl}" alt="${movie.title}">
      <div class="movie-card-overlay"></div>
      <span class="movie-category">${primaryCategory}</span>
      <span class="movie-duration">${movie.duration}</span>
      <div class="movie-card-content">
        <h3 class="movie-card-title">${movie.title}</h3>
        <div class="movie-card-meta">
          <span>${movie.year}</span>
          <span>•</span>
          <span>${movie.rating}</span>
        </div>
      </div>
    </div>
  `;
}

// Filter movies by category
function filterMoviesByCategory(category) {
  return movies.filter(movie => 
    category === 'all' || movie.categories.includes(category)
  );
}

// Initialize movies page
function initializeMoviesPage() {
  const moviesGrid = document.getElementById('movies-grid');
  if (!moviesGrid) return;
  
  // Display all movies
  moviesGrid.innerHTML = movies.map((movie, index) => createMovieCard(movie, index)).join('');
  
  // Set up movie overlay
  setupMovieOverlay();
}

// Initialize category page
function initializeCategoryPage() {
  const categoryContainer = document.querySelector('.category-container');
  if (!categoryContainer) return;

  // Create category filter
  const filterHTML = `
    <div class="category-filter">
      <input type="text" placeholder="Szukaj kategorii..." class="category-search">
      <div class="category-tags">
        <button class="category-tag active" data-category="all">Wszystkie</button>
        ${categories.map(category => 
          `<button class="category-tag" data-category="${category}">${category}</button>`
        ).join('')}
      </div>
    </div>
  `;

  categoryContainer.insertAdjacentHTML('afterbegin', filterHTML);

  // Add event listeners
  const categorySearch = document.querySelector('.category-search');
  const categoryTags = document.querySelectorAll('.category-tag');
  const movieGrid = document.querySelector('.movie-grid');

  // Display all movies initially
  movieGrid.innerHTML = movies.map((movie, index) => createMovieCard(movie, index)).join('');
  setupMovieOverlay();

  categorySearch.addEventListener('input', (e) => {
    const searchTerm = e.target.value.toLowerCase();
    categoryTags.forEach(tag => {
      const category = tag.textContent;
      if (category === 'Wszystkie' || category.toLowerCase().includes(searchTerm)) {
        tag.style.display = 'block';
      } else {
        tag.style.display = 'none';
      }
    });
  });

  categoryTags.forEach(tag => {
    tag.addEventListener('click', () => {
      categoryTags.forEach(t => t.classList.remove('active'));
      tag.classList.add('active');
      
      const selectedCategory = tag.dataset.category;
      const filteredMovies = filterMoviesByCategory(selectedCategory);
      movieGrid.innerHTML = filteredMovies.map((movie, index) => {
        const originalIndex = movies.findIndex(m => m.title === movie.title);
        return createMovieCard(movie, originalIndex);
      }).join('');
      
      // Set up movie overlay for new cards
      setupMovieOverlay();
    });
  });
}

// Filter recently added movies (within last 14 days)
function getRecentMovies() {
  const today = new Date();
  const fourteenDaysAgo = new Date(today.getTime() - (14 * 24 * 60 * 60 * 1000));
  
  return movies.filter(movie => {
    const movieDate = new Date(movie.dateAdded);
    return movieDate >= fourteenDaysAgo;
  });
}

// Initialize watchlist page
function initializeWatchlistPage() {
  const movieRow = document.querySelector('.movie-row');
  if (!movieRow) return;

  updateWatchlistUI();
}

// Initialize featured movie
function initializeFeaturedMovie() {
  const featuredMovie = document.querySelector('.featured-movie');
  if (!featuredMovie) return;

  const randomMovie = movies[Math.floor(Math.random() * movies.length)];
  
  featuredMovie.querySelector('.featured-backdrop').style.backgroundImage = `url(${randomMovie.imageUrl})`;
  featuredMovie.querySelector('.featured-title').textContent = randomMovie.title;
  featuredMovie.querySelector('.rating').textContent = randomMovie.rating;
  featuredMovie.querySelector('.year').textContent = randomMovie.year;
  featuredMovie.querySelector('.duration').textContent = randomMovie.duration;
  featuredMovie.querySelector('.movie-description').textContent = randomMovie.description;
}

// Populate movie rows with proper positioning of information
document.addEventListener('DOMContentLoaded', () => {
  // Initialize featured movie
  initializeFeaturedMovie();

  const recommendedMovies = document.getElementById('recommended-movies');
  const latestMovies = document.getElementById('latest-movies');
  
  if (recommendedMovies) {
    recommendedMovies.innerHTML = movies.map((movie, index) => createMovieCard(movie, index)).join('');
  }
  
  if (latestMovies) {
    const recentMovies = getRecentMovies();
    latestMovies.innerHTML = recentMovies.map((movie, index) => {
      const originalIndex = movies.findIndex(m => m.title === movie.title);
      return createMovieCard(movie, originalIndex);
    }).join('');
  }

  // Initialize movies page if we're on the movies page
  initializeMoviesPage();
  
  // Initialize category page if we're on the category page
  initializeCategoryPage();

  // Initialize watchlist page if we're on the watchlist page
  initializeWatchlistPage();
  
  // Set up movie overlay for any existing cards
  setupMovieOverlay();
});

// Navbar scroll effect
const navbar = document.querySelector('.navbar');
window.addEventListener('scroll', () => {
  if (window.scrollY > 10) {
    navbar.classList.add('scrolled');
  } else {
    navbar.classList.remove('scrolled');
  }
});

// Mobile menu toggle
const menuToggle = document.querySelector('.menu-toggle');
const mobileMenu = document.querySelector('.mobile-menu');

menuToggle.addEventListener('click', () => {
  mobileMenu.classList.toggle('active');
});

// Search functionality
const searchToggle = document.querySelector('.search-toggle');
let searchOpen = false;

searchToggle.addEventListener('click', () => {
  if (!searchOpen) {
    const searchForm = document.createElement('form');
    searchForm.className = 'search-form fadeIn';
    searchForm.innerHTML = `
      <input type="search" placeholder="Szukaj filmów..." class="search-input">
      <button type="button" class="search-close">
        <i data-lucide="x"></i>
      </button>
    `;
    
    navbar.appendChild(searchForm);
    lucide.createIcons();
    searchOpen = true;

    const searchInput = searchForm.querySelector('input');
    searchInput.focus();

    const closeButton = searchForm.querySelector('.search-close');
    closeButton.addEventListener('click', () => {
      searchForm.remove();
      searchOpen = false;
    });
  }
});

// Global variable for overlay management
let currentOverlay = null;

// Movie details overlay
function setupMovieOverlay() {
  const overlay = document.createElement('div');
  overlay.className = 'movie-details-overlay';
  overlay.innerHTML = `
    <div class="movie-details-content">
      <button class="movie-details-close">
        <i data-lucide="x"></i>
      </button>
      <div class="movie-details-header">
        <img src="" alt="" class="movie-details-poster">
        <div class="movie-details-info">
          <h1 class="movie-details-title"></h1>
          <div class="movie-details-meta">
            <span class="movie-details-genre"></span>
            <span class="movie-details-rating">
              <i data-lucide="star" class="star-icon"></i>
              <span></span>
            </span>
          </div>
          <p class="movie-details-description"></p>
          <div class="movie-details-actions">
            <a href="#" class="btn btn-primary play-button">
              <i data-lucide="play"></i>
              <span>Odtwórz film</span>
            </a>
            <button class="btn btn-secondary watchlist-button">
              <i data-lucide="plus"></i>
              <span>Dodaj do listy</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  `;

  // Add click event listeners to all movie cards
  const movieCards = document.querySelectorAll('.movie-card');
  movieCards.forEach(card => {
    card.addEventListener('click', () => {
      // Remove existing overlay if it exists
      if (currentOverlay) {
        currentOverlay.remove();
      }

      document.body.appendChild(overlay);
      currentOverlay = overlay;
      lucide.createIcons();

      const movieId = parseInt(card.dataset.movieId);
      const movieData = movies[movieId];
      const inWatchlist = isInWatchlist(movieId);

      // Update overlay content with movie data
      overlay.querySelector('.movie-details-title').textContent = movieData.title;
      overlay.querySelector('.movie-details-genre').textContent = movieData.genre;
      overlay.querySelector('.movie-details-rating span').textContent = movieData.rating;
      overlay.querySelector('.movie-details-description').textContent = movieData.description;
      overlay.querySelector('.movie-details-poster').src = movieData.imageUrl;
      overlay.querySelector('.movie-details-poster').alt = movieData.title;

      // Update play button link
      const playButton = overlay.querySelector('.play-button');
      playButton.href = `player.html?id=${movieId}`;

      // Update watchlist button
      const watchlistButton = overlay.querySelector('.watchlist-button');
      watchlistButton.className = `btn ${inWatchlist ? 'btn-primary' : 'btn-secondary'} watchlist-button`;
      watchlistButton.innerHTML = `
        <i data-lucide="${inWatchlist ? 'check' : 'plus'}"></i>
        <span>${inWatchlist ? 'Usuń z listy' : 'Dodaj do listy'}</span>
      `;
      lucide.createIcons();

      // Add watchlist button functionality
      watchlistButton.onclick = (e) => {
        e.preventDefault();
        e.stopPropagation();
        if (inWatchlist) {
          removeFromWatchlist(movieId);
          watchlistButton.className = 'btn btn-secondary watchlist-button';
          watchlistButton.innerHTML = '<i data-lucide="plus"></i><span>Dodaj do listy</span>';
        } else {
          addToWatchlist(movieId);
          watchlistButton.className = 'btn btn-primary watchlist-button';
          watchlistButton.innerHTML = '<i data-lucide="check"></i><span>Usuń z listy</span>';
        }
        lucide.createIcons();
      };

      // Show overlay with animation
      overlay.classList.add('active');
    });
  });

  // Close button functionality
  const closeButton = overlay.querySelector('.movie-details-close');
  closeButton.addEventListener('click', (e) => {
    e.stopPropagation();
    overlay.classList.remove('active');
    setTimeout(() => {
      overlay.remove();
      currentOverlay = null;
    }, 300);
  });

  // Close on escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && overlay.classList.contains('active')) {
      overlay.classList.remove('active');
      setTimeout(() => {
        overlay.remove();
        currentOverlay = null;
      }, 300);
    }
  });

  // Close when clicking outside
  overlay.addEventListener('click', (e) => {
    if (e.target === overlay) {
      overlay.classList.remove('active');
      setTimeout(() => {
        overlay.remove();
        currentOverlay = null;
      }, 300);
    }
  });
}