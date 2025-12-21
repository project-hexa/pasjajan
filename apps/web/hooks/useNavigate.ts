import { useRouter } from "next/navigation";
import { useTopLoader } from "nextjs-toploader";
import { useCallback } from "react";

export const useNavigate = () => {
  const router = useRouter();
  const loader = useTopLoader();

  const push = useCallback(
    (href: string) => {
      loader.start();
      router.push(href);
    },
    [router, loader]
  );

  const replace = useCallback(
    (href: string) => {
      loader.start();
      router.replace(href);
    },
    [router, loader]
  );

  return {
    push,
    replace,
    back: router.back,
    forward: router.forward,
    refresh: router.refresh,
    prefetch: router.prefetch,
  };
};
