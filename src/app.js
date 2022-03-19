//Displays time and date
setInterval(dayClock, 1000);
function dayClock() {
  const currentTime = new Date();
  let weekDay = currentTime.getDay();
  let minutes = currentTime.getMinutes();

  let hour = currentTime.getHours();

  if (minutes < 10) {
    minutes = "0" + minutes;
  }

  if (hour > 12) {
    hour = hour - 12;
  }

  let week = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];
  weekDay = week[currentTime.getDay()];
  const dayNTime = document.getElementById("dayTime");
  dayNTime.textContent = `${weekDay} ${hour}:${minutes}`;
}

let forecastBtn = document.getElementById("fiveDayBtn");
let locator = document.getElementById("geoHouse");
let imperial = document.getElementById("farenheit");
let metric = document.getElementById("celsius");
let searchForm = document.getElementById("searchForm");
let searchIcon = document.getElementById("submitSearch");

const getWeather = {
  devKey: "3711439e85a5b0487eab981ef384735a",

  generic: function () {
    let apiURL = `https://api.openweathermap.org/data/2.5/weather?q=Pittsburgh&appid=${this.devKey}&units=imperial`;
    axios.get(apiURL).then(this.showWeather);
  },

  farenheit: function (userEntry) {
    let apiURL = `https://api.openweathermap.org/data/2.5/weather?q=${userEntry}&appid=${this.devKey}&units=imperial`;
    axios.get(apiURL).then(this.showWeather);
  },

  metric: function (userEntry) {
    let apiURL = `https://api.openweathermap.org/data/2.5/weather?q=${userEntry}&appid=${this.devKey}&units=metric`;
    axios.get(apiURL).then(this.showWeather);
  },

  showWeather: function (response) {
    document.getElementById("updateCity").innerHTML = `${response.data.name}`;
    document.getElementById("hiTemp").innerHTML = `${response.data.main.temp}`;
    let currentIcon = response.data.weather[0].icon;
    let weatherDescription = response.data.weather[0].description;
    let feelsLike = response.data.main.feels_like;

    document.getElementById(
      "currentWeatherIcon"
    ).innerHTML = `<img src="images/icons/${currentIcon}.png" class="lgIcon" />`;
    document.querySelector(
      "#currentWeatherDetails"
    ).innerHTML = `${weatherDescription.toUpperCase()} in ${
      response.data.name
    }.`;
    document.querySelector(
      "#wind"
    ).innerHTML = `There is currently a windspeed of ${response.data.wind.speed}`;
    document.querySelector(
      "#humidity"
    ).innerHTML = `With a humidity of ${response.data.main.humidity}%.`;
    document.querySelector(
      "#feelsLike"
    ).innerHTML = `The temperature feels like it's ${feelsLike}° outside.`;
  },

  test: function (userEntry) {
    console.log("button clicked 1");
    let apiURL = `https://api.openweathermap.org/data/2.5/weather?q=${userEntry}&appid=${this.devKey}&units=imperial`;
    axios.get(apiURL).then(this.getForecast);
  },

  getForecast: function (res) {
    console.log("button clicked 2");
    let lat = res.data.coord.lat;
    let lon = res.data.coord.lon;
    let apiURL = `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&exclude=minutely,hourly,alerts,current&appid=${getWeather.devKey}&units=imperial`;
    axios.get(apiURL).then(getWeather.showForecast);
  },

  showForecast: function (res) {
    console.log(res.data.daily);
    const userCardTemplate = document.querySelector("[data-user-template]");
    const userCardContainer = document.querySelector(
      "[data-user-cards-container]"
    );
    userCardContainer.innerHTML = "";

    res.data.daily.forEach((day) => {
      const card = userCardTemplate.content.cloneNode(true).children[0];
      const forecastDay = card.querySelector("[data-header]");
      const weatherForecastMax = card.querySelector("[data-body]");
      const weatherForecastMin = card.querySelector("[data-min]");
      forecastDay.textContent = day.dt;
      weatherForecastMax.textContent = `High temp ${day.temp.max}°  /`;
      weatherForecastMin.textContent = `Lo temp ${day.temp.min}°`;
      userCardContainer.append(card);
    });
  },
};

getFiveDay = {};

getWeather.generic();

function getCoords(pos) {
  let lat = pos.coords.latitude;
  let long = pos.coords.longitude;
  let apiURL = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${long}&appid=${getWeather.devKey}&units=imperial`;
  axios.get(apiURL).then(getWeather.showWeather);
}

function navigate() {
  console.log("click");
  navigator.geolocation.getCurrentPosition(getCoords);
}

function getCity(event) {
  event.preventDefault();
  let userEntry = document.querySelector("#userCity").value;
  document.getElementById("updateCity").innerHTML = `${userEntry}`;
  getWeather.farenheit(userEntry);
}

function activate() {
  document.querySelector("form").requestSubmit();
}

forecastBtn.addEventListener("click", function () {
  let userEntry = document.querySelector("#userCity").value;
  getWeather.test(userEntry);
});

locator.addEventListener("click", navigate);

farenheit.addEventListener("click", function () {
  let userEntry = document.querySelector("#userCity").value;
  getWeather.farenheit(userEntry);
});

metric.addEventListener("click", function () {
  let userEntry = document.querySelector("#userCity").value;
  getWeather.metric(userEntry);
});

searchIcon.addEventListener("click", activate);
searchForm.addEventListener("submit", getCity);
