// Theme Toggle Logic
document.addEventListener('DOMContentLoaded', () => {
    const themeToggleBtn = document.getElementById('themeToggle');
    const body = document.body;

    // Check for saved preference
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'light') {
        body.classList.add('light-mode');
        updateButtonText(true);
    } else {
        updateButtonText(false);
    }

    themeToggleBtn.addEventListener('click', () => {
        body.classList.toggle('light-mode');
        const isLight = body.classList.contains('light-mode');

        // Save preference
        localStorage.setItem('theme', isLight ? 'light' : 'dark');

        updateButtonText(isLight);
    });

    function updateButtonText(isLight) {
        themeToggleBtn.textContent = isLight ? 'Modo: Claro' : 'Modo: Oscuro';
        themeToggleBtn.setAttribute('aria-label', isLight ? 'Cambiar a modo oscuro' : 'Cambiar a modo claro');
    }
});
