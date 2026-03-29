import { useLocalStorage } from '@mantine/hooks';
import type { FormattedLocation } from '@/lib/types/location';

const MAX_FAVORITES = 4;

export const useFavorites = () => {
  const [favorites, setFavorites] = useLocalStorage<
    Array<FormattedLocation | 'unset'>
  >({
    key: 'favorites',
    defaultValue: new Array(MAX_FAVORITES).fill('unset'),
  });

  const addFavorite = (place: FormattedLocation, index: number) => {
    setFavorites((prev) => {
      if (index < 0 || index >= MAX_FAVORITES) return prev;
      const updated = [...prev];
      updated[index] = place;
      return updated;
    });
  };

  const removeFavorite = (index: number) => {
    setFavorites((prev) => {
      if (index < 0 || index >= MAX_FAVORITES) return prev;
      const updated = [...prev];
      updated[index] = 'unset';
      return updated;
    });
  };

  const isFavorite = (place: FormattedLocation) => {
    return favorites.some((f) => f !== 'unset' && f.id === place.id);
  };

  return { favorites, addFavorite, removeFavorite, isFavorite };
};
