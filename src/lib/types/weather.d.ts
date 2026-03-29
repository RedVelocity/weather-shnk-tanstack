import { HourlyWeather } from '~/components/weather/HourlyWeather';
// Type representing Open-Meteo's response for weather data
type OpenMeteoWeatherData = {
  latitude: number;
  longitude: number;
  generationtime_ms: number;
  utc_offset_seconds: number;
  timezone: string;
  timezone_abbreviation: string;
  elevation: number;
  current_units: {
    time: string;
    interval: string;
    temperature_2m: string;
    relative_humidity_2m: string;
    apparent_temperature: string;
    precipitation: string;
    weather_code: string;
    surface_pressure: string;
    wind_speed_10m: string;
    is_day: number;
  };
  current: {
    time: number;
    interval: number;
    temperature_2m: number;
    relative_humidity_2m: number;
    apparent_temperature: number;
    precipitation: number;
    weather_code: number;
    surface_pressure: number;
    wind_speed_10m: number;
    is_day: number;
  };
  hourly_units: {
    time: string;
    temperature_2m: string;
    weather_code: number;
    uv_index: string;
    dew_point_2m: string;
    visibility: string;
    is_day: number;
  };
  hourly: {
    time: number[];
    temperature_2m: number[];
    weather_code: number[];
    uv_index: number[];
    dew_point_2m: number[];
    visibility: number[];
    is_day: number[];
  };
  daily_units: {
    time: string;
    weather_code: string;
    temperature_2m_max: string;
    temperature_2m_min: string;
    precipitation_probability_max: string;
    sunrise: number;
    sunset: number;
  };
  daily: {
    time: number[];
    weather_code: number[];
    temperature_2m_max: number[];
    temperature_2m_min: number[];
    precipitation_probability_max: number[];
    sunrise: number[];
    sunset: number[];
  };
};

// Mapping Open-Meteo data to custom FormattedData type
type FormattedData = {
  timezone: string;
  current: {
    dt: number;
    temp: number;
    feels_like: number;
    pressure: number;
    humidity: number;
    wind_speed: number;
    uvi: number;
    visibility: number;
    dew_point: number;
    is_day: number;
    weather: Weather;
    sunrise: number;
    sunset: number;
  };
  daily: {
    dt: number;
    temp: {
      max: number;
      min: number;
    };
    weather: Weather;
    pop: number;
  }[];
  hourly: HourlyWeather;
};

type HourlyWeather = {
  dt: number;
  temp: number;
  is_day: number;
  weather: Weather;
}[];

// Single weather description type based on OpenWeather format
type Weather = {
  id: number;
  main: string;
  description: string;
  icon: WeatherIconKey;
};

// Define a union type for all possible weather icon keys
type WeatherIconKey =
  | '01d'
  | '01n'
  | '02d'
  | '02n'
  | '03d'
  | '03n'
  | '04d'
  | '04n'
  | '09d'
  | '09n'
  | '10d'
  | '10n'
  | '11d'
  | '11n'
  | '13d'
  | '13n'
  | '50d'
  | '50n';

// Define a union type for all possible values
type WeatherIconValue =
  | 'clear-day'
  | 'clear-night'
  | 'partly-cloudy-day'
  | 'partly-cloudy-night'
  | 'cloudy'
  | 'rain'
  | 'thunderstorm'
  | 'sleet'
  | 'fog';

// Define the type for the weatherIcons object
type WeatherIcons = { [key in WeatherIconKey]: WeatherIconValue };

export type {
  OpenMeteoWeatherData,
  FormattedData,
  Weather,
  HourlyWeather,
  WeatherIcons,
  WeatherIconKey,
};
