import "@testing-library/jest-dom";
import { render, screen } from "@testing-library/react";
import { Button } from "@workspace/ui/components/button";

describe("Components", () => {
    it("Renders a button", () => {
        render(<Button />)

        const button = screen.getByRole("button")
        expect(button).toBeInTheDocument()
    })
})