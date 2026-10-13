const API_HOST = "anime-db.p.rapidapi.com";
const API_URL = `https://${API_HOST}`;

/**
 * Envoie une requête GET à l'API Anime DB et renvoie le JSON.
 * @param {string} chemin ex : "/anime?page=1&size=10"
 */
async function appelerApi(chemin) {
  const reponse = await fetch(API_URL + chemin, {
    method: "GET",
    headers: {
      "x-rapidapi-key": API_KEY,
      "x-rapidapi-host": API_HOST,
    },
  });

  if (!reponse.ok) {
    throw new Error(`Erreur API : ${reponse.status}`);
  }
  return reponse.json();
}

// Test provisoire : affiche la réponse dans la console
appelerApi("/anime?page=1&size=10&sortOrder=asc")
  .then((data) => console.log(data))
  .catch((erreur) => console.error(erreur));
