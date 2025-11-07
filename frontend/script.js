const API_URL = "http://localhost:5000/api/weather";
const cityInput = document.getElementById("cityInput");
const searchBtn = document.getElementById("searchBtn");
const locBtn = document.getElementById("locBtn");
const weatherCard = document.getElementById("weatherCard");
const errorMsg = document.getElementById("error");
const themeToggle = document.getElementById("themeToggle");

// Load saved theme
if (localStorage.getItem("theme") === "dark") {
  document.body.classList.add("dark");
  themeToggle.textContent = "☀️";
}

themeToggle.addEventListener("click", () => {
  document.body.classList.toggle("dark");
  const isDark = document.body.classList.contains("dark");
  themeToggle.textContent = isDark ? "☀️" : "🌙";
  localStorage.setItem("theme", isDark ? "dark" : "light");
});


searchBtn.addEventListener("click", () => fetchWeather(cityInput.value.trim()));


locBtn.addEventListener("click", () => {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(async (pos) => {
      const { latitude, longitude } = pos.coords;
      try {
        const response = await fetch(
          `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${latitude}&longitude=${longitude}&localityLanguage=en`
        );
        const locationData = await response.json();
        const city = locationData.city || locationData.locality;
        if (city) fetchWeather(city);
        else errorMsg.textContent = "Could not detect city. Try manual search.";
      } catch (err) {
        errorMsg.textContent = "Location access failed. Try again.";
      }
    });
  } else {
    errorMsg.textContent = "Geolocation not supported.";
  }
});


async function fetchWeather(city) {
  if (!city) {
    errorMsg.textContent = "Enter a city name.";
    return;
  }

  errorMsg.textContent = "";
  weatherCard.classList.add("hidden");

  try {
    const res = await fetch(`${API_URL}?city=${city}`);
    const data = await res.json();

    if (data.error) {
      errorMsg.textContent = data.error;
      return;
    }

    document.getElementById("cityName").textContent = `${data.city}, ${data.country}`;
    document.getElementById("description").textContent = data.description;
    document.getElementById("temperature").textContent = `🌡 Temp: ${data.temp}°C (Feels like ${data.feels_like}°C)`;
    document.getElementById("humidity").textContent = `💧 Humidity: ${data.humidity}%`;
    document.getElementById("wind").textContent = `🌬 Wind: ${data.wind_speed} m/s`;
    document.getElementById("weatherIcon").src = `https://openweathermap.org/img/wn/${data.icon}@2x.png`;

    updateBackground(data.weather);
    weatherCard.classList.remove("hidden");
  } catch (error) {
    errorMsg.textContent = "Failed to fetch weather data.";
  }
}


function updateBackground(weatherType) {
  const lower = weatherType.toLowerCase();
  document.body.classList.remove(
    "sunny",
    "cloudy",
    "rainy",
    "snowy",
    "thunderstorm",
    "mist",
    "clear"
  );

  if (lower.includes("clear")) document.body.classList.add("sunny");
  else if (lower.includes("cloud")) document.body.classList.add("cloudy");
  else if (lower.includes("rain")) document.body.classList.add("rainy");
  else if (lower.includes("snow")) document.body.classList.add("snowy");
  else if (lower.includes("thunder")) document.body.classList.add("thunderstorm");
  else if (lower.includes("mist") || lower.includes("fog") || lower.includes("haze"))
    document.body.classList.add("mist");
  else document.body.classList.add("clear");
}
