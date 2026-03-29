import { env } from 'cloudflare:workers';
import type {
  FormattedData,
  OpenMeteoWeatherData,
  Weather,
} from '@/lib/types/weather';
import { logger } from '@/lib/utils/logger.server';

const mapOpenMeteoToFormattedData = (
  data: OpenMeteoWeatherData,
): FormattedData => {
  return {
    timezone: data.timezone,
    current: {
      dt: data.current.time,
      temp: data.current.temperature_2m,
      feels_like: data.current.apparent_temperature,
      pressure: data.current.surface_pressure,
      humidity: data.current.relative_humidity_2m,
      wind_speed: data.current.wind_speed_10m,
      uvi: data.hourly.uv_index[0],
      visibility: data.hourly.visibility[0],
      dew_point: data.hourly.dew_point_2m[0],
      is_day: data.current.is_day,
      sunrise: data.daily.sunrise[0],
      sunset: data.daily.sunset[0],
      weather: mapWeatherCodeToWeather(
        data.current.weather_code,
        data.current.is_day,
      ),
    },
    daily: data.daily.time.map((time, index) => ({
      dt: time,
      temp: {
        max: data.daily.temperature_2m_max[index],
        min: data.daily.temperature_2m_min[index],
      },
      weather: mapWeatherCodeToWeather(data.daily.weather_code[index]),
      pop: data.daily.precipitation_probability_max[index] ?? 0,
    })),
    hourly: data.hourly.time.map((time, index) => ({
      dt: time,
      temp: data.hourly.temperature_2m[index],
      is_day: data.hourly.is_day[index],
      weather: mapWeatherCodeToWeather(
        data.hourly.weather_code[index],
        data.hourly.is_day[index],
      ),
    })),
  };
};

const mapWeatherCodeToWeather = (code: number, is_day: number = 1): Weather => {
  const day_night_suffix = is_day == 1 ? 'd' : 'n';
  const weatherMapping: { [key: number]: Weather } = {
    0: {
      id: 0,
      main: 'Clear',
      description: 'Clear sky',
      icon: `01${day_night_suffix}`,
    },
    1: {
      id: 1,
      main: 'Partly Cloudy',
      description: 'Mostly clear',
      icon: `02${day_night_suffix}`,
    },
    2: {
      id: 2,
      main: 'Partly Cloudy',
      description: 'Partly cloudy',
      icon: `02${day_night_suffix}`,
    },
    3: {
      id: 3,
      main: 'Overcast Clouds',
      description: 'Overcast Clouds',
      icon: `03${day_night_suffix}`,
    },
    45: {
      id: 45,
      main: 'Fog',
      description: 'Fog',
      icon: `50${day_night_suffix}`,
    },
    48: {
      id: 48,
      main: 'Fog',
      description: 'Depositing rime fog',
      icon: `50${day_night_suffix}`,
    },
    51: {
      id: 51,
      main: 'Drizzle',
      description: 'Light drizzle',
      icon: `09${day_night_suffix}`,
    },
    53: {
      id: 53,
      main: 'Drizzle',
      description: 'Moderate drizzle',
      icon: `09${day_night_suffix}`,
    },
    55: {
      id: 55,
      main: 'Drizzle',
      description: 'Dense drizzle',
      icon: `09${day_night_suffix}`,
    },
    56: {
      id: 56,
      main: 'Freezing Drizzle',
      description: 'Freezing drizzle',
      icon: `13${day_night_suffix}`,
    },
    57: {
      id: 57,
      main: 'Freezing Drizzle',
      description: 'Dense freezing drizzle',
      icon: `13${day_night_suffix}`,
    },
    61: {
      id: 61,
      main: 'Rain',
      description: 'Light rain',
      icon: `10${day_night_suffix}`,
    },
    63: {
      id: 63,
      main: 'Rain',
      description: 'Moderate rain',
      icon: `10${day_night_suffix}`,
    },
    65: {
      id: 65,
      main: 'Rain',
      description: 'Heavy intensity rain',
      icon: `10${day_night_suffix}`,
    },
    66: {
      id: 66,
      main: 'Freezing Rain',
      description: 'Freezing rain',
      icon: `13${day_night_suffix}`,
    },
    67: {
      id: 67,
      main: 'Freezing Rain',
      description: 'Heavy freezing rain',
      icon: `13${day_night_suffix}`,
    },
    71: {
      id: 71,
      main: 'Snow',
      description: 'Light snowfall',
      icon: `13${day_night_suffix}`,
    },
    73: {
      id: 73,
      main: 'Snow',
      description: 'Moderate snowfall',
      icon: `13${day_night_suffix}`,
    },
    75: {
      id: 75,
      main: 'Snow',
      description: 'Heavy snowfall',
      icon: `13${day_night_suffix}`,
    },
    77: {
      id: 77,
      main: 'Snow Grains',
      description: 'Snow grains',
      icon: `13${day_night_suffix}`,
    },
    80: {
      id: 80,
      main: 'Rain Showers',
      description: 'Light rain',
      icon: `09${day_night_suffix}`,
    },
    81: {
      id: 81,
      main: 'Rain Showers',
      description: 'Moderate rain',
      icon: `09${day_night_suffix}`,
    },
    82: {
      id: 82,
      main: 'Rain Showers',
      description: 'Violent rain showers',
      icon: `09${day_night_suffix}`,
    },
    85: {
      id: 85,
      main: 'Snow Showers',
      description: 'Light snow',
      icon: `13${day_night_suffix}`,
    },
    86: {
      id: 86,
      main: 'Snow Showers',
      description: 'Heavy snow',
      icon: `13${day_night_suffix}`,
    },
    95: {
      id: 95,
      main: 'Thunderstorm',
      description: 'Thunderstorm',
      icon: `11${day_night_suffix}`,
    },
    96: {
      id: 96,
      main: 'Thunderstorm',
      description: 'Thunderstorm with hail',
      icon: `11${day_night_suffix}`,
    },
    99: {
      id: 99,
      main: 'Thunderstorm',
      description: 'Severe thunderstorm with hail',
      icon: `11${day_night_suffix}`,
    },
  };

  return weatherMapping[code];
};

export const getWeather = async (latitude: number, longitude: number) => {
  const current =
    'temperature_2m,relative_humidity_2m,apparent_temperature,precipitation,weather_code,surface_pressure,wind_speed_10m,is_day';
  const hourly =
    'temperature_2m,weather_code,uv_index,dew_point_2m,visibility,is_day';
  const daily =
    'weather_code,temperature_2m_max,temperature_2m_min,precipitation_probability_max,sunrise,sunset';
  const params =
    'timeformat=unixtime&timezone=auto&forecast_hours=24&forecast_days=8';
  const API_ENDPOINT = `https://customer-api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=${current}&hourly=${hourly}&daily=${daily}&${params}&apikey=${env.OPEN_METEO_KEY}`;
  // const API_ENDPOINT = `https://api.openweathermap.org/data/2.5/onecall?lat=${latitude}&lon=${longitude}&exclude=${exclude}&appid=${OWM_KEY}&units=metric`;
  const res = await fetch(encodeURI(API_ENDPOINT));
  if (!res.ok) {
    logger.error(
      {
        status: res.status,
        statusText: res.statusText,
      },
      'getWeather failed',
    );
    throw new Response(null, {
      status: 500,
      statusText: 'Failed to fetch weather data',
    });
  }
  const data = await res.json<OpenMeteoWeatherData>();
  logger.info(data, 'weather data');
  const formattedData = mapOpenMeteoToFormattedData(data);
  logger.info(formattedData, 'formattedData');
  return formattedData;
};
