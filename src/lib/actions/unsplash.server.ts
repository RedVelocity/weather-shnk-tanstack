import { env } from 'cloudflare:workers';
import type { BannerImage, UnsplashPhotoResponse } from '@/lib/types/unsplash';
import type { FormattedLocation } from '@/lib/types/location';
import { logger } from '@/lib/utils/logger.server';

const fallbackImage: BannerImage = {
  url: 'https://images.unsplash.com/34/BA1yLjNnQCI1yisIZGEi_2013-07-16_1922_IMG_9873.jpg?auto=format&w=800&q=80',
  creditUser: 'Ryan Schroeder',
  creditUserLink: 'https://unsplash.com/@ryanschroeder',
  creditImageLink:
    'https://unsplash.com/photos/landscape-photography-mountain-range-with-snow-Gg7uKdHFb_c',
};

const fetchPhoto = async (query: string) => {
  const API_ENDPOINT = `https://api.unsplash.com/photos/random?client_id=${env.UNSPLASH_ACCESS_KEY}&query=${query}&orientation=landscape`;
  const res = await fetch(encodeURI(API_ENDPOINT));
  if (!res.ok) {
    console.error(res.status, res.statusText);
    logger.error(
      {
        status: res.status,
        statusText: res.statusText,
      },
      'fetchPhoto failed',
    );
    throw new Error('Unsplash fetchPhoto failed');
  }
  const data = await res.json<UnsplashPhotoResponse>();
  return {
    url: data.urls.regular,
    creditUser: data.user.name,
    creditUserLink: data.user.links.html,
    creditImageLink: data.links.html,
  };
};

export const getPhoto = async (location: FormattedLocation) => {
  const key = location.id;

  try {
    const KV = env.KV;
    logger.info(KV, key + '-getPhoto key');
    const cachedImage = await KV.get<BannerImage | null>(
      key + '-unsplash',
      'json',
    );

    if (cachedImage) {
      return cachedImage;
    } else {
      // const prompt = `You are a location formatter. Given a location, determine if the city is Internationally well-known.

      // Input:
      // city:${location.name}
      // region:${location.region}
      // country:${location.country}

      // Rules:
      // - IF Internationally Well-known cities (New York, Tokyo, London, Nice, etc.): $formatted_location = "city, country" ELSE $formatted_location = "region, country"
      // - Shorten country names ("People's Republic of China" → "China")

      // Output JSON:
      // {
      //   "text": $formatted_location,
      //   "reasoning": "if it's internationally well-known or not"
      // }`;

      // const queryKey = await context.cloudflare.env.AI.run(
      //   '@cf/google/gemma-2b-it-lora',
      //   {
      //     prompt,
      //     max_tokens: 100,
      //     temperature: 0.3,
      //     response_format: {
      //       type: 'json_object',
      //     },
      //   }
      // );
      // console.log('query', queryKey.response);
      const query = `${location.region ?? ''} ${location.country} Architecture, Landscapes, NO PEOPLE`;
      // Fetch a new image if no cached value exists
      const bannerImage = await fetchPhoto(query);
      await KV.put(key + '-unsplash', JSON.stringify(bannerImage), {
        expirationTtl: 24 * 60 * 60, // Cache for 1 day
      });
      return bannerImage;
    }
  } catch (error) {
    logger.error(error, 'getBannerImage failed');
    return fallbackImage;
  }
};
