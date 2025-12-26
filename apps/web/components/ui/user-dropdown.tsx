"use client";

import { Logout } from "@/app/(modul 1 - user management)/_components/logout";
import { useUserStore } from "@/app/(modul 1 - user management)/_stores/useUserStore";
import { useNavigate } from "@/hooks/useNavigate";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@workspace/ui/components/avatar";
import { Button } from "@workspace/ui/components/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@workspace/ui/components/dropdown-menu";
import { Icon } from "@workspace/ui/components/icon";
import { usePathname } from "next/navigation";

export const UserDropdown = () => {
  const navigate = useNavigate();
  const { user } = useUserStore();
  const pathname = usePathname();
  const dashboardPath = pathname === "/dashboard";

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        {dashboardPath ? (
          <Button
            variant={"ghost"}
            className="hover:text-foreground justify-start rounded-none px-4 py-6 text-start"
          >
            <Avatar>
              <AvatarFallback>U</AvatarFallback>
              <AvatarImage src={user?.avatar} alt={user?.full_name} />
            </Avatar>
            <div className="min-w-0 flex-1">
              <h3 className="line-clamp-1 font-medium">{user?.full_name}</h3>
              <span className="line-clamp-1 text-sm text-gray-500">
                {user?.email}
              </span>
            </div>
          </Button>
        ) : (
          <Button
            variant={"ghost"}
            className={
              dashboardPath
                ? "rounded-none border-none"
                : "text-primary-foreground"
            }
          >
            {user?.full_name}
            <Icon icon="lucide:user" />
          </Button>
        )}
      </DropdownMenuTrigger>
      <DropdownMenuContent
        className="bg-primary text-primary-foreground"
        side={dashboardPath ? "top" : "bottom"}
      >
        {user?.role === "Admin" && (
          <DropdownMenuItem onClick={() => navigate.push("/dashboard")}>
            <Icon icon="material-symbols:dashboard" /> Dashboard
          </DropdownMenuItem>
        )}
        <DropdownMenuItem onClick={() => navigate.push("/profile")}>
          <Icon icon="lucide:settings" /> Profile
        </DropdownMenuItem>
        {!dashboardPath && (
          <DropdownMenuItem>
            <Icon icon={"ic:outline-discount"} /> Transaksi & Poin
          </DropdownMenuItem>
        )}
        <DropdownMenuItem asChild>
          <Logout />
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
