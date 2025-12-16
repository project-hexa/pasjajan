import { Button } from "@workspace/ui/components/button";
import { ButtonGroup } from "@workspace/ui/components/button-group";
import { Icon } from "@workspace/ui/components/icon";
import { Input } from "@workspace/ui/components/input";

export const Search = () => {
  return (
    <div className="flex w-full">
      <ButtonGroup className="w-full [&>*:not(:first-child)]:-ml-5 [&>*:not(:first-child)]:rounded-bl-full">
        <Input
          placeholder="Cari produk yang anda inginkan disini"
          className="bg-card w-full rounded-full placeholder:max-sm:text-xs"
        />
        <Button className="rounded-full border-t border-r border-b">
          <Icon icon="lucide:search" className="size-4" />
        </Button>
      </ButtonGroup>
    </div>
  );
};
