'use client';

import React from 'react';

export default function WeatherComponent({ weather, lang }: { weather: any; lang: string }) {
  if (!weather) return null;

  const isEn = lang === 'en';

  return (
    <section className="my-10 bg-card/30 backdrop-blur-md rounded-3xl overflow-hidden shadow-2xl border border-foreground/10 p-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* Current Weather (Principal) */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-8 mb-10">
        <div className="text-center md:text-left flex-1">
          <h2 className="text-sm font-bold uppercase tracking-widest text-foreground/40 mb-3">
            {isEn ? 'Current Weather' : 'Clima Actual'}
          </h2>
          <div className="flex items-center justify-center md:justify-start gap-6">
            <span className="text-7xl md:text-8xl font-black text-foreground leading-none tracking-tighter">
              {Math.round(weather.current.temp_c)}°
            </span>
            <div className="flex flex-col items-center md:items-start">
              <img 
                src={`https:${weather.current.condition.icon}`} 
                alt={weather.current.condition.text}
                className="w-20 h-20 md:w-24 md:h-24"
              />
              <p className="text-xl font-bold text-foreground/80 capitalize leading-none">
                {weather.current.condition.text}
              </p>
            </div>
          </div>
        </div>

        {/* Weather Stats */}
        <div className="grid grid-cols-2 gap-4 w-full md:w-auto">
          <div className="bg-foreground/5 p-5 rounded-2xl border border-foreground/10 text-center flex flex-col justify-center min-w-[120px]">
            <p className="text-[10px] font-bold uppercase tracking-widest text-foreground/40 mb-1">
              {isEn ? 'Humidity' : 'Humedad'}
            </p>
            <p className="text-2xl font-black text-foreground">{weather.current.humidity}%</p>
          </div>
          <div className="bg-foreground/5 p-5 rounded-2xl border border-foreground/10 text-center flex flex-col justify-center min-w-[120px]">
            <p className="text-[10px] font-bold uppercase tracking-widest text-foreground/40 mb-1">
              {isEn ? 'Wind' : 'Viento'}
            </p>
            <p className="text-2xl font-black text-foreground">{weather.current.wind_kph} <span className="text-xs font-normal opacity-50">km/h</span></p>
          </div>
        </div>
      </div>

      {/* 3-Day Forecast */}
      <div className="border-t border-foreground/5 pt-8">
        <h3 className="text-xs font-bold uppercase tracking-widest text-foreground/40 mb-6 text-center md:text-left">
          {isEn ? '3-Day Forecast' : 'Pronóstico de 3 días'}
        </h3>
        <div className="grid grid-cols-3 md:grid-cols-3 gap-4">
          {weather.forecast.forecastday.map((dayData: any) => (
            <div key={dayData.date} className="bg-foreground/5 border border-foreground/5 rounded-2xl p-6 text-center hover:bg-foreground/10 transition-colors group">
              <p className="text-xs font-bold text-foreground/60 uppercase tracking-tighter mb-3">
                {new Date(dayData.date + 'T00:00:00').toLocaleDateString(lang, { weekday: 'short', month: 'short', day: 'numeric' })}
              </p>
              <img
                src={`https:${dayData.day.condition.icon}`}
                alt={dayData.day.condition.text}
                className="w-14 h-auto mx-auto mb-2 group-hover:scale-110 transition-transform"
              />
              <p className="text-xs font-bold text-foreground/40 capitalize mb-3 line-clamp-1">{dayData.day.condition.text}</p>
              <p className="text-md font-black text-foreground grid grid-cols-3 gap-1 justify-center items-center">
                {Math.round(dayData.day.maxtemp_c)}° <span className="text-foreground/20 font-normal">/</span> {Math.round(dayData.day.mintemp_c)}°
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}