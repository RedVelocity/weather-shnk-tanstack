import { useEffect, useMemo, useState } from 'react';
import { Link } from '@tanstack/react-router';
import L from 'leaflet';
import {
  MapContainer,
  Marker,
  TileLayer,
  Tooltip,
  useMap,
  useMapEvents,
} from 'react-leaflet';
import { useServerFn } from '@tanstack/react-start';
import type { FormattedLocation } from '@/lib/types/location';
import { findLocationServerFn } from '@/lib/actions/locationServerFn';
import { getLinkPath } from '@/lib/utils/getLinkPath';

const UpdateMapView = ({ center }: { center: [number, number] }) => {
  const map = useMap();

  useEffect(() => {
    map.setView(center, map.getZoom());
  }, [center, map]);

  return null;
};

const MapClickHandler = ({
  onMapClick,
}: {
  onMapClick: (latLng: [number, number]) => void;
}) => {
  useMapEvents({
    click: (e) => {
      onMapClick([e.latlng.lat, e.latlng.lng]);
    },
  });
  return null;
};

const LeafletMap = ({ location }: { location: FormattedLocation }) => {
  const findLocation = useServerFn(findLocationServerFn);
  const [loading, setLoading] = useState(false);

  // State for marker position and location details
  const [markerData, setMarkerData] = useState<{
    position: [number, number];
    location: FormattedLocation | null;
  }>({
    position: [location.coordinates[1], location.coordinates[0]],
    location,
  });

  const customIcon = useMemo(
    () =>
      L.icon({
        iconUrl:
          'https://ik.imagekit.io/redvelocity/assets/icons/tr:w-50,h-50/marker.png',
        iconSize: [35, 35],
        iconAnchor: [17.5, 35],
        popupAnchor: [0, -35],
      }),
    [],
  );

  // Update marker position when the location changes
  useEffect(() => {
    setMarkerData({
      position: [location.coordinates[1], location.coordinates[0]],
      location,
    });
  }, [location]);

  // Fetch new location details based on marker position with delay for smoother UX
  const updateLocation = async (latLng: [number, number]) => {
    setLoading(true);

    try {
      await new Promise((resolve) => setTimeout(resolve, 300)); // UX delay

      const loc = await findLocation({
        data: {
          latitude: latLng[0],
          longitude: latLng[1],
        },
      });
      if (loc instanceof Response) throw new Error('Location not found');
      setMarkerData((prev) => ({
        ...prev,
        location: loc,
      }));
    } catch (error) {
      console.info('Error fetching location:', error);
      setMarkerData((prev) => ({
        ...prev,
        location: null,
      }));
    } finally {
      setLoading(false);
    }
  };

  const handleMapClick = (latLng: [number, number]) => {
    console.log('Map clicked at:', latLng);
    setMarkerData((prev) => ({
      ...prev,
      position: latLng,
    }));
    updateLocation(latLng);
  };

  const center: [number, number] = [
    location.coordinates[1],
    location.coordinates[0],
  ];

  return (
    <div className="relative z-0 overflow-hidden h-80 lg:h-full card" id="map">
      <MapContainer center={center} zoom={10}>
        <TileLayer
          attribution='&copy; <a href="https://www.mapbox.com/">Mapbox</a> | <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url={`https://api.mapbox.com/styles/v1/redvelocity/ckozmz39930fd17o235d58kon/tiles/256/{z}/{x}/{y}@2x?access_token=${import.meta.env.VITE_MAPBOX_FRONTEND_KEY}`}
        />
        <UpdateMapView center={markerData.position} />
        <MapClickHandler onMapClick={handleMapClick} />
        <Marker position={markerData.position} icon={customIcon}>
          <Tooltip direction="bottom" className="text-lg" interactive permanent>
            {loading ? (
              <span>Loading...</span>
            ) : markerData.location ? (
              <Link to={getLinkPath(markerData.location)} className="underline">
                {markerData.location.name}
              </Link>
            ) : (
              <span>Not found</span>
            )}
          </Tooltip>
        </Marker>
      </MapContainer>
    </div>
  );
};

export default LeafletMap;
