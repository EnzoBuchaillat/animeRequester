const url = 'https://anime-db.p.rapidapi.com/anime?sortOrder=asc&page=1&size=10';

fetch(url, {
    method: 'GET',
    headers: {
        'x-rapidapi-key': API_KEY,
        'x-rapidapi-host': 'anime-db.p.rapidapi.com',
    },
})
.then(response => response.json())
.then(data => {
    console.log(data);
    const liste = document.getElementById('liste-anime');

    data.data.forEach((anime) => {
        const carte = document.createElement('div');
        carte.innerHTML = `<img src="${anime.image}" alt="${anime.name}" width="150">
<h2>${anime.name}</h2>`;
        liste.appendChild(carte);
    })

})
.catch(error => console.error(error));