import { useEffect, useRef, useState } from 'react';
import { AnimatePresence, m as motion } from 'framer-motion';
import DaySummary from './DaySummary';
import type { FormattedLocation } from '@/lib/types/location';
import type { FormattedData } from '@/lib/types/weather';
import type { BannerImage } from '@/lib/types/unsplash';
import dayjsExtended from '@/lib/utils/dayjsExtended';
import useWindowSize from '@/lib/hooks/useWindowSize';

const getImageWidth = (width: number) => {
  if (width >= 768) return 900;
  if (width >= 480) return 500;
  return 300;
};

const WeatherBanner = ({
  weather,
  location,
  bannerImage,
}: {
  weather: FormattedData;
  location: FormattedLocation;
  bannerImage?: BannerImage;
}) => {
  // state for image animation sync on load
  const [ready, setReady] = useState(false);
  const imgRef = useRef<HTMLImageElement>(null);
  // get responsive image URL based on window width
  const { width } = useWindowSize();
  const backgroundImageUrl =
    bannerImage && width
      ? `${bannerImage.url + `&auto=format&w=${getImageWidth(width)}&q=80`}`
      : '';
  // to prevent image flickering when location changes but the same image is used
  useEffect(() => {
    setReady(false);
    // set ready to true immediately if the image is already cached in browser
    if (imgRef.current?.complete) {
      setReady(true);
    }
  }, [bannerImage?.url]);

  return (
    <div className="relative flex flex-col justify-between gap-2 overflow-hidden wrapper text-primary-dark min-h-56">
      <AnimatePresence mode="sync">
        <motion.img
          ref={imgRef}
          alt="banner image"
          src={backgroundImageUrl}
          key={backgroundImageUrl}
          initial={{ opacity: 0 }}
          animate={ready ? { opacity: 1 } : { opacity: 0 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
          onLoad={() => setReady(true)}
          onError={() => setReady(true)}
          className="absolute inset-0 object-cover w-full h-full"
        />
      </AnimatePresence>

      {/* Gradient overlay */}
      <span className="absolute inset-0 bg-linear-to-r from-black/70 to-black/30" />

      {/* Main Content */}
      <div className="z-20 grid h-full gap-2 md:grid-cols-2">
        <div className="flex flex-col justify-between">
          <div>
            <h2 className="heading-xl">
              {location.name}
              <p className="text-secondary-dark heading-sm">
                {location.address}
              </p>
            </h2>
          </div>
          <p className="text-secondary-dark heading-sm">{`${dayjsExtended
            .tz(Date.now(), weather.timezone)
            .format('HH:mm')} ${weather.timezone}`}</p>
        </div>
        {/* Weather Summary */}
        <DaySummary weather={weather} />
      </div>
      {/* Footer with Links */}
      <p className="z-20 text-secondary-dark">
        Photo by{' '}
        <a
          href={bannerImage?.creditUserLink}
          target="_blank"
          rel="noreferrer"
          className="underline"
        >
          {bannerImage?.creditUser}
        </a>{' '}
        on{' '}
        <a
          href={bannerImage?.creditImageLink}
          target="_blank"
          rel="noreferrer"
          title="Unsplash"
          className="font-semibold pill bg-surface/70 text-primary hover:underline"
        >
          Unsplash
        </a>
      </p>
    </div>
  );
};

export default WeatherBanner;
