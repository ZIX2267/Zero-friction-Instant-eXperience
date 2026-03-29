export const DB = {

  ads: JSON.parse(
    localStorage.getItem("ads") || "[]"
  ),

  favorites: JSON.parse(
    localStorage.getItem("favorites") || "{}"
  )

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