import * as motion from 'motion/react-m';
import type { FormattedData } from '@/lib/types/weather';
import type { FormattedLocation, Theme } from '@/lib/types/location';
import WeatherIcon from '@/components/Icon/WeatherIcon';
import getTheme from '@/lib/utils/getTheme';

const variants = {
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -10 },
  initial: { opacity: 0, y: 10 },
};

const getBackgroundPosition = (theme: Theme) => {
  switch (theme) {
    case 'cool':
      return 'left';
    case 'mild':
      return 'center';
    case 'hot':
      return 'right';
    default:
      return 'left';
  }
};

const WeatherCard = ({
  weather,
  location,
}: {
  weather: FormattedData;
  location: FormattedLocation;
}) => {
  const { name } = location;
  const { current, daily } = weather;
  const theme = getTheme(current.temp);
  const backgroundPosition = getBackgroundPosition(theme);

  const { min: minTemp, max: maxTemp } = daily[0].temp;

  const additionalInfo = `Feels Like: ${Math.round(
    current.feels_like,
  )}°C • Humidity: ${current.humidity}%`;

  return (
    <div
      style={{
        backgroundImage: `linear-gradient(140deg, var(--color-cool) 0%, var(--color-mild) 30%, var(--color-milder)55%, var(--color-hot) 100%)`,
        backgroundSize: '1800px',
        backgroundPosition,
        transition: 'background-position 500ms linear',
      }}
      className="relative grid w-full h-full gap-2 p-4 overflow-hidden card text-primary min-w-xs"
    >
      <div className="flex items-center space-x-2 border-b border-black/30 pb-2">
        <img
          src="https://ik.imagekit.io/redvelocity/assets/icons/tr:w-50,h-50/location.png"
          height={20}
          width={20}
          alt="location"
        />
        <h1 className="heading-md">Current Weather for {name}</h1>
      </div>
      <div className="flex flex-col justify-between">
        <div className="grid grid-cols-4 gap-4 py-2 place-items-center">
          <WeatherIcon icon={current.weather.icon} size="large" animate />
          <motion.h2
            className="col-span-2 text-center capitalize heading-lg"
            key={current.weather.description}
            variants={variants}
            initial="initial"
            animate="animate"
            exit="exit"
            transition={{ duration: 0.5 }}
          >
            {current.weather.description}
          </motion.h2>
          <motion.p
            className="heading-xl"
            key={current.temp}
            variants={variants}
            initial="initial"
            animate="animate"
            exit="exit"
            transition={{ duration: 0.5 }}
          >
            {`${Math.round(current.temp)}°C`}
          </motion.p>
        </div>
        <p className="heading-md p-2 mt-6 mb-2 tracking-wide text-center card-border bg-surface/80 md:px-4 md:py-3">
          {additionalInfo}
        </p>
      </div>
      <div className="grid grid-cols-2 gap-2 heading-md">
        <div className="flex items-center justify-center gap-2 p-2 surface-light card-border">
          <img
            src="https://ik.imagekit.io/redvelocity/assets/icons/tr:w-50,h-50/low.png"
            height={32}
            width={32}
            alt="Low"
          />
          <p>{`Low • ${Math.round(minTemp)}°C`}</p>
        </div>
        <div className="flex items-center justify-center gap-2 p-2 surface-light card-border">
          <img
            src="https://ik.imagekit.io/redvelocity/assets/icons/tr:w-50,h-50/high.png"
            height={32}
            width={32}
            alt="High"
          />
          <p>{`High • ${Math.round(maxTemp)}°C`}</p>
        </div>
      </div>
    </div>
  );
};

export default WeatherCard;
