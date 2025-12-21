import * as React from "react";
import { usePathname } from "next/navigation";
import { useNavigate } from "@/hooks/useNavigate";
import { Button } from "@workspace/ui/components/button";
import { ButtonGroup } from "@workspace/ui/components/button-group";
import { Icon } from "@workspace/ui/components/icon";
import { Input } from "@workspace/ui/components/input";
import { useSearchStore } from "@/stores/useSearchStore";

export const Search = () => {
  const navigate = useNavigate();
  const pathname = usePathname();
  const { search, setSearch } = useSearchStore();
  const [value, setValue] = React.useState(search ?? "");
  const debounceRef = React.useRef<number | null>(null);

  React.useEffect(() => {
    setValue(search ?? "");
  }, [search]);

  const submit = (next: string) => {
    const trimmed = (next || "").trim();
    setSearch(trimmed);
    const isStorePath = pathname?.startsWith("/store/");
    if (isStorePath) {
      const slug = pathname?.split("/")[2];
      if (trimmed) navigate.push(`/store/${slug}?search=${encodeURIComponent(trimmed)}`);
      else navigate.push(`/store/${slug}`);
    } else {
      if (trimmed) navigate.push(`/catalogue?search=${encodeURIComponent(trimmed)}`);
      else navigate.push(`/catalogue`);
    }
  };

  const onChange = (next: string) => {
    setValue(next);
    // debounce update to global store
    if (debounceRef.current) window.clearTimeout(debounceRef.current);
    debounceRef.current = window.setTimeout(() => {
      const trimmed = (next || "").trim();
      setSearch(trimmed);
      // navigate to catalogue or active store so user sees live results
      const isStorePath = pathname?.startsWith("/store/");
      if (isStorePath) {
        const slug = pathname?.split("/")[2];
        if (trimmed) navigate.replace(`/store/${slug}?search=${encodeURIComponent(trimmed)}`);
        else navigate.replace(`/store/${slug}`);
      } else {
        if (trimmed) navigate.replace(`/catalogue?search=${encodeURIComponent(trimmed)}`);
        else navigate.replace(`/catalogue`);
      }
      debounceRef.current = null;
    }, 300);
  };

  React.useEffect(() => {
    return () => {
      if (debounceRef.current) window.clearTimeout(debounceRef.current);
    };
  }, []);

  return (
    <div className="flex w-full">
      <form
        onSubmit={(e) => {
          e.preventDefault();
          submit(value);
        }}
        className="w-full"
      >
        <ButtonGroup className="w-full [&>*:not(:first-child)]:-ml-5 [&>*:not(:first-child)]:rounded-bl-full">
          <Input
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder="Cari produk atau toko..."
            className="bg-card w-full rounded-full placeholder:max-sm:text-xs"
          />
          <Button
            type="submit"
            className="rounded-full border-t border-r border-b"
            onClick={() => submit(value)}
          >
            <Icon icon="lucide:search" className="size-4" />
          </Button>
        </ButtonGroup>
      </form>
    </div>
  );
};
