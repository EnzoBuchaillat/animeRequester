// Dark mode

const darkMode = document.getElementById('switch');

darkMode.checked = localStorage.getItem('theme') === 'dark';
document.body.classList.toggle('dark', darkMode.checked);

darkMode.addEventListener('change', () => {
    document.body.classList.toggle('dark', darkMode.checked);
    if (darkMode.checked) {
        localStorage.setItem('theme', 'dark');
    } else {
        localStorage.setItem('theme', 'light');
    }
});
