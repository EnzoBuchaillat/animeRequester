# Anime Requester

Une page web pour rechercher des animés : on tape un titre, un identifiant ou un rang de classement, ou on coche des genres, et les résultats s'affichent sous forme de cartes.

Projet de cours réalisé en équipe de 3 en 2<sup>e</sup> année de BUT Informatique (IUT Grand Ouest Normandie, Université de Caen), en HTML, CSS et JavaScript natifs, sans framework.

**[Voir la démo en ligne](https://enzobuchaillat.github.io/animeRequester/)**

## Fonctionnalités

- **Recherche par titre** : jusqu'à 10 animés dont le titre contient le texte saisi
- **Recherche par identifiant** : l'animé correspondant à un identifiant MyAnimeList
- **Recherche par classement** : l'animé qui occupe le rang demandé (1 = le mieux classé)
- **Recherche par genre** : on coche un ou plusieurs genres, et seuls les animés qui les ont **tous** sont affichés. La recherche se combine avec le titre ou le classement saisis au-dessus
- **Cartes de résultats** : affiche, titre, genres, classement, nombre d'épisodes et synopsis
- **Mode sombre**, mémorisé d'une visite à l'autre grâce au `localStorage`
- **Messages clairs** quand la saisie est invalide, qu'il n'y a aucun résultat ou que l'API ne répond pas
- **Accessibilité** visée au niveau WCAG 2.0 AA : libellés de formulaire, contrastes, focus visible, zone de résultats annoncée aux lecteurs d'écran (`aria-live`), langue des textes en anglais signalée (`lang="en"`)

## Technologies

- **HTML** : formulaires, `<template>` pour le modèle de carte
- **CSS** : mise en page, thème clair et sombre
- **JavaScript** : modules ES (`import` / `export`), `fetch` avec `async` / `await`, manipulation du DOM
- **API** : [Tenrai](https://api.tenrai.org/v1), qui fournit les données des animés

## Lancer le projet

Le plus simple est d'ouvrir la [démo en ligne](https://enzobuchaillat.github.io/animeRequester/).

En local, le JavaScript est découpé en modules : il faut donc passer par un petit serveur, et non ouvrir `index.html` directement depuis le disque.

```bash
git clone https://github.com/EnzoBuchaillat/animeRequester.git
cd animeRequester
python3 -m http.server 8000
```

Puis ouvrir http://localhost:8000 dans le navigateur. L'extension *Live Server* de VS Code fonctionne aussi.

## Structure du projet

```
animeRequester/
├── index.html         # La page : formulaires, zone de résultats, modèle de carte
├── favicon.png
├── CSS/
│   └── style.css      # Styles, thème clair et sombre
└── JS/
    ├── api.js         # Appels à l'API et mise en forme des données reçues
    ├── script.js      # Recherche par titre, identifiant ou classement
    ├── genres.js      # Chargement des genres et recherche par genre
    ├── affichage.js   # Création des cartes et des messages
    └── darkmode.js    # Bouton du mode sombre
```

## Organisation du travail

Le projet a été mené avec Git et GitHub :

- `main` : la version stable, publiée sur GitHub Pages
- `dev` : la branche d'intégration
- `feature/...`, `fix/...` : une branche par fonctionnalité ou correction, fusionnée dans `dev` par une Pull Request

## Équipe

- [Enzo Buchaillat](https://github.com/EnzoBuchaillat)
- [Elyas Ahmadi](https://github.com/ElyasAhm4di)
- [Tom](https://github.com/TomM4lh3rbe)
