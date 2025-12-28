import HomePage from "@/app/(home)/page";
import { render, screen } from "@testing-library/react";
import { expect, test } from "vitest";

test("Renders a heading", () => {
  render(<HomePage />);

  const heading = screen.getByTestId("title-in-development");

  expect(heading).toBeDefined();
});
