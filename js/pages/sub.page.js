import { registerPage } from "../page.js";

registerPage("sub", route=>{
  openSub(route.param1, route.param2);
});