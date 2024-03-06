document.getElementById('addPublisherForm').addEventListener('submit', async function(event) {
    event.preventDefault();

    const formData = new FormData(this);
    const formDataJSON = {};

    formData.forEach((value, key) => {
        formDataJSON[key] = value;
    });

    try {
        const response = await fetch('http://localhost:5050/add/publisher', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(formDataJSON)
        });

        if (!response.ok) {
            throw new Error('Failed to add publisher');
        }

        alert('Publisher added successfully!');
        location.reload();
    } catch (error) {
        console.error(error);
        alert('Failed to add publisher. Please try again.');
    }
});
