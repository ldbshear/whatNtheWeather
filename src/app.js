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

//Weather object
const getWeather = {
  devKey: "4d52faf0671d8976c45e49132852bc77", // access key

  //displays generic weather onload
  generic: function () {
    let apiURL = `https://api.openweathermap.org/data/2.5/weather?q=Pittsburgh&appid=${this.devKey}&units=imperial`;
    axios.get(apiURL).then(this.showWeather);
  },

  //call to api for weather in farenhit unit
  farenheit: function (userEntry) {
    let apiURL = `https://api.openweathermap.org/data/2.5/weather?q=${userEntry}&appid=${this.devKey}&units=imperial`;
    axios.get(apiURL).then(this.showWeather);
  },

  //call to api for weather in metic units
  metric: function (userEntry) {
    let apiURL = `https://api.openweathermap.org/data/2.5/weather?q=${userEntry}&appid=${this.devKey}&units=metric`;
    axios.get(apiURL).then(this.showWeather);
  },

  //function to display response from api in my format
  showWeather: function (response) {
    let weather = response.data.weather[0].main;
    let pupPhoto = document.getElementById("pupPic");
    document.getElementById("updateCity").innerHTML = `${response.data.name}`;
    document.getElementById("hiTemp").innerHTML = `${response.data.main.temp}`;
    let currentIcon = response.data.weather[0].icon;
    let weatherDescription = response.data.weather[0].description;
    let feelsLike = response.data.main.feels_like;

    //how i accessed weather icons from my files based on icon code from api
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

    //found a couple pup photos tried to match their outfits to weather description, used if else statements to swich out img tags. probably a better way to refactor and reduce repeated code. may come back and explore
    if (weather === "Clear") {
      document.getElementById("pupPic").innerHTML = `<img id="pupPic"
                src="images/sunglasses.png"
                class="rounded weatherPuppy img-fluid"
                alt="puppy in clothes"
                />`;
    } else if (weather === "Clouds") {
      document.getElementById("pupPic").innerHTML = `<img id="pupPic"
                src="images/chilly.png"
                class="rounded weatherPuppy img-fluid"
                alt="puppy in clothes"
                />`;
    } else if (
      weather === "Rain" ||
      weather === "Thunderstorm" ||
      weather === "Drizzle"
    ) {
      document.getElementById("pupPic").innerHTML = `<img id="pupPic"
                src="images/rainy.png"
                class="rounded weatherPuppy img-fluid"
                alt="puppy in clothes"
                />`;
    } else if (weather === "Snow") {
      document.getElementById("pupPic").innerHTML = `<img
          id="pupPic"
          src="images/snow.png"
          class="rounded weatherPuppy img-fluid"
          alt="puppy in clothes"
        />`;
    } else {
      document.getElementById("pupPic").innerHTML = `<img id="pupPic"
                src="images/chilly.png"
                class="rounded weatherPuppy img-fluid"
                alt="puppy in clothes"
                />`;
    }

    //This code is how i get the forecast to clear before another search
    const userCardContainer = document.querySelector(
      "[data-user-cards-container]"
    );
    userCardContainer.innerHTML = "";
  },

  //test, getForecast, and showForecast is the solution I came up with to call and display the week forecast using openWeatherMap's api. I take the user's entry from the form input
  //then call the api. Then send that response to getForecast which accesses the lat and long coords and makes the forecast call to the api.
  //showForecast then displays the response from the api, using a html template.
  test: function (userEntry) {
    let apiURL = `https://api.openweathermap.org/data/2.5/weather?q=${userEntry}&appid=${this.devKey}&units=imperial`;
    axios.get(apiURL).then(this.getForecast);
  },

  getForecast: function (res) {
    let lat = res.data.coord.lat;
    let lon = res.data.coord.lon;
    let apiURL = `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&exclude=minutely,hourly,alerts,current&appid=${getWeather.devKey}&units=imperial`;

    axios.get(apiURL).then(getWeather.showForecast);
  },

  showForecast: function (res) {
    const userCardTemplate = document.querySelector("[data-user-template]");
    const userCardContainer = document.querySelector(
      "[data-user-cards-container]"
    );
    //stops multiple forecast calls from appending to the page
    userCardContainer.innerHTML = "";

    //takes response from forecast api and using data attribute fills in the html template created on index.html
    res.data.daily.forEach((day) => {
      const card = userCardTemplate.content.cloneNode(true).children[0];
      const forecastDay = card.querySelector("[data-header]");
      const weatherForecastMax = card.querySelector("[data-max]");
      const weatherForecastMin = card.querySelector("[data-min]");
      const weatherForecastIcon = card.querySelector("[data-pic]");
      let timestamp = day.dt;
      let convert = new Date(timestamp * 1000);
      let weekdays = [
        "Sunday",
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday",
      ];
      let dayOfWeek = weekdays[convert.getDay()];
      forecastDay.textContent = day.dt;
      forecastDay.textContent = dayOfWeek;
      weatherForecastMax.textContent = `High temp ${day.temp.max}°  /`;
      weatherForecastMin.textContent = `Lo temp ${day.temp.min}°`;
      weatherForecastIcon.innerHTML = `<img src="images/icons/${day.weather[0].icon}.png" class="smIcon" />`;
      userCardContainer.append(card);
    });
  },
};

//onload weather forecast displayed
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
