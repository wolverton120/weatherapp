import React from 'react';
import { useUnitContext } from './useunitconversion';

const ForecastCards = React.memo(({ forecast }) => {
  const { convertTemp, convertWindSpeed } = useUnitContext();

  if (!forecast || forecast.length === 0) return null;

  return (
    <>
      <h2 className="text-3xl font-bold text-center mb-5">Next 5 Days</h2>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 px-4 justify-center md:justify-start">
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
  );
});

export default ForecastCards;