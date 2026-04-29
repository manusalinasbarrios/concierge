import React from 'react';
import { getDictionary } from '../../get-dictionary';
import Link from 'next/link';

export interface WeatherData {
  current: {
    temp_c: number;
    condition: {
      text: string;
      icon: string;
    };
    humidity: number;
    wind_kph: number;
  };
  forecast: {
    forecastday: Array<{
      date: string;
      day: {
        maxtemp_c: number;
        mintemp_c: number;
        condition: {
          text: string;
          icon: string;
        };
      };
    }>;
  };
  location: {
    name: string;
    region: string;
    tz_id: string;
    localtime: string;
  };
}

const STRAPI_URL = process.env.STRAPI_URL || 'http://localhost:1337';

export async function getCityName(cityId: string) {
  const res = await fetch(`${STRAPI_URL}/api/cities`, {
    headers: {
      Authorization: `Bearer ${process.env.STRAPI_API_TOKEN}`,
    },
  });
  if (!res.ok) return null;

  const json = await res.json();
  const city = json.data.find((city: any) => city.id === parseInt(cityId));
  if (!city) return null;
  return city.cityNameForWeather;
}

export async function getWeatherData(cityName: string, lang: string) {
  const API_KEY = process.env.WEATHER_API_KEY; // Add this to your .env
  const url = `https://api.weatherapi.com/v1/forecast.json?key=${API_KEY}&q=${cityName}&days=3&lang=${lang}`;
  console.log('Fetching weather data from:', url);
  const res = await fetch(url, { next: { revalidate: 900 } }); // Revalidate every 15 minutes
  if (!res.ok) return null;
  return await res.json() as WeatherData;
}

export default async function WeatherPage({
  searchParams,
}: {
  searchParams: Promise<{ lang?: string; city?: string }>;
}) {
  const sParams = await searchParams;
  const lang = sParams.lang || 'es';
  const cityId = sParams.city;
  const dict = await getDictionary(lang);

  if (!cityId) return <div>No city selected</div>;

  const cityName = await getCityName(cityId);
  const weather = cityName ? await getWeatherData(cityName,lang) : null;

  return (
    <main className="max-w-screen-lg mx-auto my-8 p-4 font-sans">
      <div className="mb-6">
        <Link href={`/options?lang=${lang}&city=${cityId}`} className="text-sm text-blue-500 hover:underline">
          &larr; {dict.explore_options}
        </Link>
      </div>

      <h1 className="text-3xl font-bold mb-6 text-foreground">
        {lang === 'en' ? `Weather in ${cityName}` : `Clima en ${cityName}`}
      </h1>

      {weather ? (
        <div className="bg-gray-800/50 border border-gray-700 rounded-2xl p-8 shadow-xl flex flex-col md:flex-row items-center gap-8">
          <div className="text-center md:text-left">
            <p className="text-7xl font-bold text-white mb-2">{weather.current.temp_c}°C</p>
            <p className="text-xl text-gray-300 capitalize">{weather.current.condition.text}</p>
          </div>
          
          <div className="flex-1 grid grid-cols-2 gap-4 w-full">
            <div className="bg-gray-900/50 p-4 rounded-xl border border-gray-700">
              <p className="text-gray-400 text-xs uppercase tracking-wider mb-1">
                {lang === 'en' ? 'Humidity' : 'Humedad'}
              </p>
              <p className="text-xl font-semibold text-white">{weather.current.humidity}%</p>
            </div>
            <div className="bg-gray-900/50 p-4 rounded-xl border border-gray-700">
              <p className="text-gray-400 text-xs uppercase tracking-wider mb-1">
                {lang === 'en' ? 'Wind' : 'Viento'}
              </p>
              <p className="text-xl font-semibold text-white">{weather.current.wind_kph} km/h</p>
            </div>
          </div>

          <div className="relative w-32 h-32">
            <img 
              src={`https:${weather.current.condition.icon}`} 
              alt={weather.current.condition.text}
              className="w-full h-full object-contain"
            />
          </div>
        </div>
      ) : (
        <p className="text-gray-400 italic text-center py-12">
          {lang === 'en' ? 'Weather data currently unavailable.' : 'Datos del clima no disponibles.'}
        </p>
      )}

      {weather && weather.forecast && weather.forecast.forecastday.length > 0 && (
        <div className="mt-8">
          <h2 className="text-2xl font-bold mb-4 text-foreground">
            {lang === 'en' ? '3-Day Forecast' : 'Pronóstico de 3 días'}
          </h2>
          <div className="grid grid-cols-3 gap-4">
            {weather.forecast.forecastday.map((dayData) => (
              <div key={dayData.date} className="bg-gray-800/50 border border-gray-700 rounded-2xl p-4 text-center">
                <p className="text-base font-semibold text-white mb-2">
                  
                  {new Date(dayData.date).toLocaleDateString(lang, { weekday: 'short', month: 'short', day: 'numeric', timeZone: weather.location.tz_id })}
                </p>
                <img
                  src={`https:${dayData.day.condition.icon}`}
                  alt={dayData.day.condition.text}
                  className="w-16 h-16 mx-auto mb-2"
                />
                <p className="text-gray-300 capitalize mb-2">{dayData.day.condition.text}</p>
                <p className="text-lg font-bold text-white">
                  {dayData.day.maxtemp_c}°C / {dayData.day.mintemp_c}°C
                </p>
              </div>
            ))}
          </div>
        </div>
      )}
    </main>
  );
}