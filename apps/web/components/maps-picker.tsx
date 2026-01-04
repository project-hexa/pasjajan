"use client";

import Map, { Marker, MapRef, MarkerDragEvent } from "react-map-gl/mapbox";
import { useEffect, useRef, useState } from "react";
import { MapLayerMouseEvent } from "mapbox-gl";

interface LocationCoords {
  lat: number;
  lng: number;
}

export const MapsPicker = ({
  position,
  onLocationChange,
}: {
  position: LocationCoords;
  onLocationChange: (coords: LocationCoords) => void;
}) => {
  const mapRef = useRef<MapRef | null>(null);
  const [marker, setMarker] = useState<LocationCoords>(position);

  useEffect(() => {
    setMarker(position);

    if (mapRef.current) {
      mapRef.current.flyTo({
        center: [position.lng, position.lat],
        zoom: 15,
        essential: true,
      });
    }
  }, [position]);

  return (
    <Map
      ref={mapRef}
      mapboxAccessToken={process.env.NEXT_PUBLIC_MAPBOX_TOKEN}
      initialViewState={{
        latitude: position.lat,
        longitude: position.lng,
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
      onClick={(e: MapLayerMouseEvent) => {
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
        onDragEnd={(e: MarkerDragEvent) => {
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
