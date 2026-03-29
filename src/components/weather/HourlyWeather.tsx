import { useState } from 'react';
import { AnimatePresence, m as motion } from 'framer-motion';

import type { FormattedData } from '@/lib/types/weather';
import dayjsExtended from '@/lib/utils/dayjsExtended';
import WeatherIcon from '@/components/Icon/WeatherIcon';

type HourlySlideProps = {
  hourlyData: FormattedData['hourly'];
  timezone: string;
  startIndex: number;
};

const slideVariants = {
  initial: (d: number) => ({ opacity: 0, x: d * 40 }),
  animate: { opacity: 1, x: 0 },
  exit: (d: number) => ({ opacity: 0, x: d * -40 }),
};

const HourlySlide = ({
  hourlyData,
  timezone,
  startIndex,
}: HourlySlideProps) => {
  return (
    <div className="grid gap-2 mt-4 text-center capitalize sm:grid-cols-2 lg:grid-cols-1">
      {hourlyData.map((item, i) => (
        <div
          className="grid items-center justify-around grid-cols-4 gap-2 px-2 py-1 surface card"
          key={`hourly ${i}`}
        >
          <p className="heading-sm tracking-wider">
            {startIndex === 0 && i === 0
              ? 'Now'
              : dayjsExtended
                  .tz(dayjsExtended.unix(item.dt), timezone)
                  .format('HH:mm')}
          </p>
          <div className="flex items-center justify-center col-span-2 gap-2 sm:gap-3">
            <WeatherIcon size="small" icon={item.weather.icon} />
            <span className="w-full text-lg text-left">
              {item.weather.description}
            </span>
          </div>
          <span className="text-lg">{`${Math.round(item.temp)}°C`}</span>
        </div>
      ))}
    </div>
  );
};

const HourlyWeather = ({ weather }: { weather: FormattedData }) => {
  const { hourly, timezone: TZ } = weather;
  const [page, setPage] = useState(0);
  const [direction, setDirection] = useState(1);

  const navigate = (newPage: number) => {
    setDirection(newPage > page ? 1 : -1);
    setPage(newPage);
  };

  return (
    <div className="min-h-full wrapper">
      <h3 className="heading-md">24-Hour Forecast</h3>
      <div className="relative overflow-hidden">
        {/* Prev button */}
        <button
          type="button"
          onClick={() => navigate(0)}
          disabled={page === 0}
          className="absolute -left-7 top-1/2 -translate-y-1/2 z-10 w-12 h-12 bg-base rounded-full disabled:opacity-30 transition-opacity disabled:cursor-not-allowed"
          aria-label="Previous"
        />

        <AnimatePresence mode="wait" initial={false} custom={direction}>
          <motion.div
            key={page}
            custom={direction}
            variants={slideVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            transition={{
              type: 'spring',
              stiffness: 300,
              damping: 30,
              duration: 0.2,
            }}
            drag="x"
            dragConstraints={{ left: 0, right: 0 }}
            dragElastic={0}
            onDragEnd={(_, info) => {
              if (info.offset.x < -50 && page === 0) navigate(1);
              if (info.offset.x > 50 && page === 1) navigate(0);
            }}
          >
            <HourlySlide
              hourlyData={hourly.slice(page * 12, page * 12 + 12)}
              timezone={TZ}
              startIndex={page * 12}
            />
          </motion.div>
        </AnimatePresence>

        {/* Next button */}
        <button
          type="button"
          onClick={() => navigate(1)}
          disabled={page === 1}
          className="absolute -right-7 top-1/2 -translate-y-1/2 z-10 w-12 h-12 bg-base rounded-full disabled:opacity-30 transition-opacity disabled:cursor-not-allowed"
          aria-label="Next"
        />
      </div>
    </div>
  );
};

export default HourlyWeather;
