document.addEventListener('DOMContentLoaded', () => {
    fetch('http://localhost:5050/data')
        .then(response => response.json())
        .then(data => {
            const gameList = document.getElementById('game-list');
            data.game.forEach(game => {
                const listItem = document.createElement('li');

                listItem.textContent = 
                `Name: ${game.game_name},
                Released: ${game.released},
                Price: ${game.price_value}`;
                gameList.appendChild(listItem);
            });

            const publisherList = document.getElementById('publisher-list');
            data.publisher.forEach(publisher => {
                const listItem = document.createElement('li');

                listItem.textContent = publisher.publisher_name;
                publisherList.appendChild(listItem);
            });

            const developerList = document.getElementById('developer-list');
            data.developer.forEach(developer => {
                const listItem = document.createElement('li');

                listItem.textContent = developer.developer_name;
                developerList.appendChild(listItem);
            });

            const genreList = document.getElementById('genre-list');
            data.genre.forEach(genre => {
                const listItem = document.createElement('li');

                listItem.textContent = genre.genre_name;
                genreList.appendChild(listItem);
            });

            const reviewsList = document.getElementById('review-list');
            data.review.forEach(review => {
                const listItem = document.createElement('li');

                listItem.textContent = review.is_positive;
                reviewsList.appendChild(listItem);
            });

            const restrictionList = document.getElementById('restriction-list');
            data.restriction.forEach(restriction => {
                const listItem = document.createElement('li');

                listItem.textContent = restriction.restriction_value;
                restrictionList.appendChild(listItem);
            });

            const controllersupportList = document.getElementById('ControllerSupport-list');
            data.controllersupport.forEach(controllersupport => {
                const listItem = document.createElement('li');

                listItem.textContent = controllersupport.supports_controller;
                controllersupportList.appendChild(listItem);
            });

        })
        .catch(error => console.error('Error:', error));
});
