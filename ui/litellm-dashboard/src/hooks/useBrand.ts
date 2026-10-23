import { useContext } from "react";
import { QueryClient, QueryClientContext, useQuery } from "@tanstack/react-query";
import { getProxyBaseUrl } from "@/components/networking";
import { DEFAULT_BRAND, resolveBrand, type Brand } from "@/lib/brand";
import { createApiClient } from "@/lib/http/client";
import { uiHref } from "@/utils/uiHref";

const uiOriginClient = createApiClient({ getBaseUrl: () => "" });
const proxyClient = createApiClient({ getBaseUrl: getProxyBaseUrl });
const standaloneQueryClient = new QueryClient();

const fetchBrand = async (): Promise<Brand> => {
  const [brandFile, themeSettings] = await Promise.all([
    uiOriginClient.get<unknown>(uiHref("brand.json")).catch(() => null),
    proxyClient.get<unknown>("/get/ui_theme_settings").catch(() => null),
  ]);
  return resolveBrand(brandFile, themeSettings);
};

export function useBrand(): Brand {
  const queryClient = useContext(QueryClientContext) ?? standaloneQueryClient;
  const { data } = useQuery({ queryKey: ["brand"], queryFn: fetchBrand, staleTime: Infinity }, queryClient);
  return data ?? DEFAULT_BRAND;
}
