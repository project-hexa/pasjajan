import { Icon } from "@workspace/ui/components/icon";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@workspace/ui/components/input-group";
import { ComponentProps } from "react";

export const SearchInput = (props: ComponentProps<"div">) => {
  return (
    <InputGroup {...props}>
      <InputGroupAddon>
        <Icon icon={"lucide:search"} />
      </InputGroupAddon>
      <InputGroupInput placeholder="Cari Pengguna" />
    </InputGroup>
  );
};
