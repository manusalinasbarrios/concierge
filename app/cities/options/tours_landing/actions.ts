'use server';

const STRAPI_URL = process.env.NEXT_PUBLIC_STRAPI_URL || 'http://localhost:1337';

export interface Tour {
  id: number;
  name: string;
  description: string;
  externalLink: string | null;
  portada: boolean;
  onlyCoverImage: boolean;
  coverImage: {
    url: string;
    alternativeText: string | null;
  } | null;
  images: {
    url: string;
    alternativeText: string | null;
  }[];
}

export async function fetchTours(cityId: string, lang: string, page: number, pageSize: number) {
  const url = `${STRAPI_URL}/api/tours?filters[city][documentId][$eq]=${cityId}&populate[0]=coverImage&populate[1]=images&locale=${lang}&pagination[page]=${page}&pagination[pageSize]=${pageSize}&sort=order:asc`;

  const res = await fetch(url, {
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${process.env.NEXT_PUBLIC_STRAPI_API_TOKEN}`,
    },
  });

  if (!res.ok) {
    throw new Error('Failed to fetch tours');
  }

  const json = await res.json();
  return { data: json.data as Tour[], meta: json.meta };
}