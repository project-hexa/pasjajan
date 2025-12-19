"use client";

import Map, { Marker, MapRef } from "react-map-gl/mapbox";
import { useRef, useState } from "react";

interface LocationCoords {
  lat: number;
  lng: number;
}

export const MapsPicker = ({
  initialPosition,
  onLocationChange,
}: {
  initialPosition: LocationCoords;
  onLocationChange: (coords: LocationCoords) => void;
}) => {
  const mapRef = useRef<MapRef | null>(null);

  const [marker, setMarker] = useState<LocationCoords>(initialPosition);

  return (
    <Map
      ref={mapRef}
      mapboxAccessToken={process.env.NEXT_PUBLIC_MAPBOX_TOKEN}
      initialViewState={{
        latitude: initialPosition.lat,
        longitude: initialPosition.lng,
        zoom: 15,
      }}
      mapStyle="mapbox://styles/mapbox/streets-v12"
      style={{
        width: "100%",
        height: "100%",
      }}
      scrollZoom
      doubleClickZoom
      touchZoomRotate
      dragPan
      dragRotate={false}
      onClick={(e) => {
        const coords = {
          lat: e.lngLat.lat,
          lng: e.lngLat.lng,
        };
        setMarker(coords);
        onLocationChange(coords);
      }}
    >
      <Marker
        latitude={marker.lat}
        longitude={marker.lng}
        draggable
        onDragEnd={(e) => {
          const coords = {
            lat: e.lngLat.lat,
            lng: e.lngLat.lng,
          };
          setMarker(coords);
          onLocationChange(coords);
        }}
      />
    </Map>
  );
};
