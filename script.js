// ===== BLOQUEAR ACESSO EM PC =====
function isMobileDevice() {
  return /Android|iPhone|iPad|iPod|Opera Mini|IEMobile|Mobile/i.test(navigator.userAgent);
}

window.addEventListener("load", () => {
  const bloqueio = document.getElementById("acessoBloqueado");
  const login = document.getElementById("login");
  const app = document.getElementById("app");

  if (!isMobileDevice()) {
    bloqueio.style.display = "flex";
    login.style.display = "none";
    app.style.display = "none";
  }
});

// ===== DESATIVAR CLIQUE DIREITO =====
document.addEventListener("contextmenu", e => e.preventDefault());


// ===== LOGIN =====
const correctKey = "2328";
const login = document.getElementById("login");
const app = document.getElementById("app");
const loginBtn = document.getElementById("loginBtn");
const keyInput = document.getElementById("keyInput");
const loginMsg = document.getElementById("loginMsg");

loginBtn.addEventListener("click", () => {
  if (keyInput.value.trim() === correctKey) {
    login.style.opacity = 0;
    setTimeout(() => {
      login.style.display = "none";
      app.style.display = "block";
      updateAllThumbs();
    }, 350);
  } else {
    loginMsg.textContent = "Key incorreta!";
    loginMsg.style.color = "#ff3b3b";
  }
});

// ===== ELEMENTOS =====
const tabNormal = document.getElementById("tabNormal");
const tabMax = document.getElementById("tabMax");
const injetarNormal = document.getElementById("injetarNormal");
const injetarMax = document.getElementById("injetarMax");

const slider = document.getElementById("slider");
const barra = document.getElementById("barra");
const percent = document.getElementById("percent");
const thumb = document.getElementById("thumb");
const containerPrincipal = document.getElementById("container-principal");

const sliderSuav = document.getElementById("slider-suav");
const barraSuav = document.getElementById("barra-suav");
const percentSuav = document.getElementById("percent-suav");
const thumbSuav = document.getElementById("thumb-suav");
const containerSuav = document.getElementById("container-suav");

const toggleRecoil = document.getElementById("toggle-recoil");
const togglePrecision = document.getElementById("toggle-precision");
const toggleSuav = document.getElementById("toggle-suav");

// ===== FUNÇÕES =====
function updateThumb(sliderEl, thumbEl, containerEl, barraEl) {
  const val = Number(sliderEl.value);
  const max = Number(sliderEl.max || 100);
  const rect = containerEl.getBoundingClientRect();
  const x = (val / max) * rect.width;
  thumbEl.style.left = `${Math.max(0, Math.min(rect.width, x))}px`;
  barraEl.style.width = (val / max) * 100 + "%";
}
function updateAllThumbs() {
  updateThumb(slider, thumb, containerPrincipal, barra);
  updateThumb(sliderSuav, thumbSuav, containerSuav, barraSuav);
}
window.addEventListener("resize", updateAllThumbs);

// ===== CONTROLE DE SLIDER =====
function attachSliderFollow(sliderEl, thumbEl, barraEl, containerEl, percentEl) {
  function setValueByClientX(clientX) {
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
  containerEl.addEventListener("touchstart", (e) => setValueByClientX(e.touches[0].clientX));
  containerEl.addEventListener("touchmove", (e) => { setValueByClientX(e.touches[0].clientX); e.preventDefault(); });
  containerEl.addEventListener("mousedown", (e) => {
    setValueByClientX(e.clientX);
    const move = (ev) => setValueByClientX(ev.clientX);
    const up = () => { document.removeEventListener("mousemove", move); document.removeEventListener("mouseup", up); };
    document.addEventListener("mousemove", move);
    document.addEventListener("mouseup", up);
  });
}
attachSliderFollow(slider, thumb, barra, containerPrincipal, percent);
attachSliderFollow(sliderSuav, thumbSuav, barraSuav, containerSuav, percentSuav);

// ===== RESET AO TROCAR ABA =====
function resetPainel() {
  [toggleRecoil, togglePrecision, toggleSuav].forEach(t => t.checked = false);
  slider.value = 50; percent.textContent = "50%"; barra.style.width = "50%";
  sliderSuav.value = 50; percentSuav.textContent = "50%"; barraSuav.style.width = "50%";
  injetarNormal.textContent = "INJETAR"; injetarNormal.classList.remove("active");
  injetarNormal.dataset.injected = "0";
  injetarMax.textContent = "INJETAR"; injetarMax.classList.remove("active");
  injetarMax.dataset.injected = "0";
  updateAllThumbs();
}

// ===== TROCAR ABAS =====
function setTab(normal) {
  resetPainel();
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
}
tabNormal.addEventListener("click", () => setTab(true));
tabMax.addEventListener("click", () => setTab(false));

// ===== INJETAR =====
function toggleInjectVisual(btn, scheme) {
  const injected = btn.dataset.injected === "1";
  if (!injected) {
    btn.textContent = "INJETADO";
    btn.classList.add("active");
    btn.dataset.injected = "1";
    try { window.location.href = scheme; } catch (e) {}
  } else {
    btn.textContent = "INJETAR";
    btn.classList.remove("active");
    btn.dataset.injected = "0";
  }
}
injetarNormal.addEventListener("click", () => toggleInjectVisual(injetarNormal, "freefire://"));
injetarMax.addEventListener("click", () => toggleInjectVisual(injetarMax, "freefiremax://"));

// ===== INICIAL =====
setTab(true);
updateAllThumbs();
