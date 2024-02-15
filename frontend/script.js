document.addEventListener('DOMContentLoaded', () => {
const fetchData = (searchParams) => {
    fetch('http://localhost:5050/search', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(searchParams)
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Failed to fetch data');
        }
        return response.json();
    })
    .then(data => {
        displayGames(data.games);
    })
    .catch(error => console.error('Error:', error));
};

const displayGames = (games) => {
    const searchResults = document.getElementById('search-results');
    searchResults.innerHTML = '';
    if (games && games.length > 0) {
        games.forEach(game => {
            const listItem = document.createElement('li');
            let info = `Name: ${game.game_name}, Released: ${game.released}, Price: ${game.price_value}, Publisher: ${game.publisher_name || 'N/A'}, Developer: ${game.developer_name || 'N/A'}, Genre: ${game.genres.join(', ') || 'N/A'}, Review: ${game.review || 'N/A'}, Restriction: ${game.restriction_value || 'N/A'}, Controller Support: ${game.controllerSupport.join(', ') || 'N/A'}`;
            listItem.textContent = info;
            searchResults.appendChild(listItem);
        });
    } else {
        searchResults.innerHTML = '<li>No results found</li>';
    }
};

    document.getElementById('search-btn').addEventListener('click', () => {
        const gameName = document.getElementById('game-name').value;
        const released = document.getElementById('released').value;
        const price = document.getElementById('price').value;
        const publisher = document.getElementById('publisher').value;
        const developer = document.getElementById('developer').value;
        const genre = document.getElementById('genre').value;
        const review = document.getElementById('review').value;
        const restriction = document.getElementById('restriction').value;
        const controllerSupport = document.getElementById('controller-support').value;

        const searchParams = {
            game_name: gameName,
            released: released,
            price_value: price,
            publisher_name: publisher,
            developer_name: developer,
            genre_name: genre,
            review: review,
            restriction_value: restriction,
            supports_controller: controllerSupport
        };

        fetchData(searchParams);
    });
});
