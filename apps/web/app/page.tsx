"use client";

import { Button } from "@workspace/ui/components/button";
import { ButtonGroup } from "@workspace/ui/components/button-group";
import { Card, CardContent, CardHeader } from "@workspace/ui/components/card";
import { ModeToggle } from "@workspace/ui/components/mode-toggle";
import { Separator } from "@workspace/ui/components/separator";
import Link from "next/link";
import { useState } from "react";

export default function HomePage() {
  const [count, setCount] = useState<number>(0);
  const handleClickMinus = () => setCount(count - 1);
  const handleClickPlus = () => setCount(count + 1);

  return (
    <div className="min-h-[calc(100vh-80px)] border">
      <div className="flex flex-col justify-center items-center gap-5">
        <h1 className="text-2xl font-bold">Setup Proyek Pasjajan-Mart</h1>
        <Card>
          <CardContent>
            <div className="flex flex-col gap-2 items-center">
              <span>Test Button dengan Count</span>
              <span>Count: {count}</span>
              <ButtonGroup>
                <Button onClick={handleClickMinus} variant={"outline"}>
                  -
                </Button>
                <Button onClick={handleClickPlus} variant={"outline"}>
                  +
                </Button>
              </ButtonGroup>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent>
            <div className="flex flex-col gap-2 items-center">
              <span>Test Button Clicked dengan Mode Toggle Theme</span>
              <ModeToggle />
            </div>
          </CardContent>
        </Card>
        <Card className="max-w-1/2">
          <CardContent>
            <div className="flex flex-col gap-2 items-center">
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
                <Card className="gap-2 w-60">
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
                <Card className="gap-2 w-60">
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
        <Card className="max-w-1/2">
          <CardContent>
            <div className="flex flex-col gap-2 items-center">
              <p>
                Lorem ipsum, dolor sit amet consectetur adipisicing elit. Sit
                optio unde earum, ducimus corporis minima numquam odio dolores
                praesentium ipsa explicabo corrupti illum facilis, tenetur
                maiores officia porro. At non nulla asperiores fugiat
                repellendus sunt nam dolores nesciunt, assumenda, nihil ullam
                saepe, quam est! Ea id saepe iusto modi quasi, nobis nemo iste
                explicabo nulla molestiae ab totam itaque laboriosam recusandae?
                Dicta aliquam dolorum itaque velit assumenda deleniti nesciunt,
                beatae modi praesentium quibusdam rerum, dignissimos reiciendis?
                Fugit perferendis nisi animi nostrum libero tempora, quo quos
                quaerat rerum suscipit numquam sit accusantium unde deserunt
                fugiat, minima quidem excepturi quae! Reprehenderit, magni!
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
