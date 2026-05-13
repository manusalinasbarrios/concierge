'use server'

interface Contact {
  id: number;
  fullname: string;
  phone: string;
  whatsappUrl: string;
}

export async function getQuickContacts(cityId: string) {
  const url = `http://localhost:1337/api/contactos?populate=cities&filters[cities][documentId][$eq]=${cityId}`;
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