// Affichage des cartes et des messages
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
    champ('synopsis').lang = anime.synopsis ? 'en' : 'fr'; // synopsis de l'API en anglais
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
            badge.lang = 'en';
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

export { afficherMessage, afficherAnimes };
