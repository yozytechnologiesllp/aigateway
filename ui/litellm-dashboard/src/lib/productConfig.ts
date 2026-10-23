const HIDDEN_ROUTES: ReadonlySet<string> = new Set([
  "model-insights",
  "lens",
  "projects",
  "organizations",
  "telemetry",
  "workflows",
  "api-reference",
  "old-usage",
  "prompts",
  "transform-request",
  "tag-management",
  "learning-resources",
  "moyai",
  "chat",
]);

export const SHOW_UPSTREAM_LINKS = false;

const HIDDEN_TABS: Readonly<Record<string, ReadonlySet<string>>> = {
  "models-and-endpoints": new Set(["auto-routers", "access-group-budgets"]),
  playground: new Set(["system-one"]),
};

export const isRouteHidden = (route: string): boolean => HIDDEN_ROUTES.has(route);

export const isTabHidden = (route: string, tab: string): boolean => HIDDEN_TABS[route]?.has(tab) ?? false;

export const withoutHiddenTabs = <T extends string>(route: string, tabs: readonly T[]): T[] =>
  tabs.filter((tab) => !isTabHidden(route, tab));
