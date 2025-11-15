const API_KEY = "2722944c772cebfbaf9d4d62fb993184";

export async function getWeatherByCity(city) {
  const endpoint = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`;

  const response = await fetch(endpoint);
  if (!response.ok) throw new Error("City not found.");
  return response.json();
}