import "./spa.js";
import { AUTH } from "./auth.js";
import { initRouter } from "./router.js";

const appRoot =
  document.getElementById("app");

initRouter(appRoot);

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