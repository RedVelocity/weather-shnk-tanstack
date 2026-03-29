import { clsx } from 'clsx';
import type { FormattedData } from '@/lib/types/weather';
import dayjsExtended from '@/lib/utils/dayjsExtended';

type IconCardProps = {
  textLeft: string;
  textRight: string;
  icon: string;
};

type UVIType = {
  [key: number]: [string, string];
};

const UVI: UVIType = {
  0: ['Low', 'text-cool'],
  1: ['Low', 'text-cool'],
  2: ['Low', 'text-cool'],
  3: ['Moderate', 'text-warning'],
  4: ['Moderate', 'text-warning'],
  5: ['Moderate', 'text-warning'],
  6: ['High', 'text-danger'],
  7: ['High', 'text-danger'],
  8: ['Very High', 'text-danger-l2'],
  9: ['Very High', 'text-danger-l2'],
  10: ['Very High', 'text-danger-l2'],
};
const getUVIInfo = (uvi: number): [string, string] => {
  if (uvi >= 11) {
    return ['Extreme', 'bg-danger-/50 text-primary-dark'];
  }
  return UVI[Math.min(Math.max(0, uvi), 10)];
};

const getIconCards = (weather: FormattedData): Array<IconCardProps> => {
  return [
    {
      icon: 'sunrise',
      textLeft: 'Sunrise',
      textRight: dayjsExtended
        .unix(weather.current.sunrise)
        .tz(weather.timezone)
        .format('HH:mm'),
    },
    {
      icon: 'sunset',
      textLeft: 'Sunset',
      textRight: dayjsExtended
        .unix(weather.current.sunset)
        .tz(weather.timezone)
        .format('HH:mm'),
    },
    {
      icon: 'wind',
      textLeft: 'Wind',
      textRight: `${Math.round(weather.current.wind_speed)} km/h`,
    },
    {
      icon: 'uv',
      textLeft: 'UV Index',
      textRight: `${Math.round(weather.current.uvi)}`,
    },
  ];
};

const WeatherCardSecondary = ({ weather }: { weather: FormattedData }) => {
  const iconCards = getIconCards(weather);
  return (
    <div className="grid items-center h-full grid-cols-2 gap-2">
      {iconCards.map((card) => (
        <IconCard key={card.icon} {...card} />
      ))}
    </div>
  );
};

const IconCard = ({ textLeft, textRight, icon }: IconCardProps) => {
  return (
    <div
      className={clsx(
        'flex flex-col h-full px-4 py-2 card',
        icon === 'uv'
          ? 'bg-wrapper-dark text-secondary-dark'
          : 'wrapper secondary',
      )}
    >
      <h5 className="capitalize">{textLeft}</h5>
      <div className="flex items-center flex-1 gap-2 p-2">
        <img
          className={clsx(
            'p-1 rounded-full',
            icon === 'uv' ? 'bg-focus' : 'dark:bg-focus',
          )}
          src={`https://ik.imagekit.io/redvelocity/assets/icons/tr:w-100,h-100/${icon}.png`}
          height={32}
          width={32}
          alt={textLeft}
        />
        <h2
          className={clsx(
            icon === 'uv' && `${getUVIInfo(Number(textRight))[1]}`,
          )}
        >
          {icon === 'uv' ? getUVIInfo(Number(textRight))[0] : textRight}
        </h2>
      </div>
    </div>
  );
};

export default WeatherCardSecondary;
