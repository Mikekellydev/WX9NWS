const apiKey = '7bcb22c7820130022bdef4017e307fd1';  // Replace with your actual API key

async function getWeather() {
    const city = document.getElementById('city').value;
    if (!city) {
        alert('Please enter a city name');
        return;
    }

    const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=imperial`;

    try {
        const response = await fetch(url);
        const data = await response.json();

        if (data.cod !== 200) {
            document.getElementById('weather-info').innerHTML = `<p>Error: ${data.message}</p>`;
            return;
        }

        document.getElementById('weather-info').innerHTML = `
            <h2>${data.name}, ${data.sys.country}</h2>
            <p>🌡️ Temperature: ${data.main.temp}°F</p>
            <p>🌬️ Wind Speed: ${data.wind.speed} mph</p>
            <p>💧 Humidity: ${data.main.humidity}%</p>
            <p>☁️ Condition: ${data.weather[0].description}</p>
        `;
    } catch (error) {
        console.error("Error fetching weather data:", error);
        document.getElementById('weather-info').innerHTML = "<p>Unable to get weather data. Try again later.</p>";
    }
}


document.addEventListener("DOMContentLoaded", function () {
    // Create the base map
    var map = new ol.Map({
        target: 'map', // Matches the ID of the div in index.html
        layers: [
            // Base layer (OpenStreetMap)
            new ol.layer.Tile({
                source: new ol.source.OSM()
            }),
            // NOAA Radar Overlay
            new ol.layer.Tile({
                source: new ol.source.XYZ({
                    url: 'https://mesonet.agron.iastate.edu/cache/tile.py/1.0.0/nexrad-n0q-900913/{z}/{x}/{y}.png',
                    crossOrigin: 'anonymous'
                })
            })
        ],
        view: new ol.View({
            center: ol.proj.fromLonLat([-76.1, 36.8]), // USA Center
            zoom: 9
        })
    });
});
