"use client";

import { Button } from "@workspace/ui/components/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@workspace/ui/components/card";
import { Icon } from "@workspace/ui/components/icon";
import Image from "next/image";
import Link from "next/link";
import { useEffect } from "react";

export default function ErrorPage({
  error,
}: {
  error: Error & { digest?: string };
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="flex h-screen w-screen items-center justify-center">
      <Card>
        <CardContent className="flex flex-col items-center justify-center">
          <CardHeader className="-ml-20">
            <div className="bg-primary relative size-20 rounded-full">
              <Image
                src={"/img/logo.png"}
                alt="logo-pasjajan"
                className="px-4 py-5"
                fill
                priority
              />
            </div>
          </CardHeader>
          <CardTitle className="text-8xl">500</CardTitle>
          <h2 className="text-2xl">Oops! Ada yang tidak beres.</h2>
          <CardDescription className="mt-4 max-w-sm text-center">
            Terjadi kesalahan pada sistem kami. Silakan coba beberapa saat lagi
            atau hubungi tim support jika masalah terus berlanjut.
          </CardDescription>
          <CardFooter className="mt-4 gap-5">
            <Button onClick={() => window.location.reload()}>
              Refresh Halaman
            </Button>
            <Link href="mailto:admin@pasjajan.com">
              <Button variant={"outline"}>
                <Icon icon={"lucide:email"} />
                Hubungi Dukungan
              </Button>
            </Link>
          </CardFooter>
        </CardContent>
      </Card>
    </div>
  );
}
