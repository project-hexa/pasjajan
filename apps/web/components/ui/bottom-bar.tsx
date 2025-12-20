import { Button } from "@workspace/ui/components/button";
import { Icon } from "@workspace/ui/components/icon";
import Link from "next/link";

export function BottomBar() {
  return (
    <div className="bg-background fixed bottom-0 flex w-full items-center justify-between gap-2 border-t-2 p-4 shadow-[0_0_10px_rgba(0,0,0,0.1)] md:hidden">
      <Link href="/">
        <Button variant={"ghost"} size={"icon"}>
          <Icon icon={"lucide:home"} width={24} />
        </Button>
      </Link>
      <Link href={"/kategory"}>
        <Button variant={"ghost"} size={"icon"}>
          <Icon icon="mynaui:grid" width={24} />
        </Button>
      </Link>
      <Link href="/">
        <Button variant={"ghost"} size={"icon"}>
          <Icon icon={"lucide:bell"} width={24} />
        </Button>
      </Link>
      <Link href={"/profile"}>
        <Button variant={"ghost"} size={"icon"}>
          <Icon icon={"lucide:user"} width={24} />
        </Button>
      </Link>
    </div>
  );
}
