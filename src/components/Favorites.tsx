import { useState } from 'react';
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
  animate: { y: 0, opacity: 1, transition: { duration: 0.25 } },
  exit: { y: -50, opacity: 0, transition: { duration: 0.25 } },
} as const;

type ModalLocationSectionProps = {
  title: string;
  locations: FormattedLocation[];
  onLocationClick: (location: FormattedLocation) => void;
  isDisabled: (location: FormattedLocation) => boolean;
};

const ModalLocationSection = ({
  title,
  locations,
  onLocationClick,
  isDisabled,
}: ModalLocationSectionProps) => {
  if (locations.length === 0) return null;

  return (
    <>
      <p className="heading-xs px-4 py-2">{title}</p>
      <div className="grid grid-cols-2">
        {locations.map((location, index) => (
          <button
            key={`${title}-${location.id}-${index}`}
            className="p-4 m-1 surface card disabled:bg-gray/40 disabled:cursor-not-allowed"
            onClick={() => onLocationClick(location)}
            disabled={isDisabled(location)}
          >
            <p className="heading-md">{location.name}</p>
            <p className="secondary">{location.address}</p>
          </button>
        ))}
      </div>
    </>
  );
};

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
      // prefetch="viewport"
    >
      <p className="heading-md">{favorite.name}</p>
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
    FormattedLocation[]
  >({
    key: 'recentlyRemoved',
    defaultValue: [],
  });
  const { favorites, addFavorite, removeFavorite, isFavorite } = useFavorites();
  const { searches } = useRecentSearch();

  const handleAddFavorite = (loc: FormattedLocation) => {
    addFavorite(loc, currentIndex);
    setRecentlyRemoved((prev) => prev.filter((item) => item.id !== loc.id));
    setDialogOpen(false);
  };

  const handleRemoveFavorite = (favorite: FormattedLocation, index: number) => {
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
  };

  return (
    <div className="flex flex-col gap-4 wrapper">
      <h3 className="heading-md">Favorites</h3>
      <Modal heading="Add Favorite" open={dialogOpen} setOpen={setDialogOpen}>
        <div className="max-h-[80vh] overflow-y-auto w-full">
          {currentLocation && (
            <ModalLocationSection
              title="Current Location"
              locations={[currentLocation]}
              onLocationClick={handleAddFavorite}
              isDisabled={isFavorite}
            />
          )}
          <ModalLocationSection
            title="Recent Searches"
            locations={[...searches].reverse()}
            onLocationClick={handleAddFavorite}
            isDisabled={isFavorite}
          />
          <ModalLocationSection
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
              // Add Favorite Button
              <motion.div
                className="relative h-24 sm:min-h-full"
                key={`addFav-${index}`}
                variants={popInOut}
                initial="initial"
                animate="animate"
                exit="exit"
              >
                <button
                  type="button"
                  className="absolute inset-0 flex items-center justify-center w-full h-full p-4 card-hollow"
                  onClick={(e) => {
                    setDialogOpen(true);
                    setCurrentIndex(index);
                    e.currentTarget.blur(); // remove focus after click
                  }}
                >
                  <img
                    src="https://ik.imagekit.io/redvelocity/assets/icons/tr:w-100,h-100/add.png"
                    height={45}
                    width={45}
                    alt="Add Favorite"
                  />
                </button>
              </motion.div>
            ),
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default Favorites;
