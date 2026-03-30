import { registerPage } from "../page.js";

registerPage("home", () => {

  const categories =
    document.getElementById("categoriesSection");

  const vip =
    document.getElementById("vipSection");

  const search =
    document.getElementById("searchSection");

  if(categories) categories.style.display="block";
  if(vip) vip.style.display="block";
  if(search) search.style.display="block";
});