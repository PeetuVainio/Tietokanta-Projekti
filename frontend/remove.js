document.addEventListener('DOMContentLoaded', () => {
    const fetchData = () => {
        fetch('http://localhost:5050/data')
            .then(response => {
                if (!response.ok) {
                    throw new Error('Failed to fetch data');
                }
                return response.json();
            })
            .then(data => displayData(data))
            .catch(error => console.error('Error:', error));
    };

    const displayData = (data) => {
        const dataList = document.getElementById('data-list');
        dataList.innerHTML = '';

        data.games.forEach(item => {
            const listItem = document.createElement('li');
            listItem.innerHTML = `
                <button class="remove-btn" data-id="${item.id}">Remove</button>
                <span>Name: ${item.game_name}</span>
                <span>Released: ${item.released}</span>
                <span>Price: ${item.price_value}</span>
            `;
            dataList.appendChild(listItem);
        });

        document.querySelectorAll('.remove-btn').forEach(button => {
            button.addEventListener('click', () => handleRemove(button.dataset.id));
        });
    };

    const handleRemove = (id) => {
        fetch(`http://localhost:5050/remove/${id}`, {
            method: 'DELETE'
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Failed to remove data');
            }
            fetchData();
        })
        .catch(error => console.error('Error:', error));
    };

    fetchData();
});
