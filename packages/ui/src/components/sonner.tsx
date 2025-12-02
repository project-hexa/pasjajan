"use client";

import { Icon } from "@iconify-icon/react";
import { useTheme } from "next-themes";
import { Toaster as Sonner, type ToasterProps } from "sonner";

const Toaster = ({ ...props }: ToasterProps) => {
  const { theme = "system" } = useTheme();

  return (
    <Sonner
      theme={theme as ToasterProps["theme"]}
      className="toaster group"
      icons={{
        success: <Icon icon="lucide:circle-check" />,
        info: <Icon icon="lucide:info" />,
        warning: <Icon icon="lucide:triangle-alert" />,
        error: <Icon icon="lucide:octagon-x" />,
        loading: <Icon icon="lucide:loader-circle" />,
      }}
      style={
        {
          "--normal-bg": "var(--popover)",
          "--normal-text": "var(--popover-foreground)",
          "--normal-border": "var(--border)",
          "--border-radius": "var(--radius)",
        } as React.CSSProperties
      }
      {...props}
    />
  );
};

export { Toaster };
export * from "sonner";
