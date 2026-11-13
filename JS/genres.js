// Recherche par genre

import { appelerApi, adapterAnime } from './api.js';
import { afficherAnimes, afficherMessage } from './affichage.js';

const formulaireGenre = document.getElementById('formGenre');
const listeGenres = document.getElementById('listeGenres');
const genresRetires = [26, 28]; // Girls Love, Boys Love
const champType = document.getElementById('RechercheType');
const champParametre = document.getElementById('Parametre');

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
            etiquette.lang = 'en'; // noms de genres de l'API en anglais

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
// on tient compte aussi du titre ou du classement tapé en haut
async function rechercherParGenre(idsGenres, type, valeur) {
    const parametres = new URLSearchParams({
        genres: idsGenres.join(','),
        limit: 10,
    });

    if (type === 'Recherche par titre' && valeur !== '') {
        parametres.set('q', valeur);
    }

    if (type === 'Recherche par classement' && valeur !== '') {
        const rang = Number(valeur);
        if (!Number.isInteger(rang) || rang < 1) {
            throw new Error('Le classement doit être un entier positif.');
        }
        // le rang 1 = le mieux classé parmi ces genres
        parametres.set('order_by', 'rank');
        parametres.set('sort', 'asc');
        parametres.set('limit', 25);
        parametres.set('page', Math.ceil(rang / 25));
        const reponse = await appelerApi(`/anime?${parametres}`);
        const anime = reponse.data[(rang - 1) % 25];
        return anime ? [adapterAnime(anime)] : [];
    }

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
        const animes = await rechercherParGenre(ids, champType.value, champParametre.value.trim());
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
