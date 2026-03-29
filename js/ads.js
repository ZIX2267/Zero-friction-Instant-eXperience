import { DB, saveAds } from "./db.js";
import { AUTH } from "./auth.js";

export function createAd(data){

  if(!AUTH.user) return;

  const ad = {
    id: Date.now(),
    ownerId: AUTH.user.id,
    ...data
  };

  DB.ads.unshift(ad);

  saveAds();
}

export function getMyAds(){

  if(!AUTH.user) return [];

  return DB.ads.filter(
    ad => ad.ownerId === AUTH.user.id
  );
}

export function searchAds(query){

  query = query.toLowerCase();

  return DB.ads.filter(ad =>
    ad.title.toLowerCase().includes(query)
  );
}