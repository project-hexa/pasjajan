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

export default function NotFoundPage() {
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
          <CardTitle className="text-8xl">404</CardTitle>
          <h2 className="text-2xl">Oops! Halaman Tidak Ditemukan.</h2>
          <CardDescription className="mt-4 max-w-sm text-center">
            Sepertinya kami tidak dapat menemukan halaman yang Anda cari. Mungkin saja
            telah dipindahkan, dihapus, atau tidak pernah ada.
          </CardDescription>
          <CardFooter className="mt-4 gap-5">
            <Link href="/">
              <Button>
                <Icon icon={"lucide:home"} />
                Kembali ke Beranda
              </Button>
            </Link>
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
