import { registerPage } from "../page.js";
import { DB } from "../db.js";
import { hideHome } from "../spa.js";

registerPage("sub", route=>{
  openSub(route.param1, route.param2);
});

/* ---------- AD PAGE ---------- */

function openAd(id){

  const ad = DB.ads.find(a => a.id == id);
  if(!ad) return;

  if(!window.fromHistory){
    history.pushState(
      { page:"ad", id },
      "",
      "#ad=" + id
    );
  }

  hideHome();
  searchSection.style.display = "block";

  appRoot.innerHTML = `
    <div class="ad-page">

      <button id="adBack">← Назад</button>

      <div class="ad-layout">

        <img class="ad-big-img" src="${ad.img}">

        <div class="ad-side">
          <h1>${ad.title}</h1>
          <div class="price">${ad.price} €</div>

          <p><b>Категория:</b> ${ad.category}</p>
          <p><b>Раздел:</b> ${ad.sub}</p>
          <p><b>Состояние:</b> ${ad.condition}</p>
<p style="margin-top:15px">${ad.description}</p>
        </div>

      </div>
    </div>
  `;

  document.getElementById("adBack").onclick =
    () => history.back();
}