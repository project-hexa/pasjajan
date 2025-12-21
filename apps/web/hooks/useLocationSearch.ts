import { useCallback, useState } from "react";
import axios from "axios";

interface LocationResult {
  name: string;
  mapbox_id: string;
}

interface Coordinates {
  lat: number;
  lng: number;
}

export const useLocationSearch = () => {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<LocationResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [sessionToken, setSessionToken] = useState<string | null>(null);

  const setQueryFromOutside = (value: string) => {
    setQuery(value);
  };

  const startSession = useCallback(() => {
    if (!sessionToken) {
      setSessionToken(crypto.randomUUID());
    }
  }, [sessionToken]);

  const clearSession = useCallback(() => {
    setSessionToken(null);
  }, []);

  const search = useCallback(
    async (value: string) => {
      setQuery(value);

      if (value.length < 3 || !sessionToken) {
        setResults([]);
        return;
      }

      try {
        setIsSearching(true);

        const { data } = await axios.get(
          "https://api.mapbox.com/search/searchbox/v1/suggest",
          {
            params: {
              q: value,
              language: "id",
              country: "id",
              session_token: sessionToken,
              access_token: process.env.NEXT_PUBLIC_MAPBOX_TOKEN,
            },
          },
        );

        setResults(data.suggestions ?? []);
      } finally {
        setIsSearching(false);
      }
    },
    [sessionToken, setQuery],
  );

  const selectPlace = useCallback(
    async (item: LocationResult): Promise<Coordinates | null> => {
      if (!sessionToken) return null;

      const { data } = await axios.get(
        `https://api.mapbox.com/search/searchbox/v1/retrieve/${item.mapbox_id}`,
        {
          params: {
            session_token: sessionToken,
            access_token: process.env.NEXT_PUBLIC_MAPBOX_TOKEN,
          },
        },
      );

      const [lng, lat] = data.features[0].geometry.coordinates;

      clearSession();
      setResults([]);
      setQuery(item.name);

      return { lat, lng };
    },
    [sessionToken, clearSession, setQuery],
  );

  return {
    query,
    results,
    isSearching,
    startSession,
    search,
    selectPlace,
    setQuery,
    setQueryFromOutside,
  };
};
