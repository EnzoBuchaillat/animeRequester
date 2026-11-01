// Appels à l'API
const API_URL = "https://api.tenrai.org/v1";

/**
 * Envoie une requête GET à l'API Anime DB et renvoie le JSON.
 * @param {string} chemin ex : "/anime?page=1&size=10"
 */
async function appelerApi(chemin) {
    const reponse = await fetch(API_URL + chemin, {
        method: "GET",
    });

  if (!reponse.ok) {
    const erreur = new Error(`Erreur API : ${reponse.status}`);
    erreur.status = reponse.status; // pour savoir ensuite si c'est un problème de clé
    throw erreur;
  }
  return reponse.json();
}

function adapterAnime(anime) {
    return {
        title: anime.title,
        synopsis: anime.synopsis,
        hasRanking: anime.rank != null,
        ranking: anime.rank,
        hasEpisode: anime.episodes != null,
        episodes: anime.episodes,
        image: anime.images.jpg.image_url,
        genres: anime.genres.map((genre) => genre.name),
    };
}

/**
 * Recherche jusqu'à 10 animes dont le titre contient le texte donné.
 * @param {string} nom
 * @returns {Promise<Array>} la liste des animes trouvés
 */
async function rechercherParNom(nom) {
  const parametres = new URLSearchParams({
    page: 1,
        limit: 10,
        q: nom,
  });
  const reponse = await appelerApi(`/anime?${parametres}`);
    return reponse.data.map(adapterAnime);
}

/**
 * Recherche un anime par son identifiant.
 * @param {string} id
 * @returns {Promise<Array>} un tableau avec l'anime trouvé
 */
async function rechercherParId(id) {
    const reponse = await appelerApi(`/anime/${encodeURIComponent(id)}`);
    return [adapterAnime(reponse.data)];
}

/**
 * Recherche l'anime qui a le classement donné.
 * @param {string} classement le rang saisi (1 = le mieux classé)
 * @returns {Promise<Array>} un tableau avec l'anime trouvé
 */
async function rechercherParClassement(classement) {
  const rang = Number(classement);

  // Le rang doit être un entier à partir de 1
  if (!Number.isInteger(rang) || rang < 1) {
    throw new Error("Le classement doit être un entier positif.");
  }

    const reponse = await appelerApi(`/top/anime?page=${Math.ceil(rang / 25)}&limit=25`);
    return reponse.data.filter((anime) => anime.rank === rang).map(adapterAnime);
}

export { appelerApi, adapterAnime, rechercherParNom, rechercherParId, rechercherParClassement };
