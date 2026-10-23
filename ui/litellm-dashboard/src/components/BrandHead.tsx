"use client";

import { useEffect } from "react";
import { useBrand } from "@/hooks/useBrand";

export function BrandHead() {
  const { productName, faviconUrl } = useBrand();

  useEffect(() => {
    document.title = productName;
  }, [productName]);

  useEffect(() => {
    if (!faviconUrl) return;
    const links = document.querySelectorAll<HTMLLinkElement>("link[rel*='icon']");
    if (links.length > 0) {
      links.forEach((link) => {
        link.href = faviconUrl;
      });
      return;
    }
    const link = document.createElement("link");
    link.rel = "icon";
    link.href = faviconUrl;
    document.head.appendChild(link);
  }, [faviconUrl]);

  return null;
}
