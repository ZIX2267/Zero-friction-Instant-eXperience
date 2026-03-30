import { getMyAds } from "./ads.js";

import {
  showHome,
  openProfilePage,
  openCategory,
  openSub,
  openAd
} from "./spa.js";

let appRoot;

export function initRouter(root){
  appRoot = root;
}

/* ======================
   PAGES
====================== */

export function openMyAdsPage(){

  history.pushState(
    { page:"myAds" },
    "",
    "#myads"
  );

  const ads = getMyAds();

  appRoot.innerHTML =
    "<h1>Мои объявления</h1>" +
    JSON.stringify(ads);
}

/* ======================
   GLOBAL ROUTER
====================== */

function handleRoute(){

  // ⭐ очищаем SPA перед загрузкой новой страницы
  const spaRoot = document.getElementById("spaRoot");
  if (spaRoot) spaRoot.innerHTML = "";

  const state = history.state;

  if(!state){
    showHome(true);
    return;
  }

  window.fromHistory = true;

  switch(state.page){

    case "home":
      showHome(true);
      break;

    case "profile":
      openProfilePage();
      break;

    case "category":
      openCategory(state.category);
      break;

    case "sub":
      openSub(state.category, state.sub);
      break;

    case "ad":
      openAd(state.id);
      break;

    case "myAds":
      openMyAdsPage();
      break;
  }

  window.fromHistory = false;
}

  window.fromHistory = false;
}

/* listeners */

window.addEventListener("popstate", handleRoute);
window.addEventListener("load", handleRoute);
