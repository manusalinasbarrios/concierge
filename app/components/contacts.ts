'use server'

interface Contact {
  id: number;
  fullname: string;
  phone: string;
  whatsappUrl: string;
}
const STRAPI_URL = process.env.NEXT_PUBLIC_STRAPI_URL || 'http://localhost:1337';

export async function getQuickContacts(cityId: string) {
  const url = `${STRAPI_URL}/api/contactos?populate=cities&filters[cities][documentId][$eq]=${cityId}`;
  const res = await fetch(url, {
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${process.env.NEXT_PUBLIC_STRAPI_API_TOKEN}`,
    },
    next: { revalidate: 3600 } // Cache for 1 hour
  });

  if (!res.ok) return [];
  
  const json = await res.json();
  return json.data as Contact[];
}