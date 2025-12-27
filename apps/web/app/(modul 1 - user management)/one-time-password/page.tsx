import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@workspace/ui/components/card";
import { OTPForm } from "../_components/otp-form";

export default function OTPPage() {
  return (
    <div className="flex h-screen w-screen items-center justify-center">
      <Card className="flex flex-col overflow-hidden p-0 max-sm:mx-5 max-sm:-mt-40 md:border-2 md:border-black lg:min-h-2/3 lg:min-w-1/2">
        <CardHeader className="sr-only">
          <CardTitle>OTP Verification</CardTitle>
          <CardDescription>Halaman untuk verifikasi OTP</CardDescription>
        </CardHeader>
        <CardContent className="flex min-h-0 flex-1 flex-col items-center justify-center p-0">
          <OTPForm />
        </CardContent>
      </Card>
    </div>
  );
}
