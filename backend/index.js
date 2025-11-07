import express from "express";
import axios from "axios";
import dotenv from "dotenv";
import cors from "cors";


dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;
const API_KEY = process.env.OPENWEATHER_API_KEY;


app.use(cors());
app.use(express.json());


if (!API_KEY) {
  console.warn(" WARNING: OPENWEATHER_API_KEY is not set. Add it in your .env file!");
}


app.get("/api/weather", async (req, res) => {
  try {
    const city = req.query.city;
    if (!city) return res.status(400).json({ error: "City name is required" });

    const url = `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(
      city
    )}&units=metric&appid=${API_KEY}`;

    console.log(" Fetching from URL:", url); // debug

    const response = await axios.get(url);
    const data = response.data;

    console.log("OpenWeather response received");

    res.json({
      city: data.name,
      country: data.sys?.country,
      coord: data.coord,
      weather: data.weather?.[0]?.main,
      description: data.weather?.[0]?.description,
      temp: data.main?.temp,
      feels_like: data.main?.feels_like,
      temp_min: data.main?.temp_min,
      temp_max: data.main?.temp_max,
      humidity: data.main?.humidity,
      wind_speed: data.wind?.speed,
      icon: data.weather?.[0]?.icon
    });
  } catch (error) {
    console.error(" Error fetching weather data:");
    if (error.response) {
      console.error("Status:", error.response.status);
      console.error("Data:", error.response.data);
      return res.status(error.response.status).json(error.response.data);
    } else {
      console.error("Message:", error.message);
      return res.status(500).json({ error: "Internal server error" });
    }
  }
});

app.listen(PORT, () => {
  console.log(`Weather backend running on port ${PORT}`);
});
