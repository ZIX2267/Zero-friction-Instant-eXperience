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

