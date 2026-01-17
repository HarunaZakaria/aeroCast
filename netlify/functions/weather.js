import axios from "axios";

exports.handler = async (event, context) => {
  // Only allow POST requests
  if (event.httpMethod !== "POST") {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: "Method Not Allowed" }),
    };
  }

  try {
    // Parse the request body
    const { cityName } = JSON.parse(event.body);

    if (!cityName) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: "City name is required" }),
      };
    }

    // Get API key from environment variable
    const apiKey = process.env.WEATHER_API_KEY;

    if (!apiKey) {
      return {
        statusCode: 500,
        body: JSON.stringify({ error: "API key not configured" }),
      };
    }

    // Fetch weather data from OpenWeatherMap
    const weatherUrl = `https://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=${apiKey}&units=metric`;
    const response = await axios.get(weatherUrl);
    const weatherData = response.data;

    // Extract required data
    const iconCode = weatherData.weather[0].icon;
    const imgUrl = `https://openweathermap.org/img/wn/${iconCode}@2x.png`;

    return {
      statusCode: 200,
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        imgUrl: imgUrl,
        cityName: weatherData.name,
        temperature: Math.floor(weatherData.main.temp),
        description: weatherData.weather[0].description,
      }),
    };
  } catch (error) {
    // Handle city not found or other errors
    if (error.response && error.response.status === 404) {
      return {
        statusCode: 404,
        body: JSON.stringify({ error: "City not found. Please try again." }),
      };
    }

    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Error fetching weather data" }),
    };
  }
};
