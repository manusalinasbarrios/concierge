import React from 'react';
import { getDictionary } from '../../../get-dictionary';
import ExploreServicesLink from '../../../../app/components/ExploreServicesLink';
import ReturnToCityLink from '../../../../app/components/ReturnToCityLink';

interface Contact {
  id: number;
  documentId: string;
  fullname: string;
  email: string;
  phone: string;
  whatsappUrl: string;
}

const STRAPI_URL = process.env.NEXT_PUBLIC_STRAPI_URL || 'http://localhost:1337';

async function getContacts(cityId: string, lang: string) {
  // Using the API structure and filters provided in your request
  const url = `${STRAPI_URL}/api/contactos?populate=cities&filters[cities][documentId][$eq]=${cityId}`;
  const res = await fetch(url, {
    cache: 'no-store',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${process.env.NEXT_PUBLIC_STRAPI_API_TOKEN}`,
    },
  });

  if (!res.ok) {
    throw new Error('Failed to fetch contacts');
  }

  const json = await res.json();
  return json.data as Contact[];
}

export default async function ContactsPage({
  searchParams,
}: {
  searchParams: Promise<{ lang?: string; city?: string }>;
}) {
  const sParams = await searchParams;
  const lang = sParams.lang || 'es';
  const cityId = sParams.city;
  const dict = await getDictionary(lang);

  if (!cityId) {
    return (
      <main className="max-w-screen-md mx-auto my-8 p-4 font-sans text-center">
        <p className="text-red-500">Error: No city selected.</p>
        <ReturnToCityLink lang={lang} />
      </main>
    );
  }

  const contacts = await getContacts(cityId, lang);

  return (
    <main className="max-w-screen-lg mx-auto my-8 p-4">
      <div className="mb-6">
        <ExploreServicesLink lang={lang} cityId={cityId} dict={dict} />
      </div>

      <h1 className="text-3xl font-bold mb-6 text-foreground">{dict.options.contacts}</h1>

      <div className="grid gap-4">
        {contacts.length > 0 ? (
          contacts.map((contact) => (
            <div key={contact.id} className="p-6 border border-gray-200 rounded-lg shadow-sm">
              <h2 className="text-2xl font-semibold mb-2">{contact.fullname}</h2>
              <div className="space-y-2 mb-4 ">
                <div className="flex items-center gap-2">
                  <div
                    className="w-4 h-4 group-hover:scale-110 transition-transform flex-shrink-0 bg-current"
                    style={{
                      maskImage: `url(/img/mail.svg)`,
                      maskRepeat: 'no-repeat',
                      maskSize: 'contain',
                      maskPosition: 'center',
                      color: 'currentColor',
                    }}
                    aria-hidden="true"
                  />
                  <p>{contact.email}</p>
                </div>
                <div className="flex items-center gap-2">
                  <div
                    className="w-4 h-4 group-hover:scale-110 transition-transform flex-shrink-0 bg-current"
                    style={{
                      maskImage: `url(/img/phone.svg)`,
                      maskRepeat: 'no-repeat',
                      maskSize: 'contain',
                      maskPosition: 'center',
                      color: 'currentColor',
                    }}
                    aria-hidden="true"
                  />
                  <p>{contact.phone}</p>
                </div>
              </div>
                                <div className="grid grid-cols-2 gap-3">

              {contact.phone && (
                <a
                      href={`tel:${contact.phone}`}
                      className="flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold py-2.5 rounded-full transition-all"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.74 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path></svg>
                      {lang === 'en' ? 'Call' : 'Llamar'}
                    </a>
              )}


              {contact.whatsappUrl && (
              
                
                <a
                  href={contact.whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 bg-[#25D366] hover:bg-[#128C7E] text-white px-5 py-2.5 rounded-full font-medium transition-colors"
                >
                  WhatsApp
                </a>
              )}
              </div>
            </div>
          ))
        ) : (
          <p className="text-gray-400 italic text-center py-12 border border-dashed border-gray-800 rounded-lg">
            No contacts found for this city.
          </p>
        )}
      </div>
    </main>
  );
}