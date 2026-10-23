import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { DEFAULT_BRAND } from "@/lib/brand";
import LoadingScreen from "./LoadingScreen";

describe("LoadingScreen", () => {
  it("should render", () => {
    render(<LoadingScreen />);
    expect(screen.getByText("Loading...")).toBeInTheDocument();
  });

  it("names the product from the brand instead of LiteLLM, even outside a query provider", () => {
    render(<LoadingScreen />);
    expect(screen.getByText(DEFAULT_BRAND.productName)).toBeInTheDocument();
    expect(screen.queryByText(/LiteLLM/)).not.toBeInTheDocument();
  });
});
