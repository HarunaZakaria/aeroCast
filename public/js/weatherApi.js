/**
 * Fetch weather data from the Netlify function
 * @param {string} cityName - The name of the city to fetch weather for
 * @returns {Promise<Object>} - Weather data object
 */
export async function getWeather(cityName) {
  try {
    const response = await fetch("/.netlify/functions/weather", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ cityName }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || "Failed to fetch weather data");
    }

    return await response.json();
  } catch (error) {
    console.error("Weather API error:", error.message);
    throw error;
  }
}
