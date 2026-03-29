/* =====================
   OLX AUTH LOCAL DB
   LOCALSTORAGE VERSION
===================== */

const AUTH = {

  user:null,

  register(){},

  login(){},

  logout(){},

  applyAuthUI(){},

/* ---------- INIT ---------- */

init(){

  if(!localStorage.getItem("users")){
    localStorage.setItem("users", JSON.stringify([]));
  }

  const saved = localStorage.getItem("user");

  if(saved){
    this.user = JSON.parse(saved);
    this.applyAuthUI();
  }

  this.bindProfileClick();
 this.autoLogin();

  /* ✅ ВСТАВИТЬ СЮДА */
  const savedLogin =
    localStorage.getItem("savedLogin");

  if(savedLogin){
    const input =
      document.querySelector("#loginInput");

    if(input) input.value = savedLogin;
  }

},
/* ---------- PROFILE CLICK ---------- */

bindProfileClick(){

  const profileLink =
    document.getElementById("profileBtn");

  if(!profileLink) return;

  profileLink.addEventListener("click", (e) => {

    e.preventDefault();

    // ❌ НЕ авторизован
    if (!AUTH.user) {

      e.stopPropagation();

      if (typeof openLoginPage === "function") {
        openLoginPage();
      } else {
        location.hash = "login";
      }

      return;
    }

    // ✅ авторизован → открыть SPA профиль
    if (typeof openProfilePage === "function") {
      openProfilePage();
    }

  });
},



/* ---------- REGISTER ---------- */

register(login,password){

  const users =
    JSON.parse(localStorage.getItem("users"));

  const exists =
    users.find(u=>u.login===login);

  if(exists)
    return "LOGIN_EXISTS";

  const user = {
    id: Date.now(), // уникальный ID
    login,
    password
  };

  users.push(user);

  localStorage.setItem(
    "users",
    JSON.stringify(users)
  );

  /* =========================
     AUTO LOGIN AFTER REGISTER
  ========================= */

  this.user = {
    id:user.id,
    login:user.login
  };

  localStorage.setItem(
    "user",
    JSON.stringify(this.user)
  );

  this.applyAuthUI();

  // закрываем регистрацию → назад
  history.back();

  return "OK";
},

/* ---------- LOGIN ---------- */
login(login,password){

  const users =
    JSON.parse(localStorage.getItem("users")) || [];

  const user =
    users.find(u => u.login === login);

  if(!user)
    return "USER_NOT_FOUND";

  if(user.password !== password)
    return "WRONG_PASSWORD";

this.user = user;
localStorage.setItem("user", JSON.stringify(user));
localStorage.setItem("savedLogin", login);
localStorage.setItem("savedPass", password);
this.applyAuthUI();

return "OK";
},

/* -------- LOGOUT -------- */

logout(){
  this.user = null;
  localStorage.removeItem("user");
  this.applyAuthUI();
},

/* ---------- UI ---------- */

applyAuthUI(){

  const btn = document.getElementById("profileBtn");
  if(!btn) return;

  btn.innerHTML = "Мой профиль";

  if(this.user){

const avatar = document.createElement("span");
avatar.className = "avatar-mini";

const letter =
  this.user.login.charAt(0).toUpperCase();

avatar.textContent = letter;

/* цвет зависит от логина */
const colors = [
  "#ff6b6b","#6bcB77","#4d96ff",
  "#f7b801","#9d4edd","#00bcd4"
];

let hash = 0;
for(let i=0;i<this.user.login.length;i++){
  hash += this.user.login.charCodeAt(i);
}

avatar.style.background =
  colors[hash % colors.length];

    btn.prepend(avatar);
}

},
autoLogin(){
  const savedLogin = localStorage.getItem("savedLogin");
  const savedPass = localStorage.getItem("savedPass");

  if(!savedLogin || !savedPass) return;

  const users =
    JSON.parse(localStorage.getItem("users") || "[]");

  const user = users.find(
    u => u.login === savedLogin && u.password === savedPass
  );

  if(user){
    this.user = user;
    this.applyAuthUI();
  }
},


/* ---------- INIT APP ---------- */

}; // ✅ ЗАКРЫЛИ ОБЪЕКТ AUTH

window.AUTH = AUTH;

window.addEventListener("load", () => AUTH.init());

document.addEventListener("click", e => {

  if(e.target.id === "logoutBtn"){

    AUTH.user = null;
    localStorage.removeItem("user");

    const modal =
      document.getElementById("profileModal");

    if(modal) modal.style.display = "none";

    AUTH.applyAuthUI();
  }
export { AUTH };

// ✅ делаем глобальным для старого SPA
window.AUTH = AUTH;

});
