import Image from "next/image";
import { notFound } from "next/navigation";
import SiteHeader from "../../components/site-header";
import SiteFooter from "../../components/site-footer";

const defaultHeroSubtitle = "Belanja semua kebutuhan kelontong favoritmu, langsung dari toko terpercaya di kota kamu.";

const defaultPopularProducts = [
  { id: "minyak-goreng", name: "Minyak Goreng", description: "Botol 2L", price: 38500, image: "/images/Screenshot 2025-10-25 173437.png" },
  { id: "fruit-tea", name: "Fruit Tea", description: "Freeze 350 ML", price: 4500, image: "/images/Screenshot 2025-10-25 173713.png" },
  { id: "happy-tos", name: "Happy Tos", description: "Keripik 140 g", price: 14500, image: "/images/Screenshot 2025-10-25 174230.png" },
  { id: "mie-sedap", name: "Mie Sedap", description: "Goreng Selection", price: 3500, image: "/images/Screenshot 2025-10-25 174329.png" },
  { id: "mamy-poko", name: "MamyPoko", description: "X-tra Kering", price: 51700, image: "/images/Screenshot 2025-10-25 175114.png" },
  { id: "ekonomi", name: "Ekonomi", description: "Sabun Cuci Piring", price: 6800, image: "/images/Screenshot 2025-10-25 175248.png" },
  { id: "minyak-telon", name: "Minyak Telon", description: "Botol 60 ml", price: 24500, image: "/images/Screenshot 2025-10-25 175308.png" },
  { id: "yupie", name: "Yupie Permen", description: "Gummy 9 Rasa", price: 14500, image: "/images/Screenshot 2025-10-25 175227.png" },
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
  popularProducts: defaultPopularProducts,
}));

const storeIndex = Object.fromEntries(storeCatalogue.map((store) => [store.slug, store]));

const formatPrice = (value: number) => `Rp. ${value.toLocaleString("id-ID")}`;

type Product = (typeof defaultPopularProducts)[number];

export default function StorePage({
  params,
  searchParams,
}: {
  params: { storeSlug: string };
  searchParams: { search?: string };
}) {
  const store = storeIndex[params.storeSlug];

  if (!store) {
    notFound();
  }

  const rawQuery = searchParams?.search ?? "";
  const trimmedQuery = rawQuery.trim();
  const normalizedQuery = trimmedQuery.toLowerCase();
  const hasQuery = normalizedQuery.length > 0;

  const searchResults = hasQuery
    ? store.popularProducts.filter((product) => {
        const haystack = `${product.name} ${product.description}`.toLowerCase();
        return haystack.includes(normalizedQuery);
      })
    : [];

  const hasSearchResults = searchResults.length > 0;
  const heroHidden = hasQuery;

  const ProductCard = ({ product }: { product: Product }) => (
    <div className="relative flex min-h-[240px] flex-col rounded-2xl border border-[#E5E7EB] bg-white shadow-sm transition-shadow hover:shadow-md">
      <div className="p-3 pb-16">
        <div className="relative h-32 w-full overflow-hidden rounded-md bg-white">
          <Image
            src={product.image}
            alt={product.name}
            fill
            sizes="(max-width: 768px) 50vw, (max-width: 1280px) 20vw, 15vw"
            className="object-contain"
          />
        </div>
        <div className="mt-3 space-y-1">
          <h4 className="text-sm font-semibold text-[#111827]">{product.name}</h4>
          <p className="text-xs text-[#6B7280]">{product.description}</p>
          <p className="text-sm font-bold text-[#DC2626]">{formatPrice(product.price)}</p>
        </div>
      </div>
      <button
        type="button"
        className="absolute inset-x-0 bottom-0 rounded-2xl bg-[#0A6B3C] py-3 text-sm font-semibold text-white transition-colors hover:bg-[#07502C]"
      >
        Tambah
      </button>
    </div>
  );

  return (
    <main className="min-h-screen flex flex-col bg-[#F9FAFB] pb-0 pt-0">
      <SiteHeader />
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
                Hasil pencarian untuk "<span className="font-semibold">{trimmedQuery}</span>"
              </p>
              <p className="text-sm text-[#6B7280]">
                {hasSearchResults ? `${searchResults.length} produk ditemukan` : "Produk tidak ditemukan"}
              </p>
            </div>

            {hasSearchResults ? (
              <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-3 sm:gap-6 lg:grid-cols-4 xl:grid-cols-5">
                {searchResults.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            ) : (
              <div className="mt-10">
                <h3 className="text-2xl font-semibold text-[#111827]">Rekomendasi</h3>
                <p className="mt-1 text-sm text-[#6B7280]">Produk populer lainnya dari toko ini.</p>
                <div className="mt-4 grid grid-cols-2 gap-4 sm:grid-cols-3 sm:gap-6 lg:grid-cols-4 xl:grid-cols-5">
                  {store.popularProducts.map((product) => (
                    <ProductCard key={product.id} product={product} />
                  ))}
                </div>
              </div>
            )}
          </section>
        ) : (
          <section className="mt-12">
            <h3 className="text-2xl font-semibold text-[#111827]">Produk Populer</h3>
            <div className="mt-6 -mx-4 overflow-x-auto pb-4">
              <div className="flex gap-4 px-4">
                {store.popularProducts.map((product) => (
                  <div key={product.id} className="w-[200px] flex-shrink-0">
                    <ProductCard product={product} />
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}
      </div>
      <SiteFooter />
    </main>
  );
}
