import { useCallback, useState } from 'react';
import { useLocalStorage } from '@mantine/hooks';
import { Link } from '@tanstack/react-router';
import * as motion from 'motion/react-m';
import { AnimatePresence } from 'motion/react';
import type { MouseEventHandler } from 'react';
import type { FormattedLocation } from '@/lib/types/location';
import { useFavorites } from '@/lib/hooks/useFavorites';
import useRecentSearch from '@/lib/hooks/useRecentSearch';
import { getLinkPath } from '@/lib/utils/getLinkPath';
import Modal from '@/components/Modal';

const popInOut = {
  initial: { y: 50, opacity: 0 },
  animate: {
    y: 0,
    opacity: 1,
    transition: { duration: 0.25 },
  },
  exit: { y: -50, opacity: 0, transition: { duration: 0.25 } },
} as const;

type LocationButtonProps = {
  location: FormattedLocation;
  onClick: () => void;
  disabled: boolean;
};

type LocationSectionProps = {
  title: string;
  locations: Array<FormattedLocation>;
  onLocationClick: (location: FormattedLocation) => void;
  isDisabled: (location: FormattedLocation) => boolean;
};

const LocationSection = ({
  title,
  locations,
  onLocationClick,
  isDisabled,
}: LocationSectionProps) => {
  if (locations.length === 0) return null;

  return (
    <>
      <h5 className="px-4 py-2">{title}</h5>
      <div className="grid grid-cols-2">
        {locations.map((location, index) => (
          <LocationButton
            key={`${title}-${location.id}-${index}`}
            location={location}
            onClick={() => onLocationClick(location)}
            disabled={isDisabled(location)}
          />
        ))}
      </div>
    </>
  );
};

const LocationButton = ({
  location,
  onClick,
  disabled,
}: LocationButtonProps) => (
  <button
    className="p-4 m-1 surface card disabled:bg-gray/40 disabled:cursor-not-allowed"
    onClick={onClick}
    disabled={disabled}
  >
    <h3>{location.name}</h3>
    <p className="secondary">{location.address}</p>
  </button>
);

const AddFavButton = ({
  onClick,
}: {
  onClick: MouseEventHandler<HTMLButtonElement>;
}) => (
  <button
    type="button"
    className="absolute inset-0 flex items-center justify-center w-full h-full p-4 card"
    onClick={onClick}
  >
    <img
      src="https://ik.imagekit.io/redvelocity/assets/icons/tr:w-100,h-100/add.png"
      height={45}
      width={45}
      alt="Add Favorite"
    />
  </button>
);

type FavButtonProps = {
  favorite: FormattedLocation;
  removeFavorite: MouseEventHandler<HTMLButtonElement>;
};

const FavButton = ({ favorite, removeFavorite }: FavButtonProps) => (
  <div className="absolute inset-0 w-full h-full">
    <Link
      to={getLinkPath(favorite)}
      className="flex flex-col items-center justify-center h-full p-6 overflow-hidden text-center surface card"
      resetScroll={false}
      preload="intent"
    >
      <h3>{favorite.name}</h3>
      <p className="secondary">{`${favorite.address}`}</p>
    </Link>
    <button
      type="button"
      onClick={removeFavorite}
      className="absolute dark:saturate-75 top-0 right-0 z-20 h-8 sm:h-10 card aspect-square bg-[#BF392B]"
    >
      <img
        src="https://ik.imagekit.io/redvelocity/assets/icons/tr:w-50,h-50/close.png"
        className="w-full h-full"
        alt="Remove Favorite"
        sizes="2rem"
      />
    </button>
  </div>
);

type FavoritesProps = {
  currentLocation?: FormattedLocation;
};

const Favorites = ({ currentLocation }: FavoritesProps) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [recentlyRemoved, setRecentlyRemoved] = useLocalStorage<
    Array<FormattedLocation>
  >({
    key: 'recentlyRemoved',
    defaultValue: [],
  });
  const { favorites, addFavorite, removeFavorite, isFavorite } = useFavorites();
  const { searches } = useRecentSearch();

  const handleAddFavorite = useCallback(
    (loc: FormattedLocation) => {
      addFavorite(loc, currentIndex);
      setRecentlyRemoved((prev) => prev.filter((item) => item.id !== loc.id));
      setDialogOpen(false);
    },
    [addFavorite, currentIndex, setRecentlyRemoved, setDialogOpen],
  );

  const handleRemoveFavorite = useCallback(
    (favorite: FormattedLocation, index: number) => {
      setRecentlyRemoved((prev) => {
        if (searches.some((search) => search.id === favorite.id)) {
          return prev;
        }
        const updated = [favorite, ...prev].slice(0, 3);
        return Array.from(
          new Map(updated.map((item) => [item.id, item])).values(),
        );
      });
      removeFavorite(index);
    },
    [removeFavorite, searches, setRecentlyRemoved],
  );

  return (
    <div className="flex flex-col gap-4 wrapper">
      <h3>Favorites</h3>
      <Modal heading="Add Favorite" open={dialogOpen} setOpen={setDialogOpen}>
        <div className="max-h-[80vh] overflow-y-auto w-full">
          {currentLocation && (
            <LocationSection
              title="Current Location"
              locations={[currentLocation]}
              onLocationClick={handleAddFavorite}
              isDisabled={isFavorite}
            />
          )}
          <LocationSection
            title="Recent Searches"
            locations={[...searches].reverse()}
            onLocationClick={handleAddFavorite}
            isDisabled={isFavorite}
          />
          <LocationSection
            title="Recently Removed"
            locations={recentlyRemoved}
            onLocationClick={handleAddFavorite}
            isDisabled={isFavorite}
          />
        </div>
      </Modal>
      <div className="grid grid-cols-2 gap-2">
        <AnimatePresence initial={false} mode="popLayout">
          {favorites.map((fav, index) =>
            fav !== 'unset' ? (
              <motion.div
                className="relative h-24 sm:min-h-full"
                key={`fav-${fav.id}-${index}`}
                variants={popInOut}
                initial="initial"
                animate="animate"
                exit="exit"
              >
                <FavButton
                  favorite={fav}
                  removeFavorite={() => handleRemoveFavorite(fav, index)}
                />
              </motion.div>
            ) : (
              <motion.div
                className="relative h-24 sm:min-h-full"
                key={`addFav-${index}`}
                variants={popInOut}
                initial="initial"
                animate="animate"
                exit="exit"
              >
                <AddFavButton
                  onClick={() => {
                    setDialogOpen(true);
                    setCurrentIndex(index);
                  }}
                />
              </motion.div>
            ),
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default Favorites;
