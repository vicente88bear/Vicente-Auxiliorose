/* ============================
   JS completo - painel + bloqueio
   ============================ */

/* ---------- bloqueio PC ---------- */
/* mostra overlay "Acesso Bloqueado" quando não é mobile */
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

/* ---------- prevenir inspeção / zoom / scroll ---------- */
document.addEventListener('contextmenu', e => e.preventDefault());
document.addEventListener('keydown', e => {
  // F12, Ctrl+U, Ctrl+Shift+I/C/J
  if (e.key === "F12" || (e.ctrlKey && e.key.toLowerCase() === "u") || (e.ctrlKey && e.shiftKey && ["i","c","j"].includes(e.key.toLowerCase()))) {
    e.preventDefault();
    return false;
  }
});

// prevenir zoom com Ctrl + roda
window.addEventListener('wheel', function(e){ if (e.ctrlKey) e.preventDefault(); }, { passive: false });

// prevenir gestos de pinch (quando suportado)
document.addEventListener('gesturestart', e => e.preventDefault(), { passive: false });
document.addEventListener('gesturechange', e => e.preventDefault(), { passive: false });
document.addEventListener('gestureend', e => e.preventDefault(), { passive: false });

// impedir rolagem por toque (também evita arrastar a página)
window.addEventListener('touchmove', function(e){ 
  // se quiser permitir scroll em inputs, poderia condicionalmente permitir; aqui bloqueamos tudo
  e.preventDefault(); 
}, { passive: false });

// bloquear pinch com dois dedos explicitamente e double-tap zoom
let lastTouch = 0;
document.addEventListener('touchstart', function(e){
  if (e.touches && e.touches.length > 1) {
    e.preventDefault(); // duas pontas => evita pinch
  }
  const now = Date.now();
  if (now - lastTouch <= 300) {
    e.preventDefault(); // double-tap => evita zoom
  }
  lastTouch = now;
}, { passive: false });

/* ---------- LOGIN ---------- */
const correctKey = "2328";
const loginBtn = document.getElementById("loginBtn");
const keyInput = document.getElementById("keyInput");
const loginMsg = document.getElementById("loginMsg");

loginBtn.addEventListener("click", () => {
  if (keyInput.value.trim() === correctKey) {
    loginEl.style.opacity = 0;
    setTimeout(() => {
      loginEl.style.display = "none";
      appEl.style.display = "block";
      updateAllThumbs();
    }, 300);
  } else {
    loginMsg.textContent = "Key incorreta!";
    loginMsg.style.color = "#ff3b3b";
  }
});

/* ---------- elementos do painel ---------- */
const tabNormal = document.getElementById("tabNormal");
const tabMax = document.getElementById("tabMax");

const toggleRecoil = document.getElementById("toggle-recoil");
const togglePrecision = document.getElementById("toggle-precision");
const toggleSuav = document.getElementById("toggle-suav");

const percent = document.getElementById("percent");
const percentSuav = document.getElementById("percent-suav");

const slider = document.getElementById("slider");
const thumb = document.getElementById("thumb");
const barra = document.getElementById("barra");
const containerPrincipal = document.getElementById("container-principal");

const sliderSuav = document.getElementById("slider-suav");
const thumbSuav = document.getElementById("thumb-suav");
const barraSuav = document.getElementById("barra-suav");
const containerSuav = document.getElementById("container-suav");

const injetarNormal = document.getElementById("injetarNormal");
const injetarMax = document.getElementById("injetarMax");

/* ---------- helpers para thumb ---------- */
function updateThumb(sliderEl, thumbEl, containerEl, barraEl){
  const val = Number(sliderEl.value);
  const max = Number(sliderEl.max || 100);
  const rect = containerEl.getBoundingClientRect();
  const x = (val / max) * rect.width;
  const clamped = Math.max(0, Math.min(rect.width, x));
  thumbEl.style.left = clamped + "px";
  barraEl.style.width = (val / max * 100) + "%";
}
function updateAllThumbs(){
  updateThumb(slider, thumb, containerPrincipal, barra);
  updateThumb(sliderSuav, thumbSuav, containerSuav, barraSuav);
}
window.addEventListener("resize", updateAllThumbs);
window.addEventListener("orientationchange", updateAllThumbs);

/* ---------- slider touch/mouse follow (funciona bem no mobile) ---------- */
function attachSliderFollow(sliderEl, thumbEl, barraEl, containerEl, percentEl){
  function setValueByClientX(clientX){
    const rect = containerEl.getBoundingClientRect();
    let val = ((clientX - rect.left) / rect.width) * Number(sliderEl.max);
    val = Math.max(0, Math.min(Number(sliderEl.max), val));
    sliderEl.value = Math.round(val);
    percentEl.textContent = sliderEl.value + "%";
    updateThumb(sliderEl, thumbEl, containerEl, barraEl);
  }

  sliderEl.addEventListener("input", () => {
    percentEl.textContent = sliderEl.value + "%";
    updateThumb(sliderEl, thumbEl, containerEl, barraEl);
  });

  // touch gestures
  containerEl.addEventListener("touchstart", (e) => {
    if (e.touches && e.touches.length > 1) return; // evita conflito com pinch (já prevenido)
    setValueByClientX(e.touches[0].clientX);
  }, { passive: false });

  containerEl.addEventListener("touchmove", (e) => {
    setValueByClientX(e.touches[0].clientX);
    e.preventDefault();
  }, { passive: false });

  // mouse fallback
  containerEl.addEventListener("mousedown", (e) => {
    setValueByClientX(e.clientX);
    const move = (ev) => setValueByClientX(ev.clientX);
    const up = () => { document.removeEventListener("mousemove", move); document.removeEventListener("mouseup", up); };
    document.addEventListener("mousemove", move);
    document.addEventListener("mouseup", up);
  });
}

// ligar sliders
attachSliderFollow(slider, thumb, barra, containerPrincipal, percent);
attachSliderFollow(sliderSuav, thumbSuav, barraSuav, containerSuav, percentSuav);

/* ---------- reset para defaults (quando trocar de aba) ---------- */
function resetUItoDefaults() {
  // toggles
  toggleRecoil.checked = false;
  togglePrecision.checked = false;
  toggleSuav.checked = false;
  // main slider
  slider.value = 50;
  percent.textContent = "50%";
  barra.style.width = "50%";
  // suav slider
  sliderSuav.value = 50;
  percentSuav.textContent = "50%";
  barraSuav.style.width = "50%";
  // inject buttons
  [injetarNormal, injetarMax].forEach(btn => {
    btn.textContent = "INJETAR";
    btn.classList.remove("active");
    btn.dataset.injected = "0";
    btn.style.background = "#555";
    btn.style.color = "#fff";
    btn.style.boxShadow = "0 0 10px transparent";
  });
  updateAllThumbs();
}

/* ---------- troca de abas (reseta painel ao trocar) ---------- */
function setTab(normal){
  // sempre resetamos o painel ao trocar (para forçar novo INJETAR)
  resetUItoDefaults();

  if (normal) {
    tabNormal.classList.add("active");
    tabMax.classList.remove("active");
    injetarNormal.style.display = "inline-block";
    injetarMax.style.display = "none";
  } else {
    tabNormal.classList.remove("active");
    tabMax.classList.add("active");
    injetarNormal.style.display = "none";
    injetarMax.style.display = "inline-block";
  }
  setTimeout(updateAllThumbs, 0);
}
tabNormal.addEventListener("click", () => setTab(true));
tabMax.addEventListener("click", () => setTab(false));
setTab(true); // inicial

/* ---------- botão INJETAR (visual) ---------- */
function toggleInjectVisual(btn, scheme) {
  const injected = btn.dataset.injected === "1";
  if (!injected) {
    btn.textContent = "INJETADO";
    btn.classList.add("active");
    btn.dataset.injected = "1";
    // style handled by CSS .active, but ensure colors for old browsers:
    btn.style.background = "var(--pink)";
    btn.style.color = "#000";
    btn.style.boxShadow = "0 0 25px var(--pink),0 0 60px var(--pink)";
    try { window.location.href = scheme; } catch(e){}
  } else {
    btn.textContent = "INJETAR";
    btn.classList.remove("active");
    btn.dataset.injected = "0";
    btn.style.background = "#555";
    btn.style.color = "#fff";
    btn.style.boxShadow = "0 0 10px transparent";
  }
}
injetarNormal.addEventListener("click", () => toggleInjectVisual(injetarNormal, "freefire://"));
injetarMax.addEventListener("click", () => toggleInjectVisual(injetarMax, "freefiremax://"));
