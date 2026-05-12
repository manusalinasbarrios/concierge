'use server';

export interface Restaurant {
  id: number;
  documentId: string;
  name: string;
  nameLocation1: string | null;
  nameLocation2: string | null;
  nameLocation3: string | null;
  nameLocation4: string | null;
  restaurantUrl: string | null;
  location2: string | null;
  location3: string | null;
  location4: string | null;
  description: string;
  avatar: {
    url: string;
    alternativeText: string | null;
  } | null;
}

const STRAPI_URL = process.env.NEXT_PUBLIC_STRAPI_URL || 'http://localhost:1337';

export async function fetchRestaurants(
  cityId: string, 
  lang: string, 
  page: number, 
  pageSize: number
) {
  const url = `${STRAPI_URL}/api/restaurantes?filters[city][documentId][$eq]=${cityId}&populate=avatar&pagination[page]=${page}&pagination[pageSize]=${pageSize}&locale=${lang}`;

  const res = await fetch(url, {
    cache: 'no-store',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${process.env.NEXT_PUBLIC_STRAPI_API_TOKEN}`,
    },
  });

  if (!res.ok) {
    throw new Error('Failed to fetch restaurants');
  }

  const json = await res.json();
  return json as { data: Restaurant[]; meta: any };
}