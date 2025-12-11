import { RegisterForm } from "@/components/auth/register-form";
import { Card, CardContent, CardTitle } from "@workspace/ui/components/card";
import Image from "next/image";

export default function RegisterPage() {
  return (
    <div className="items-center justify-center md:flex md:h-screen md:w-screen">
      <Card className="flex flex-col overflow-hidden p-0 max-sm:rounded-none md:h-2/3 md:w-2/3">
        <CardContent className="min-h-0 flex-1 p-0">
          <div className="flex h-full">
            <div className="bg-primary relative flex flex-1 items-center justify-center max-sm:hidden">
              <div className="flex flex-col items-center gap-5 text-white">
                <h1 className="text-4xl font-bold">Selamat datang</h1>
                <div className="flex flex-col items-center gap-5">
                  <Image src="/logo.png" alt="Logo" width={128} height={128} />
                  <div className="flex flex-col items-center">
                    <h2 className="text-2xl font-bold">Pasjajan</h2>
                    <p className="text-sm">Belanja cepat dan Mudah</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex flex-1 flex-col items-center gap-4 overflow-y-auto py-4">
              <CardTitle className="text-2xl">Daftar</CardTitle>

              <RegisterForm />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
