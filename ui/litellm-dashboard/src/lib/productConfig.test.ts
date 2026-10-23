import { describe, expect, it } from "vitest";
import { SHOW_ENTERPRISE_UPSELL, showPremiumFeature } from "./productConfig";

describe("showPremiumFeature", () => {
  it("shows premium features to a licensed proxy", () => {
    expect(showPremiumFeature(true)).toBe(true);
  });

  it("hides them from an unlicensed proxy unless enterprise upsells are switched on", () => {
    for (const premiumUser of [false, null, undefined]) {
      expect(showPremiumFeature(premiumUser)).toBe(SHOW_ENTERPRISE_UPSELL);
    }
  });
});
