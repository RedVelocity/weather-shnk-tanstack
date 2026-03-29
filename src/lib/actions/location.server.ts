import { env } from 'cloudflare:workers';
import type {
  Feature,
  FeatureLocation,
  FormattedLocation,
} from '@/lib/types/location';
import { logger } from '@/lib/utils/logger.server';

const formatLocation = (feature: Feature) => {
  const name = feature.text_en;
  const context = feature.context;

  // Helper: return the matching context text or undefined when not present.
  const getContextText = (type: string): string | undefined => {
    return context.find((ctx) => ctx.id.startsWith(type))?.text_en;
  };
  // District should fall back to the place name when not available.
  const district = getContextText('district');
  const region = getContextText('region');
  const country = getContextText('country') ?? name;
  // Build the address by collecting `context.text_en` values in a loop,
  // then remove duplicates using a `Set`. Exclude the place `name`.
  const parts: Array<string> = [];
  for (const ctx of context) {
    const t = ctx.text_en;
    if (typeof t === 'string' && t.trim() !== '') parts.push(t);
  }
  // Remove duplicates while preserving first-occurrence order, then
  // exclude the place name itself from the parts used in the address.
  const dedupedParts = Array.from(new Set(parts)).filter((p) => p !== name);
  const address =
    dedupedParts.length > 0 ? dedupedParts.join(', ') : feature.place_name_en;

  const formattedLocation: FormattedLocation = {
    id: feature.id,
    coordinates: feature.geometry.coordinates,
    name,
    district,
    region,
    country,
    address,
  };
  return formattedLocation;
};

const fetcher = async (
  url: string,
  type?: 'Location' | 'Places'
): Promise<FeatureLocation> => {
  const res = await fetch(encodeURI(url));
  if (!res.ok) {
    logger.error(
      {
        url,
        status: res.status,
        statusText: res.statusText,
      },
      `fetcher ${type} failed`
    );
    if (res.status === 404) {
      throw new Response(null, {
        status: 404,
        statusText: `${type} not found`,
      });
    }
    throw new Response(null, {
      status: 500,
      statusText: `Failed to fetch ${type} data`,
    });
  }
  const data = await res.json<FeatureLocation>();
  if (Array.isArray(data.features) && data.features.length === 0) {
    throw new Response(null, {
      status: 404,
      statusText: `${type} not found`,
    });
  }
  return data;
};

export const getLocation = async (
  searchTerm: string
) => {
  if (!searchTerm || searchTerm.trim() === '') {
    throw new Response(null, {
      status: 400,
      statusText: 'Invalid location',
    });
  }
  const API_ENDPOINT = `https://api.mapbox.com/geocoding/v5/mapbox.places/${searchTerm}.json?access_token=${env.MAPBOX_BACKEND_KEY}&types=place,locality&language=en&limit=1`;
  const data = await fetcher(API_ENDPOINT, 'Location');
  const formattedLocation = formatLocation(data.features[0]);
  return formattedLocation;
};

export const getPlaces = async (
  latitude: number,
  longitude: number,
  searchTerm: string
) => {
  const proximity =
    latitude !== 0 && longitude !== 0
      ? `&proximity=${longitude},${latitude}`
      : '';
  const API_ENDPOINT = `https://api.mapbox.com/geocoding/v5/mapbox.places/${searchTerm}.json?access_token=${env.MAPBOX_BACKEND_KEY}&types=place,locality&language=en&limit=25${proximity}`;
  const data = await fetcher(API_ENDPOINT, 'Places');
  return data.features.map(formatLocation);
};

// https://api.mapbox.com/geocoding/v5/{endpoint}/{longitude},{latitude}.json?access_token={access_token}&types=place,region,country&language=en
export const findLocation = async (
  latitude: number,
  longitude: number
) => {
  const API_ENDPOINT = `https://api.mapbox.com/geocoding/v5/mapbox.places/${longitude},${latitude}.json?access_token=${env.MAPBOX_BACKEND_KEY}&types=place,region,country&language=en`;
  const data = await fetcher(API_ENDPOINT, 'Location');
  return formatLocation(data.features[0]);
};
