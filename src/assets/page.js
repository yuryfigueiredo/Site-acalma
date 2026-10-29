const button = document.querySelector('#page-theme');
function render() { const dark = document.documentElement.dataset.theme === 'dark'; button.textContent = dark ? 'Modo claro' : 'Modo noturno'; button.setAttribute('aria-pressed', String(dark)); }
button?.addEventListener('click', () => { const theme = document.documentElement.dataset.theme === 'dark' ? 'light' : 'dark'; document.documentElement.dataset.theme = theme; try { localStorage.setItem('acalmo:theme', theme); } catch { /* Choice still works in this page. */ } render(); });
if (button) render();
document.querySelector('#print-guide')?.addEventListener('click', () => window.print());
if ('serviceWorker' in navigator) navigator.serviceWorker.register('/sw.js').catch(() => {});
