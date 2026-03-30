import { getMyAds } from "./ads.js";
import { initUI } from "./spa.js";

let appRoot;

export function initRouter(root){
  appRoot = root;
}

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

  initUI();
}

/* ===============================
   GLOBAL ROUTER
================================= */

function handleRoute(){

  const state = history.state;

  if(!state) return;

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
  }

  window.fromHistory = false;
}

window.addEventListener("popstate", handleRoute);

