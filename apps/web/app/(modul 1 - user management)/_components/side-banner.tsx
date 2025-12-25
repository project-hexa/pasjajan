"use client";

import Image from "next/image";
import { usePathname } from "next/navigation";

export const SideBanner = () => {
  const pathname = usePathname();

  return (
    <div className="bg-primary relative flex flex-1 items-center justify-center max-sm:hidden">
      <div className="flex flex-col items-center gap-5 text-white">
        {pathname !== "/login/admin" && (
          <h1 className="font-bold md:text-2xl lg:text-4xl">Selamat datang</h1>
        )}
        <div className="flex flex-col items-center gap-5">
          <Image
            src="/img/logo.png"
            alt="Logo"
            width={172}
            height={172}
            className="aspect-auto"
            priority
          />
          <div className="flex flex-col text-center">
            <h2 className="text-2xl font-bold">Pasjajan</h2>
            {pathname !== "/login/admin" && (
              <p className="text-sm">Belanja cepat dan Mudah</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
