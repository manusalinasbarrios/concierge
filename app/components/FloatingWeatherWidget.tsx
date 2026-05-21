'use client';

import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import type { WeatherData } from '../cities/options/weather/page';

export default function FloatingWeatherWidget({ lang }: { lang: string }) {
  const searchParams = useSearchParams();
  const cityId = searchParams.get('city');
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (cityId) {
      setLoading(true);
      fetch(`/api/weather?cityId=${cityId}&lang=${lang}`)
        .then((res) => res.json())
        .then((data) => {
          if (!data.error) {
            setWeather(data);
            console.log('Weather data fetched successfully:', data);
          }
          setLoading(false);
        })
        .catch(() => setLoading(false));
    } else {
      setWeather(null);
      setIsOpen(false);
    }
  }, [cityId, lang]);

  if (!cityId || !weather) return null;

  return (
    <>
      {/* Floating Button */}
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 left-6 z-50 flex items-center gap-3  p-2 pr-4 rounded-full shadow-xl border border-gray-200  hover:scale-105 transition-all active:scale-95 group"
        aria-label="View weather forecast"
      >
        <div className="bg-gray-200 rounded-full p-1">
          <img
            src={`https:${weather.current.condition.icon}`}
            alt={weather.current.condition.text}
            className="w-8 h-8"
          />
        </div>
        <div className="flex flex-col items-start leading-tight">
          <span className="text-sm font-bold text-foreground">
            {weather.current.temp_c}°C
          </span>
         
        </div>
      </button>

      {/* Backdrop */}
      <div
        className={`fixed inset-0 bg-black/40 backdrop-blur-sm z-[55] transition-opacity duration-300 ${
          isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
        onClick={() => setIsOpen(false)}
      />

      {/* Forecast Drawer */}
      <div
        className={`fixed inset-x-0 bottom-0 z-[60]  border-t border-gray-200 rounded-t-3xl shadow-2xl transition-transform duration-500 ease-out transform ${
          isOpen ? 'translate-y-0' : 'translate-y-full'
        }`}
      >
        <div className="max-w-screen-md mx-auto p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold text-foreground">
              {lang === 'en' ? '3-Day Forecast in' : 'Pronóstico de 3 días en'} {' '} {weather.location.name}
            </h2>
            <button
              onClick={() => setIsOpen(false)}
              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m18 15-6-6-6 6"/></svg>
            </button>
          </div>

          <div className="grid grid-cols-3 gap-4">
            {weather.forecast.forecastday.map((dayData) => (
              <div
                key={dayData.date}
                className="bg-gray-100/50 border border-gray-100 rounded-2xl p-4 text-center"
              >
                <p className="text-xs font-semibold text-white-500  mb-2">
                
                 
                  {dayData.date.slice(8, 10)}
                </p>
                <img
                  src={`https:${dayData.day.condition.icon}`}
                  alt={dayData.day.condition.text}
                  className="w-12 h-12 mx-auto mb-1"
                />
                <p className="text-[10px] text-white-400  capitalize line-clamp-1 mb-2">
                  {dayData.day.condition.text}
                </p>
                <p className="text-sm font-bold text-foreground">
                  {Math.round(dayData.day.maxtemp_c)}°
                  <span className="text-white-400 font-normal mx-1">/</span>
                  <span className="text-white-400 font-normal">
                    {Math.round(dayData.day.mintemp_c)}°
                  </span>
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}