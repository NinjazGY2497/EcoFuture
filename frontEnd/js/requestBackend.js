import { updateChartWithAI } from "./chart.js";

// Vars
const heading = document.querySelector("h1");
const extinctionLevelLabel = document.querySelector(".prediction-value");

const statusBar = document.querySelector(".ai-status-bar");
const statusBarSpan = document.querySelector(".status-text");
const statusSpinner = document.querySelector(".spinner");
const retryButton = document.querySelector(".retry-button");

const whatIfSelecter = document.querySelector("#whatIfSelect");

// Funcs
async function requestBackend(location, animal, timeframe, whatIf) {
    const BACKEND_URL = "https://hackathoncrewraag.pythonanywhere.com/ai-response";
    const response = await fetch(BACKEND_URL, {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({ location, animal, timeframe, whatIf })
    });
    if (!response.ok) throw new Error("Network response was not ok");
    return await response.json();
}

async function displayAnalysis(location, animal, timeframe, whatIf=null) {
    statusBar.style.display = "block";
    statusSpinner.style.display = "block";
    retryButton.style.display = "none";
    statusBarSpan.textContent = "Contacting AI...";
    heading.textContent = `EcoFuture For "${animal}"`;

    let data;
    try {
        data = await requestBackend(location, animal, timeframe, whatIf);
    } catch (error) {
        console.error(error);
        statusBarSpan.textContent = "Error contacting AI.";
        statusSpinner.style.display = "none";
        retryButton.style.display = "flex";
        return;
    }

    updateChartWithAI(data.response);
    setExtinctionLevel(data.response.extinction_level);
    statusBar.style.display = "none";
}

function setExtinctionLevel(level) {
    const colorMap = {
        "Extinct": "#000000",                // Black
        "Critically Endangered": "#8B0000",  // Dark Red
        "Endangered": "#FF0000",             // Red
        "Vulnerable": "#FFA500",             // Orange
        "Near Threatened": "#FFFF00",        // Yellow
        "Safe": "#008000",                   // Green
        "Not Evaluated": "#FFFFFF"           // White
    };

    const correspondingColor = colorMap[level] || "#FFFFFF";

    extinctionLevelLabel.textContent = level;
    extinctionLevelLabel.style.color = correspondingColor;
}

// // Trigger "Changes you made may not be saved" prompt to prevent lots of refreshing
window.addEventListener('beforeunload', (event) => {
    event.preventDefault();
    event.returnValue = ''; 
});

// Requesting
const urlData = new URLSearchParams(window.location.search);
if (!urlData.has('location') || !urlData.has('animal') || !urlData.has('timeframe')) {
    window.location.href = 'index.html';
}

displayAnalysis(
    urlData.get('location'), 
    urlData.get('animal'), 
    urlData.get('timeframe')
);

// Event Listeners
whatIfSelecter.addEventListener("change", (event) => {
    const selectedWhatIf = event.target.value;
    const whatIfParam = event.target.value === "none" ? null : selectedWhatIf;
    displayAnalysis(
        urlData.get('location'), 
        urlData.get('animal'), 
        urlData.get('timeframe'),
        whatIfParam
    );
});

retryButton.addEventListener("click", () => {
    const whatIfParam = whatIfSelecter.value === "none" ? null : whatIfSelecter.value;

    displayAnalysis(
        urlData.get('location'), 
        urlData.get('animal'), 
        urlData.get('timeframe'),
        whatIfParam
    );
});