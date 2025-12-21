import { notFound } from "next/navigation";
import StoreProductList from "../_components/store-product-list";
import { Navbar } from "@/components/ui/navigation-bar";
import { Footer } from "@/components/ui/footer";
import { StoreService, ProductService } from "@/services/api-service";

/* ================= TYPES ================= */

interface Store {
  id: number;
  code: string;
  name: string;
  address: string;
  phone_number: string;
}

interface Product {
  id: number;
  name: string;
  description: string;
  price: number | string;
  image_url?: string;
  store_id?: number;
  store_code?: string;
}

interface FormattedProduct {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
}

interface PageProps {
  params: Promise<{
    storeSlug: string;
  }>;
  searchParams?: Promise<{
    search?: string;
  }>;
}

/* ================= PAGE ================= */

export default async function StorePage(props: PageProps) {
  const { storeSlug } = await props.params;
  const searchParams = await props.searchParams;

  const query = (searchParams?.search ?? "").toLowerCase();

  const [stores, allProducts] = await Promise.all([
    StoreService.getAll() as Promise<Store[]>,
    ProductService.getAll() as Promise<Product[]>,
  ]);

  const storeData = stores.find(
    (s) => s.code.toLowerCase() === storeSlug.toLowerCase()
  );

  if (!storeData) return notFound();

  const storeProducts = allProducts.filter(
    (p) =>
      p.store_id === storeData.id ||
      p.store_code === storeData.code
  );

  const formattedProducts: FormattedProduct[] = storeProducts.map((p) => ({
    id: String(p.id),
    name: p.name,
    description: p.description,
    price: Number(p.price),
    image: p.image_url || "/images/placeholder.png",
  }));

  const filtered = query
    ? formattedProducts.filter((p) =>
        p.name.toLowerCase().includes(query)
      )
    : formattedProducts;

  return (
    <main className="min-h-screen bg-[#F9FAFB]">
      <Navbar />

      <div className="mx-auto max-w-[90rem] px-4 py-10 sm:px-8">
        <header className="mb-10 rounded-3xl bg-black p-10 text-white">
          <span className="text-xs font-bold uppercase tracking-widest text-yellow-400">
            Official Store
          </span>

          <h1 className="mt-2 text-4xl font-black">
            {storeData.name}
          </h1>

          <p className="mt-2 text-gray-400">
            {storeData.address}
          </p>

          <div className="mt-6 flex gap-4">
            <div className="rounded-full bg-white/10 px-4 py-2 text-sm">
              Code: {storeData.code}
            </div>
            <div className="rounded-full bg-white/10 px-4 py-2 text-sm">
              Telp: {storeData.phone_number}
            </div>
          </div>
        </header>

        <section>
          <h3 className="mb-8 text-2xl font-bold">
            {query ? `Mencari: "${query}"` : "Semua Produk"}
          </h3>

          <StoreProductList
            products={filtered}
            variant={query ? "grid" : "scroll"}
          />

          {filtered.length === 0 && (
            <div className="rounded-2xl border-2 border-dashed p-20 text-center text-gray-400">
              Tidak ada produk ditemukan di toko ini.
            </div>
          )}
        </section>
      </div>

      <Footer />
    </main>
  );
}
