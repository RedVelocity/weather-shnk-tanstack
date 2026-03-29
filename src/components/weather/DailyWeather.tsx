import type { FormattedData } from '@/lib/types/weather';
import dayjsExtended from '@/lib/utils/dayjsExtended';
import WeatherIcon from '@/components/Icon/WeatherIcon';
import getTheme from '@/lib/utils/getTheme';

const DailyWeather = ({ weather }: { weather: FormattedData }) => {
  const { daily, timezone: TZ } = weather;
  const theme = getTheme(weather.current.temp);
  const tempColor = {
    cool: 'bg-gradient-cool',
    mild: 'bg-gradient-mild',
    hot: 'bg-gradient-hot',
  }[theme];
  dayjsExtended.tz(daily[0].dt, TZ);

  return (
    <div className="wrapper">
      <h3>8-Day Forecast</h3>
      <div className="grid gap-2 mt-4 capitalize sm:grid-cols-2">
        {daily.map((item, i) => (
          <div
            className="grid grid-cols-2 gap-4 p-4 card surface"
            key={`summary-${i}`}
          >
            <div className="flex gap-4">
              <WeatherIcon icon={item.weather.icon} size="medium" />
              <div className="grid items-center flex-1 gap-1 md:grid-cols-2 md:gap-4">
                <h4 className="leading-4 text-left">
                  {i !== 0
                    ? dayjsExtended
                        .tz(dayjsExtended.unix(item.dt), TZ)
                        .format('ddd DD')
                    : 'Today'}
                </h4>
                <div className="flex items-center gap-1 text-secondary dark:text-secondary-dark">
                  <img
                    src="https://ik.imagekit.io/redvelocity/assets/icons/tr:w-50,h-50/rain_drops.png"
                    height={20}
                    width={20}
                    alt="precipitation"
                    title="precipitation"
                  />
                  <span>{`${Math.round(item.pop)}%`}</span>
                </div>
              </div>
            </div>
            <div className="flex flex-col gap-1 text-right">
              <span className="mr-1 text-lg">{item.weather.description}</span>
              <h4
                className={`px-2 text-muted self-end card-border min-w-28 text-center ${tempColor}`}
              >{`${Math.round(item.temp.min)}°C • ${Math.round(
                item.temp.max,
              )}°C`}</h4>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DailyWeather;
