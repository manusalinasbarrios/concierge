'use client'

import React, { useState, useEffect } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';
import { getQuickContacts } from './contacts';

interface Contact {
  id: number;
  fullname: string;
  phone: string;
  whatsappUrl: string;
}

export default function FloatingContactButton({ lang }: { lang: string }) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const cityId = searchParams.get('city');
  const [isOpen, setIsOpen] = useState(false);
  const [contacts, setContacts] = useState<Contact[]>([]);

  // Show on /options and all sub-routes
  const isVisible = pathname?.startsWith('/cities/options');

  useEffect(() => {
    if (isVisible && cityId) {
      getQuickContacts(cityId).then(data => {
        setContacts(data.slice(0, 2));
      });
    } else {
      setIsOpen(false);
    }
  }, [isVisible, cityId]);

  if (!isVisible || !cityId) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-4">
      {isOpen && (
        <div className="bg-gray-900 border border-gray-700 rounded-2xl shadow-2xl p-5 w-80 animate-in fade-in slide-in-from-bottom-4 duration-300">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-white font-bold text-lg">
              {lang === 'en' ? 'Quick Contact' : 'Contacto Rápido'}
            </h3>
            <button
              onClick={() => setIsOpen(false)}
              className="text-gray-400 hover:text-white bg-gray-800 p-1 rounded-full transition-colors"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-message-square-icon lucide-message-square"><path d="M22 17a2 2 0 0 1-2 2H6.828a2 2 0 0 0-1.414.586l-2.202 2.202A.71.71 0 0 1 2 21.286V5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2z" /></svg>            </button>
          </div>

          <div className="space-y-6">
            {contacts.length > 0 ? (
              contacts.map(contact => (
                <div key={contact.id} className="space-y-3">
                  <p className="text-sm font-semibold text-gray-100">{contact.fullname}</p>
                  <div className="grid grid-cols-2 gap-3">
                    <a
                      href={`tel:${contact.phone}`}
                      className="flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold py-2.5 rounded-xl transition-all"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.74 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path></svg>
                      {lang === 'en' ? 'Call' : 'Llamar'}
                    </a>
                    {contact.whatsappUrl && (
                      <a
                        href={contact.whatsappUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700 text-white text-xs font-bold py-2.5 rounded-xl transition-all"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-message-circle-check-icon lucide-message-circle-check"><path d="M2.992 16.342a2 2 0 0 1 .094 1.167l-1.065 3.29a1 1 0 0 0 1.236 1.168l3.413-.998a2 2 0 0 1 1.099.092 10 10 0 1 0-4.777-4.719" /><path d="m9 12 2 2 4-4" /></svg>                        WhatsApp
                      </a>
                    )}
                  </div>
                </div>
              ))
            ) : (
              <p className="text-gray-400 text-sm italic text-center py-4">
                {lang === 'en' ? 'No contacts available' : 'No hay contactos disponibles'}
              </p>
            )}
          </div>
        </div>
      )}

      <button
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Contact Concierge"
        className={`w-16 h-16 rounded-full shadow-2xl flex items-center justify-center transition-all duration-300 transform active:scale-90 ${isOpen ? 'bg-gray-700' : 'bg-blue-600 hover:bg-blue-700'}`}
      >
        {isOpen ? (
          <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
        ) : (
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-message-square-icon lucide-message-square"><path d="M22 17a2 2 0 0 1-2 2H6.828a2 2 0 0 0-1.414.586l-2.202 2.202A.71.71 0 0 1 2 21.286V5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2z" /></svg>
        )}
      </button>
    </div>
  );
}