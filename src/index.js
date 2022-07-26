function showCelsius() {
  let forecastTempMaxElement = document.querySelectorAll(
    "#forecast-temperature-max"
  );
  let forecastTempMinElement = document.querySelectorAll(
    "#forecast-temperature-min"
  );

  if (temperatureUnitElement.innerHTML === "°F") {
    forecastTempMaxElement.forEach(function (day) {
      let mathFahr = ((parseInt(day.innerHTML) - 32) * 5) / 9;
      day.innerHTML = Math.round(mathFahr);
    });
    forecastTempMinElement.forEach(function (day) {
      let mathFahr = ((parseInt(day.innerHTML) - 32) * 5) / 9;
      day.innerHTML = Math.round(mathFahr);
    });
  }
  temperatureDigitElement.innerHTML = Math.round(temperatureCelsius);
  temperatureUnitElement.innerHTML = "°C";
  feelsLikeDigitElement.innerHTML = Math.round(feelsLikeTempCelsius);
  feelsLikeUnitElement.innerHTML = "°C";
}

function showFahrenheit() {
  let temperatureFahrenheit = (temperatureCelsius * 9) / 5 + 32;
  let feelsLikeTempFahrenheit = (feelsLikeTempCelsius * 9) / 5 + 32;
  let forecastTempMaxElement = document.querySelectorAll(
    "#forecast-temperature-max"
  );
  let forecastTempMinElement = document.querySelectorAll(
    "#forecast-temperature-min"
  );

  if (temperatureUnitElement.innerHTML === "°C") {
    forecastTempMaxElement.forEach(function (day) {
      let mathFahr = (parseInt(day.innerHTML) * 9) / 5 + 32;
      day.innerHTML = Math.round(mathFahr);
    });
    forecastTempMinElement.forEach(function (day) {
      let mathFahr = (parseInt(day.innerHTML) * 9) / 5 + 32;
      day.innerHTML = Math.round(mathFahr);
    });
  }

  temperatureDigitElement.innerHTML = Math.round(temperatureFahrenheit);
  feelsLikeDigitElement.innerHTML = Math.round(feelsLikeTempFahrenheit);
  temperatureUnitElement.innerHTML = "°F";
  feelsLikeUnitElement.innerHTML = "°F";
}

function getPosition(position) {
  let lat = position.coords.latitude;
  let lon = position.coords.longitude;
  let apiUrlCurrent = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`;
  axios.get(apiUrlCurrent).then(showTemperature);
}

function position() {
  navigator.geolocation.getCurrentPosition(getPosition);
}

function formateTime(timestamp) {
  let time = new Date(timestamp);

  let hours = time.getHours();
  if (hours < 10) {
    hours = `0${hours}`;
  }
  let minutes = time.getMinutes();
  if (minutes < 10) {
    minutes = `0${minutes}`;
  }

  return `${hours}:${minutes}`;
}

function formateDate(timestamp) {
  let day = new Date(timestamp);
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
  let month = months[day.getMonth()];
  let date = day.getDate();
  let daysOfWeek = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];

  return `${daysOfWeek[day.getDay()]}, ${month} ${date}`;
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

function getUv(response) {
  if (response < 3) {
    return `Low Risk`;
  } else {
    if (response < 6) {
      return `Moderate Risk`;
    } else {
      if (response < 8) {
        return `High Risk`;
      } else {
        if (response < 10) {
          return `Very High Risk`;
        } else {
          return `Extreme Risk`;
        }
      }
    }
  }
}

function showForecast(response) {
  console.log(response.data.current);
  let forecastElement = document.querySelector("#forecast");

  let forecastHTML = "";
  let days = response.data.daily;
  days.forEach(function (day, index) {
    if (index > 0 && index < 6) {
      forecastHTML += `
      <div class="weather-forecast-item">
        <h4>${formateForecastDate(day.dt * 1000)}</h4>
        <img src="images/${day.weather[0].icon}.svg" alt="" width="100px" />
        <p> <span id="forecast-temperature-max">${Math.round(
          day.temp.max
        )}</span>° / <span id="forecast-temperature-min">${Math.round(
        day.temp.min
      )}</span>°</p>
      </div>`;
    }
  });

  forecastElement.innerHTML = forecastHTML;
  let visibilityElement = document.querySelector("#visibility");
  visibilityElement.innerHTML = `${response.data.current.visibility / 1000} km`;
  let uvElement = document.querySelector("#uv");
  uvElement.innerHTML = getUv(response.data.current.uvi);
}

function interpretAirPolution(response) {
  if (response === 1) {
    return `Good`;
  } else {
    if (response === 2) {
      return `Fair`;
    } else {
      if (response === 3) {
        return `Moderate`;
      } else {
        if (response === 4) {
          return `Poor`;
        } else {
          return `Very Poor`;
        }
      }
    }
  }
}

function showAirPolution(response) {
  let airElement = document.querySelector("#air");
  let airQuality = interpretAirPolution(response.data.list[0].main.aqi);
  airElement.innerHTML = airQuality;
}

function getAirPolution(coordinates) {
  let apiUrl = `https://api.openweathermap.org/data/2.5/air_pollution?lat=${coordinates.lat}&lon=${coordinates.lon}&appid=${apiKey}`;
  axios.get(apiUrl).then(showAirPolution);
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
  feelsLikeTempCelsius = response.data.main.feels_like;

  temperatureDigitElement.innerHTML = Math.round(temperatureCelsius);
  temperatureUnitElement.innerHTML = "°C";
  headingCityElement.innerHTML = response.data.name;
  weatherIconElement.setAttribute(
    "src",
    `images/${response.data.weather[0].icon}.svg`
  );
  descriptionElement.innerHTML = response.data.weather[0].description;
  feelsLikeDigitElement.innerHTML = Math.round(feelsLikeTempCelsius);
  feelsLikeUnitElement.innerHTML = "°C";
  windElement.innerHTML = `${Math.round(response.data.wind.speed)} km/h`;
  humidityElement.innerHTML = `${response.data.main.humidity} %`;

  let currentDate = new Date(response.data.dt * 1000);
  let locationTime =
    (response.data.dt +
      currentDate.getTimezoneOffset() * 60 +
      response.data.timezone) *
    1000;

  dateElement.innerHTML = formateTime(locationTime);
  dayOfWeekElement.innerHTML = formateDate(locationTime);
  getForecast(response.data.coord);
  getAirPolution(response.data.coord);
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

search("London");

let temperatureDigitElement = document.querySelector("#temperature-digit");
let temperatureUnitElement = document.querySelector("#temperature-unit");
let temperatureCelsius = null;
let feelsLikeDigitElement = document.querySelector("#feels-like-digit");
let feelsLikeUnitElement = document.querySelector("#feels-like-unit");
