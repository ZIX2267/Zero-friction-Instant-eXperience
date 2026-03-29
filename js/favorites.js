import { DB, saveFavorites } from "./db.js";
import { AUTH } from "./auth.js";

export function toggleFavorite(adId){

  if(!AUTH.user) return false;

  const uid = AUTH.user.id;

  if(!DB.favorites[uid])
    DB.favorites[uid] = [];

  const list = DB.favorites[uid];

  const i = list.indexOf(adId);

  if(i === -1)
    list.push(adId);
  else
    list.splice(i,1);

  saveFavorites();

  return true;
}