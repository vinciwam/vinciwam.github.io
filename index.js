async function submitNumber() {
    const number = document.getElementById('numberInput').value;
    try {
        const response = await fetch('http://127.0.0.1:5000/api/submit-number', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ number: number })
        });
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const data = await response.json();
        document.getElementById('result').innerText = `Data submitted successfully! Response: ${data.message}`;
    } catch (error) {
        console.error('Error:', error);
        document.getElementById('result').innerText = `Error submitting data: ${error.message}`;
    }
}
