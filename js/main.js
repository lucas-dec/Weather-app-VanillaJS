window.addEventListener("load", () => {
  inputActive = false;
  const btnShowInput = document.querySelector(".btn-show-input");
  const form = document.querySelector(".search-city");

  const checkWeather = (lon, lat, city) => {
    const apiKey = "f0326d2bfb921fa77828c60ea653855b";
    let api = "";

    if (lon && lat) {
      api = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}`;
    }
    if (city) {
      api = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}`;
    }

    fetch(api)
      .then(response => {
        if (response.ok) {
          return response;
        }
        throw Error("Something went wrong ! </br> Try agine ...");
      })
      .then(response => response.json())
      .then(result => {
        displayWeather(result);
      })
      .catch(err => notification(err));
  };

  const notification = info => {
    const notificationBox = document.querySelector(".notification");
    notificationBox.classList.add("active");
    notificationBox.innerHTML = info;
  };

  const showInput = () => {
    form.classList.add("active");
    inputActive = true;
    form.addEventListener("submit", e => {
      e.preventDefault();
      const city = e.target.city.value;
      if (city === "" || city === " ") return;
      checkWeather(null, null, city);
      const notificationBox = document.querySelector(".notification");
      notificationBox.classList.remove("active");
      closeInput();
    });
  };

  const closeInput = () => {
    form.reset();
    form.classList.remove("active");
    inputActive = false;
  };

  const displayWeather = result => {
    const iconWeather = document.querySelector(".icon-weather");
    const labelDescription = document.querySelector(".description");
    const temperature = document.querySelector(".temperature h1");
    const labelCity = document.querySelector("span.city");

    const city = result.name;
    const description = result.weather[0].main;

    const temp = Math.floor(result.main.temp - 273);
    const icon = result.weather[0].icon;

    iconWeather.innerHTML = `<img src="./images/${icon}.svg" alt="Unknown image" />`;
    labelDescription.textContent = description;
    temperature.innerHTML = `${temp} &#8451`;
    labelCity.textContent = city;
  };

  const position = position => {
    const lon = position.coords.longitude;
    const lat = position.coords.latitude;
    checkWeather(lon, lat);
  };

  const showError = error => {
    if (error.code === 1) {
      notification(
        error.message +
          "</br>Turn on allow geolocation setting of your browser or type manualy city :)"
      );
      showInput();
    } else
      notification(error.message + "</br>Please check connect to internet");
  };

  const weatherGeolocation = () => {
    if (navigator.geolocation) {
      options = {
        enableHighAccuracy: true,
        timeout: 6000,
        maximumAge: 0
      };

      navigator.geolocation.getCurrentPosition(position, showError);
    } else {
      notification("Your browser doesn't support Geolocation");
    }

    const setDate = () => {
      const dateBox = document.querySelector(".date-box");
      const time = new Date();

      const nameDays = [
        "Sunday",
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday"
      ];

      const day = time.getDay();
      const hours = time.getHours();
      let minute = time.getMinutes();
      if (minute < 10) minute = "0" + minute;

      dateBox.innerHTML = `<span>${nameDays[day]}</span>, <span>${hours}:${minute}</span>`;
    };
  };

  weatherGeolocation();
  setDate();

  btnShowInput.addEventListener("click", () => {
    if (inputActive) closeInput();
    else showInput();
  });
});
