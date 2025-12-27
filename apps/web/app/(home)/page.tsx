"use client";
import { Button } from "@workspace/ui/components/button";
import { Card, CardContent, CardHeader } from "@workspace/ui/components/card";
import { Separator } from "@workspace/ui/components/separator";
import Link from "next/link";

export default function HomePage() {
  return (
    <div className="min-h-[calc(100vh-80px)] border">
      <div className="flex flex-col items-center justify-center gap-5 pt-5">
        <h1 className="text-2xl font-bold">Setup Proyek Pasjajan-Mart</h1>
        <Card className="max-w-1/2">
          <CardContent>
            <div className="flex flex-col items-center gap-2">
              <span>Coba Navigasi ke route tertentu:</span>
              <p>semua folder routing harus ada di folder apps/web/app/</p>
              <Card className="gap-2">
                <CardHeader>folder user/</CardHeader>
                <Separator />
                <CardContent>
                  <div className="space-y-2">
                    <p>Routing ke:</p>
                    <div className="flex flex-wrap gap-2">
                      <Link href="/user">
                        <Button variant={"secondary"}>/User</Button>
                      </Link>
                      <Link href="/user/1">
                        <Button variant={"secondary"}>/User/1</Button>
                      </Link>
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Separator />
              <span>Coba navigasi dengan struktur folder group</span>
              <div className="flex gap-2">
                <Card className="w-60 gap-2">
                  <CardHeader>folder (auth)/</CardHeader>
                  <Separator />
                  <CardContent>
                    <div className="space-y-2">
                      <p>Routing ke:</p>
                      <div className="flex flex-wrap gap-2">
                        <Link href="/login">
                          <Button variant={"secondary"}>/login</Button>
                        </Link>
                        <Link href="/register">
                          <Button variant={"secondary"}>/register</Button>
                        </Link>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                <Card className="w-60 gap-2">
                  <CardHeader>folder (admin)/</CardHeader>
                  <Separator />
                  <CardContent>
                    <div className="space-y-2">
                      <p>Routing ke:</p>
                      <div className="flex flex-wrap gap-2">
                        <Link href="/dashboard">
                          <Button variant={"secondary"}>/dashboard</Button>
                        </Link>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
              <Separator />
              <span>Coba navigasi dengan dynamic route</span>
              <Card className="gap-2">
                <CardHeader>folder (delivery)/</CardHeader>
                <Separator />
                <CardContent>
                  <div className="flex flex-wrap gap-2 pt-6">
                    <Link href="/cart">
                      <Button variant={"secondary"}>/cart</Button>
                    </Link>
                    <Link href="/catalogue">
                      <Button variant={"secondary"}>/catalogue</Button>
                    </Link>

                    <Link href="/delivery/123/rating">
                      <Button variant={"secondary"}>
                        /delivery/123/rating
                      </Button>
                    </Link>
                    <Link href="/delivery/123/tracking">
                      <Button variant={"secondary"}>
                        /delivery/123/tracking
                      </Button>
                    </Link>
                  </div>
                  <p className="text-muted-foreground mt-2">
                    Folder: app/(delivery)/[deliveryId]/rating dan
                    app/(delivery)/[deliveryId]/tracking
                  </p>
                </CardContent>
              </Card>
              <Separator />
              <span>Coba navigasi dengan catch all route</span>
              <div className="flex gap-2">
                <Link href="/employee">
                  <Button variant={"secondary"}>/employee</Button>
                </Link>
                <Link href="/employee/123">
                  <Button variant={"secondary"}>/employee/123</Button>
                </Link>
                <Link href="/employee/123/abc">
                  <Button variant={"secondary"}>/employee/123/abc</Button>
                </Link>
              </div>
              <p className="text-muted-foreground">
                ini ada di folder app/employee/[[...employee]]/
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
