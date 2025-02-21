let map;
let spotterLayer;
let currentZip = "";

// Initialize Map
function initMap() {
    map = L.map('map').setView([39.8283, -98.5795], 5); // Centered on the US
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 18,
    }).addTo(map);
}

// Get Weather Data by ZIP Code
function getWeather() {
    const zip = document.getElementById('zipInput').value;
    if (!zip) {
        alert("Please enter a ZIP code.");
        return;
    }

    fetch(`https://api.weather.gov/points/${zip}`)
        .then(response => response.json())
        .then(data => {
            const { latitude, longitude } = data.properties;
            map.setView([latitude, longitude], 10);

            fetch(data.properties.forecast)
                .then(res => res.json())
                .then(forecastData => {
                    document.getElementById("weather-info").innerHTML = `
                        <h4>Weather Forecast:</h4>
                        <p>${forecastData.properties.periods[0].detailedForecast}</p>
                    `;
                });

            fetch(data.properties.forecastOffice)
                .then(res => res.json())
                .then(alertData => {
                    document.getElementById("alert-info").innerHTML = alertData.properties.headline || "No alerts.";
                });

            currentZip = zip;
        })
        .catch(error => console.error("Error fetching weather data:", error));
}

// Reset Location
function resetLocation() {
    document.getElementById("zipInput").value = "";
    document.getElementById("weather-info").innerHTML = "";
    document.getElementById("alert-info").innerHTML = "No alerts currently.";
    map.setView([39.8283, -98.5795], 5);
}

// Toggle Spotter Reports
function toggleSpotterReports() {
    if (spotterLayer) {
        map.removeLayer(spotterLayer);
        spotterLayer = null;
    } else {
        spotterLayer = L.layerGroup().addTo(map);
        fetch('https://api.weather.gov/alerts/active')
            .then(response => response.json())
            .then(data => {
                data.features.forEach(alert => {
                    const { geometry, properties } = alert;
                    if (geometry) {
                        const [lon, lat] = geometry.coordinates;
                        L.marker([lat, lon])
                            .bindPopup(`<strong>${properties.headline}</strong><br>${properties.description}`)
                            .addTo(spotterLayer);
                    }
                });
            })
            .catch(error => console.error("Error fetching spotter reports:", error));
    }
}

// Initialize the Map
window.onload = initMap;
