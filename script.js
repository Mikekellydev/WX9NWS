// Initialize Map
let map = L.map('map').setView([39.8283, -98.5795], 5); // Default to center of the U.S.

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; OpenStreetMap contributors'
}).addTo(map);

let weatherMarker;
let spotterMarkers = []; // Store spotter report markers

// Fetch Weather Data Based on Zip Code
async function fetchWeather(zipCode) {
    try {
        const geoResponse = await fetch(`https://api.openweathermap.org/geo/1.0/zip?zip=${zipCode},US&appid=YOUR_API_KEY`);
        const geoData = await geoResponse.json();
        
        if (!geoData.lat || !geoData.lon) {
            alert("Invalid ZIP Code. Please try again.");
            return;
        }

        const { lat, lon } = geoData;

        const weatherResponse = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=imperial&appid=YOUR_API_KEY`);
        const weatherData = await weatherResponse.json();

        // Display Weather Data
        document.getElementById("weather-info").innerHTML = `
            <h3>${weatherData.name}, ${weatherData.sys.country}</h3>
            <p><strong>Temperature:</strong> ${weatherData.main.temp}°F</p>
            <p><strong>Condition:</strong> ${weatherData.weather[0].description}</p>
            <p><strong>Wind:</strong> ${weatherData.wind.speed} mph</p>
        `;

        // Update Severe Weather Alert Link
        document.getElementById("weather-alert").innerHTML = `
            <a href="https://www.weather.gov/alerts?zip=${zipCode}" target="_blank" class="alert-link">
                Check Severe Weather Alerts for ${zipCode}
            </a>
        `;

        // Update Map Center
        map.setView([lat, lon], 10);

        // Add/Update Weather Marker
        if (weatherMarker) map.removeLayer(weatherMarker);
        weatherMarker = L.marker([lat, lon]).addTo(map)
            .bindPopup(`<b>${weatherData.name}</b><br>Temp: ${weatherData.main.temp}°F<br>${weatherData.weather[0].description}`)
            .openPopup();

        // Fetch and Display Spotter Reports
        fetchSpotterReports(lat, lon);
    } catch (error) {
        console.error("Error fetching weather data:", error);
    }
}

// Fetch and Display SKYWARN Spotter Reports
async function fetchSpotterReports(lat, lon) {
    try {
        const response = await fetch(`https://api.weather.gov/reports?point=${lat},${lon}`);
        const data = await response.json();

        // Remove previous markers
        spotterMarkers.forEach(marker => map.removeLayer(marker));
        spotterMarkers = [];

        if (!data.features || data.features.length === 0) {
            console.log("No spotter reports available.");
            return;
        }

        data.features.forEach(report => {
            const { geometry, properties } = report;
            if (geometry && geometry.coordinates) {
                const [reportLon, reportLat] = geometry.coordinates;
                const marker = L.marker([reportLat, reportLon])
                    .bindPopup(`<strong>Spotter Report</strong><br>${properties.event}<br>${properties.description}`);

                spotterMarkers.push(marker);
                if (document.getElementById("spotter-toggle").checked) {
                    marker.addTo(map);
                }
            }
        });
    } catch (error) {
        console.error("Error fetching SKYWARN spotter reports:", error);
    }
}

// Toggle SKYWARN Spotter Reports
document.getElementById("spotter-toggle").addEventListener("change", function () {
    if (this.checked) {
        spotterMarkers.forEach(marker => marker.addTo(map));
    } else {
        spotterMarkers.forEach(marker => map.removeLayer(marker));
    }
});

// Event Listener for Zip Code Search
document.getElementById("zip-form").addEventListener("submit", function (event) {
    event.preventDefault();
    const zipCode = document.getElementById("zip-input").value.trim();
    if (zipCode) {
        fetchWeather(zipCode);
    }
});

// Load Default Weather (Example ZIP Code)
fetchWeather("10001"); // New York City as default
