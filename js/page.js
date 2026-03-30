/* ======================
   PAGE REGISTRY
====================== */

const pages = {};

/* регистрация страницы */
export function registerPage(name, handler){
  pages[name] = handler;
}

/* получение страницы */
export function getPage(name){
  return pages[name];
}