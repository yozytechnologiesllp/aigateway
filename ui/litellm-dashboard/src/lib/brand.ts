import { z } from "zod";
import { uiHref } from "@/utils/uiHref";

export interface Brand {
  productName: string;
  version: string;
  logoUrl: string | null;
  logoUrlDark: string | null;
  faviconUrl: string | null;
  docsUrl: string | null;
  supportUrl: string | null;
}

export const DEFAULT_BRAND: Brand = {
  productName: "AI Gateway",
  version: "1.0",
  logoUrl: null,
  logoUrlDark: null,
  faviconUrl: null,
  docsUrl: null,
  supportUrl: null,
};

const optionalText = z
  .string()
  .trim()
  .transform((value) => value || null)
  .nullish()
  .catch(null);

const brandFileSchema = z
  .object({
    productName: optionalText,
    version: optionalText,
    logoUrl: optionalText,
    logoUrlDark: optionalText,
    faviconUrl: optionalText,
    docsUrl: optionalText,
    supportUrl: optionalText,
  })
  .catch({});

const themeSettingsSchema = z
  .object({
    values: z.object({ logo_url: optionalText, logo_url_dark: optionalText, favicon_url: optionalText }).catch({}),
  })
  .catch({ values: {} });

const isAbsolute = (url: string): boolean =>
  /^(https?:)?\/\//.test(url) || url.startsWith("/") || url.startsWith("data:");

const resolveAsset = (url: string | null | undefined): string | null => {
  if (!url) return null;
  return isAbsolute(url) ? url : uiHref(url);
};

export const resolveBrand = (brandFile: unknown, themeSettings: unknown): Brand => {
  const file = brandFileSchema.parse(brandFile ?? {});
  const theme = themeSettingsSchema.parse(themeSettings ?? {}).values;
  return {
    productName: file.productName ?? DEFAULT_BRAND.productName,
    version: file.version ?? DEFAULT_BRAND.version,
    logoUrl: theme.logo_url ?? resolveAsset(file.logoUrl),
    logoUrlDark: theme.logo_url_dark ?? resolveAsset(file.logoUrlDark),
    faviconUrl: theme.favicon_url ?? resolveAsset(file.faviconUrl),
    docsUrl: file.docsUrl ?? null,
    supportUrl: file.supportUrl ?? null,
  };
};
