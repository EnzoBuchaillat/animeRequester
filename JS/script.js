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

/**
 * Recherche jusqu'à 10 animes dont le titre contient le texte donné.
 * @param {string} nom
 * @returns {Promise<Array>} la liste des animes trouvés
 */
async function rechercherParNom(nom) {
  const parametres = new URLSearchParams({
    page: 1,
    size: 10,
    search: nom,
  });
  const reponse = await appelerApi(`/anime?${parametres}`);
  return reponse.data;
}

const formulaire = document.getElementById("form");
const champTypeRecherche = document.getElementById("RechercheType");
const champParametre = document.getElementById("Parametre");

formulaire.addEventListener("submit", async (e) => {
  e.preventDefault();

  const type = champTypeRecherche.value;
  const valeur = champParametre.value.trim();
  if (valeur == "") {
    return;
  }

  try {
    let animes = [];
    if (type == "Recherche par titre") {
      animes = await rechercherParNom(valeur);
    }
    console.log(animes);
  } catch (erreur) {
    console.error(erreur);
  }
});
