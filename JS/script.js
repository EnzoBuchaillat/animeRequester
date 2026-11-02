import { rechercherParNom, rechercherParId, rechercherParClassement } from './api.js';
import { afficherMessage, afficherAnimes } from './affichage.js';
import './darkmode.js'; // se lance tout seul

/*const CLE_STOCKAGE = "cleApi";
const formCleApi = document.getElementById("formCleApi");
const champCleApi = document.getElementById("champCleApi");
const messageCleApi = document.getElementById("messageCleApi");
const detailsCleApi = document.querySelector(".cle-api");*/

/**
 * Affiche un message sous le champ de la clé API.
 * @param {string} texte
 * @param {boolean} estErreur true pour afficher le message en rouge
 */
/*function afficherStatutCle(texte, estErreur) {
  messageCleApi.textContent = texte;
  messageCleApi.classList.toggle("cle-api__message--erreur", estErreur);
  if (estErreur) {
    detailsCleApi.open = true;
  }
}*/

/**
 * Renvoie la clé API enregistrée dans le sessionStorage (ou null).
 */
/*function lireCleApi() {
  return sessionStorage.getItem(CLE_STOCKAGE);
}*/

/*formCleApi.addEventListener("submit", (e) => {
  e.preventDefault();
  const cle = champCleApi.value.trim();
  if (cle === "") {
    afficherStatutCle("Veuillez coller votre clé API.", true);
    return;
  }
  sessionStorage.setItem(CLE_STOCKAGE, cle);
  champCleApi.value = "";
  afficherStatutCle("Clé API enregistrée pour cette session.", false);
});*/

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
  /*if (!lireCleApi()) {
    afficherStatutCle("Veuillez d'abord saisir votre clé API.", true);
    return;
  }*/

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
    /*if (messageCleApi.classList.contains("cle-api__message--erreur")) {
      afficherStatutCle("", false);
    }*/
  } catch (erreur) {
    console.error(erreur);
    /*if (erreur.status === 401 || erreur.status === 403) {
      afficherStatutCle("Clé API invalide ou non abonnée à Anime DB.", true);
      zoneResultats.replaceChildren();
    } else {*/
      afficherMessage("Aucun résultat ou erreur lors de la recherche.");
    //}
  }
});

formulaire.addEventListener("reset", () => {
  const resultats = document.getElementById("resultats");
  if (resultats) {
    resultats.replaceChildren(); // supprime toutes les cartes affichées
  }
  champParametre.focus(); // pour que l’utilisateur puisse retaper directement
});
