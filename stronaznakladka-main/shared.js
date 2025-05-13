// Shared data and utilities
const STORAGE_KEYS = {
    AUTH_TOKEN: 'filmhaven_auth_token',
    USER_DATA: 'filmhaven_user_data',
    WATCHLIST: 'filmhaven_watchlist'
};

// Utility functions
const storage = {
    get: (key) => JSON.parse(localStorage.getItem(key)),
    set: (key, value) => localStorage.setItem(key, JSON.stringify(value)),
    remove: (key) => localStorage.removeItem(key)
};

// Auth utilities
const auth = {
    isAuthenticated: () => !!storage.get(STORAGE_KEYS.AUTH_TOKEN),
    
    getCurrentUser: () => storage.get(STORAGE_KEYS.USER_DATA),
    
    login: async (email, password) => {
        // Simulate API call
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                if (email === 'demo@example.com' && password === 'password') {
                    const userData = {
                        id: '1',
                        email,
                        fullName: 'Demo User'
                    };
                    storage.set(STORAGE_KEYS.AUTH_TOKEN, 'demo_token');
                    storage.set(STORAGE_KEYS.USER_DATA, userData);
                    resolve(userData);
                } else {
                    reject(new Error('Invalid credentials'));
                }
            }, 1000);
        });
    },

    register: async (email, password, fullName) => {
        // Simulate API call
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                const userData = {
                    id: Math.random().toString(36).substr(2, 9),
                    email,
                    fullName
                };
                storage.set(STORAGE_KEYS.AUTH_TOKEN, 'demo_token');
                storage.set(STORAGE_KEYS.USER_DATA, userData);
                resolve(userData);
            }, 1000);
        });
    },

    logout: () => {
        storage.remove(STORAGE_KEYS.AUTH_TOKEN);
        storage.remove(STORAGE_KEYS.USER_DATA);
        window.location.href = '/';
    }
};

// Update auth button based on authentication status
function updateAuthButton() {
    const authButton = document.querySelector('.auth-button');
    if (authButton) {
        const isAuthenticated = auth.isAuthenticated();
        authButton.href = isAuthenticated ? '/pages/account.html' : '/pages/auth.html';
        const iconElement = authButton.querySelector('i');
        if (iconElement) {
            iconElement.setAttribute('data-lucide', isAuthenticated ? 'user-circle' : 'log-in');
            lucide.createIcons();
        }
    }
}

// Initialize shared elements
document.addEventListener('DOMContentLoaded', () => {
    // Initialize Lucide icons
    lucide.createIcons();

    // Update auth button
    updateAuthButton();

    // Setup mobile menu toggle
    const menuToggle = document.querySelector('.menu-toggle');
    const mobileMenu = document.querySelector('.mobile-menu');
    if (menuToggle && mobileMenu) {
        menuToggle.addEventListener('click', () => {
            mobileMenu.classList.toggle('active');
        });
    }

    // Setup search functionality
    const searchToggle = document.querySelector('.search-toggle');
    if (searchToggle) {
        let searchOpen = false;
        searchToggle.addEventListener('click', () => {
            if (!searchOpen) {
                const searchForm = document.createElement('form');
                searchForm.className = 'search-form';
                searchForm.innerHTML = `
                    <input type="search" placeholder="Search movies..." class="search-input">
                    <button type="button" class="search-close">
                        <i data-lucide="x"></i>
                    </button>
                `;
                
                document.querySelector('.navbar').appendChild(searchForm);
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
    }
});


// Utility functions for session management
const SESSION_COOKIE_NAME = 'wfo_session';
const WATCHLIST_COOKIE_NAME = 'wfo_watchlist';

const session = {
    get: () => {
        const cookie = document.cookie
            .split('; ')
            .find(row => row.startsWith(`${SESSION_COOKIE_NAME}=`));
        
        if (cookie) {
            return JSON.parse(decodeURIComponent(cookie.split('=')[1]));
        }
        return null;
    },

    set: (data) => {
        const expiryDate = new Date();
        expiryDate.setDate(expiryDate.getDate() + 7);
        document.cookie = `${SESSION_COOKIE_NAME}=${encodeURIComponent(JSON.stringify(data))}; expires=${expiryDate.toUTCString()}; path=/`;
    },

    remove: () => {
        document.cookie = `${SESSION_COOKIE_NAME}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/`;
    },

    isAuthenticated: () => {
        return !!session.get();
    }
};
const watchlist = {
    get: () => {
        const cookie = document.cookie
            .split('; ')
            .find(row => row.startsWith(`${WATCHLIST_COOKIE_NAME}=`));
        
        if (cookie) {
            return JSON.parse(decodeURIComponent(cookie.split('=')[1]));
        }
        return [];
    },

    set: (movieIds) => {
        const expiryDate = new Date();
        expiryDate.setDate(expiryDate.getDate() + 365); // Store for 1 year
        document.cookie = `${WATCHLIST_COOKIE_NAME}=${encodeURIComponent(JSON.stringify(movieIds))}; expires=${expiryDate.toUTCString()}; path=/`;
    },

    add: (movieId) => {
        const currentList = watchlist.get();
        if (!currentList.includes(movieId)) {
            currentList.push(movieId);
            watchlist.set(currentList);
        }
    },

    remove: (movieId) => {
        const currentList = watchlist.get();
        const newList = currentList.filter(id => id !== movieId);
        watchlist.set(newList);
    },

    isInWatchlist: (movieId) => {
        return watchlist.get().includes(movieId);
    }
};



// Update UI based on authentication status
const updateAuthUI = () => {
    const loginButton = document.querySelector('.login-button');
    const userIcon = document.querySelector('.nav-actions .icon-button[href="Logowanie.html"]');
    
    if (session.isAuthenticated()) {
        const userData = session.get();
        if (loginButton) {
            loginButton.style.display = 'none';
        }
        if (userIcon) {
            userIcon.href = 'konto.html';
        }
    } else {
        if (loginButton) {
            loginButton.style.display = 'block';
        }
        if (userIcon) {
            userIcon.href = 'Logowanie.html';
        }
    }
};

// Initialize on page load
document.addEventListener('DOMContentLoaded', () => {
    updateAuthUI();

    // Handle logout
    const logoutButton = document.querySelector('.logout-button');
    if (logoutButton) {
        logoutButton.addEventListener('click', () => {
            session.remove();
            window.location.href = 'index.html';
        });
    }
});
