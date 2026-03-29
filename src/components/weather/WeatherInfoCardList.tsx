import { FormattedData } from '~/lib/types/weather';
import {
  DewpointIcon,
  PressureIcon,
  VisibilityIcon,
  WindIcon,
} from '~/components/Icon/InfoIcon';

type WeatherInfoCardListProps = {
  className?: string;
  weather: FormattedData;
};
const WeatherInfoCardList = ({
  className,
  weather,
}: WeatherInfoCardListProps) => {
  const { current } = weather;
  return (
    <ul className={`${className} gap-1 min-w-[18rem]`}>
      <>
        <WeatherInfoCard
          Icon={WindIcon}
          title="Wind Speed"
          content={`${Math.round(current.wind_speed)} km/h`}
        />
        <WeatherInfoCard
          Icon={VisibilityIcon}
          title="Visibility"
          content={`${Math.round(current.visibility / 1000)} km`}
        />
        <WeatherInfoCard
          Icon={PressureIcon}
          title="Pressure"
          content={`${Math.round(current.pressure)} hPa`}
        />
        <WeatherInfoCard
          Icon={DewpointIcon}
          title="Dew Point"
          content={`${current.dew_point.toFixed()}°C`}
        />
      </>
    </ul>
  );
};

type WeatherInfoCardProps = {
  Icon: React.FC;
  title: string;
  content: string;
};
const WeatherInfoCard = ({ Icon, title, content }: WeatherInfoCardProps) => (
  <li className="flex items-center justify-between gap-4 px-3 py-2 card surface">
    <p className="flex items-center">
      <Icon />
      {title}
    </p>
    <p>{content}</p>
  </li>
);

export default WeatherInfoCardList;
