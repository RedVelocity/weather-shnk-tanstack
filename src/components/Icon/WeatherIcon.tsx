import AnimatedIcon from './AnimatedIcon';
import type { WeatherIconKey, WeatherIcons } from '@/lib/types/weather';

const weatherIcons: WeatherIcons = {
  '01d': 'clear-day',
  '01n': 'clear-night',
  '02d': 'partly-cloudy-day',
  '02n': 'partly-cloudy-night',
  '03d': 'cloudy',
  '03n': 'cloudy',
  '04d': 'cloudy',
  '04n': 'cloudy',
  '09d': 'rain',
  '09n': 'rain',
  '10d': 'rain',
  '10n': 'rain',
  '11d': 'thunderstorm',
  '11n': 'thunderstorm',
  '13d': 'sleet',
  '13n': 'sleet',
  '50d': 'fog',
  '50n': 'fog',
};

const getIcon = (icon: WeatherIconKey) =>
  `/assets/weather-icons/${weatherIcons[icon]}.svg`;

const sizes: { [key: string]: number } = {
  small: 36,
  medium: 48,
  large: 64,
};

type WeatherIconProps = {
  icon: WeatherIconKey;
  size: string;
  className?: string;
  animate?: boolean;
};
const WeatherIcon = ({
  icon,
  size,
  className,
  animate = false,
}: WeatherIconProps) => {
  if (animate)
    return (
      <AnimatedIcon
        className={className}
        icon={getIcon(icon)}
        size={sizes[size]}
        alt={getIcon(icon)}
      />
    );
  return (
    <img
      className={className}
      src={getIcon(icon)}
      height={sizes[size]}
      width={sizes[size]}
      key={icon}
      alt={weatherIcons[icon]}
    />
  );
};

export default WeatherIcon;
