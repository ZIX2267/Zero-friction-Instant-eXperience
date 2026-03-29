export const DB = {
  categories: {},

  ads: JSON.parse(
    localStorage.getItem("ads") || "[]"
  ),

  favorites: JSON.parse(
    localStorage.getItem("favorites") || "{}"
  ),

  users: []
};

export function saveAds(){
  localStorage.setItem(
    "ads",
    JSON.stringify(DB.ads)
  );
}

export function saveFavorites(){
  localStorage.setItem(
    "favorites",
    JSON.stringify(DB.favorites)
  );
}