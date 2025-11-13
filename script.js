// detectar se é mobile
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

// impedir inspeção
document.addEventListener('contextmenu', e => e.preventDefault());
document.addEventListener('keydown', e => {
  if (e.key === "F12" || (e.ctrlKey && e.shiftKey && ["i","j","c"].includes(e.key.toLowerCase())) || (e.ctrlKey && e.key.toLowerCase() === "u")) {
    e.preventDefault();
    return false;
  }
});

// prevenir zoom e pinch
window.addEventListener('wheel', e => { if (e.ctrlKey) e.preventDefault(); }, { passive: false });
document.addEventListener('gesturestart', e => e.preventDefault(), { passive: false });
document.addEventListener('gesturechange', e => e.preventDefault(), { passive: false });
document.addEventListener('gestureend', e => e.preventDefault(), { passive: false });

// evitar duplo toque zoom
let lastTouch = 0;
document.addEventListener('touchstart', e => {
  const now = Date.now();
  if (now - lastTouch <= 300) e.preventDefault();
  lastTouch = now;
}, { passive: false });

// login
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

// abas FF Normal / FF Max
const tabNormal = document.getElementById("tabNormal");
const tabMax = document.getElementById("tabMax");
const btnNormal = document.getElementById("injetarNormal");
const btnMax = document.getElementById("injetarMax");

tabNormal.addEventListener("click", () => {
  tabNormal.classList.add("active");
  tabMax.classList.remove("active");
  btnNormal.style.display = "inline-block";
  btnMax.style.display = "none";
});

tabMax.addEventListener("click", () => {
  tabMax.classList.add("active");
  tabNormal.classList.remove("active");
  btnMax.style.display = "inline-block";
  btnNormal.style.display = "none";
});

// sliders
function sliderControl(sliderId, barraId, thumbId, percentId) {
  const slider = document.getElementById(sliderId);
  const barra = document.getElementById(barraId);
  const thumb = document.getElementById(thumbId);
  const percent = document.getElementById(percentId);

  function update() {
    const val = slider.value;
    barra.style.width = val + "%";
    thumb.style.left = val + "%";
    percent.textContent = val + "%";
  }
  slider.addEventListener("input", update);
  update();
}
sliderControl("slider", "barra", "thumb", "percent");
sliderControl("slider-suav", "barra-suav", "thumb-suav", "percent-suav");

// injetar
btnNormal.addEventListener("click", () => {
  alert("Abrindo Free Fire Normal...");
});
btnMax.addEventListener("click", () => {
  alert("Abrindo Free Fire Max...");
});

function updateAllThumbs() {
  document.querySelectorAll("input[type=range]").forEach(input => {
    input.dispatchEvent(new Event("input"));
  });
}
