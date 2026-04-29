'use server'

interface Contact {
  id: number;
  fullname: string;
  phone: string;
  whatsappUrl: string;
}
const STRAPI_URL = process.env.STRAPI_URL || 'http://localhost:1337';

export async function getQuickContacts(cityId: string) {
  const url = `${STRAPI_URL}/api/contactos?populate=cities&filters[cities][id][$eq]=${cityId}`;
  const res = await fetch(url, {
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${process.env.STRAPI_API_TOKEN}`,
    },
    next: { revalidate: 60 } // Cache for 1 minute
  });

  if (!res.ok) return [];
  
  const json = await res.json();
  return json.data as Contact[];
}