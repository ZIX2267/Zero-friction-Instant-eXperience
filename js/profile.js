import { AUTH } from "./auth.js";
import { openMyAdsPage } from "./router.js";

export function openProfilePage(appRoot){

  if(!AUTH.user){
    location.hash="login";
    return;
  }

  appRoot.innerHTML = `
    <div class="profile">

      <div class="avatar-big">
        ${AUTH.user.login[0].toUpperCase()}
      </div>

      <h2>${AUTH.user.login}</h2>

      <button id="myAdsBtn">
        Мои объявления
      </button>

    </div>
  `;

  document
    .getElementById("myAdsBtn")
    .onclick = openMyAdsPage;
}

window.addEventListener("hashchange", () => {

  const hash = location.hash.replace("#","");

  if(hash === "profile"){
    import("./profile.js")
      .then(m => m.openProfilePage(appRoot));
  }

});