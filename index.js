//import the dependencies
import express from "express";
import bodyParser from "body-parser";
import axios from "axios";
import dotevn from "dotenv";
dotevn.config();

//initialize the express app
const app = express();
const apiKey = process.env.WEATHER_API_KEY;
const PORT = process.env.PORT;
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));
app.set("view engine", "ejs");

//define a route to handle GET requests
app.get("/", async (req, res) => {
  res.render("index.ejs");
});
//define a route to handle POST requests
app.post("/submit", async (req, res) => {
  const cityName = req.body.bookName;
  const weatherUrl = `https://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=${apiKey}&units=metric`;
  try {
    const response = await axios.get(weatherUrl);
    const weatherData = response.data;
    const iconCode = `${weatherData["weather"][0]["icon"]}`;
    const imgUrl = "https://openweathermap.org/img/wn/" + iconCode + "@2x.png";
    //onst weatherDescription = `The weather in ${weatherData.name} is ${weatherData.weather[0].description} with a temperature of ${weatherData.main.temp}°C.`;
    res.render("index.ejs", {
      imgUrl: imgUrl,
      cityName: cityName,
      temperature: Math.floor(weatherData.main.temp),
      description: weatherData.weather[0].description,
    });
    console.log(weatherData.main.temp);
    console.log(weatherData.weather[0].description);
    console.log(weatherData.name);
  } catch (error) {
    res.render("index.ejs", { weather: "City not found. Please try again." });
  }
});

//start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
