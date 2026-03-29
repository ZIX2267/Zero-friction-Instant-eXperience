import { DB, saveAds, saveFavorites } from "./db.js";
import {
  categoriesSection,
  vipSection,
  searchSection,
  homeLogo,
  categoryGrid
} from "./dom.js";


import { AUTH } from "./auth.js";
/* ===============================
   OLX SPA ENGINE
   НЕ ИЗМЕНЯЕТ ГЛАВНУЮ СТРАНИЦУ
================================= */

/* ===============================
   DATABASE (AUTO OLX SYSTEM)
================================= */


const images = [
  "https://picsum.photos/400/300?1",
  "https://picsum.photos/400/300?2",
  "https://picsum.photos/400/300?3",
  "https://picsum.photos/400/300?4",
  "https://picsum.photos/400/300?5",
  "https://picsum.photos/400/300?6",
  "https://picsum.photos/400/300?7",
  "https://picsum.photos/400/300?8"
];

const descriptions = [
  "Отличное состояние, использовалось аккуратно. Без дефектов.",
  "Практически новое, продаю из-за переезда.",
  "Работает идеально, есть небольшие следы использования.",
  "Качественная вещь, покупалась дорого.",
  "В хорошем состоянии, всё как на фото.",
  "Почти не использовалось.",
  "Полностью исправно, можно проверять при встрече.",
  "Продажа срочная, поэтому цена снижена."
];

function rand(min, max){
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function createAd(title, price, category){

  if(!AUTH.user){
    openLoginPage();
    return;
  }

  const ad = {
    id: Date.now(),
    ownerId: AUTH.user.id,
    title,
    price,
    category,
    sub:"Мои",
    condition:"Новое",
    img:"https://picsum.photos/400/300?random="+Math.random(),
    description:"Пользовательское объявление"
  };

  DB.ads.unshift(ad);

  openProfilePage();
}

/* ===============================
   CREATE CATEGORIES FROM HOME PAGE
================================= */

function buildCategoriesFromHome(){

  const cats = document.querySelectorAll("#categoryGrid .category");

  cats.forEach(cat=>{

    const name = cat.querySelector("p").textContent.trim();

    DB.categories[name] = {
      sub: [
        "Все объявления",
        "Популярное",
        "Новое",
        "Б/у",
        "Другое"
      ],
      filters:["Цена","Состояние","Дата"]
    };

  });

} 

function generateAds(){

  const ads = [];

  Object.keys(DB.categories).forEach(category=>{

    DB.categories[category].sub.forEach(sub=>{

      for(let i=0;i<8;i++){

ads.push({
  id: ads.length + 1,
ownerId: null,

  category,
  sub,
  title: `${category} — ${sub} #${i+1}`,
  price: 100 + i * 15,
  condition: i % 2 ? "Б/У" : "Новое",
  img: images[i],
description: descriptions[rand(0, descriptions.length-1)]
});

      }

    });

  });

  return ads;
}
 

/* ---------- SPA ROOT ---------- */

const appRoot = document.createElement("section");
appRoot.className = "container";
appRoot.id = "spaRoot";
document.body.appendChild(appRoot);


/* ---------- HELPERS ---------- */

function hideHome() {
  categoriesSection.style.display = "none";
  vipSection.style.display = "none";
  searchSection.style.display = "none";
}

function showHome(fromHistory = false) {

  if(!fromHistory){
    history.pushState(
      { page: "home" },
      "",
      "#home"
    );
  }

  categoriesSection.style.display = "block";
  vipSection.style.display = "block";
  searchSection.style.display = "block";

  appRoot.innerHTML = "";
}

/* ---------- ADS RENDER ---------- */

function renderAds(list) {

  return `
    <div class="ads-grid">
      ${list.map(ad=>`
        <div class="ad-card" data-id="${ad.id}">
          <img src="${ad.img}" />

          <div class="ad-info">

            <div class="ad-condition ${ad.condition === 'Новое' ? 'new' : 'used'}">
              ${ad.condition}
            </div>

            <h3>${ad.title}</h3>
<button class="fav-btn" data-id="${ad.id}">
❤
</button>

            <p class="price">${ad.price} €</p>

          </div>
        </div>
      `).join("")}
    </div>
  `;
}

/* ---------- FILTERS ---------- */

function renderFilters(){

  return `
    <div class="filters">

      <div class="price-filter">
        <input type="number" id="priceFrom" placeholder="Цена от €">
        <input type="number" id="priceTo" placeholder="Цена до €">
      </div>

      <select id="conditionFilter">
        <option value="">Состояние</option>
        <option value="Новое">Новое</option>
        <option value="Б/У">Б/У</option>
      </select>

    </div>
  `;
}

/* ---------- CATEGORY PAGE ---------- */

function openCategory(category){

if(!window.fromHistory){
  history.pushState(
    { page: "category", category },
    "",
    "#category=" + category
  );
}

hideHome();

// ✅ показываем поиск ПОСЛЕ скрытия главной
searchSection.style.display = "block";

  const data = DB.categories[category];

  appRoot.innerHTML = `
      <h2>${category}</h2>

      <div class="subcats">
        ${data.sub.map(s=>`
          <button class="sub-btn" data-sub="${s}">
            ${s}
          </button>
        `).join("")}
      </div>

      ${renderFilters()}

      <div id="adsContainer">
        ${renderAds(
          DB.ads.filter(a=>a.category===category)
        )}
      </div>
  `;


  /* ---------- FILTERS ---------- */

  const priceFrom = document.getElementById("priceFrom");
  const priceTo = document.getElementById("priceTo");
  const condition = document.getElementById("conditionFilter");

priceFrom.addEventListener("input", applyFilters);
priceTo.addEventListener("input", applyFilters);
condition.addEventListener("change", applyFilters);

// применить фильтр сразу
applyFilters();

  function applyFilters(){

    let ads = DB.ads.filter(a=>a.category===category);

    const from = Number(priceFrom.value);
    const to = Number(priceTo.value);
    const cond = condition.value;

    if(from) ads = ads.filter(a=>a.price >= from);
    if(to) ads = ads.filter(a=>a.price <= to);
    if(cond) ads = ads.filter(a=>a.condition === cond);

    document.getElementById("adsContainer").innerHTML =
      renderAds(ads);
  }

  /* ---------- SUB BUTTONS ---------- */

  document.querySelectorAll(".sub-btn")
    .forEach(btn=>{
      btn.onclick = () =>
        openSub(category, btn.dataset.sub);
    });

} // 
/* ---------- SUBCATEGORY PAGE ---------- */

function openSub(category, sub){

  /* ---------- HISTORY ---------- */

  if(!window.fromHistory){
    history.pushState(
      { page:"sub", category, sub },
      "",
      "#category=" + category + "&sub=" + sub
    );
  }

  hideHome();
  searchSection.style.display = "block";

  appRoot.innerHTML = `
    <h2>${category} / ${sub}</h2>

    ${renderFilters()}

    <div id="adsContainer"></div>
  `;

  const priceFrom = document.getElementById("priceFrom");
  const priceTo = document.getElementById("priceTo");
  const condition = document.getElementById("conditionFilter");

  function applyFilters(){

    let ads = DB.ads.filter(a =>
      a.category === category &&
      a.sub === sub
    );

    const from = Number(priceFrom.value);
    const to = Number(priceTo.value);
    const cond = condition.value;

    if(from) ads = ads.filter(a=>a.price >= from);
    if(to) ads = ads.filter(a=>a.price <= to);
    if(cond) ads = ads.filter(a=>a.condition === cond);

    document.getElementById("adsContainer").innerHTML =
      renderAds(ads);
  }

  priceFrom.addEventListener("input", applyFilters);
  priceTo.addEventListener("input", applyFilters);
  condition.addEventListener("change", applyFilters);

  applyFilters();
}

/* ---------- AD PAGE ---------- */

function openAd(id){

  const ad = DB.ads.find(a => a.id == id);
  if(!ad) return;

  if(!window.fromHistory){
    history.pushState(
      { page:"ad", id },
      "",
      "#ad=" + id
    );
  }

  hideHome();
  searchSection.style.display = "block";

  appRoot.innerHTML = `
    <div class="ad-page">

      <button id="adBack">← Назад</button>

      <div class="ad-layout">

        <img class="ad-big-img" src="${ad.img}">

        <div class="ad-side">
          <h1>${ad.title}</h1>
          <div class="price">${ad.price} €</div>

          <p><b>Категория:</b> ${ad.category}</p>
          <p><b>Раздел:</b> ${ad.sub}</p>
          <p><b>Состояние:</b> ${ad.condition}</p>
<p style="margin-top:15px">${ad.description}</p>
        </div>

      </div>
    </div>
  `;

  document.getElementById("adBack").onclick =
    () => history.back();
}

/* ---------- AD CLICK ---------- */

document.addEventListener("click", (e)=>{

  const card = e.target.closest(".ad-card");
  if(!card) return;

  const id = card.dataset.id;
  if(id) openAd(id);

});

if (categoryGrid) {
  categoryGrid.addEventListener("click", (e) => {

    const cat = e.target.closest(".category");
    if (!cat) return;

    const name = cat.querySelector("p").textContent.trim();

    if (DB.categories[name]) {
      openCategory(name);
    }

  });
}

/* ---------- RETURN HOME ---------- */


if (homeLogo) {
  homeLogo.addEventListener("click", showHome);
}


/* ---------- STYLES (OLX LOOK) ---------- */

const style = document.createElement("style");
style.innerHTML = `

.subcats{
  display:flex;
  gap:10px;
  margin:20px 0;
}

.sub-btn{
  padding:10px 14px;
  border:none;
  border-radius:8px;
  background:#e8f1f2;
  cursor:pointer;
  font-weight:600;
}

.filters{
  display:flex;
  gap:12px;
  margin-bottom:20px;
}

.filters select{
  padding:10px;
  border-radius:6px;
}

.ads-grid{
  display:grid;
  grid-template-columns:repeat(2,1fr);
  gap:16px;
}

.ad-card{
  background:white;
  border-radius:10px;
  overflow:hidden;
  display:flex;
  gap:14px;
  box-shadow:0 2px 10px rgba(0,0,0,.08);
}

.ad-card img{
  width:160px;
  height:120px;
  object-fit:cover;
}

.ad-info{
  padding:10px;
}

.price{
  font-weight:800;
}

.price-filter{
  display:flex;
  gap:10px;
}

.price-filter input{
  padding:10px;
  border-radius:6px;
  border:1px solid #ccc;
  width:130px;
}

.ad-card{
  background:#fff;
  border-radius:12px;
  overflow:hidden;
  display:flex;
  gap:16px;
  padding:10px;
  box-shadow:0 3px 14px rgba(0,0,0,.08);
  transition:.2s;
}

.ad-card:hover{
  transform:translateY(-2px);
  box-shadow:0 6px 20px rgba(0,0,0,.12);
}

.ad-info h3{
  font-weight:800;
  font-size:18px;
  margin:6px 0;
}

.price{
  font-weight:900;
  font-size:18px;
  margin-top:6px;
}

.ad-condition{
  display:inline-block;
  padding:4px 8px;
  border-radius:6px;
  font-size:12px;
  font-weight:700;
  margin-bottom:6px;
}

.ad-condition.new{
  background:#e6f7ec;
  color:#1a7f37;
}

.ad-condition.used{
  background:#eef1f3;
  color:#555;
}

/* ---------- AD PAGE ---------- */

.ad-layout{
  display:flex;
  gap:30px;
  margin-top:20px;
}

.ad-big-img{
  width:600px;
  border-radius:12px;
}

.ad-side{
  background:#fff;
  padding:20px;
  border-radius:12px;
  box-shadow:0 3px 14px rgba(0,0,0,.08);
}

#adBack{
  margin-bottom:20px;
}

/* ---------- FILTER INPUTS ---------- */

.filters input,
.filters select{
  padding:12px 14px;
  border-radius:10px;
  border:1px solid #d0d7de;
  font-weight:700;
  font-size:14px;

  background:#fff;
  color:#6b7c85;   /* ← ВОТ ЭТА СТРОКА */

  appearance:none;
  -webkit-appearance:none;
  -moz-appearance:none;

  cursor:pointer;
}

/* ---------- PRICE STYLE ---------- */

.price{
  font-weight:900;
  font-size:18px;
  color:#002f34;
  margin-top:6px;
}

/* ---------- CONDITION BADGE ---------- */

.ad-condition{
  display:inline-block;
  padding:4px 10px;
  border-radius:6px;
  font-weight:800;
  font-size:12px;
  margin-bottom:6px;
}

.ad-condition.new{
  background:#e6f7ee;
  color:#067647;
}

.ad-condition.used{
  background:#eef2ff;
  color:#3730a3;
}

/* ---------- CARD TEXT ---------- */

.ad-info h3{
  font-weight:800;
  font-size:16px;
  color:#002f34;
}

/* ===============================
   AUTH OVERLAY
================================= */

.auth-overlay{
  position:fixed;
  inset:0;
  background:rgba(0,0,0,.45);
  display:flex;
  align-items:center;
  justify-content:center;
  z-index:9999;
}

.auth-box{
  background:#fff;
  padding:30px;
  border-radius:12px;
  width:320px;
  box-shadow:0 10px 40px rgba(0,0,0,.25);
  display:flex;
  flex-direction:column;
  gap:12px;
}

.auth-box input{
  padding:12px;
  border-radius:8px;
  border:1px solid #ccc;
}

.auth-box button{
  padding:12px;
  border:none;
  border-radius:8px;
  background:#002f34;
  color:white;
  font-weight:700;
  cursor:pointer;
}

#authError{
  color:red;
  font-weight:600;
  min-height:18px;
}

/* PROFILE MODAL */

.profile-modal{
  position:fixed;
  inset:0;
  background:rgba(0,0,0,.4);
  display:flex;
  align-items:center;
  justify-content:center;
  z-index:9999;
}

.profile-box{
  background:#fff;
  padding:25px;
  border-radius:12px;
  width:280px;
  text-align:center;
}

.avatar{
  font-size:40px;
  margin-bottom:10px;
}

.profile-box button{
  margin-top:15px;
  padding:10px;
  width:100%;
  border:none;
  border-radius:8px;
  background:#002f34;
  color:#fff;
  cursor:pointer;
}

.auth-box{
  position:relative;
}

.auth-close{
  position:absolute;
  right:12px;
  top:10px;
  font-size:18px;
  cursor:pointer;
  font-weight:700;
}

.avatar-mini{
  background:#002f34;
  color:#fff;
  width:26px;
  height:26px;
  border-radius:50%;
  display:inline-flex;
  align-items:center;
  justify-content:center;
  font-weight:700;
  margin-right:8px;
}

.profile{
  background:#fff;
  padding:20px;
  border-radius:12px;
  box-shadow:0 2px 10px rgba(0,0,0,.1);
}

.profile img{
  width:120px;
  height:120px;
  border-radius:50%;
  object-fit:cover;
}

`;

document.head.appendChild(style);

/* ===============================
   PROFILE PAGE (SPA)
================================= */

function openProfilePage(){

  // защита
  if(!AUTH.user){
    openLoginPage();
    return;
  }

  history.pushState(
    {page:"profile"},
    "",
    "#profile"
  );

  hideHome();
  searchSection.style.display = "none";

  const myAds = DB.ads.filter(
    ad => ad.ownerId === AUTH.user.id
  );

  appRoot.innerHTML = `
    <div class="profile-page">

      <h1>Мой профиль</h1>

      <p><b>Логин:</b> ${AUTH.user.login}</p>

      <button id="logoutBtn">
        Выйти
      </button>

      <h2 style="margin-top:30px">
        Мои объявления
      </h2>

      ${
        myAds.length
          ? renderAds(myAds)
          : "<p>Объявлений пока нет</p>"
      }

    </div>
  `;

  document.getElementById("logoutBtn").onclick=()=>{
    AUTH.logout();
    showHome();
  };
}

/* ===============================
   AUTH SPA PAGES
================================= */

window.openLoginPage = function(){

  history.pushState({page:"login"},"","#login");

  document.getElementById("authPage")?.remove();

  document.body.insertAdjacentHTML("beforeend",`
    <div id="authPage" class="auth-overlay">
      <div class="auth-box">

        <span class="auth-close" id="authClose">✕</span>

        <h3>Вход</h3>

        <input id="loginInput" placeholder="Логин">
        <input id="passInput" type="password" placeholder="Пароль">

        <button id="loginBtn">Войти</button>

        <p>
          Нет аккаунта?
          <a href="#" id="goRegister">Регистрация</a>
        </p>

        <div id="authError"></div>

      </div>
    </div>
  `);

  // ❌ закрытие крестиком
  document.getElementById("authClose").onclick =
    () => document.getElementById("authPage").remove();

  // ❌ клик вне окна
  document.getElementById("authPage").onclick = e=>{
    if(e.target.id==="authPage")
      e.currentTarget.remove();
  };

  // LOGIN
  document.getElementById("loginBtn").onclick=()=>{

    const res = AUTH.login(
      loginInput.value,
      passInput.value
    );

    const err = document.getElementById("authError");

    if(res==="USER_NOT_FOUND")
      err.textContent="Пользователь не найден";

    else if(res==="WRONG_PASSWORD")
      err.textContent="Неверный пароль";

    else if(res==="OK")
      document.getElementById("authPage").remove();
  };

  // переход к регистрации
  document.getElementById("goRegister").onclick=e=>{
    e.preventDefault();
    openRegisterPage();
  };
};

function openRegisterPage(){

  history.pushState({page:"register"},"","#register");

  document.getElementById("authPage")?.remove();

  document.body.insertAdjacentHTML("beforeend",`
    <div id="authPage" class="auth-overlay">
      <div class="auth-box">

        <span class="auth-close" id="authClose">✕</span>

        <h3>Регистрация</h3>

        <input id="rLogin" placeholder="Логин">
        <input id="rPass" type="password" placeholder="Пароль">

        <button id="registerBtn">Создать аккаунт</button>

        <div id="authError"></div>

      </div>
    </div>
  `);

  document.getElementById("authClose").onclick =
    () => document.getElementById("authPage").remove();

  document.getElementById("authPage").onclick = e => {
    if(e.target.id === "authPage")
      e.currentTarget.remove();
  };

  document.getElementById("registerBtn").onclick=()=>{

    const res = AUTH.register(
      rLogin.value,
      rPass.value
    );

    const err = document.getElementById("authError");

    if(res==="LOGIN_EXISTS")
      err.textContent="Логин уже существует";

    else if(res==="OK")
      openLoginPage();
  };
}

addEventListener("click", e=>{

  if(!e.target.classList.contains("fav-btn"))
    return;

  if(!AUTH.user){
    openLoginPage();
    return;
  }

  const id = Number(e.target.dataset.id);
  const uid = AUTH.user.id;

  if(!DB.favorites[uid])
    DB.favorites[uid] = [];

  const list = DB.favorites[uid];

  const index = list.indexOf(id);

  if(index === -1)
    list.push(id);
  else
    list.splice(index,1);

  saveFavorites();
});

/* ===============================
   INIT DATABASE
================================= */

/* ---------- BROWSER BACK BUTTON ---------- */

window.addEventListener("load", ()=>{

  buildCategoriesFromHome();

  // ✅ регистрируем главную страницу в history
  history.replaceState(
    { page: "home" },
    "",
    "#home"
  );
/* ---------- POPSTATE (BACK BUTTON) ---------- */

window.onpopstate = e => {

  const state = e.state;

  if(!state){
    showHome(true);
    return;
  }

  window.fromHistory = true;

  /* --- AUTH PAGES --- */
  if(state.page === "login")
    openLoginPage();

  else if(state.page === "register")
    openRegisterPage();

  /* --- SPA PAGES --- */
  else if(state.page === "home")
    showHome(true);

  else if(state.page === "category")
    openCategory(state.category, true);

  else if(state.page === "sub")
    openSub(state.category, state.sub, true);

  else if(state.page === "ad")
    openAd(state.id, true);

else if(state.page === "profile")
  openProfilePage();

  window.fromHistory = false;
};



});
