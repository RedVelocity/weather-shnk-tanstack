import { memo, useCallback, useEffect, useState } from 'react';
import { Link } from '@tanstack/react-router';
import { useServerFn } from '@tanstack/react-start';
import {
  Combobox,
  ComboboxItem,
  ComboboxList,
  ComboboxPopover,
  ComboboxProvider,
} from '@ariakit/react/combobox';
import { useDebouncedValue } from '@mantine/hooks';
// import { AnimatePresence, m as motion } from 'framer-motion';
import type { FormattedLocation } from '@/lib/types/location';
import { getPlacesServerFn } from '@/lib/actions/locationServerFn';
import { getLinkPath } from '@/lib/utils/getLinkPath';
import useRecentSearch from '@/lib/hooks/useRecentSearch';

// Memoize the place item to prevent re-renders
const PlaceItem = memo(({ place }: { place: FormattedLocation }) => (
  <ComboboxItem
    value={place.name}
    hideOnClick
    className="data-active-item:bg-focus/20"
    render={(props) => (
      <Link
        {...props}
        to={getLinkPath(place)}
        className="block px-3 py-2 hover:bg-focus/20 data-active-item:bg-focus/20"
      >
        <p className="heading-xs">{place.name}</p>
        <p className="text-sm secondary">{place.address}</p>
      </Link>
    )}
  />
));

PlaceItem.displayName = 'PlaceItem';

const SearchCard = () => {
  // const fetcher = useFetcher<FormattedLocation[]>();

  const getPlaces = useServerFn(getPlacesServerFn);

  const [searchInput, setSearchInput] = useState('');
  const [debouncedSearch] = useDebouncedValue(searchInput, 300);
  const [places, setPlaces] = useState<FormattedLocation[]>([]);
  const { searches } = useRecentSearch();

  // Memoize the onChange handler
  const handleSearchChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setSearchInput(e.target.value);
    },
    [],
  );

  // Effect to fetch places
  useEffect(() => {
    if (!debouncedSearch.trim()) return;
    const fetchPlaces = async () => {
      return await getPlaces({
        data: {
          latitude: 0,
          longitude: 0,
          search: debouncedSearch,
        },
      });
    };
    fetchPlaces().then((data) => {
      if (data instanceof Response) {
        setPlaces([]);
      } else {
        setPlaces(data);
      }
    });
  }, [debouncedSearch, getPlaces]);

  return (
    <div className="wrapper-dark w-full">
      <h3 className="heading-md">Search</h3>
      <ComboboxProvider>
        <div className="relative">
          <Combobox
            value={searchInput}
            onChange={handleSearchChange}
            className="w-full p-2 overflow-hidden rounded-l surface rounded-r-3xl mt-2"
            placeholder="Search places"
          />
          {/* <AnimatePresence>
              <motion.img
                className="absolute top-0 right-0 w-10 h-10"
                src="https://ik.imagekit.io/redvelocity/assets/icons/tr:w-50,h-50/loading-arrow.png"
                alt="Add Favorite"
                initial={{ opacity: 0 }}
                animate={{
                  opacity: 1,
                  rotate: 360,
                  transition: {
                    duration: 1,
                    repeat: Infinity,
                    repeatType: 'reverse',
                  },
                }}
                exit={{
                  opacity: 0,
                  scale: 0,
                  transition: { duration: 0.5 },
                }}
              />
          </AnimatePresence> */}
        </div>
        <ComboboxPopover
          flip={false}
          unmountOnHide
          sameWidth
          className="relative z-50 mt-2 overflow-y-auto transition duration-200 ease-in-out -translate-y-8 rounded-lg shadow-lg opacity-0 surface max-h-96 data-enter:opacity-100 data-enter:translate-y-0"
        >
          <ComboboxList>
            {searchInput && !Array.isArray(places) && (
              <ComboboxItem className="px-3 py-2">
                No results found.
              </ComboboxItem>
            )}
            {searchInput &&
              Array.isArray(places) &&
              places.map((place) => <PlaceItem key={place.id} place={place} />)}
            {!searchInput &&
              searches
                .map((place) => <PlaceItem key={place.id} place={place} />)
                .reverse()}
          </ComboboxList>
        </ComboboxPopover>
      </ComboboxProvider>
    </div>
  );
};

export default SearchCard;
