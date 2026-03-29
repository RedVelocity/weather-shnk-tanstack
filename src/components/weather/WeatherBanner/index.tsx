import DaySummary from './DaySummary';
import type { FormattedLocation } from '@/lib/types/location';
import type { FormattedData } from '@/lib/types/weather';
import type { BannerImage } from '@/lib/types/unsplash';

const WeatherBanner = ({
  weather,
  location,
  genTime,
  bannerImage,
}: {
  weather: FormattedData;
  location: FormattedLocation;
  genTime?: string;
  bannerImage?: BannerImage;
}) => {
  return (
    <div
      style={{
        backgroundImage: bannerImage ? `url(${bannerImage.url})` : 'none',
        transition: 'background-image 500ms ease-in-out',
      }}
      className="relative flex flex-col justify-between h-full gap-2 p-4 overflow-hidden bg-center bg-cover card text-primary-dark min-h-56"
    >
      {/* Gradient overlay */}
      <span className="absolute top-0 left-0 z-10 w-full h-full bg-linear-to-r from-black/70 to-black/30" />

      {/* Main Content */}
      <div className="z-20 grid h-full gap-2 md:grid-cols-2">
        <div className="flex flex-col justify-between">
          <div>
            <h1>{location.name}</h1>
            <p className="text-secondary-dark">
              {location.address.replace(`${location.name}, `, '')}
            </p>
          </div>
          <p className="text-secondary-dark">{`${genTime} ${weather.timezone}`}</p>
        </div>
        {/* Weather Summary */}
        <DaySummary weather={weather} />
      </div>
      {/* Footer with Links */}
      <span className="z-20 text-secondary-dark">
        Photo by{' '}
        <a
          href={`${bannerImage?.creditUserLink}?utm_source=weather-remix&utm_medium=referral`}
          target="_blank"
          rel="noreferrer"
          className="underline"
        >
          {bannerImage?.creditUser}
        </a>{' '}
        on{' '}
        <a
          href={`${bannerImage?.creditImageLink}?utm_source=weather-remix&utm_medium=referral`}
          target="_blank"
          rel="noreferrer"
          title="Unsplash"
          className="font-semibold pill bg-surface/70 text-primary hover:underline"
        >
          Unsplash
        </a>
      </span>
    </div>
  );
};

export default WeatherBanner;
