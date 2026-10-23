import { describe, expect, it } from "vitest";
import { DEFAULT_BRAND, resolveBrand } from "./brand";

describe("resolveBrand", () => {
  it("falls back to the default brand when brand.json and theme settings are missing", () => {
    expect(resolveBrand(null, null)).toEqual(DEFAULT_BRAND);
  });

  it("takes the product name and links from brand.json", () => {
    const brand = resolveBrand(
      { productName: "Acme Gateway", docsUrl: "https://docs.example.com", supportUrl: "https://help.example.com" },
      null,
    );

    expect(brand.productName).toBe("Acme Gateway");
    expect(brand.docsUrl).toBe("https://docs.example.com");
    expect(brand.supportUrl).toBe("https://help.example.com");
  });

  it("lets logo and favicon saved on the UI Theme page override brand.json", () => {
    const brand = resolveBrand(
      { logoUrl: "https://cdn.example.com/file-logo.svg", faviconUrl: "https://cdn.example.com/file.ico" },
      { values: { logo_url: "https://cdn.example.com/db-logo.png", favicon_url: null } },
    );

    expect(brand.logoUrl).toBe("https://cdn.example.com/db-logo.png");
    expect(brand.faviconUrl).toBe("https://cdn.example.com/file.ico");
  });

  it("serves relative brand.json asset paths from the UI base", () => {
    const brand = resolveBrand({ logoUrl: "brand/logo.svg", logoUrlDark: "/static/dark.svg" }, null);

    expect(brand.logoUrl).toMatch(/\/brand\/logo\.svg$/);
    expect(brand.logoUrl).not.toBe("brand/logo.svg");
    expect(brand.logoUrlDark).toBe("/static/dark.svg");
  });

  it("treats blank and malformed values as unset instead of breaking the brand", () => {
    const brand = resolveBrand({ productName: "   ", logoUrl: 42, docsUrl: "" }, { values: "nope" });

    expect(brand).toEqual(DEFAULT_BRAND);
  });
});
