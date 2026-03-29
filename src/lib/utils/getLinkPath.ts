import type { FormattedLocation } from '@/lib/types/location';

export const getLinkPath = (location: FormattedLocation): string => {
  if (!location.name) return '/';

  const name = location.name.trim().toLowerCase();
  const region = location.region?.trim().toLowerCase() || '';
  const countryCode = location.countryCode.trim().toLowerCase() || '';
  const country = location.country.trim().toLowerCase() || '';

  if (!name) return '/';
  if (!countryCode || name === country) return encodeURI(`/${name}`);
  if (!region) return encodeURI(`/${name},${countryCode}`);
  if (region.includes(name)) return encodeURI(`/${name},${countryCode}`);
  if (name.includes(region)) return encodeURI(`/${name},${countryCode}`);
  return encodeURI(`/${name},${region},${countryCode}`);
};
