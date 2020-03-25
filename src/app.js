import appLoad from "./body";
import getName from "country-list";
import { search, runSearch } from "./search";

appLoad();

const locationInput = document.querySelector("#get-location-id");
const tempNum = document.querySelector(".city-temp");
const tempDescription = document.querySelector(".city-weather");
const noLocationFound = document.querySelector(".current-location");
const city = document.querySelector(".city-name");
const country = document.querySelector(".country");
const weatherBox = document.querySelector(".box");
const spinner = document.querySelector(".spinner");
const tempBtn = document.querySelector(".temp-btn");
const convertToCelsius = tempInKelvin => Math.floor(tempInKelvin + -273.15);
const convertToFahrenheit = tempInKelvin => Math.floor(tempInKelvin + -459.67);

const renderData = data => {
  if (tempBtn.classList.contains("fahrenheit")) {
    tempBtn.innerHTML = "To celsius";
    tempNum.innerText = convertToFahrenheit(data.main.temp);
    document.querySelector(".temp-degree").innerText = "";
    document.querySelector(".temp-celsius").innerText = "F";
  } else {
    tempBtn.innerHTML = "To fahrenheit";
    tempNum.innerText = convertToCelsius(data.main.temp);
    document.querySelector(".temp-degree").innerText = "o";
    document.querySelector(".temp-celsius").innerText = "C";
  }

  country.innerText = getName.getName(data.sys.country);
};

const getWeatherAtLocation = inputLocation => {
  if (locationInput.value === "") {
    alert("enter a location to start");
  } else {
    spinner.classList.remove("hide");
    weatherBox.classList.add("hide");
    noLocationFound.classList.add("hide");
    const weatherApi = `https://api.openweathermap.org/data/2.5/weather?q=${inputLocation}&APPID=2874e0623c8807994e18916c8cd78f21`;
    fetch(weatherApi, { mode: "cors" })
      .then(response => response.json())
      .then(data => {
        if (data.main === undefined) {
          spinner.classList.add("hide");
          noLocationFound.classList.remove("hide");
          noLocationFound.innerText = "City not found";
        } else {
          spinner.classList.add("hide");
          weatherBox.classList.remove("hide");

          tempDescription.innerText = data.weather[0].description;
          city.innerText = data.name;
          renderData(data);
        }
      });
  }
};

const listenToTempChange = () => {
  tempBtn.addEventListener("click", () => {
    tempBtn.classList.toggle("fahrenheit");
    const cityInput = document.querySelector("#get-location-id").value;
    getWeatherAtLocation(cityInput);
  });
};

const showWeatherAtUserLat = (lat, lng) => {
  const weatherApi = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lng}&APPID=2874e0623c8807994e18916c8cd78f21`;
  fetch(weatherApi, { mode: "cors" })
    .then(response => response.json())
    .then(data => {
      tempDescription.innerText = data.weather[0].description;
      city.innerText = data.name;
      renderData(data);
    });
};

const runForm = () => {
  const submitForm = document.querySelector(".get-location");
  submitForm.addEventListener("submit", event => {
    event.preventDefault();
    const cityInput = document.querySelector("#get-location-id").value;
    getWeatherAtLocation(cityInput);
  });
};

const grabUserLocation = (lat, lng) => {
  if (lat === undefined && lng === undefined) {
    noLocationFound.classList.add("hide");
  } else {
    showWeatherAtUserLat(lat, lng);
  }
};

const getCurrentLocation = () => {
  const successFunction = position => {
    const lat = position.coords.latitude;
    const lng = position.coords.longitude;
    grabUserLocation(lat, lng);
  };

  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(successFunction);
  }
};

// getCurrentLocation();
runForm();
grabUserLocation();
listenToTempChange();
