import { describe, expect, it } from "vitest";
import { visibleMenuGroups, type MenuGroup, menuGroups } from "@/components/leftnav";
import { isRouteHidden } from "@/lib/productConfig";
import { flattenNavItems, matchNavItems, paletteScopeForRoute, shortcutLabel, type PaletteNavItem } from "./utils";

describe("paletteScopeForRoute", () => {
  it.each([
    ["api-keys", "keys"],
    ["", "global"],
    ["teams", "global"],
  ] as const)("uses the expected palette scope for %s", (routeSegment, expected) => {
    expect(paletteScopeForRoute(routeSegment)).toBe(expected);
  });
});

describe("flattenNavItems", () => {
  it("flattens visible leaves and skips external links", () => {
    const groups: MenuGroup[] = [
      {
        groupLabel: "Tools",
        items: [
          { key: "search-tools", page: "search-tools", label: "Search Tools" },
          { key: "docs", page: "docs", label: "Docs", external_url: "https://example.com" },
          { key: "tools", page: "tools", label: "Tools", children: [{ key: "logs", page: "logs", label: "Logs" }] },
        ],
      },
    ];

    expect(flattenNavItems(groups).map(({ label }) => label)).toEqual(["Search Tools", "Logs"]);
  });
});

describe("visibleMenuGroups", () => {
  const context = {
    userRole: "Internal User",
    isViewOnly: false,
    isOrgAdmin: false,
    isTeamAdmin: false,
  };

  it("applies the internal-user page allowlist", () => {
    const visible = visibleMenuGroups(menuGroups, {
      ...context,
      enabledPagesInternalUsers: ["api-keys"],
    });

    expect(flattenNavItems(visible).map(({ route }) => route)).toEqual(["api-keys"]);
  });

  it("never shows a product-hidden route, even to an admin with every page flag enabled", () => {
    const everyFlagAdmin = {
      ...context,
      userRole: "Admin",
      isOrgAdmin: true,
      isTeamAdmin: true,
      enableProjectsUI: true,
    };
    const visible = visibleMenuGroups(menuGroups, everyFlagAdmin);
    const routes = flattenNavItems(visible).map(({ route }) => route);

    expect(routes.filter(isRouteHidden)).toEqual([]);
    expect(routes).toEqual(expect.arrayContaining(["api-keys", "teams", "users", "logs"]));
  });

  it("keeps admin pages visible despite the internal-user page allowlist", () => {
    const visible = visibleMenuGroups(menuGroups, {
      ...context,
      userRole: "Admin",
      enabledPagesInternalUsers: ["api-keys"],
    });

    expect(flattenNavItems(visible).some(({ route }) => route === "users")).toBe(true);
  });
});

describe("matchNavItems", () => {
  const items: PaletteNavItem[] = [
    { key: "section", label: "Teams", section: "Logs", route: "teams" },
    { key: "substring", label: "Audit Logs", section: "Access Control", route: "audit-logs" },
    { key: "prefix", label: "Logging", section: "Observability", route: "logging" },
  ];

  it("ranks label prefixes above label substrings and section matches", () => {
    expect(matchNavItems(items, "log").map(({ key }) => key)).toEqual(["prefix", "substring", "section"]);
  });

  it("returns every item in its original order for an empty query", () => {
    expect(matchNavItems(items, "  ")).toEqual(items);
  });
});

describe("shortcutLabel", () => {
  it("uses the command key on Mac and Ctrl elsewhere", () => {
    expect(shortcutLabel("MacIntel", "Mozilla/5.0")).toBe("⌘K");
    expect(shortcutLabel("Linux x86_64", "Mozilla/5.0 (Windows NT 10.0)")).toBe("Ctrl K");
  });
});
