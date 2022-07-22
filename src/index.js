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

function showTemperature(response) {
  let headingCityElement = document.querySelector("#city-heading");
  let weatherIconElement = document.querySelector("#weather-icon");
  let dateElement = document.querySelector("#date");
  let dayOfWeekElement = document.querySelector("#day-of-week");

  temperatureCelsius = response.data.main.temp;

  temperatureDigitElement.innerHTML = Math.round(temperatureCelsius);
  temperatureUnitElement.innerHTML = "°C";
  headingCityElement.innerHTML = response.data.name;
  weatherIconElement.setAttribute(
    "src",
    `images/${response.data.weather[0].icon}.svg`
  );

  let currentDate = new Date(response.data.dt * 1000);
  let locationTime =
    (response.data.dt +
      currentDate.getTimezoneOffset() * 60 +
      response.data.timezone) *
    1000;

  dateElement.innerHTML = formateDate(locationTime);
  dayOfWeekElement.innerHTML = formateWeekDay(locationTime);
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
