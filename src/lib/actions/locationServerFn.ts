// lib/actions/location.ts (or wherever you want)
import { createServerFn } from '@tanstack/react-start';
import { findLocation, getPlaces } from '@/lib/actions/location.server';

export const getPlacesServerFn = createServerFn({ method: 'GET' })
  .inputValidator(
    (data: { latitude: number; longitude: number; search: string }) => data,
  )
  .handler(async ({ data }) => {
    return await getPlaces(data.latitude, data.longitude, data.search);
  });

export const findLocationServerFn = createServerFn({ method: 'GET' })
  .inputValidator((data: { latitude: number; longitude: number }) => data)
  .handler(async ({ data }) => {
    return await findLocation(data.latitude, data.longitude);
  });
