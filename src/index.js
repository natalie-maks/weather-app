function showCelsius() {
  let tempCel = document.querySelector("#temperature-number");
  let signCel = document.querySelector("#temperature-sign");
  if (signCel.innerHTML === "°F") {
    let mathCel = ((parseInt(tempCel.innerHTML, 10) - 32) * 5) / 9;
    tempCel.innerHTML = Math.round(mathCel);
    signCel.innerHTML = "°C";
  }
}

function showFahrenheit() {
  let tempFahr = document.querySelector("#temperature-number");
  let signFahr = document.querySelector("#temperature-sign");
  if (signFahr.innerHTML === "°C") {
    let mathFahr = (parseInt(tempFahr.innerHTML, 10) * 9) / 5 + 32;
    tempFahr.innerHTML = Math.round(mathFahr);
    signFahr.innerHTML = "°F";
  }
}

function showTemperature(response) {
  let temperatureElement = document.querySelector("#temperature-number");
  let headingCityElement = document.querySelector("#city-heading");
  let weatherIconElement = document.querySelector("#weather-icon");

  temperatureElement.innerHTML = Math.round(response.data.main.temp);
  headingCityElement.innerHTML = response.data.name;
  weatherIconElement.setAttribute(
    "src",
    `images/${response.data.weather[0].icon}.svg`
  );
}

function submitForm(event) {
  event.preventDefault();
  let cityInput = document.querySelector("#city-input");
  search(cityInput.value);
}
function search(cityName) {
  let apiKey = `c670fa7c4d1ccad9ebab8f9eb49cae65`;
  let apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=${apiKey}&units=metric`;
  axios.get(apiUrl).then(showTemperature);
}

search("London");

let form = document.querySelector("form");
form.addEventListener("submit", submitForm);

let tempCelsius = document.querySelector("#celsius-button");
tempCelsius.addEventListener("click", showCelsius);

let tempFahrenheit = document.querySelector("#fahrenheit-button");
tempFahrenheit.addEventListener("click", showFahrenheit);

function position() {
  function getPosition(position) {
    function showTemp(response) {
      let pageHeading = document.querySelector("#city-heading");
      pageHeading.innerHTML = response.data.name;

      let locTemperature = response.data.main.temp;
      let number = document.querySelector("#temperature-number");
      number.innerHTML = Math.round(locTemperature);
    }

    let lat = position.coords.latitude;
    let lon = position.coords.longitude;
    let apiUrlCurrent = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`;

    axios.get(apiUrlCurrent).then(showTemp);
  }

  navigator.geolocation.getCurrentPosition(getPosition);
}

let current = document.querySelector(`#current-button`);
current.addEventListener("click", position);

let today = new Date();

let days = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];

let dayOfWeek = document.querySelector("#day-of-week");
dayOfWeek.innerHTML = days[today.getDay()];

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

let minutes = today.getMinutes();
if (minutes < 10) {
  minutes = "0" + today.getMinutes();
} else {
  today.getMinutes();
}

let date = document.querySelector("#date");
date.innerHTML =
  months[today.getMonth()] +
  " " +
  today.getDate() +
  "    " +
  today.getHours() +
  ":" +
  minutes;
