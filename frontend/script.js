const fetchData = () => {
    fetch('http://localhost:5050/data')
        .then(response => {
            if (!response.ok) {
                throw new Error('Failed to fetch data');
            }
            return response.json();
        })
        .then(data => {
            const publisherSelect = document.getElementById('publisher-select');
            publisherSelect.innerHTML = '<option value="">Select Publisher</option>';
            if (data.publishers && data.publishers.length > 0) {
                data.publishers.forEach(publisher => {
                    const option = document.createElement('option');
                    option.value = publisher.id;
                    option.textContent = publisher.publisher_name;
                    publisherSelect.appendChild(option);
                });
            } else {
                console.error('No publishers data found');
            }
        })
        .catch(error => console.error('Error:', error));
};

fetchData();

document.getElementById('publisher-select').addEventListener('change', () => {
    const selectedPublisherId = document.getElementById('publisher-select').value;
    if (selectedPublisherId) {
        fetch(`http://localhost:5050/publisherData/${selectedPublisherId}`)
            .then(response => {
                if (!response.ok) {
                    throw new Error('Failed to fetch data');
                }
                return response.json();
            })
            .then(data => {
                const gameList = document.getElementById('game-list');
                gameList.innerHTML = '';
                const addedGames = {};
                if (data.games && data.games.length > 0) {
                    data.games.forEach(game => {
                        if (!addedGames[game.id]) {
                            const listItem = document.createElement('li');
                            let info = `Name: ${game.game_name}, Released: ${game.released}, Price: ${game.price_value}, Publisher: ${game.publisher_name || 'N/A'}, Developer: ${game.developer_name || 'N/A'},`;
                            
                            const genres = game.genres ? game.genres.join(', ') : 'N/A';
                            info += ` Genre: ${genres},`;
                            
                            info += ` Review: ${game.review || 'N/A'},`;
                            
                            info += ` Restriction: ${game.restriction_value || 'N/A'},`;
                            
                            const controllerSupport = game.controllerSupport ? game.controllerSupport.map(cs => cs.supports_controller).join(', ') : 'N/A';
                            info += ` Controller Support: ${controllerSupport}`;
                            
                            listItem.textContent = info;
                            gameList.appendChild(listItem);
                            addedGames[game.id] = true;
                        }
                    });
                } else {
                    console.error('No games data found');
                }
            })
            .catch(error => console.error('Error:', error));
    } else {
        fetchData();
    }
});