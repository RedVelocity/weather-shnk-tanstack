import type {
  FormattedData,
  HourlyWeather,
  WeatherIconKey,
} from '@/lib/types/weather';
import dayjsExtended from '@/lib/utils/dayjsExtended';
import WeatherIcon from '@/components/Icon/WeatherIcon';

const periods = [
  { name: 'Morning', start: 6, end: 12 },
  { name: 'Afternoon', start: 12, end: 17 },
  { name: 'Evening', start: 17, end: 24 },
  { name: 'Overnight', start: 24, end: 6 },
];

// Dynamically reorders periods starting from the current time's period
const reorderPeriods = (timezone: string) => {
  const currentHour = dayjsExtended.tz(Date.now(), timezone).hour();
  // Find the current period index
  const currentIndex = periods.findIndex(
    ({ start, end }) =>
      end > start
        ? currentHour >= start && currentHour < end // Normal periods
        : currentHour >= start || currentHour < end, // Overnight period
  );
  // If no valid period is found (unlikely, but for safety)
  if (currentIndex === -1) return periods;
  // Reorder periods to start from the currentIndex
  return periods.slice(currentIndex).concat(periods.slice(0, currentIndex));
};
// Groups hourly data into corresponding periods
const mapHoursToPeriods = (hourly: HourlyWeather, timezone: string) => {
  const periodData: Record<string, HourlyWeather> = {};
  hourly.forEach((hour) => {
    const localTime = dayjsExtended.unix(hour.dt).tz(timezone);
    const hourOfDay = localTime.hour();

    const period = periods.find(({ start, end }) =>
      end > start
        ? hourOfDay >= start && hourOfDay < end
        : hourOfDay >= start || hourOfDay < end,
    );

    if (period) {
      if (!periodData[period.name]) {
        periodData[period.name] = [];
      }
      periodData[period.name].push(hour);
    }
  });
  return periodData;
};
// Computes average data for each period
const computePeriodTemperature = (
  periodData: HourlyWeather,
  periodName?: string,
) => {
  if (periodData.length === 0) return null;
  // Determine the temperature value dynamically
  let selectedHour = periodData[0]; // Initialize to the first hour
  if (periodName === 'Afternoon') {
    // Find the hour with the maximum temperature
    selectedHour = periodData.reduce((max, hour) =>
      hour.temp > max.temp ? hour : max,
    );
  } else if (
    periodName === 'Overnight' ||
    periodName === 'Morning' ||
    periodName === 'Evening'
  ) {
    // Find the hour with the minimum temperature
    selectedHour = periodData.reduce((min, hour) =>
      hour.temp < min.temp ? hour : min,
    );
  } else {
    // Default: average temperature
    const avgTemp =
      periodData.reduce((sum, hour) => sum + hour.temp, 0) / periodData.length;
    return {
      temp: avgTemp,
      icon: periodData[0].weather.icon,
      description: periodData[0].weather.description,
    };
  }
  // Return the selected hour's weather data
  return {
    temp: selectedHour.temp,
    icon: selectedHour.weather.icon,
    description: selectedHour.weather.description,
  };
};

const DaySummary = ({
  weather,
  className = '',
}: {
  weather: FormattedData;
  className?: string;
}) => {
  const { timezone, hourly } = weather;
  const orderedPeriods = reorderPeriods(timezone);
  const periodData = mapHoursToPeriods(hourly, timezone);

  const forecast = orderedPeriods.map(({ name }) => {
    const averages = computePeriodTemperature(periodData[name], name);
    return {
      name,
      ...(averages || {
        temp: 999,
        icon: '01d' as WeatherIconKey,
        description: 'No data available',
      }),
    };
  });

  return (
    <div
      className={`${className} grid sm:grid-cols-2 card-border overflow-hidden`}
    >
      {forecast.map(
        (period) =>
          period.temp !== 999 && (
            <div
              key={period.name}
              className="flex items-center gap-4 p-4 backdrop-blur-xs ring-1 ring-surface/10"
            >
              <WeatherIcon icon={period.icon} size="medium" />
              <div>
                <p className="heading-md text-primary-dark/70">{period.name}</p>
                <p className="heading-lg">{Math.round(period.temp)}°C</p>
                <span className="text-lg text-primary-dark/70">
                  {period.description}
                </span>
              </div>
            </div>
          ),
      )}
    </div>
  );
};

export default DaySummary;
