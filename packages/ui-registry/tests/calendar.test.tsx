import * as React from "react";
import { afterEach, describe, expect, it } from "vitest";
import { cleanup, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { Calendar } from "@/components/ui/calendar";

afterEach(cleanup);

// react-day-picker marca con `modifiers.focused` el día que debe tener el foco
// cuando se navega con el teclado; CalendarDayButton lo aplica con un
// useEffect sobre su ref. Si el ref no llega al <button>, la navegación con
// flechas cambia el día "focused" pero el foco del DOM no se mueve.
describe("Calendar · foco de teclado", () => {
  it("ArrowRight mueve document.activeElement al día siguiente", async () => {
    const user = userEvent.setup();
    render(<Calendar mode="single" defaultMonth={new Date(2026, 8, 1)} />);

    const day15 = screen.getByRole("button", { name: /15/ });
    await user.click(day15);
    expect(document.activeElement).toBe(day15);

    await user.keyboard("{ArrowRight}");

    const day16 = screen.getByRole("button", { name: /16/ });
    expect(day16.closest("[data-focused=true]")).not.toBeNull();
    expect(document.activeElement).toBe(day16);
  });
});
