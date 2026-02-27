// ===============================
// WeatherApp Constructor
// ===============================

function WeatherApp(apiKey) {
    this.apiKey = apiKey;
    this.weatherUrl = "https://api.openweathermap.org/data/2.5/weather";
    this.forecastUrl = "https://api.openweathermap.org/data/2.5/forecast";

    // DOM Elements
    this.searchBtn = document.getElementById("search-btn");
    this.cityInput = document.getElementById("city-input");
    this.weatherDisplay = document.getElementById("weather-display");

    this.init();
}

// ===============================
// INIT
// ===============================

WeatherApp.prototype.init = function () {
    this.searchBtn.addEventListener("click", this.handleSearch.bind(this));

    this.cityInput.addEventListener("keypress", function (e) {
        if (e.key === "Enter") {
            this.handleSearch();
        }
    }.bind(this));
};

// ===============================
// HANDLE SEARCH
// ===============================

WeatherApp.prototype.handleSearch = function () {
    const city = this.cityInput.value.trim();

    if (!city) {
        alert("Please enter a city name");
        return;
    }

    this.getWeather(city);
    this.cityInput.value = "";
};

// ===============================
// GET WEATHER + FORECAST
// ===============================

WeatherApp.prototype.getWeather = async function (city) {
    this.weatherDisplay.innerHTML = "Loading...";

    const currentUrl = `${this.weatherUrl}?q=${city}&appid=${this.apiKey}&units=metric`;
    const forecastUrl = `${this.forecastUrl}?q=${city}&appid=${this.apiKey}&units=metric`;

    try {
        const [weatherResponse, forecastResponse] = await Promise.all([
            axios.get(currentUrl),
            axios.get(forecastUrl)
        ]);

        this.displayWeather(weatherResponse.data);
        this.displayForecast(forecastResponse.data);

    } catch (error) {
        this.weatherDisplay.innerHTML = "City not found ❌";
        console.error(error);
    }
};

// ===============================
// DISPLAY CURRENT WEATHER
// ===============================

WeatherApp.prototype.displayWeather = function (data) {
    const html = `
        <div class="current-weather">
            <h2>${data.name}, ${data.sys.country}</h2>
            <p><strong>${data.weather[0].main}</strong></p>
            <p>🌡 Temperature: ${data.main.temp}°C</p>
            <p>💧 Humidity: ${data.main.humidity}%</p>
            <p>🌬 Wind: ${data.wind.speed} m/s</p>
        </div>
    `;

    this.weatherDisplay.innerHTML = html;
};

// ===============================
// DISPLAY 5-DAY FORECAST
// ===============================

WeatherApp.prototype.displayForecast = function (data) {

    let forecastHTML = `<h3>5-Day Forecast</h3><div class="forecast-container">`;

    // Filter: One forecast per day (every 8th item = 24 hours)
    const dailyData = data.list.filter((item, index) => index % 8 === 0);

    dailyData.forEach(day => {
        const date = new Date(day.dt * 1000).toLocaleDateString();

        forecastHTML += `
            <div class="forecast-card">
                <p>${date}</p>
                <p>${day.weather[0].main}</p>
                <p>🌡 ${day.main.temp}°C</p>
            </div>
        `;
    });

    forecastHTML += `</div>`;

    this.weatherDisplay.innerHTML += forecastHTML;
};

// ===============================
// CREATE APP INSTANCE
// ===============================

const app = new WeatherApp("4f10cecf59445a32b474cb51b3370976");