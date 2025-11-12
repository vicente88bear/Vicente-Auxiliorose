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
const maxExtra = document.getElementById("maxExtra");
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
  normal: { sliderValue: 50, toggles: { "toggle-recoil": false, "toggle-precision": false, "toggle-suav": false } },
  max: { sliderValue: 100, toggles: { "toggle-recoil": false, "toggle-precision": false, "toggle-suav": false } }
};

// ===== AUX =====
function updateThumb(sliderEl, thumbEl, containerEl, barraEl){
  if(!sliderEl || !thumbEl || !containerEl || !barraEl) return;
  const val = Number(sliderEl.value);
  const max = Number(sliderEl.max||100);
  const rect = containerEl.getBoundingClientRect();
  const x = (val/max)*rect.width;
  const clamped = Math.max(0,Math.min(rect.width,x));
  thumbEl.style.left=clamped+"px";
  barraEl.style.width=(val/max*100)+"%";
}
function updateAllThumbs(){
  updateThumb(slider,thumb,containerPrincipal,barra);
  updateThumb(sliderSuav,thumbSuav,containerSuav,barraSuav);
}
window.addEventListener("resize",updateAllThumbs);
window.addEventListener("orientationchange",updateAllThumbs);

// ===== SLIDERS =====
function attachSliderEvents(sliderEl, thumbEl, barraEl, percentEl, tabName){
  sliderEl.addEventListener("input",()=>{
    percentEl.textContent=sliderEl.value+"%";
    updateThumb(sliderEl, thumbEl, sliderEl===slider?containerPrincipal:containerSuav, barraEl);
    savedState[tabName].sliderValue=sliderEl.value;
  });
  sliderEl.addEventListener("touchmove",()=>{
    percentEl.textContent=sliderEl.value+"%";
    updateThumb(sliderEl, thumbEl, sliderEl===slider?containerPrincipal:containerSuav, barraEl);
    savedState[tabName].sliderValue=sliderEl.value;
  });
}
attachSliderEvents(slider, thumb, barra, percent, "normal");
attachSliderEvents(sliderSuav, thumbSuav, barraSuav, percentSuav, "max");

// ===== TOGGLES =====
toggleRecoil.addEventListener("change",()=>{
  const tab = tabNormal.classList.contains("active")?"normal":"max";
  savedState[tab].toggles["toggle-recoil"]=toggleRecoil.checked;
});
togglePrecision.addEventListener("change",()=>{
  const tab = tabNormal.classList.contains("active")?"normal":"max";
  savedState[tab].toggles["toggle-precision"]=togglePrecision.checked;
});
toggleSuav.addEventListener("change",()=>{
  const tab = tabNormal.classList.contains("active")?"normal":"max";
  savedState[tab].toggles["toggle-suav"]=toggleSuav.checked;
});

// ===== APLICAR ESTADO =====
function applyStateToUI(state,isMax){
  if(!state) return;
  if(typeof state.sliderValue!=="undefined"){
    if(isMax){
      sliderSuav.value=state.sliderValue;
      percentSuav.textContent=sliderSuav.value+"%";
      barraSuav.style.width=sliderSuav.value+"%";
    }else{
      slider.value=state.sliderValue;
      percent.textContent=slider.value+"%";
      barra.style.width=slider.value+"%";
    }
  }
  if(state.toggles){
    toggleRecoil.checked=!!state.toggles["toggle-recoil"];
    togglePrecision.checked=!!state.toggles["toggle-precision"];
    toggleSuav.checked=!!state.toggles["toggle-suav"];
  }
  updateAllThumbs();
}

// ===== TROCA DE ABAS =====
function setTab(normal){
  if(normal){
    tabNormal.classList.add("active");
    tabMax.classList.remove("active");
    maxExtra.style.display="none";
    injetarNormal.style.display="inline-block";
    injetarMax.style.display="none";
    applyStateToUI(savedState.normal,false);
  }else{
    tabNormal.classList.remove("active");
    tabMax.classList.add("active");
    maxExtra.style.display="block";
    injetarNormal.style.display="none";
    injetarMax.style.display="inline-block";
    applyStateToUI(savedState.max,true);
  }
  setTimeout(updateAllThumbs,0);
}
tabNormal.addEventListener("click",()=>setTab(true));
tabMax.addEventListener("click",()=>setTab(false));
setTab(true);

// ===== INJETAR =====
function toggleInjectVisual(btn,scheme){
  const injected=btn.dataset.injected==="1";
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

// ===== INICIALIZA =====
applyStateToUI(savedState.normal,false);
applyStateToUI(savedState.max,true);
