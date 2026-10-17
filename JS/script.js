const API_HOST = "anime-db.p.rapidapi.com";
const API_URL = `https://${API_HOST}`;
const CLE_STOCKAGE = "cleApi";
const formCleApi = document.getElementById("formCleApi");
const champCleApi = document.getElementById("champCleApi");
const messageCleApi = document.getElementById("messageCleApi");
const detailsCleApi = document.querySelector(".cle-api");

/**
 * Affiche un message sous le champ de la clé API.
 * @param {string} texte
 * @param {boolean} estErreur true pour afficher le message en rouge
 */
function afficherStatutCle(texte, estErreur) {
  messageCleApi.textContent = texte;
  messageCleApi.classList.toggle("cle-api__message--erreur", estErreur);
  if (estErreur) {
    detailsCleApi.open = true;
  }
}

/**
 * Renvoie la clé API enregistrée dans le sessionStorage (ou null).
 */
function lireCleApi() {
  return sessionStorage.getItem(CLE_STOCKAGE);
}

formCleApi.addEventListener("submit", (e) => {
  e.preventDefault();
  const cle = champCleApi.value.trim();
  if (cle === "") {
    afficherStatutCle("Veuillez coller votre clé API.", true);
    return;
  }
  sessionStorage.setItem(CLE_STOCKAGE, cle);
  champCleApi.value = "";
  afficherStatutCle("Clé API enregistrée pour cette session.", false);
});

/**
 * Envoie une requête GET à l'API Anime DB et renvoie le JSON.
 * @param {string} chemin ex : "/anime?page=1&size=10"
 */
async function appelerApi(chemin) {
  const reponse = await fetch(API_URL + chemin, {
    method: "GET",
    headers: {
      "x-rapidapi-key": lireCleApi(),
      "x-rapidapi-host": API_HOST,
    },
  });

  if (!reponse.ok) {
    const erreur = new Error(`Erreur API : ${reponse.status}`);
    erreur.status = reponse.status; // pour savoir ensuite si c'est un problème de clé
    throw erreur;
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

/**
 * Recherche un anime par son identifiant.
 * @param {string} id
 * @returns {Promise<Array>} un tableau avec l'anime trouvé
 */
async function rechercherParId(id) {
  const anime = await appelerApi(`/anime/by-id/${encodeURIComponent(id)}`);
  return [anime];
}

const formulaire = document.getElementById("form");
const champTypeRecherche = document.getElementById("RechercheType");
const champParametre = document.getElementById("Parametre");

formulaire.addEventListener("submit", async (e) => {
  e.preventDefault();

  const type = champTypeRecherche.value;
  const valeur = champParametre.value.trim();
  if (valeur === "") {
    return;
  }
  if (!lireCleApi()) {
    afficherStatutCle("Veuillez d'abord saisir votre clé API.", true);
    return;
  }

  try {
    let animes = [];
    if (type === "Recherche par titre") {
      animes = await rechercherParNom(valeur);
    } else if (type === "Recherche par identifiant") {
      animes = await rechercherParId(valeur);
    } else if (type === "Recherche par classement") {
      animes = await rechercherParClassement(valeur);
    }
    afficherAnimes(animes);
    if (messageCleApi.classList.contains("cle-api__message--erreur")) {
      afficherStatutCle("", false);
    }
  } catch (erreur) {
    console.error(erreur);
    if (erreur.status === 401 || erreur.status === 403) {
      afficherStatutCle("Clé API invalide ou non abonnée à Anime DB.", true);
      zoneResultats.replaceChildren();
    } else {
      afficherMessage("Aucun résultat ou erreur lors de la recherche.");
    }
  }
});

formulaire.addEventListener("reset", () => {
  const resultats = document.getElementById("resultats");
  if (resultats) {
    resultats.replaceChildren(); // supprime toutes les cartes affichées
  }
  champParametre.focus(); // pour que l’utilisateur puisse retaper directement
});

const modeleCarte = document.getElementById('modele-carte');

/**
 * Crée une carte HTML remplie avec les infos d'un anime
 * @param {Object} anime un objet renvoyé par l'API
 * @returns {HTMLElement} la carte prête à être ajoutée à la page
 */
function creerCarte(anime) {
    const copie = modeleCarte.content.cloneNode(true);
    const carte = copie.querySelector('.carte');

    const champ = (nom) => carte.querySelector(`[data-champ="${nom}"]`);

    champ('titre').textContent = anime.title;
    champ('synopsis').textContent = anime.synopsis || 'Pas de synopsis disponible.';
    champ('classement').textContent = anime.hasRanking ? `#${anime.ranking}` : 'Non classé';
    champ('episodes').textContent = anime.hasEpisode ? anime.episodes : 'Inconnu';

    const image = champ('image');
    if (anime.image) {
        image.src = anime.image;
        image.alt = `Affiche de ${anime.title}`;
    } else {
        carte.querySelector('.carte__media').remove();
    }

    const listeGenres = champ('genres');
    listeGenres.replaceChildren(); 

    if (anime.genres && anime.genres.length > 0) {
        anime.genres.forEach((genre) => {
            const badge = document.createElement('li');
            badge.className = 'carte__badge';
            badge.textContent = genre;
            listeGenres.appendChild(badge);
        });
    } else {
        const badgeVide = document.createElement('li');
        badgeVide.className = 'carte__badge--vide';
        badgeVide.textContent = 'Pas de genre renseigné';
        listeGenres.appendChild(badgeVide);
    }

    return carte;
}

const zoneResultats = document.getElementById('resultats');

/**
 * Affiche un message dans la zone des résultats (aucun résultat, erreur...).
 * @param {string} texte
 */
function afficherMessage(texte) {
    zoneResultats.replaceChildren();
    const message = document.createElement('p');
    message.className = 'message';
    message.textContent = texte;
    zoneResultats.appendChild(message);
}

/**
 * Affiche une carte pour chaque anime du tableau.
 * @param {Array} animes
 */
function afficherAnimes(animes) {
    if (animes.length === 0) {
        afficherMessage('Aucun résultat pour cette recherche.');
        return;
    }

    zoneResultats.replaceChildren(); // enlève les anciens résultats
    animes.forEach((anime) => {
        zoneResultats.appendChild(creerCarte(anime));
    });
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

  const anime = await appelerApi(`/anime/by-ranking/${rang}`);
  return [anime];
}




// Dark mode

const darkMode = document.getElementById('switch');

darkMode.checked = localStorage.getItem('theme') === 'dark';
document.body.classList.toggle('dark', darkMode.checked);

darkMode.addEventListener('change', () => {
    document.body.classList.toggle('dark', darkMode.checked);
    if (darkMode.checked) {
        localStorage.setItem('theme', 'dark');
    } else {
        localStorage.setItem('theme', 'light');
    }
});
