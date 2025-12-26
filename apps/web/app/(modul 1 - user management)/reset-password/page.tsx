import { Card, CardContent, CardTitle } from "@workspace/ui/components/card";
import { Icon } from "@workspace/ui/components/icon";
import { ResetPasswordForm } from "../_components/reset-password-form";

export default function ResetPasswordPage() {
  return (
    <div className="flex h-screen w-screen items-center justify-center">
      <Card className="flex flex-col overflow-hidden max-lg:px-5 max-sm:mx-5 max-sm:-mt-40 md:w-2/3 md:border-2 md:border-black lg:w-1/2">
        <CardContent className="flex min-h-0 flex-1 flex-col items-center justify-center gap-4 p-0">
          <Icon icon="uil:padlock" width={200} />
          <CardTitle className="text-2xl">Atur Password</CardTitle>

          <ResetPasswordForm />
        </CardContent>
      </Card>
    </div>
  );
}
