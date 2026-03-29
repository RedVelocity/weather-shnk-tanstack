import { FormattedLocation } from '~/lib/types/location';

export const getLinkPath = (location: FormattedLocation): string => {
  const cleanedName = location.name.trim().replace(/\s*,\s*/g, ',');
  const cleanedAddress = location.address.trim().replace(/\s*,\s*/g, ',');

  if (!cleanedName) return '/';
  if (!cleanedAddress || cleanedName === cleanedAddress) {
    return encodeURI(`/${cleanedName}`);
  }
  return encodeURI(`/${cleanedName},${cleanedAddress}`);
};
