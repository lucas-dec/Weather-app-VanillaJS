window.addEventListener("load", () => {
  checkWeather = (lon, lat, city) => {
    const apiKey = "f0326d2bfb921fa77828c60ea653855b";
    let api = "";

    if (lon && lat) {
      api = `http://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}`;
    }
    if (city) {
      api = `http://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}`;
    }

    fetch(api)
      .then(response => {
        if (response.ok) {
          return response;
        }
        throw Error("Something went wrong ! Try agine ...");
      })
      .then(response => response.json())
      .then(result => {
        displayWeather(result);
      })
      .catch(err => notification(err));
  };

  notification = info => {
    const notificationBox = document.querySelector(".notification");
    notificationBox.classList.add("active");
    notificationBox.textContent = info;
  };

  showInput = () => {
    const form = document.getElementById("search-city");
    form.classList.add("active");

    form.addEventListener("submit", e => {
      e.preventDefault();
      const city = e.target.city.value;
      checkWeather(null, null, city);
      const notificationBox = document.querySelector(".notification");
      notificationBox.classList.remove("active");
      e.target.city.value = "";
      form.classList.remove("active");
    });
  };

  displayWeather = result => {
    const iconWeather = document.querySelector(".icon-weather");
    const temperature = document.querySelector(".temperature h1");
    const labelCity = document.querySelector("span.city");
    const city = result.name;
    const temp = Math.floor(result.main.temp - 273);
    const icon = result.weather[0].icon;

    temperature.textContent = temp;
    labelCity.textContent = city;
  };

  function weatherGeolocation() {
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

    function position(position) {
      const lon = position.coords.longitude;
      const lat = position.coords.latitude;
      checkWeather(lon, lat);
    }
    function showError(error) {
      console.log(error);
      if (error.code === 1) {
        notification(
          error.message +
            "Turn on allow geolocation setting of your browser or type manualy city :)"
        );
        showInput();
      } else notification(error.message + "Please check connect to internet");
    }

    setDate = () => {
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
      const minute = time.getMinutes();
      if (minute < 10) minute = "0" + minute;

      dateBox.innerHTML = `<span>${nameDays[day]}</span>, <span>${hours}:${minute}</span>`;
    };
  }
  weatherGeolocation();
  setDate();
});
