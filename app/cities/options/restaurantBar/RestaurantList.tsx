'use client';

import React, { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import { fetchRestaurants, Restaurant } from './actions';

interface RestaurantListProps {
  initialRestaurants: Restaurant[];
  cityId: string;
  lang: string;
  pageSize: number;
  initialPage: number;
  strapiUrl: string;
}

export default function RestaurantList({
  initialRestaurants,
  cityId,
  lang,
  pageSize,
  initialPage,
  strapiUrl,
}: RestaurantListProps) {
  const [restaurants, setRestaurants] = useState<Restaurant[]>(initialRestaurants);
  const [page, setPage] = useState(initialPage);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(initialRestaurants.length >= pageSize);
  const observerTarget = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore && !loading) {
          loadMore();
        }
      },
      { threshold: 0.1 }
    );

    if (observerTarget.current) {
      observer.observe(observerTarget.current);
    }

    return () => observer.disconnect();
  }, [hasMore, loading, page]);

  const loadMore = async () => {
    setLoading(true);
    const nextPage = page + 1;
    try {
      const res = await fetchRestaurants(cityId, lang, nextPage, pageSize);
      if (res.data && res.data.length > 0) {
        setRestaurants((prev) => [...prev, ...res.data]);
        setPage(nextPage);
        if (res.data.length < pageSize) setHasMore(false);
      } else {
        setHasMore(false);
      }
    } catch (error) {
      console.error("Error loading more restaurants:", error);
      setHasMore(false);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col">
      <div className="grid gap-8">
        {restaurants.map((restaurant) => (
          <article key={restaurant.id} className="overflow-hidden border border-gray-200 rounded-xl shadow-lg flex flex-col m-4">
            {restaurant.avatar ? (
              <div className="relative w-full h-64">
                <Image
                  src={`${restaurant.avatar.url.startsWith('http') ? restaurant.avatar.url : `${strapiUrl}${restaurant.avatar.url}`}`}
                  alt={restaurant.avatar.alternativeText || restaurant.name}
                  fill
                  className="object-cover"
                />
              </div>
            ) : (
              <div className="w-full h-48 bg-gray-200 rounded-lg mb-4 flex items-center justify-center">
                <span className="text-gray-400">No Image</span>
              </div>
            )}
            <div className="p-6">
              <h2 className="text-4xl font-bold mb-3">{restaurant.name}</h2>
              <p className="text-2xl mb-6 leading-relaxed ">{restaurant.description}</p>
              
              {(() => {
                const locations = [
                  { url: restaurant.restaurantUrl, label: restaurant.nameLocation1 },
                  { url: restaurant.location2, label: restaurant.nameLocation2 },
                  { url: restaurant.location3, label: restaurant.nameLocation3 },
                  { url: restaurant.location4, label: restaurant.nameLocation4 },
                ].filter((loc) => loc.url);

                const defaultLabel = lang === 'en' ? 'Location' : 'Ubicación';

                if (locations.length === 0) return null;

                return (
                  <div className={locations.length > 1 ? "grid grid-cols-1 md:grid-cols-2 gap-4" : "w-full"}>
                    {locations.map((loc, idx) => (
                      <a
                        key={idx}
                        href={loc.url!}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center justify-center gap-2 w-full px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg transition-colors group"
                      >
                        <div
                          className="w-5 h-5 group-hover:scale-110 transition-transform flex-shrink-0 bg-current"
                          style={{
                            maskImage: "url('/img/map-pin.svg')",
                            maskRepeat: 'no-repeat',
                            maskSize: 'contain',
                            maskPosition: 'center',
                          }}
                          aria-hidden="true"
                        />
                        <span className="text-3xl" style={{ textTransform: 'uppercase' }}>
                          {loc.label || defaultLabel}
                        </span>
                      </a>
                    ))}
                  </div>
                );
              })()}
            </div>
          </article>
        ))}
      </div>
      <div ref={observerTarget} className="h-20 flex items-center justify-center">
        {loading && (
          <div className="flex gap-1"><div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce"></div><div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce [animation-delay:-.3s]"></div><div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce [animation-delay:-.5s]"></div></div>
        )}
      </div>
    </div>
  );
}