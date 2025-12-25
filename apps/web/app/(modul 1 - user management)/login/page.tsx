import { LoginForm } from "@/app/(modul 1 - user management)/_components/login-form";
import { Card, CardContent, CardTitle } from "@workspace/ui/components/card";
import { Metadata } from "next";
import Image from "next/image";

export const metadata: Metadata = {
  title: "Login",
};

export default function LoginPage() {
  return (
    <div className="items-center justify-center md:flex md:h-screen md:w-screen">
      <Card className="flex flex-col overflow-hidden p-0 md:h-2/3 md:w-2/3">
        <CardContent className="min-h-0 flex-1 p-0">
          <div className="flex h-full max-sm:py-10">
            <div className="bg-primary relative flex flex-1 items-center justify-center max-sm:hidden">
              <div className="flex flex-col items-center gap-5 text-white">
                <h1 className="font-bold md:text-2xl lg:text-4xl">
                  Selamat datang
                </h1>
                <div className="flex flex-col items-center gap-5">
                  <Image
                    src="/img/logo.png"
                    alt="Logo"
                    width={128}
                    height={128}
                  />
                  <div className="flex flex-col text-center">
                    <h2 className="text-2xl font-bold">Pasjajan</h2>
                    <p className="text-sm">Belanja cepat dan Mudah</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex flex-1 flex-col items-center justify-center gap-4">
              <div className="flex shrink-0 flex-col items-center gap-4">
                <CardTitle className="text-2xl">Masuk</CardTitle>
              </div>

              <LoginForm />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
