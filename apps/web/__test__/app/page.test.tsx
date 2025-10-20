import HomePage from "@/app/(home)/page";
import { render, screen } from "@testing-library/react";
import { describe, expect, test } from "vitest";

test("Renders a heading", () => {
  render(<HomePage />);

  const heading = screen.getByRole("heading", {
    level: 1
  });

  expect(heading).toBeDefined();
});
