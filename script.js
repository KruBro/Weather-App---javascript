// SELECT ELEMENTS
const iconElement = document.querySelector(".weather-icon");
const tempElement = document.querySelector(".temperature-value p");
const descElement = document.querySelector(".temperature-description p");
const locationElement = document.querySelector(".location p");
const notificationElement = document.querySelector(".notification");
const humdElement = document.querySelector(".humidity-value p");
const windElement = document.querySelector(".wind-speed p");
const pressureElement = document.querySelector(".pressure p");

// App data
const weather = {};
weather.temperature = {
    unit: "celsius"
};

// APP CONSTS AND VARS
const KELVIN = 273.15;
// API KEY
const key = "84d346a182eaa1a1f1370bfc9a71d682";

// CHECK IF BROWSER SUPPORTS GEOLOCATION
if ('geolocation' in navigator) {
    navigator.geolocation.getCurrentPosition(setPosition, showError);
} else {
    notificationElement.style.display = "block";
    notificationElement.innerHTML = "<p>Browser doesn't Support Geolocation</p>";
}

// SET USER'S POSITION
function setPosition(position) {
    let latitude = position.coords.latitude;
    let longitude = position.coords.longitude;

    getWeather(latitude, longitude);
}

// SHOW ERROR WHEN THERE IS AN ISSUE WITH GEOLOCATION SERVICE
function showError(error) {
    notificationElement.style.display = "block";
    notificationElement.innerHTML = `<p> ${error.message} </p>`;
}

// GET WEATHER FROM API
function getWeather(latitude, longitude) {
    let api = `https://api.openweathermap.org/data/3.0/onecall?lat=${latitude}&lon=${longitude}&exclude=minutely,hourly,daily,alerts&appid=${key}`;

    fetch(api)
        .then(function (response) {
            return response.json();
        })
        .then(function (data) {
            console.log(data);
            weather.temperature.value = Math.floor(data.current.temp - KELVIN);
            weather.description = data.current.weather[0].description;
            weather.iconId = data.current.weather[0].icon;
            weather.humidity = data.current.humidity;
            weather.windSpeed = data.current.wind_speed;  // Fix: use underscore
            weather.pressure = data.current.pressure;
            weather.city = data.timezone;  // Timezone as city info, since OneCall API doesn't return city/country
            weather.country = "";  // Placeholder, as OneCall doesn't return country info
        })
        .then(function () {
            displayWeather();
        });
}

// DISPLAY WEATHER TO UI
function displayWeather() {
    iconElement.innerHTML = `<img src="icons/${weather.iconId}.png"/>`;
    tempElement.innerHTML = `${weather.temperature.value}°<span>C</span>`;
    descElement.innerHTML = weather.description;
    locationElement.innerHTML = `${weather.city}`;
    humdElement.innerHTML = `${weather.humidity}%<span> H</span>`;
    windElement.innerHTML = `${weather.windSpeed}<span> KPH </span>`;
    pressureElement.innerHTML = `${weather.pressure}<span> hPa </span>`;
}

// C to F conversion
function celsiusToFahrenheit(temperature) {
    return (temperature * 9 / 5) + 32;
}

tempElement.addEventListener("click", function () {
    if (weather.temperature.value === undefined) return;

    if (weather.temperature.unit == "celsius") {
        let fahrenheit = celsiusToFahrenheit(weather.temperature.value);
        fahrenheit = Math.floor(fahrenheit);
        tempElement.innerHTML = `${fahrenheit}°<span>F</span>`;
        weather.temperature.unit = "fahrenheit";
    } else {
        tempElement.innerHTML = `${weather.temperature.value}°<span>C</span>`;
        weather.temperature.unit = "celsius";
    }
});
