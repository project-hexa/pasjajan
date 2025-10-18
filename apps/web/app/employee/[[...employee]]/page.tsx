import { Button } from "@workspace/ui/components/button";
import Link from "next/link";
import React from "react";

export default async function EmployeePage({
  params,
}: {
  params: Promise<{ employee?: string[] }>;
}) {
  const p = (await params).employee ?? [];

  return (
    <div className="border">
      <h1>Ini adalah EmployeePage {p.length !== 0 && <>dengan params: {p.join(' ')}</>}</h1>
      <Link href="/">
        <Button variant={"outline"}>Kembali ke HomePage</Button>
      </Link>
      <p>
        Lorem ipsum dolor, sit amet consectetur adipisicing elit. Hic vero nemo
        pariatur consequuntur laborum eveniet, nihil tempora laboriosam officia
        assumenda vitae animi cumque qui doloremque asperiores. Delectus id
        neque eos.
      </p>
    </div>
  );
}
