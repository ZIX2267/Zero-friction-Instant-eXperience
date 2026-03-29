import { getMyAds } from "./ads.js";
import { initUI } from "./spa.js";

let appRoot;

export function initRouter(root){
  appRoot = root;
}

export function openMyAdsPage(){

location.hash = "myads";

  const ads = getMyAds();

  appRoot.innerHTML =
    "<h1>Мои объявления</h1>" +
    JSON.stringify(ads);

  initUI();
}

window.onpopstate = e=>{

  const state = e.state;
  if(!state) return;

  if(state.page==="myAds"){
    openMyAdsPage();
    initUI();
  }

};