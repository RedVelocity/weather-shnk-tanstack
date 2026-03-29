// import 'swiper/css';
// import 'swiper/css/navigation';
// import { Swiper, SwiperSlide } from 'swiper/react';
// import { Navigation } from 'swiper/modules';

import type { FormattedData } from '@/lib/types/weather';
import dayjsExtended from '@/lib/utils/dayjsExtended';
import WeatherIcon from '@/components/Icon/WeatherIcon';

type HourlySlideProps = {
  hourlyData: FormattedData['hourly'];
  timezone: string;
  startIndex: number;
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
          <h4 className="tracking-wider">
            {startIndex === 0 && i === 0
              ? 'Now'
              : dayjsExtended
                  .tz(dayjsExtended.unix(item.dt), timezone)
                  .format('HH:mm')}
          </h4>
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

  return (
    <div className="min-h-full wrapper">
      <h3>24-Hour Forecast</h3>
      {/* <Swiper
        navigation={true}
        modules={[Navigation]}
        spaceBetween={5}
        slidesPerView={1}
      >
        <SwiperSlide> */}
      <HourlySlide
        hourlyData={hourly.slice(0, 12)}
        timezone={TZ}
        startIndex={0}
      />
      {/* </SwiperSlide>
        <SwiperSlide>
          <HourlySlide
            hourlyData={hourly.slice(12, 24)}
            timezone={TZ}
            startIndex={12}
          />
        </SwiperSlide>
      </Swiper> */}
    </div>
  );
};

export default HourlyWeather;
