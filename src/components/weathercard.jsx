import React from 'react';
import { useUnitContext } from './useunitconversion';

const WeatherCard = React.memo(({ weather, todayHighLow }) => {
  const { convertTemp, convertWindSpeed, convertPressure, formatTime } = useUnitContext();

  if (!weather) return null;

  return (
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
  );
});

export default WeatherCard;