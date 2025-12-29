import { LoginForm } from "@/app/(modul 1 - user management)/_components/login-form";
import { Card, CardContent, CardTitle } from "@workspace/ui/components/card";
import { Metadata } from "next";
import { SideBanner } from "../_components/side-banner";

export const metadata: Metadata = {
  title: "Login",
};

export default function LoginPage() {
  return (
    <div className="items-center justify-center md:flex md:h-screen md:w-screen">
      <Card className="flex flex-col overflow-hidden p-0 md:h-2/3 md:w-2/3">
        <CardContent className="min-h-0 flex-1 p-0">
          <div className="flex h-full max-sm:py-10">
            <SideBanner />

            <div className="flex flex-1 flex-col items-center justify-center gap-4 py-4">
              <CardTitle className="text-2xl">Masuk</CardTitle>

              <LoginForm />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
