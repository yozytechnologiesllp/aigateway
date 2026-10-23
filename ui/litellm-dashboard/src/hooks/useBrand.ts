import { useQuery } from "@tanstack/react-query";
import { DEFAULT_BRAND, fetchBrand, type Brand } from "@/lib/brand";

export function useBrand(): Brand {
  const { data } = useQuery({ queryKey: ["brand"], queryFn: fetchBrand, staleTime: Infinity });
  return data ?? DEFAULT_BRAND;
}
