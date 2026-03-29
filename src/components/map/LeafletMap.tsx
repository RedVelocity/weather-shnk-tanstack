import { useEffect } from 'react';
import { MapContainer, Marker, Popup, TileLayer, useMap } from 'react-leaflet';
import type { FormattedLocation } from '@/lib/types/location';

const UpdateMapView = ({ center }: { center: [number, number] }) => {
  const map = useMap();

  useEffect(() => {
    map.setView(center, 10);
  }, [center]);

  return null;
};

const LeafletMap = ({ location }: { location: FormattedLocation }) => {
  const center: [number, number] = [
    location.coordinates[1],
    location.coordinates[0],
  ];

  return (
    <div className="relative z-0 overflow-hidden h-80 lg:h-full card" id="map">
      <MapContainer center={center} zoom={10}>
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url={`https://api.mapbox.com/styles/v1/redvelocity/ckozmz39930fd17o235d58kon/tiles/256/{z}/{x}/{y}?access_token=${import.meta.env.VITE_MAPBOX_FRONTEND_KEY}`}
        />
        <UpdateMapView center={center} />
        <Marker position={center}>
          <Popup>{location.name}</Popup>
        </Marker>
      </MapContainer>
    </div>
  );
};

export default LeafletMap;
