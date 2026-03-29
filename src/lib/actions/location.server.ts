import { env } from 'cloudflare:workers';

import type {
  Feature,
  FeatureLocation,
  FormattedLocation,
} from '@/lib/types/location';
import { logger } from '@/lib/utils/logger.server';

const formatLocation = (feature: Feature): FormattedLocation => {
  const name = feature.properties.name;
  const context = feature.properties.context;
  const region = context.region?.name || '';
  const country = context.country?.name || '';
  const countryCode = context.country?.country_code || '';

  const addressParts = [region !== name ? region : '', country].filter(Boolean);
  const address = addressParts.join(', ');

  return {
    id: feature.id,
    coordinates: feature.geometry.coordinates,
    name,
    region,
    country,
    countryCode,
    address,
  };
};

const fetcher = async (
  url: string,
  type?: 'Location' | 'Places',
): Promise<FeatureLocation | Response> => {
  const res = await fetch(encodeURI(url));
  if (!res.ok) {
    logger.error(
      {
        url,
        status: res.status,
        statusText: res.statusText,
      },
      `fetcher ${type} failed`,
    );
    if (res.status === 404) {
      return new Response(null, {
        status: 404,
        statusText: `${type} not found`,
      });
    }
    return new Response(null, {
      status: 500,
      statusText: `Failed to fetch ${type} data`,
    });
  }
  const data = await res.json<FeatureLocation>();
  if (Array.isArray(data.features) && data.features.length === 0) {
    return new Response(null, {
      status: 404,
      statusText: `${type} not found`,
    });
  }
  return data;
};

export const getLocation = async (searchTerm: string) => {
  if (!searchTerm || searchTerm.trim() === '') {
    throw new Response(null, {
      status: 400,
      statusText: 'Invalid location',
    });
  }

  const API_ENDPOINT = `https://api.mapbox.com/search/geocode/v6/forward?q=${searchTerm}&access_token=${env.MAPBOX_BACKEND_KEY}&language=en&limit=1&autocomplete=false&types=place,country`;
  // console.log('API_ENDPOINT', API_ENDPOINT);
  const data = await fetcher(API_ENDPOINT, 'Location');
  if (data instanceof Response) return data;
  // console.log(data, 'raw location data');
  const formattedLocation = formatLocation(data.features[0]);
  logger.info(formattedLocation, 'identified location');
  // console.log(formattedLocation, 'identified location');
  return formattedLocation;
};

export const getPlaces = async (
  latitude: number,
  longitude: number,
  searchTerm: string,
) => {
  const proximity =
    latitude !== 0 && longitude !== 0
      ? `&proximity=${longitude},${latitude}`
      : '';
  const API_ENDPOINT = `https://api.mapbox.com/search/geocode/v6/forward?q=${searchTerm}&access_token=${env.MAPBOX_BACKEND_KEY}&language=en&types=place,country&limit=25${proximity}`;
  const data = await fetcher(API_ENDPOINT, 'Places');
  if (data instanceof Response) return data;
  logger.info(data, 'getPlaces list');
  const formattedLocationList = data.features.map(formatLocation);
  // console.log(formattedLocationList, 'formattedLocationList');
  return formattedLocationList;
};

export const findLocation = async (latitude: number, longitude: number) => {
  const API_ENDPOINT = `https://api.mapbox.com/search/geocode/v6/reverse?latitude=${latitude}&longitude=${longitude}&access_token=${env.MAPBOX_BACKEND_KEY}&language=en&types=place&limit=1`;
  const data = await fetcher(API_ENDPOINT, 'Location');
  if (data instanceof Response) return data;
  const formattedLocation = formatLocation(data.features[0]);
  logger.info(formattedLocation, 'geocoded location');
  return formattedLocation;
};
