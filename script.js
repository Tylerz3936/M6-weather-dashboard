document.addEventListener('DOMContentLoaded', () => {
    const apiKey = '08e3ce07c67457677c71655d2ee7e7b8'; // Your OpenWeather API key
    const searchButton = document.getElementById('search-button');
    const cityInput = document.getElementById('city-input');
    const cityButtons = document.querySelectorAll('.city-btn');
    const cityNameElement = document.getElementById('city-name');
    const temperatureElement = document.getElementById('temperature');
    const windElement = document.getElementById('wind');
    const humidityElement = document.getElementById('humidity');
    const forecastElement = document.getElementById('forecast');

    searchButton.addEventListener('click', () => {
        const city = cityInput.value;
        if (city) {
            getWeather(city);
        }
    });

    cityButtons.forEach(button => {
        button.addEventListener('click', () => {
            const city = button.textContent.trim();
            getWeather(city);
        });
    });

    function getWeather(city) {
        const currentWeatherUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=imperial&appid=${apiKey}`;
        fetch(currentWeatherUrl)
            .then(response => response.json())
            .then(data => {
                displayCurrentWeather(data);
                const { lon, lat } = data.coord;
                getForecast(lon, lat);
            })
            .catch(error => console.error('Error fetching current weather:', error));
    }

    function displayCurrentWeather(data) {
        const date = new Date(data.dt * 1000).toLocaleDateString();
        cityNameElement.textContent = `${data.name} (${date})`;
        temperatureElement.textContent = `Temp: ${data.main.temp} °F`;
        windElement.textContent = `Wind: ${data.wind.speed} MPH`;
        humidityElement.textContent = `Humidity: ${data.main.humidity} %`;
    }

    function getForecast(lon, lat) {
        const forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&units=imperial&appid=${apiKey}`;
        fetch(forecastUrl)
            .then(response => response.json())
            .then(data => {
                displayForecast(data);
            })
            .catch(error => console.error('Error fetching forecast:', error));
    }

    function displayForecast(data) {
        forecastElement.innerHTML = '';
        const forecastData = data.list.filter(entry => entry.dt_txt.includes('12:00:00'));
        forecastData.forEach(entry => {
            const date = new Date(entry.dt * 1000).toLocaleDateString();
            const temp = entry.main.temp;
            const wind = entry.wind.speed;
            const humidity = entry.main.humidity;

            const forecastCard = document.createElement('div');
            forecastCard.classList.add('forecast-card');
            forecastCard.innerHTML = `
                <h3>${date}</h3>
                <p>Temp: ${temp} °F</p>
                <p>Wind: ${wind} MPH</p>
                <p>Humidity: ${humidity} %</p>
            `;
            forecastElement.appendChild(forecastCard);
        });
    }
});
