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

let searchForm = document.getElementById("searchForm");
let searchIcon = document.getElementById("submitSearch");
let metric = document.getElementById("celsius");

function showWeather(response) {
  console.log(response);
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
  ).innerHTML = `${weatherDescription.toUpperCase()} in ${response.data.name}.`;
  document.querySelector(
    "#wind"
  ).innerHTML = `There is currently a windspeed of ${response.data.wind.speed}`;
  document.querySelector(
    "#humidity"
  ).innerHTML = `With a humidity of ${response.data.main.humidity}%.`;
  document.querySelector(
    "#feelsLike"
  ).innerHTML = `The temperature feels like it's ${feelsLike}° outside.`;
}

//Stops normal submit and refresh behavior

function defaultWeather() {
  let devKey = "3711439e85a5b0487eab981ef384735a";
  let apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=Pittsburgh&appid=${devKey}&units=imperial`;

  axios.get(apiUrl).then(showWeather);
}


function requestCity(userEntry) {
  console.log(userEntry);
  let devKey = "3711439e85a5b0487eab981ef384735a";
  let apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${userEntry}&appid=${devKey}&units=imperial`;
  axios.get(apiUrl).then(showWeather);
}

function getCity(event) {
  event.preventDefault();
  let userEntry = document.querySelector("#userCity").value;
  document.getElementById("updateCity").innerHTML = `${userEntry}`;
  requestCity(userEntry);
}

function activate() {
  document.querySelector("form").requestSubmit();
}

//metric.addEventListener("click", showMetric);

searchIcon.addEventListener("click", activate);
searchForm.addEventListener("submit", getCity);
defaultWeather();
