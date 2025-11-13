const isMobile = /Mobi|Android|iPhone|iPad|iPod/i.test(navigator.userAgent);
const blockedEl = document.getElementById('blocked');
const loginEl = document.getElementById('login');
const appEl = document.getElementById('app');

if (!isMobile) {
  blockedEl.style.display = 'flex';
  loginEl.style.display = 'none';
  appEl.style.display = 'none';
} else {
  blockedEl.style.display = 'none';
  loginEl.style.display = 'block';
  appEl.style.display = 'none';
}

document.addEventListener('contextmenu', e => e.preventDefault());
document.addEventListener('keydown', e => {
  if (e.key === "F12" || (e.ctrlKey && e.key.toLowerCase() === "u") || (e.ctrlKey && e.shiftKey && ["i","c","j"].includes(e.key.toLowerCase()))) {
    e.preventDefault();
  }
});
window.addEventListener('wheel', e => { if (e.ctrlKey) e.preventDefault(); }, { passive: false });
document.addEventListener('gesturestart', e => e.preventDefault(), { passive: false });
document.addEventListener('gesturechange', e => e.preventDefault(), { passive: false });
document.addEventListener('gestureend', e => e.preventDefault(), { passive: false });
window.addEventListener('touchmove', e => e.preventDefault(), { passive: false });

let lastTouch = 0;
document.addEventListener('touchstart', e => {
  if (e.touches.length > 1) e.preventDefault();
  const now = Date.now();
  if (now - lastTouch <= 300) e.preventDefault();
  lastTouch = now;
}, { passive: false });
