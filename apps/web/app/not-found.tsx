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
          <h2 className="text-2xl">Oops! Page Not Found</h2>
          <CardDescription className="mt-4 max-w-sm text-center">
            We can’t seem to find the page you’re looking for. It might have
            been moved, deleted, or never existed.
          </CardDescription>
          <CardFooter className="mt-4 gap-5">
            <Link href="/">
              <Button>
                <Icon icon={"lucide:home"} />
                Back to Home
              </Button>
            </Link>
            <Link href="mailto:admin@pasjajan.com">
              <Button variant={"outline"}>
                <Icon icon={"lucide:email"} />
                Contact Support
              </Button>
            </Link>
          </CardFooter>
        </CardContent>
      </Card>
    </div>
  );
}
