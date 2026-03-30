import { initUI } from "./spa.js";
import { AUTH } from "./auth.js";
import { initRouter } from "./router.js";

const appRoot =
  document.getElementById("app");

initRouter(appRoot);
initUI();

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


document.addEventListener("click", e=>{

  if(e.target.id==="addAdBtn"){

    if(!AUTH.user){
      location.hash="login";
      return;
    }

    alert("Открыть страницу создания объявления");
  }

});
