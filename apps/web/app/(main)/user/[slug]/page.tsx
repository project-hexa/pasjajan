import { Button } from "@workspace/ui/components/button";
import Link from "next/link";

export default async function UserPageBySlug({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  return (
    <div className="border">
      <h1>Ini adalah UserPage dengan slug: {slug}</h1>
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
