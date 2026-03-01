async function requestBackend(location, animal, timeframe) {
    const BACKEND_URL = "http://127.0.0.1:2497/ai-response";

    const response = await fetch(BACKEND_URL, {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({
            location: location,
            animal: animal,
            timeframe: timeframe,
        })
    });

    if (!response.ok) throw new Error("Network response was not ok");
    return await response.json();
}

async function displayAnalysis(location, animal, timeframe) {
    try {
        const data = await requestBackend(location, animal, timeframe);
        console.log(data);
    }
    catch (error) {
        console.log("Error fetching AI response:", error);
    }
}

// // Trigger "Changes you made may not be saved" prompt to prevent lots of refreshing
// window.addEventListener('beforeunload', (event) => {
//     event.preventDefault();
//     event.returnValue = ''; 
// });
// ^ ADD BACK IN PRODUCTION ^

// Requesting
const urlData = new URLSearchParams(window.location.search);

if (!urlData.has('location') || !urlData.has('animal') || !urlData.has('timeframe')) {
    window.location.href = 'index.html'; // Redirect back to main page
}
displayAnalysis(
    urlData.get('location'), 
    urlData.get('animal'), 
    urlData.get('timeframe')
)