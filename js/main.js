window.addEventListener("load", () => {
  checkWeather = (lon, lat) => {
    const apiKey = "f0326d2bfb921fa77828c60ea653855b";
    let api = "";

    api = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}`;

    fetch(api)
      .then(response => {
        if (response.ok) {
          return response;
        }
        throw Error("Something went wrong !");
      })
      .then(response => response.json())
      .then(result => {
        console.log(result);
      })
      .catch(err => notification(err));
  };

  notification = info => {
    const notificationBox = document.querySelector(".notification");
    notificationBox.classList.add("active");
    notificationBox.textContent = info;
  };

  function weatherGeolocation() {
    if (navigator.geolocation) {
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
      notification(
        error.message +
          "Turn on allow geolocation in setting your browser or type manualy city :)"
      );
    }
  }
  weatherGeolocation();
});
