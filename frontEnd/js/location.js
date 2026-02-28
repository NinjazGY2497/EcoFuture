const detectLocationButton = document.querySelector("#detectLocationButton")
const locationInput = document.querySelector("#locationInput");
const submitButton = document.querySelector("#submitButton")

function getLocation() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(showPosition, showError);
    } else {
        alert("Your browser doesn't support Geolocation");
    }
}

function showPosition(position) {
    const lat = position.coords.latitude;
    const long = position.coords.longitude;
    
    locationInput.value = `Lat: ${lat}, Long: ${long}`;
}

function showError(error) {
    console.log(error);

    let errorResponse;
    switch (error.code) {
        case error.PERMISSION_DENIED:
            errorResponse = "You denied the request for Geolocation"
            break;
        case error.POSITION_UNAVAILABLE:
            errorResponse = "Location info is unavailable"
            break;
        case error.TIMEOUT:
            errorResponse = "The request to enable location permissions timed out"
            break;
        case error.UNKNOWN_ERROR:
            errorResponse = "An unknown error occurred"
            break;
        default:
            errorResponse = "An unknown error occurred"
    }

    alert(errorResponse);
}

// Event Listeners
detectLocationButton.addEventListener("click", function() {
    getLocation();
});