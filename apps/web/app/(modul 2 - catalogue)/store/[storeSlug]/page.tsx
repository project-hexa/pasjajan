import Image from "next/image";
import { notFound } from "next/navigation";
import StoreProductList, { StoreProduct } from "../_components/store-product-list";
import { Navbar } from "@/components/ui/navigation-bar";
import { Footer } from "@/components/ui/footer";

const defaultHeroSubtitle = "Belanja semua kebutuhan kelontong favoritmu, langsung dari toko terpercaya di kota kamu.";

const defaultPopularProducts: StoreProduct[] = [
  {
    id: "minyak-goreng",
    name: "Minyak Goreng",
    description: "Botol 2L",
    price: 38500,
    image: "/images/Screenshot 2025-10-25 173437.png",
    details:
      "Minyak goreng kemasan 2 liter dengan rasa netral yang cocok untuk menumis maupun menggoreng. Kemasan rapat memudahkan penyimpanan di dapur rumah atau toko.",
  },
  {
    id: "fruit-tea",
    name: "Fruit Tea",
    description: "Freeze 350 ML",
    price: 4500,
    image: "/images/Screenshot 2025-10-25 173713.png",
    details:
      "Minuman rasa buah 350 ml dengan sensasi dingin menyegarkan. Praktis dikonsumsi kapan saja dan jadi favorit pelanggan muda.",
  },
  {
    id: "happy-tos",
    name: "Happy Tos",
    description: "Keripik 140 g",
    price: 14500,
    image: "/images/Screenshot 2025-10-25 174230.png",
    details:
      "Keripik jagung renyah 140 gram dengan bumbu gurih manis. Cocok untuk stok camilan keluarga atau paket hampers sederhana.",
  },
  {
    id: "mie-sedap",
    name: "Mie Sedap",
    description: "Goreng Selection",
    price: 3500,
    image: "/images/Screenshot 2025-10-25 174329.png",
    details:
      "Mi instan goreng dengan bumbu selection kaya rasa dan tekstur kenyal. Topping bawang renyah membuat setiap sajian terasa spesial.",
  },
  {
    id: "mamy-poko",
    name: "MamyPoko",
    description: "X-tra Kering",
    price: 51700,
    image: "/images/Screenshot 2025-10-25 175114.png",
    details:
      "Popok bayi tipe celana dengan daya serap tinggi sehingga kulit tetap kering hingga 12 jam. Desain elastis nyaman untuk aktivitas si kecil.",
  },
  {
    id: "ekonomi",
    name: "Ekonomi",
    description: "Sabun Cuci Piring",
    price: 6800,
    image: "/images/Screenshot 2025-10-25 175248.png",
    details:
      "Sabun cuci piring cair dengan formula konsentrat yang efektif mengangkat lemak. Busanya melimpah namun mudah dibilas tanpa residu.",
  },
  {
    id: "minyak-telon",
    name: "Minyak Telon",
    description: "Botol 60 ml",
    price: 24500,
    image: "/images/Screenshot 2025-10-25 175308.png",
    details:
      "Minyak telon 60 ml untuk menjaga kehangatan bayi serta memberi aroma lembut menenangkan. Diformulasikan dari bahan alami pilihan.",
  },
  {
    id: "yupie",
    name: "Yupie Permen",
    description: "Gummy 9 Rasa",
    price: 14500,
    image: "/images/Screenshot 2025-10-25 175227.png",
    details:
      "Permen gummy dengan sembilan rasa buah berbeda dalam satu kemasan. Teksturnya kenyal dan disukai anak-anak maupun dewasa.",
  },
];

const storeSeeds = [
  { slug: "sushi-day-bandung", name: "Sushi Day - Bandung" },
  { slug: "burger-baik-cimahi", name: "Burger Baik - Cimahi" },
  { slug: "warkop-bandung", name: "Warkop - Bandung" },
  { slug: "jus-1l-gerlong", name: "Jus 1L - Gerlong" },
  { slug: "pizza-cuy-bandung", name: "Pizza Cuy - Bandung" },
  { slug: "roti-h-gerlong", name: "Roti H - Gerlong" },
  { slug: "ayam-bakar-mantap-bandung", name: "Ayam Bakar Mantap - Bandung", category: "Kuliner" },
  { slug: "dimsum-suka-bandung", name: "Dimsum Suka - Bandung", category: "Kuliner" },
  { slug: "toko-manis-bandung", name: "Toko Manis - Bandung", category: "Dessert" },
];

const storeCatalogue = storeSeeds.map((seed) => ({
  slug: seed.slug,
  name: seed.name,
  category: seed.category ?? "Snack",
  rating: 4.8,
  reviewCount: "1.4RB",
  distance: "1km",
  eta: "15min",
  discounts: ["Diskon 25%", "Diskon Ongkir"],
  heroTitle: "Toko Jajanan No.1 di Indonesia",
  heroSubtitle: defaultHeroSubtitle,
  heroImage: "/img/logo2.png",
  popularProducts: defaultPopularProducts.map((product) => ({ ...product })),
}));

const storeIndex = Object.fromEntries(storeCatalogue.map((store) => [store.slug, store]));

export default function StorePage(props: any) {
  const { params, searchParams } = props as { params: { storeSlug: string }; searchParams: { search?: string } };
  const store = storeIndex[params.storeSlug];

  if (!store) {
    notFound();
  }

  const rawQuery = searchParams?.search ?? "";
  const trimmedQuery = rawQuery.trim();
  const normalizedQuery = trimmedQuery.toLowerCase();
  const hasQuery = normalizedQuery.length > 0;

  const searchResults: StoreProduct[] = hasQuery
    ? store.popularProducts.filter((product) => {
        const haystack = `${product.name} ${product.description}`.toLowerCase();
        return haystack.includes(normalizedQuery);
      })
    : [];

  const hasSearchResults = searchResults.length > 0;
  const heroHidden = hasQuery;

  return (
    <main className="min-h-screen flex flex-col bg-[#F9FAFB] pb-0 pt-0">
      <Navbar />
      <div className="mx-auto flex-1 w-full max-w-[90rem] px-4 pb-10 sm:px-6 lg:px-8 xl:px-10">
        <div
          className={`overflow-hidden transition-all duration-500 ease-in-out ${
            heroHidden
              ? "mt-0 max-h-0 -translate-y-6 opacity-0 pointer-events-none"
              : "mt-6 max-h-[520px] translate-y-0 opacity-100"
          }`}
        >
          <section className="rounded-2xl bg-black px-6 py-10 text-white shadow-lg sm:px-10 lg:px-16">
            <div className="flex flex-col gap-8 lg:flex-row lg:items-center lg:justify-between">
              <div className="max-w-xl space-y-4">
                <p className="text-sm uppercase tracking-wide text-[#FACC15]">PasJajan</p>
                <h2 className="text-3xl font-semibold sm:text-4xl">{store.heroTitle}</h2>
                <p className="text-lg text-white/80">{store.heroSubtitle}</p>
                <div className="flex items-center gap-2 text-[#FACC15]">
                  {Array.from({ length: 5 }).map((_, index) => (
                    <svg
                      key={index}
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                      className="h-6 w-6"
                    >
                      <path d="M12 2.5l2.924 5.925 6.541.952-4.732 4.615 1.118 6.516L12 17.77l-5.851 3.738 1.118-6.516-4.732-4.615 6.541-.952L12 2.5z" />
                    </svg>
                  ))}
                </div>
              </div>
              <div className="flex w-full justify-center lg:w-auto">
                <Image
                  src="/img/logo3.png"
                  alt="PasJajan"
                  width={240}
                  height={240}
                  className="h-32 w-auto object-contain sm:h-40 lg:h-48"
                />
              </div>
            </div>
          </section>
        </div>

        {hasQuery ? (
          <section className="mt-8">
            <div className="space-y-1">
              <p className="text-sm text-[#111827]">
                Hasil pencarian untuk &quot;<span className="font-semibold">{trimmedQuery}</span>&quot;
              </p>
              <p className="text-sm text-[#6B7280]">
                {hasSearchResults ? `${searchResults.length} produk ditemukan` : "Produk tidak ditemukan"}
              </p>
            </div>

            {hasSearchResults ? (
              <StoreProductList products={searchResults} variant="grid" outerClassName="mt-6" />
            ) : (
              <div className="mt-10">
                <h3 className="text-2xl font-semibold text-[#111827]">Rekomendasi</h3>
                <p className="mt-1 text-sm text-[#6B7280]">Produk populer lainnya dari toko ini.</p>
                <StoreProductList products={store.popularProducts} variant="grid" outerClassName="mt-4" />
              </div>
            )}
          </section>
        ) : (
          <section className="mt-12">
            <h3 className="text-2xl font-semibold text-[#111827]">Produk Populer</h3>
            <StoreProductList
              products={store.popularProducts}
              variant="scroll"
              outerClassName="mt-6 -mx-4 pb-4"
              innerClassName="px-4"
            />
          </section>
        )}
      </div>
      <Footer />
    </main>
  );
}
