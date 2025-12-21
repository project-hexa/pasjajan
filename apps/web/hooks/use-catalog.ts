import { useState, useEffect } from "react";
import { StoreService, ProductService, PromoService } from "../services/api-service";
import { Store, Product, Promo } from "../types/api";

export const useCatalog = () => {
  const [stores, setStores] = useState<Store[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [promos, setPromos] = useState<Promo[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [storesData, productsData, promosData] = await Promise.all([
          StoreService.getAll(),
          ProductService.getAll(),
          PromoService.getActive(),
        ]);

        setStores(storesData);
        setProducts(productsData);
        setPromos(promosData);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return { stores, products, promos, loading };
};