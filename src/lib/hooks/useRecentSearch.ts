import { useLocalStorage } from '@mantine/hooks';
import type { FormattedLocation } from '@/lib/types/location';

const MAX_SIZE = 8;
const useRecentSearch = () => {
  const [searches, setSearches] = useLocalStorage<Array<FormattedLocation>>({
    key: 'recentSearches',
    defaultValue: [],
  });

  const addSearch = (place: FormattedLocation) => {
    setSearches((prevSearches) => {
      const updatedSearches = [
        ...prevSearches.filter((s) => s.id !== place.id),
        place,
      ].slice(-MAX_SIZE);
      return updatedSearches;
    });
  };

  const removeSearch = (place: FormattedLocation) => {
    setSearches((prevSearches) => {
      const updatedSearches = prevSearches.filter((s) => s.id !== place.id);
      return updatedSearches;
    });
  };

  return { searches, addSearch, removeSearch };
};

export default useRecentSearch;
