import "./spa.js";
import { AUTH } from "./auth.js";
import { DB } from "./db.js";
import { addAd, getAds } from "./ads.js";
import { toggleFavorite } from "./favorites.js";
import { initRouter } from "./router.js";

const appRoot =
  document.getElementById("app");

initRouter(appRoot);

/* AUTO LOGIN */

AUTH.autoLogin?.();

/* GLOBAL EVENTS */

document.addEventListener("click", e=>{

  if(e.target.id==="profileBtn"){

    if(!AUTH.user){
      location.hash="login";
      return;
    }

    location.hash="profile";
  }

});