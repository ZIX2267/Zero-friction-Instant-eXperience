import { registerPage } from "../page.js";
import { AUTH } from "../auth.js";

const root = document.getElementById("spaRoot");

registerPage("profile", () => {

  if(!AUTH.user){
    location.hash="login";
    return;
  }

  root.innerHTML = `
    <div class="profile">
      <h2>${AUTH.user.login}</h2>
      <button id="myAdsBtn">Мои объявления</button>
    </div>
  `;

  document.getElementById("myAdsBtn").onclick =
    () => location.hash="myads";
});