import { BannerSection } from "./_components/banner-section";
import { ProductPopulerSection } from "./_components/product-populer-section";
import { RestoTopRatingSection } from "./_components/resto-top-rating-section";

export default function HomePage() {
  return (
    <div className="container mx-auto mt-4 min-h-[calc(100vh-80px)] space-y-5 border-r px-4 pb-5">
      <BannerSection />
      <RestoTopRatingSection />
      <ProductPopulerSection />
    </div>
  );
}
