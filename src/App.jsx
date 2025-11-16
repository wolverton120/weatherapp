import React, { useState, useEffect } from "react";

const API_KEY = "2722944c772cebfbaf9d4d62fb993184";

export default function App() {
  const [city, setCity] = useState("");
  const [weather, setWeather] = useState(null);
  const [forecast, setForecast] = useState([]);
  const [unit, setUnit] = useState("C");
  const [dateTime, setDateTime] = useState("");
  const [error, setError] = useState("");
  const [todayHighLow, setTodayHighLow] = useState({ high: null, low: null });

  useEffect(() => {
    const interval = setInterval(updateDateTime, 60000);
    updateDateTime();
    return () => clearInterval(interval);
  }, []);

  const updateDateTime = () => {
    const now = new Date();
    const formatted = now.toLocaleString("en-US", {
      weekday: "long",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
    setDateTime(formatted);
  };

  const convertTemp = (c) => (unit === "C" ? c : (c * 9) / 5 + 32);
  const convertWindSpeed = (ms) => {
    if (unit === "C") {
      return ms.toFixed(1) + " m/s";
    } else {
      return (ms * 2.237).toFixed(1) + " mph";
    }
  };
  const convertPressure = (hPa) => {
    if (unit === "C") {
      return hPa + " hPa";
    } else {
      return (hPa * 0.02953).toFixed(2) + " inHg";
    }
  };
  const formatTime = (timestamp) => {
    return new Date(timestamp * 1000).toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const fetchWeather = async (cityName) => {
    try {
      const url = `https://api.openweathermap.org/data/2.5/weather?q=${cityName}&units=metric&appid=${API_KEY}`;
      const res = await fetch(url);
      const data = await res.json();

      if (data.cod !== 200) {
        setWeather(null);
        setForecast([]);
        setTodayHighLow({ high: null, low: null });
        setError(data.message);
        return;
      }

      setWeather(data);
      setError("");
    } catch (e) {
      setWeather(null);
      setForecast([]);
      setTodayHighLow({ high: null, low: null });
      setError("Failed to fetch weather");
    }
  };

  const fetchForecast = async (cityName) => {
    try {
      const url = `https://api.openweathermap.org/data/2.5/forecast?q=${cityName}&units=metric&appid=${API_KEY}`;
      const res = await fetch(url);
      const data = await res.json();

      if (data.cod !== "200") {
        setForecast([]);
        return;
      }

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
    } catch (e) {
      setForecast([]);
    }
  };

  const searchCity = async () => {
    if (!city.trim()) return;
    await fetchWeather(city);
    await fetchForecast(city);
  };

  return (
    <div className="min-h-screen px-5 py-6 relative overflow-hidden">
      <div className="particles-container">
        {[...Array(20)].map((_, i) => (
          <div key={i} className={`particle particle-${i + 1}`}></div>
        ))}
      </div>

      <h1 className="text-5xl font-extrabold text-center mb-2">
        <span className="text-neonPink">Weather</span> Dashboard
      </h1>

      <p className="text-center opacity-80 text-lg -mt-1 mb-6">
        {dateTime}
      </p>

      <div className="unit-toggle mb-6">
        <div
          className={`unit-option ${
            unit === "C" ? "unit-active" : ""
          }`}
          onClick={() => setUnit("C")}
        >
          °C
        </div>
        <div
          className={`unit-option ${
            unit === "F" ? "unit-active" : ""
          }`}
          onClick={() => setUnit("F")}
        >
          °F
        </div>
      </div>

      <div className="flex justify-center gap-3 mb-6">
        <input
          className="px-4 py-3 w-64 text-black rounded-lg shadow-md"
          placeholder="Enter city..."
          value={city}
          onChange={(e) => setCity(e.target.value)}
        />
        <button className="glow-button px-5 py-3" onClick={searchCity}>
          Search
        </button>
      </div>

      {error && (
        <p className="text-center text-red-400 font-semibold mb-5">
          {error}
        </p>
      )}

      {weather && (
        <div className="weather-card mx-auto max-w-4xl mb-8">
          <div className="shimmer"></div>
          <h2 className="text-3xl font-bold text-center mb-2">{weather.name}</h2>

          <div className="flex flex-col md:flex-row gap-6 items-center md:items-start">
            <div className="flex flex-col items-center md:w-1/2">
              <div className="flex items-center gap-2">
                <img
                  className="w-24"
                  src={`https://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png`}
                  alt={weather.weather[0].main}
                />
                <p className="text-6xl font-bold">
                  {Math.round(convertTemp(weather.main.temp))}°
                </p>
              </div>

              <p className="text-lg opacity-80 mt-1">{weather.weather[0].main}</p>
              <p className="text-sm opacity-70 capitalize">{weather.weather[0].description}</p>

              <p className="mt-2 text-sm opacity-70">
                Feels like: {Math.round(convertTemp(weather.main.feels_like))}°
              </p>

              <p className="mt-2 text-sm opacity-70">
                Highest today:{" "}
                {todayHighLow.high
                  ? Math.round(convertTemp(todayHighLow.high))
                  : "-"}
                ° <br />
                Lowest today:{" "}
                {todayHighLow.low
                  ? Math.round(convertTemp(todayHighLow.low))
                  : "-"}
                °
              </p>
            </div>

            <div className="md:w-1/2 mt-8 md:mt-12 w-full">
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center">
                  <p className="text-sm opacity-70">Humidity</p>
                  <p className="text-lg font-semibold">{weather.main.humidity}%</p>
                </div>
                <div className="text-center">
                  <p className="text-sm opacity-70">Wind</p>
                  <p className="text-lg font-semibold">{convertWindSpeed(weather.wind.speed)}</p>
                </div>
                <div className="text-center">
                  <p className="text-sm opacity-70">Pressure</p>
                  <p className="text-lg font-semibold">{convertPressure(weather.main.pressure)}</p>
                </div>
                <div className="text-center">
                  <p className="text-sm opacity-70">Visibility</p>
                  <p className="text-lg font-semibold">{(weather.visibility / 1000).toFixed(1)} km</p>
                </div>
              </div>

              <div className="mt-4 grid grid-cols-2 gap-4">
                <div className="text-center">
                  <p className="text-sm opacity-70">Sunrise</p>
                  <p className="text-lg font-semibold">{formatTime(weather.sys.sunrise)}</p>
                </div>
                <div className="text-center">
                  <p className="text-sm opacity-70">Sunset</p>
                  <p className="text-lg font-semibold">{formatTime(weather.sys.sunset)}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {forecast.length > 0 && (
        <>
          <h2 className="text-3xl font-bold text-center mb-5">Next 5 Days</h2>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 px-4">
            {forecast.map((info, idx) => (
              <div key={idx} className="weather-card p-4 text-center">
                <div className="shimmer"></div>
                <p className="font-bold mb-2">
                  {new Date(info.date).toLocaleDateString("en-US", {
                    weekday: "short",
                  })}
                </p>

                <img
                  className="w-12 mx-auto mb-2"
                  src={`https://openweathermap.org/img/wn/${info.icon}@2x.png`}
                />

                <p className="text-sm opacity-80">{info.condition}</p>

                <p className="mt-2 text-sm">
                  {Math.round(convertTemp(info.max))}° /{" "}
                  {Math.round(convertTemp(info.min))}°
                </p>

                <div className="mt-3 flex justify-between text-xs opacity-70">
                  <span>💧 {info.humidity}%</span>
                  <span>💨 {convertWindSpeed(info.windSpeed).split(" ")[0]}</span>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}