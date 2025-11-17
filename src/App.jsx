import Header from './components/header';
import UnitToggle from './components/unittoggle';
import SearchBar from './components/searchbar';
import WeatherCard from './components/weathercard';
import ForecastCards from './components/forecastcards';
import BackgroundParticles from './components/backgroundparticles';
import ErrorDisplay from './components/errordisplay';
import { useWeather } from './components/useweather';
import { UnitProvider } from './components/useunitconversion';

export default function App() {
  const {
    weather,
    forecast,
    todayHighLow,
    error,
    loading,
    fetchWeatherData
  } = useWeather();

  return (
    <UnitProvider>
      <div className="min-h-screen px-5 py-6 relative overflow-hidden">
        <BackgroundParticles />
        <Header />
        <UnitToggle />
        <SearchBar onSearch={fetchWeatherData} loading={loading} />
        <ErrorDisplay error={error} />
        <WeatherCard weather={weather} todayHighLow={todayHighLow} />
        <ForecastCards forecast={forecast} />
      </div>
    </UnitProvider>
  );
}