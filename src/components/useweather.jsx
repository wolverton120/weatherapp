import { useState, useCallback } from 'react';
import { getWeatherByCity, getForecastByCity } from '../api/weather';

export function useWeather() {
  const [weather, setWeather] = useState(null);
  const [forecast, setForecast] = useState([]);
  const [todayHighLow, setTodayHighLow] = useState({ high: null, low: null });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const fetchWeatherData = useCallback(async (city) => {
    if (!city.trim()) return;
    
    setLoading(true);
    setError("");
    
    try {
      const [weatherData, forecastData] = await Promise.all([
        getWeatherByCity(city),
        getForecastByCity(city)
      ]);
      
      setWeather(weatherData);
      processForecastData(forecastData);
    } catch (err) {
      setError(err.message || "Failed to fetch weather");
      setWeather(null);
      setForecast([]);
      setTodayHighLow({ high: null, low: null });
    } finally {
      setLoading(false);
    }
  }, []);

  const processForecastData = useCallback((data) => {
    const daily = {};
    const todayDate = new Date().toISOString().split("T")[0];
    let todayTemps = [];

    data.list.forEach((entry) => {
      const date = entry.dt_txt.split(" ")[0];
      const hour = parseInt(entry.dt_txt.split(" ")[1].split(":")[0], 10);

      if (date === todayDate) todayTemps.push(entry.main.temp);

      if (!daily[date]) {
        daily[date] = {
          min: entry.main.temp_min,
          max: entry.main.temp_max,
          icon: null,
          condition: null,
          humidity: null,
          windSpeed: null,
        };
      } else {
        daily[date].min = Math.min(daily[date].min, entry.main.temp_min);
        daily[date].max = Math.max(daily[date].max, entry.main.temp_max);
      }

      if (!daily[date].icon && hour >= 6 && hour <= 18) {
        daily[date].icon = entry.weather[0].icon;
        daily[date].condition = entry.weather[0].main;
        daily[date].humidity = entry.main.humidity;
        daily[date].windSpeed = entry.wind.speed;
      }
    });

    if (todayTemps.length > 0) {
      setTodayHighLow({
        high: Math.max(...todayTemps),
        low: Math.min(...todayTemps),
      });
    }

    const nextDays = Object.entries(daily)
      .filter(([date]) => date !== todayDate)
      .slice(0, 5);

    const fixedNextDays = nextDays.map(([date, info]) => ({
      date,
      min: info.min,
      max: info.max,
      icon: info.icon || "01d",
      condition: info.condition || "Clear",
      humidity: info.humidity || 50,
      windSpeed: info.windSpeed || 5,
    }));

    setForecast(fixedNextDays);
  }, []);

  return {
    weather,
    forecast,
    todayHighLow,
    error,
    loading,
    fetchWeatherData
  };
}