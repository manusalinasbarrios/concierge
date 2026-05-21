import { NextResponse } from 'next/server';
import { getCityName, getWeatherData } from '../../cities/options/weather/page';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const cityId = searchParams.get('cityId');
  const lang = searchParams.get('lang') || 'es';

  if (!cityId) {
    return NextResponse.json({ error: 'City ID is required' }, { status: 400 });
  }

  const cityName = await getCityName(cityId);
  if (!cityName) return NextResponse.json({ error: 'City not found' }, { status: 404 });

  const weather = await getWeatherData(cityName, lang);
  console.log('Weather data for', cityName, ':', weather);
  return NextResponse.json(weather);
}