// Recherche par genre

import { appelerApi, adapterAnime } from './api.js';
import { afficherAnimes, afficherMessage } from './affichage.js';

const formulaireGenre = document.getElementById('formGenre');
const listeGenres = document.getElementById('listeGenres');
const genresRetires = [26, 28]; // Girls Love, Boys Love

async function afficherGenres() {
    try {
        const reponse = await appelerApi('/genres/anime?filter=genres');
        listeGenres.replaceChildren(); // enlève "Chargement..."

        reponse.data.forEach((genre) => {
            if (genresRetires.includes(genre.mal_id)) {
                return;
            }

            const etiquette = document.createElement('label');
            etiquette.className = 'genre';

            const caseACocher = document.createElement('input');
            caseACocher.type = 'checkbox';
            caseACocher.name = 'genre';
            caseACocher.value = genre.mal_id;

            etiquette.appendChild(caseACocher);
            etiquette.append(genre.name);
            listeGenres.appendChild(etiquette);
        });
    } catch (erreur) {
        console.error(erreur);
        listeGenres.textContent = 'Impossible de charger les genres.';
    }
}

// l'anime doit avoir tous les genres cochés
async function rechercherParGenre(idsGenres) {
    const parametres = new URLSearchParams({
        genres: idsGenres.join(','),
        limit: 10,
    });
    const reponse = await appelerApi(`/anime?${parametres}`);
    return reponse.data.map(adapterAnime);
}

formulaireGenre.addEventListener('submit', async (e) => {
    e.preventDefault();

    const cochees = formulaireGenre.querySelectorAll('input[name="genre"]:checked');
    if (cochees.length === 0) {
        afficherMessage('Cochez au moins un genre.');
        return;
    }
    const ids = Array.from(cochees).map((c) => c.value);

    try {
        const animes = await rechercherParGenre(ids);
        afficherAnimes(animes);
    } catch (erreur) {
        console.error(erreur);
        afficherMessage('Erreur lors de la recherche par genre.');
    }
});

// vide aussi les résultats
formulaireGenre.addEventListener('reset', () => {
    document.getElementById('resultats').replaceChildren();
});

afficherGenres();
