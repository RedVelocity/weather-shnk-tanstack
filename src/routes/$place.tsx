import { useEffect } from 'react';
import { ClientOnly, createFileRoute } from '@tanstack/react-router';
import { createServerFn } from '@tanstack/react-start';
import { getLocation } from '@/lib/actions/location.server';
import { getPhoto } from '@/lib/actions/unsplash.server';
import { getWeather } from '@/lib/actions/weather.server';
import useRecentSearch from '@/lib/hooks/useRecentSearch';

import WeatherCard from '@/components/weather/WeatherCard';
import WeatherCardSecondary from '@/components/weather/WeatherCardSecondary';
import DailyWeather from '@/components/weather/DailyWeather';
import HourlyWeather from '@/components/weather/HourlyWeather';
import WeatherBanner from '@/components/weather/WeatherBanner';
import Favorites from '@/components/Favorites';
import LeafletMap from '@/components/map/LeafletMap';

export const Route = createFileRoute('/$place')({
  loader: async ({ params }) => {
    const { place } = params;
    if (!place) throw new Response('Invalid Location', { status: 400 });
    return getRouteData({ data: place }); // Pass as object with data property
  },
  head: ({ loaderData }) => {
    const locationName = loaderData?.location.name ?? '';
    const title = `${locationName} Weather`;
    const keywords = [
      `weather ${locationName}`,
      `${locationName} weather`,
      `${locationName}`,
      'weather.com',
      'accuweather',
      'Next.js',
      'React',
      'JavaScript',
      'Weather',
      'redvelo',
      'vercel weather',
      'weather vercel',
      'weather redvelocity',
      'redvelo.site',
      'redvelocity',
      'redvelocity.site',
      'redvelo.city',
      'red velocity',
      'weather red velocity',
    ];
    return {
      meta: [
        {
          title,
        },
        {
          name: 'keywords',
          content: keywords.join(', '),
        },
      ],
    };
  },
  component: Place,
});

const getRouteData = createServerFn({ method: 'GET' })
  .inputValidator((place: string) => place)
  .handler(async (place) => {
    // Destructure data from context
    const location = await getLocation(place.data);

    const bannerImagePromise = getPhoto(location);
    const weatherPromise = getWeather(
      location.coordinates[1],
      location.coordinates[0],
    );

    const [bannerImage, weather] = await Promise.all([
      bannerImagePromise,
      weatherPromise,
    ]);

    return {
      location,
      weather,
      bannerImage,
    };
  });

function Place() {
  const { location, weather, bannerImage } = Route.useLoaderData();

  const { addSearch } = useRecentSearch();
  useEffect(() => {
    addSearch(location);
  }, [location.id]);

  return (
    <div className="grid gap-4 m-4 lg:gap-6 lg:grid-cols-3">
      {/* PC Row 1 */}
      <section className="flex flex-col space-y-3">
        {/* <SearchCard /> */}
        <WeatherCard weather={weather} location={location} />
      </section>
      <section className="grid gap-4 md:grid-cols-2 lg:grid-cols-1">
        <Favorites currentLocation={location} />
        {/* hidden for mobile */}
        <div className="hidden h-full md:block">
          <WeatherCardSecondary weather={weather} />
        </div>
      </section>
      {/* PC Row 2 */}
      <section className="row-start-3 lg:row-start-2 lg:col-span-2">
        <WeatherBanner
          location={location}
          weather={weather}
          bannerImage={bannerImage}
        />
      </section>
      {/* Only for mobile */}
      <div className="row-start-4 md:hidden">
        <WeatherCardSecondary weather={weather} />
      </div>
      {/* PC Row 3 */}
      <section className="col-start-1 lg:col-span-2 lg:row-start-3">
        <DailyWeather weather={weather} />
      </section>
      <section className="row-span-2 overflow-hidden lg:col-start-3">
        <HourlyWeather weather={weather} />
      </section>
      <section className="lg:col-start-3">
        <ClientOnly
          fallback={<div className="h-80 lg:h-full wrapper animate-pulse" />}
        >
          <LeafletMap location={location} />
        </ClientOnly>
      </section>
    </div>
  );
}
