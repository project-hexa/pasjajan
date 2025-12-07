import * as React from "react";
import SiteFooter from "../components/site-footer";
import CatalogueClient from "./CatalogueClient";

export default function CataloguePage() {
  return (
    <main className="min-h-screen bg-white">
      <React.Suspense fallback={null}>
        <CatalogueClient />
      </React.Suspense>
      <SiteFooter />
    </main>
  );
}
