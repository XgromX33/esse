console.log("auth.js załadowany");

document.addEventListener('DOMContentLoaded', () => {
    const authForm = document.getElementById('authForm');
    const switchButton = document.getElementById('switchAuth');
    const nameGroup = document.getElementById('nameGroup');
    const errorMessage = document.getElementById('errorMessage');

    switchButton.addEventListener('click', () => {
        const isHidden = window.getComputedStyle(nameGroup).display === 'none';
        nameGroup.style.display = isHidden ? 'block' : 'none';

        document.querySelector('.auth-title').textContent = isHidden
            ? 'Stwórz swoje konto'
            : 'Witaj ponownie';

        document.querySelector('.auth-subtitle').textContent = isHidden
            ? 'Zacznij swoją przygodę z wypożyczalnią filmów wfo'
            : 'Zaloguj się do konta';

        document.querySelector('.auth-submit').textContent = isHidden
            ? 'Stwórz konto'
            : 'Zaloguj się';

        switchButton.textContent = isHidden
            ? 'Masz już konto? Zaloguj'
            : 'Nie masz konta? Zarejestruj się!';

        errorMessage.style.display = 'none';
    });

    authForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        errorMessage.style.display = 'none';

        const emailInput = document.getElementById('email');
        const passwordInput = document.getElementById('password');
        const loginInput = document.getElementById('login');
        const isSignUp = window.getComputedStyle(nameGroup).display !== 'none';

        const email = emailInput.value.trim();
        const password = passwordInput.value.trim();
        let login = isSignUp ? loginInput.value.trim() : '';

        console.log("Wysyłam dane logowania:", { email, password, login });

        const url = isSignUp ? 'register.php' : 'login.php';

        try {
            const response = await fetch(url, {
                method: 'POST',
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                body: new URLSearchParams({ email, password, ...(isSignUp && { login }) }),
            });

            const result = await response.json();

            if (!response.ok || result.error) {
                throw new Error(result.error || 'Wystąpił błąd');
            }

            if (isSignUp) {
                const toast = document.getElementById('toast');
                toast.textContent = "Rejestracja zakończona sukcesem! Zaloguj się.";
                toast.style.display = "block";
                toast.classList.add('show');

                setTimeout(() => {
                    toast.classList.remove('show');
                    setTimeout(() => {
                        toast.style.display = "none";
                        window.location.href = 'Logowanie.html';
                    }, 300);
                }, 2500);

                return;
            }

            // Logowanie zakończone sukcesem
            const toast = document.getElementById('toast');
            if (toast) {
                toast.textContent = "Jesteś zalogowany";
                toast.style.display = "block";
                toast.classList.add('show');

                setTimeout(() => {
                    toast.classList.remove('show');
                    setTimeout(() => {
                        toast.style.display = "none";

                        // 🔄 Automatyczne przekierowanie do index.html w tym samym folderze
                        const currentPath = window.location.pathname;
                        const currentDir = currentPath.substring(0, currentPath.lastIndexOf('/'));
                        const targetUrl = `${currentDir}/index.html`;

                        console.log("➡️ Przekierowuję do:", targetUrl);
                        window.location.href = targetUrl;

                    }, 300);
                }, 2500);
            }

            storage.set('filmhaven_auth_token', result.token || 'php_session');
            storage.set('filmhaven_user_data', result.user);

        } catch (error) {
            console.error("Błąd logowania:", error);
            errorMessage.textContent = error.message;
            errorMessage.style.display = 'block';
        }
    });

    const currentUser = storage.get('filmhaven_user_data');
    const isOnLoginPage = window.location.pathname.includes('Logowanie.html');
    if (currentUser && !isOnLoginPage) {
        const currentDir = window.location.pathname.substring(0, window.location.pathname.lastIndexOf('/'));
        window.location.href = `${currentDir}/index.html`;
    }
});
