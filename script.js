// ===== LOGIN =====
const correctKey = "2328";
const login = document.getElementById("login");
const app = document.getElementById("app");
const loginBtn = document.getElementById("loginBtn");
const keyInput = document.getElementById("keyInput");
const loginMsg = document.getElementById("loginMsg");

loginBtn.addEventListener("click", () => {
  if(keyInput.value.trim() === correctKey){
    login.style.opacity=0;
    setTimeout(()=>{login.style.display="none";app.style.display="block";updateAllThumbs();},350);
  }else{
    loginMsg.textContent="Key incorreta!";
    loginMsg.style.color="#ff3b3b";
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

// ===== ESTADO SEPARADO =====
const savedState = {
  normal: { sliderValue:50, sliderSuav:50, toggles:{ "toggle-recoil":false, "toggle-precision":false, "toggle-suav":false } },
  max: { sliderValue:50, sliderSuav:50, toggles:{ "toggle-recoil":false, "toggle-precision":false, "toggle-suav":false } }
};

// ===== AUX =====
function updateThumb(sliderEl, thumbEl, containerEl, barraEl){
  const val = Number(sliderEl.value);
  const rect = containerEl.getBoundingClientRect();
  const x = (val/sliderEl.max)*rect.width;
  const clamped = Math.max(0,Math.min(rect.width,x));
  thumbEl.style.left = clamped + "px";
  barraEl.style.width = (val/sliderEl.max*100) + "%";
}

function updateAllThumbs(){
  updateThumb(slider,thumb,containerPrincipal,barra);
  updateThumb(sliderSuav,thumbSuav,containerSuav,barraSuav);
}
window.addEventListener("resize",updateAllThumbs);
window.addEventListener("orientationchange",updateAllThumbs);

// ===== SLIDERS MOBILE & MOUSE =====
function attachSliderFollow(sliderEl, thumbEl, barraEl, containerEl, percentEl, tabName, isSuav=false){
  function setValueByClientX(clientX){
    const rect = containerEl.getBoundingClientRect();
    let val = ((clientX - rect.left) / rect.width) * Number(sliderEl.max);
    val = Math.max(0, Math.min(Number(sliderEl.max), val));
    sliderEl.value = Math.round(val);
    percentEl.textContent = sliderEl.value+"%";
    if(isSuav) savedState[tabName].sliderSuav = sliderEl.value;
    else savedState[tabName].sliderValue = sliderEl.value;
    updateThumb(sliderEl, thumbEl, containerEl, barraEl);
  }

  sliderEl.addEventListener("input", ()=>{
    percentEl.textContent = sliderEl.value+"%";
    if(isSuav) savedState[tabName].sliderSuav = sliderEl.value;
    else savedState[tabName].sliderValue = sliderEl.value;
    updateThumb(sliderEl, thumbEl, containerEl, barraEl);
  });

  containerEl.addEventListener("touchstart",(e)=>{setValueByClientX(e.touches[0].clientX);});
  containerEl.addEventListener("touchmove",(e)=>{setValueByClientX(e.touches[0].clientX);e.preventDefault();});

  containerEl.addEventListener("mousedown",(e)=>{
    setValueByClientX(e.clientX);
    const move = ev=>{setValueByClientX(ev.clientX);};
    const up = ()=>{document.removeEventListener("mousemove",move); document.removeEventListener("mouseup",up);};
    document.addEventListener("mousemove",move);
    document.addEventListener("mouseup",up);
  });
}

attachSliderFollow(slider, thumb, barra, containerPrincipal, percent, "normal", false);
attachSliderFollow(sliderSuav, thumbSuav, barraSuav, containerSuav, percentSuav, "normal", true);
attachSliderFollow(slider, thumb, barra, containerPrincipal, percent, "max", false);
attachSliderFollow(sliderSuav, thumbSuav, barraSuav, containerSuav, percentSuav, "max", true);

// ===== TOGGLES =====
toggleRecoil.addEventListener("change",()=>savedState[tabNormal.classList.contains("active")?"normal":"max"].toggles["toggle-recoil"]=toggleRecoil.checked);
togglePrecision.addEventListener("change",()=>savedState[tabNormal.classList.contains("active")?"normal":"max"].toggles["toggle-precision"]=togglePrecision.checked);
toggleSuav.addEventListener("change",()=>savedState[tabNormal.classList.contains("active")?"normal":"max"].toggles["toggle-suav"]=toggleSuav.checked);

// ===== APLICAR ESTADO =====
function applyStateToUI(state){
  if(!state) return;
  slider.value = state.sliderValue;
  sliderSuav.value = state.sliderSuav;
  percent.textContent = slider.value+"%";
  percentSuav.textContent = sliderSuav.value+"%";
  barra.style.width = slider.value+"%";
  barraSuav.style.width = sliderSuav.value+"%";
  toggleRecoil.checked = state.toggles["toggle-recoil"];
  togglePrecision.checked = state.toggles["toggle-precision"];
  toggleSuav.checked = state.toggles["toggle-suav"];
  updateAllThumbs();
}

// ===== TROCA DE ABAS =====
function setTab(normal){
  if(normal){
    tabNormal.classList.add("active");
    tabMax.classList.remove("active");
    injetarNormal.style.display="inline-block";
    injetarMax.style.display="none";
    applyStateToUI(savedState.normal);
  }else{
    tabNormal.classList.remove("active");
    tabMax.classList.add("active");
    injetarNormal.style.display="none";
    injetarMax.style.display="inline-block";
    applyStateToUI(savedState.max);
  }
}
tabNormal.addEventListener("click",()=>setTab(true));
tabMax.addEventListener("click",()=>setTab(false));
setTab(true);

// ===== INJETAR =====
function toggleInjectVisual(btn,scheme){
  const injected = btn.dataset.injected==="1";
  if(!injected){
    btn.textContent="INJETADO";
    btn.style.background="var(--pink)";
    btn.style.color="#000";
    btn.style.boxShadow="0 0 25px var(--pink),0 0 60px var(--pink)";
    btn.classList.add("active");
    btn.dataset.injected="1";
    try{window.location.href=scheme}catch(e){}
  }else{
    btn.textContent="INJETAR";
    btn.style.background="#555";
    btn.style.color="#fff";
    btn.style.boxShadow="0 0 10px transparent";
    btn.classList.remove("active");
    btn.dataset.injected="0";
  }
}

injetarNormal.addEventListener("click",()=>toggleInjectVisual(injetarNormal,"freefire://"));
injetarMax.addEventListener("click",()=>toggleInjectVisual(injetarMax,"freefiremax://"));
