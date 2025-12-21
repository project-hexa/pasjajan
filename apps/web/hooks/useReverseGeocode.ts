import { api as axios } from "@/lib/utils/axios";

interface ReverseResult {
  fullAddress: string;
  place: string;
}

export const useReverseGeocode = () => {
  const reverseGeocode = async (
    lat: number,
    lng: number,
  ): Promise<ReverseResult | null> => {
    try {
      const res = await axios.get(
        "https://api.mapbox.com/search/geocode/v6/reverse",
        {
          params: {
            longitude: lng,
            latitude: lat,
            language: "id",
            access_token: process.env.NEXT_PUBLIC_MAPBOX_TOKEN,
          },
        },
      );

      const feature = res.data.features?.[0];
      if (!feature) return null;

      return {
        fullAddress: feature.properties.full_address,
        place: feature.properties.place_formatted,
      };
    } catch (e) {
      console.error("reverse geocode error", e);
      return null;
    }
  };

  return { reverseGeocode };
};
