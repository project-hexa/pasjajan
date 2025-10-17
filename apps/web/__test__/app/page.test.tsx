import "@testing-library/jest-dom";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event"
import HomePage from "@/app/page";

describe("HomePage", () => {
  it("Renders a heading", () => {
    render(<HomePage />);

    const heading = screen.getByRole("heading", { level: 1 });

    expect(heading).toBeInTheDocument();
  });

  it("Renders a button", async () => {
    render(<HomePage />)

    const button = screen.getByRole("button", {name: "Count: 0"})

    await userEvent.click(button)
    expect(screen.getByText("Count: 1")).toBeInTheDocument()
  })
});
