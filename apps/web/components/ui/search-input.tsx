"use client";

import { Slot } from "@radix-ui/react-slot";
import { Button } from "@workspace/ui/components/button";
import { ButtonGroup } from "@workspace/ui/components/button-group";
import { Icon } from "@workspace/ui/components/icon";
import { Input } from "@workspace/ui/components/input";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@workspace/ui/components/input-group";
import { cn } from "@workspace/ui/lib/utils";
import { Controller, useForm } from "react-hook-form";

export const SearchInput = ({
  variant = "default",
  asChild = false,
  classNameContainer,
  classNameGroup,
  classNameAddon,
  classNameInput,
}: {
  variant?: "default" | "home";
  asChild?: boolean;
  classNameContainer?: string;
  classNameGroup?: string;
  classNameAddon?: string;
  classNameInput?: string;
}) => {
  const searchForm = useForm<{ value: string }>({
    defaultValues: {
      value: "",
    },
  });

  const handleOnSubmit = (data: { value: string }) => {
    console.log(data);
  };

  if (asChild) return <Slot />;

  return (
    <form
      id="search-form"
      className={cn("w-full", classNameContainer)}
      onSubmit={searchForm.handleSubmit(handleOnSubmit)}
    >
      {variant === "default" ? (
        <Controller
          control={searchForm.control}
          name="value"
          render={({ field }) => (
            <InputGroup className={cn("bg-card w-full", classNameGroup)}>
              <InputGroupAddon className={classNameAddon}>
                <Icon icon={"lucide:search"} />
              </InputGroupAddon>
              <InputGroupInput
                placeholder="Cari Pengguna"
                className={classNameInput}
                {...field}
              />
            </InputGroup>
          )}
        />
      ) : (
        <Controller
          control={searchForm.control}
          name="value"
          render={({ field }) => (
            <ButtonGroup
              className={cn(
                "w-full [&>*:not(:first-child)]:-ml-5 [&>*:not(:first-child)]:rounded-bl-full",
                classNameGroup,
              )}
            >
              <Input
                placeholder="Cari produk yang anda inginkan disini"
                className={cn(
                  "bg-card w-full rounded-full pr-6 placeholder:max-sm:text-xs",
                  classNameInput,
                )}
                {...field}
              />
              <Button
                type="submit"
                form="search-form"
                className="hover:bg-primary z-50 rounded-full border-t border-r border-b"
              >
                <Icon icon="lucide:search" className="size-4" />
              </Button>
            </ButtonGroup>
          )}
        />
      )}
    </form>
  );
};
