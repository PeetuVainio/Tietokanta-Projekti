document.getElementById('addForm').addEventListener('submit', async function(event) {
    event.preventDefault();

    const formData = new FormData(this);
    const formDataJSON = {};

    formData.set('price_value', parseFloat(formData.get('price_value').replace(/[^0-9.,]/g, '').replace(',', '.')));

    formData.forEach((value, key) => {
        formDataJSON[key] = value;
    });

    try {
        const response = await fetch('http://localhost:5050/add', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(formDataJSON)
        });

        if (!response.ok) {
            throw new Error('Failed to add data');
        }

        alert('Game added successfully!');
        location.reload();
    } catch (error) {
        console.error(error);
        alert('Failed to add game. Please try again.');
    }
});
