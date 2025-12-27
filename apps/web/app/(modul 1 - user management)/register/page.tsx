import { Card, CardContent, CardTitle } from "@workspace/ui/components/card";
import { Metadata } from "next";
import { RegisterForm } from "../_components/register-form";
import { SideBanner } from "../_components/side-banner";

export const metadata: Metadata = {
  title: "Register",
};

export default function RegisterPage() {
  return (
    <div className="items-center justify-center md:flex md:h-screen md:w-screen">
      <Card className="flex flex-col overflow-hidden p-0 max-sm:rounded-none md:h-2/3 md:w-2/3">
        <CardContent className="min-h-0 flex-1 p-0">
          <div className="flex h-full">
            <SideBanner />

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
