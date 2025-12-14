import * as React from "react";
import CatalogueClient from "./CatalogueClient";
import { Footer } from "@/components/ui/footer";

export default function CataloguePage() {
  return (
    <main className="min-h-screen bg-white">
      <React.Suspense fallback={null}>
        <CatalogueClient />
      </React.Suspense>
      <Footer />
    </main>
  );
}
