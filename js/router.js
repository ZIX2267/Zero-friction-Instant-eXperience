import { openProfilePage } from "./profile.js";
import { getMyAds } from "./ads.js";

let appRoot;

export function initRouter(root){
  appRoot = root;
}

export function openMyAdsPage(){

  history.pushState(
    {page:"myAds"},
    "",
    "#myads"
  );

  const ads = getMyAds();

  appRoot.innerHTML =
    "<h1>Мои объявления</h1>" +
    JSON.stringify(ads);
}

window.onpopstate = e=>{

  const state = e.state;

  if(!state) return;

  if(state.page==="myAds")
    openMyAdsPage();

};