const weatherApiKey = "7bcb22c7820130022bdef4017e307fd1";
const weatherContainer = document.getElementById("weather-data");
const cityForm = document.getElementById("city-form");
const cityInput = document.getElementById("city-input");




function handleLocationSelection() {
    const zip = document.getElementById("zipcode").value;
    if (zip.trim() !== "") {
        fetchWeatherByZip(zip);
    }
}

function fetchWeatherByZip(zip) {
    const apiKey = "7bcb22c7820130022bdef4017e307fd1"; // Replace with your API key
    const weatherUrl = `https://api.openweathermap.org/data/2.5/weather?zip=${zip},US&appid=${apiKey}&units=imperial`;

    fetch(weatherUrl)
        .then(response => response.json())
        .then(data => {
            if (data.cod === 200) {
                const { coord, name, weather, main } = data;
                const lat = coord.lat;
                const lon = coord.lon;

                // Hide location form and show weather container
                document.getElementById("location-form").style.display = "none";
                document.getElementById("weather-container").style.display = "block";

                // Update weather display
                document.getElementById("weather-details").innerHTML = `
                    <h2>Weather in ${name}</h2>
                    <p>${weather[0].description.toUpperCase()}</p>
                    <p>Temperature: ${main.temp}°F</p>
                `;

                // Center the map on the selected location
                map.setView([lat, lon], 10);

                // Add marker to the map
                L.marker([lat, lon])
                    .addTo(map)
                    .bindPopup(`<b>${name}</b><br>${weather[0].description.toUpperCase()}`)
                    .openPopup();

                // Fetch and update severe weather alerts
                fetchSevereWeatherAlerts(lat, lon);
            } else {
                alert("Invalid ZIP code. Please try again.");
            }
        })
        .catch(error => console.error("Error fetching weather data:", error));
}

// Go back to ZIP selection
function goBack() {
    document.getElementById("weather-container").style.display = "none";
    document.getElementById("location-form").style.display = "block";
}

// Fetch severe weather alerts based on lat/lon
function fetchSevereWeatherAlerts(lat, lon) {
    const nwsApiUrl = `https://api.weather.gov/alerts/active?point=${lat},${lon}`;

    fetch(nwsApiUrl)
        .then(response => response.json())
        .then(data => {
            const alertsContainer = document.getElementById("weather-alerts");

            if (data.features.length > 0) {
                const alert = data.features[0].properties;
                alertsContainer.innerHTML = `
                    <div class="alert-banner">
                        <a href="${alert.web}" target="_blank">⚠️ ${alert.headline} - Click for details</a>
                    </div>
                `;
            } else {
                alertsContainer.innerHTML = `<p>No active severe weather alerts.</p>`;
            }
        })
        .catch(error => console.error("Error fetching alerts:", error));
}



cityForm.addEventListener("submit", (event) => {
    event.preventDefault();
    const city = cityInput.value.trim();
    if (city) {
        fetchWeather(city);
    }
});
