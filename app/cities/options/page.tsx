import React from 'react';
import { getDictionary } from '../../get-dictionary';
import Link from 'next/link';
import CityHeaderImage from '../../components/CityHeaderImage';
import EstadioComponent from '../../components/EstadioComponent';
import CityMatches from '../../components/CityMatches';
import WeatherComponent from '../../components/WeatherComponent';


const STRAPI_URL = process.env.NEXT_PUBLIC_STRAPI_URL || 'http://localhost:1337';

export async function getCityName(cityId: string, lang: string): Promise<any | null> {
  const res = await fetch(`${STRAPI_URL}/api/cities/${cityId}?locale=${lang}&populate[0]=citieHomePageImage&populate[1]=estadioImage`, {
    cache: 'no-store', // Ensures you always get the latest data from Strapi
    headers: {
      Authorization: `Bearer ${process.env.NEXT_PUBLIC_STRAPI_API_TOKEN}`,
    },
    //next: { revalidate: 3600 }, // Cache for 1 hour
  });
  if (!res.ok) return null;

  const json = await res.json();
  return json.data;

}

async function getWeatherData(cityName: string, lang: string) {
  const API_KEY = process.env.NEXT_PUBLIC_WEATHER_API_KEY;
  const url = `https://api.weatherapi.com/v1/forecast.json?key=${API_KEY}&q=${cityName}&days=4&lang=${lang}`;
  const res = await fetch(url, { next: { revalidate: 900 } }); // Revalidate every 15 minutes
  if (!res.ok) return null;
  return await res.json();
}

export async function getMatches(cityId: string, lang: string): Promise<any[]> {
  const url = `${STRAPI_URL}/api/partidos?filters[city][documentId][$eq]=${cityId}&locale=${lang}&sort=matchDay:asc,startHour:asc`;
  const res = await fetch(url, {
    headers: {
      Authorization: `Bearer ${process.env.NEXT_PUBLIC_STRAPI_API_TOKEN}`,
    },
    next: { revalidate: 3600 }, // Cache for 1 hour
  });

  if (!res.ok) return [];
  const json = await res.json();
  return json.data;
}

export default async function OptionsPage({
  searchParams,
}: {
  searchParams: Promise<{ lang?: string, city?: string, cityName?: string }>;
}) {
  const sParams = await searchParams;
  const lang = sParams.lang || 'es';
  const city = sParams.city;
  const cityName = sParams.cityName || ''; // Fallback if cityName is not provided
  const dict = await getDictionary(lang);

  // Fetch city data for the header image
  const cityData = city ? await getCityName(city, lang) : null;
  const headerImages = cityData?.citieHomePageImage || [];
  const matches = city ? await getMatches(city, lang) : [];

  const weather = cityData?.cityNameForWeather ? await getWeatherData(cityData.cityNameForWeather, lang) : null;

  const options = [
    //{ key: 'contacts', label: dict.options.contacts, icon: '/img/contact.svg' },
    //{ key: 'matches', label: dict.options.matches, icon: '/img/matches.svg' },
    { key: 'transports', label: dict.options.transport, icon: '/img/transport.svg' },
    { key: 'restaurantBar', label: dict.options.restaurantBar, icon: '/img/restaurantBar.svg' },
    { key: 'tours_landing', label: dict.options.tour, icon: '/img/tour.svg' },
    { key: 'emergency', label: dict.options.emergency, icon: '/img/emergency.svg' },
  ];

  return (
    <main className="max-w-screen-lg mx-auto my-8 p-4 font-sans">
      {headerImages.length > 0 && (
        <CityHeaderImage images={headerImages} cityName={cityName} strapiUrl={STRAPI_URL} />
      )}



      <div className="max-w-screen-md mx-auto mb-6 p-4">
        <h1 className="text-3xl font-bold text-foreground uppercase"
        >
          {cityData?.title || 'City Options'}
        </h1>
        <p className="text-lg text-foreground/70 mt-2 text-justify p-4">
          {cityData?.description || 'Explore the various options available for this city.'}
        </p>
      </div>
      {weather && (
        <WeatherComponent weather={weather} lang={lang} />
      )}
      {cityData?.estadioName && (
        <EstadioComponent
          name={cityData.estadioName}
          description={cityData.estadioDescription}
          location={cityData.estadioLocation}
          image={cityData.estadioImage}
          strapiUrl={STRAPI_URL}
          lang={lang}
        />
      )}

      {matches.length > 0 && (
        <CityMatches matches={matches} lang={lang} />
      )}

      <ul className="list-none p-0 max-w-md mx-auto grid">
        {options.map((option) => (
          <li key={option.key} className="mb-4">
            <Link
              href={`/cities/options/${option.key}?lang=${lang}${city ? `&city=${city}` : ''}${cityName ? `&cityName=${cityName}` : ''}`}
              className="flex items-center gap-4 p-4 px-15 border border-gray-200 rounded-full text-foreground transition-colors duration-200 ease-in-out text-lg group"
            >
              <div
                className="w-8 h-8 group-hover:scale-110 transition-transform flex-shrink-0 bg-current"
                style={{
                  maskImage: `url(${option.icon})`,
                  maskRepeat: 'no-repeat',
                  maskSize: 'contain',
                  maskPosition: 'center',
                  color: 'currentColor',
                }}
                aria-hidden="true"
              />
              <span className='text-2xl' style={{
                textTransform: 'uppercase',
              }} >{option.label}</span>
            </Link>
          </li>
        ))}
      </ul>
    </main>
  );
}