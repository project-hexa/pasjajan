"use client";

import { Badge } from "@workspace/ui/components/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardTitle,
} from "@workspace/ui/components/card";
import { Skeleton } from "@workspace/ui/components/skeleton";
import { useCallback, useEffect, useState } from "react";
import { AddAddress } from "../../_components/add-address-stepper";
import { EditAddressDialog } from "../../_components/edit-address-dialog";
import { userService } from "../../_services/user.service";
import { useUserStore } from "../../_stores/useUserStore";

export default function ProfilePage() {
  const { customer, setCustomer, user } = useUserStore();
  const [loading, setLoading] = useState<boolean>(false);

  const refreshProfile = useCallback(async () => {
    setLoading(true);
    const res = await userService.getUserProfile(user?.email || "");
    if (res.ok && res.data) {
      setCustomer(res.data.user.customer);
    }
    setLoading(false);
  }, [setCustomer, user]);

  useEffect(() => {
    refreshProfile();
  }, [refreshProfile]);

  return (
    <>
      <h1 className="text-2xl font-bold">Alamat Saya</h1>
      <AddAddress onSuccess={refreshProfile} />

      {loading ? (
        <Card>
          <CardContent className="space-y-4">
            <CardTitle className="flex w-1/3 gap-2">
              <Skeleton className="h-4 w-2/4" />
              <Skeleton className="h-4 w-1/4" />
            </CardTitle>
            <div className="flex flex-col gap-1">
              <Skeleton className="h-4 w-1/5" />
              <Skeleton className="h-4 w-1/4" />
            </div>

            <CardDescription className="flex flex-col gap-2">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-2/3" />
              <Skeleton className="h-4 w-1/3" />
            </CardDescription>
            <Skeleton className="h-4 w-20" />
          </CardContent>
        </Card>
      ) : (
        customer?.addresses.map((address) => (
          <Card
            key={`customer-${customer.id}-${address.id}`}
            className="border-primary bg-primary/10"
          >
            <CardContent>
              <CardTitle>
                {address.label}
                {address.is_default ? (
                  <Badge variant={"outline"} className="ml-2 p-1">
                    Utama
                  </Badge>
                ) : null}
              </CardTitle>
              <h2 className="text-md font-bold">{address.recipient_name}</h2>
              <span>{address.phone_number}</span>

              <CardDescription>{address.detail_address}</CardDescription>
              <EditAddressDialog
                id={address.id}
                pinpoint={address.detail_address}
                onSuccess={refreshProfile}
              />
            </CardContent>
          </Card>
        ))
      )}
    </>
  );
}
