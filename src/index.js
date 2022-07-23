function showCelsius() {
  temperatureDigitElement.innerHTML = Math.round(temperatureCelsius);
  temperatureUnitElement.innerHTML = "°C";
}

function showFahrenheit() {
  let temperatureFahrenheit = (temperatureCelsius * 9) / 5 + 32;
  temperatureDigitElement.innerHTML = Math.round(temperatureFahrenheit);
  temperatureUnitElement.innerHTML = "°F";
}

function getPosition(position) {
  console.log(position);
  let lat = position.coords.latitude;
  let lon = position.coords.longitude;
  let apiUrlCurrent = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`;
  axios.get(apiUrlCurrent).then(showTemperature);
}

function position() {
  navigator.geolocation.getCurrentPosition(getPosition);
}

function formateDate(timestamp) {
  let dateAndTime = new Date(timestamp);

  let months = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];
  let month = months[dateAndTime.getMonth()];
  let date = dateAndTime.getDate();
  let hours = dateAndTime.getHours();
  if (hours < 10) {
    hours = `0${hours}`;
  }
  let minutes = dateAndTime.getMinutes();
  if (minutes < 10) {
    minutes = `0${minutes}`;
  }

  return `${month} ${date} ${hours}:${minutes}`;
}

function formateWeekDay(timestamp) {
  let day = new Date(timestamp);
  let daysOfWeek = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];

  return daysOfWeek[day.getDay()];
}

function formateForecastDate(timestamp) {
  let dateAndTime = new Date(timestamp);

  let months = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];
  let month = months[dateAndTime.getMonth()];
  let date = dateAndTime.getDate();

  return `${month} ${date}`;
}

function showForecast(response) {
  let forecastElement = document.querySelector("#forecast");

  let forecastHTML = "";
  let days = response.data.daily;
  days.forEach(function (day, index) {
    if (index > 0 && index < 6) {
      forecastHTML += `
      <div class="item11">
        <p class="date">${formateForecastDate(day.dt * 1000)}</p>
        <img src="images/${day.weather[0].icon}.svg" alt="" width="100px" />
        <p> ${Math.round(day.temp.max)}° / ${Math.round(day.temp.min)}°</p>
      </div>`;
    }
  });

  forecastElement.innerHTML = forecastHTML;
}

function getForecast(coordinates) {
  let apiUrl = `https://api.openweathermap.org/data/2.5/onecall?lat=${coordinates.lat}&lon=${coordinates.lon}&appid=${apiKey}&units=metric`;
  axios.get(apiUrl).then(showForecast);
}

function showTemperature(response) {
  let headingCityElement = document.querySelector("#city-heading");
  let weatherIconElement = document.querySelector("#weather-icon");
  let dateElement = document.querySelector("#date");
  let dayOfWeekElement = document.querySelector("#day-of-week");
  let descriptionElement = document.querySelector("#description");
  let windElement = document.querySelector("#wind");
  let humidityElement = document.querySelector("#humidity");

  temperatureCelsius = response.data.main.temp;

  temperatureDigitElement.innerHTML = Math.round(temperatureCelsius);
  temperatureUnitElement.innerHTML = "°C";
  headingCityElement.innerHTML = response.data.name;
  weatherIconElement.setAttribute(
    "src",
    `images/${response.data.weather[0].icon}.svg`
  );
  descriptionElement.innerHTML = response.data.weather[0].description;
  windElement.innerHTML = Math.round(response.data.wind.speed);
  humidityElement.innerHTML = response.data.main.humidity;

  let currentDate = new Date(response.data.dt * 1000);
  let locationTime =
    (response.data.dt +
      currentDate.getTimezoneOffset() * 60 +
      response.data.timezone) *
    1000;

  dateElement.innerHTML = formateDate(locationTime);
  dayOfWeekElement.innerHTML = formateWeekDay(locationTime);
  getForecast(response.data.coord);
}

function submitForm(event) {
  event.preventDefault();
  let cityInput = document.querySelector("#city-input");
  search(cityInput.value);
}
function search(cityName) {
  let apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=${apiKey}&units=metric`;
  axios.get(apiUrl).then(showTemperature);
}

let apiKey = `c670fa7c4d1ccad9ebab8f9eb49cae65`;

let form = document.querySelector("form");
form.addEventListener("submit", submitForm);

let currentButton = document.querySelector(`#current-button`);
currentButton.addEventListener("click", position);

let tempCelsius = document.querySelector("#celsius-button");
tempCelsius.addEventListener("click", showCelsius);

let tempFahrenheit = document.querySelector("#fahrenheit-button");
tempFahrenheit.addEventListener("click", showFahrenheit);

let temperatureDigitElement = document.querySelector("#temperature-digit");
let temperatureUnitElement = document.querySelector("#temperature-unit");
let temperatureCelsius = null;

search("London");
