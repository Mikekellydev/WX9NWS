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
