import "./pages/category.page.js";
import "./pages/sub.page.js";
import "./pages/ad.page.js";
import "./pages/profile.page.js";
import "./pages/home.page.js";
import { getPage } from "./page.js";

/* ======================
   NAVIGATION
====================== */

export function navigate(url){

  history.pushState(
    {},
    "",
    "#" + url
  );

  handleRoute();
}

function parseURL(){

  const hash = location.hash.slice(1);

  const parts = hash.split("/").filter(Boolean);

  return {
    page: parts[0] || "home",
    param1: parts[1],
    param2: parts[2]
  };
}
/* ======================
   ROUTER CORE
====================== */
function handleRoute(){

  const root = document.getElementById("spaRoot");
  if(root) root.innerHTML = "";

  const route = parseURL();

  const page = getPage(route.page);

  if(!page){
    console.warn("Page not found");
    return;
  }

  window.fromHistory = true;
  page(route);
  window.fromHistory = false;
}

/* listeners */

window.addEventListener("popstate", handleRoute);
window.addEventListener("load", handleRoute);