import * as React from "react";
import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { Button, buttonVariants } from "@/components/ui/button";

// @saastro/forms pasa `size` (md · lg · xl) al Button inyectado. Sin md/xl en
// el cva, el control SIZE de HubForm no hacía nada; con lg en h-9, SIZE=lg
// pintaba más bajo que md. default y lg se fijan aquí porque tocarlos cambia
// lo que ven los sites al sincronizar: que falle si alguien los mueve.
const ALTURAS = {
  default: "h-8",
  md: "h-10",
  lg: "h-12",
  xl: "h-14",
} as const;

const altura = (clases: string) =>
  clases.split(/\s+/).filter((c) => /^h-/.test(c));

describe("Button · alturas por size", () => {
  for (const [size, h] of Object.entries(ALTURAS)) {
    it(`size="${size}" → ${h}`, () => {
      expect(
        altura(buttonVariants({ size: size as keyof typeof ALTURAS })),
      ).toEqual([h]);
    });

    it(`<Button size="${size}"> pinta ${h} en el DOM`, () => {
      render(
        <Button size={size as keyof typeof ALTURAS}>{`b-${size}`}</Button>,
      );
      const b = screen.getByRole("button", { name: `b-${size}` });
      expect(altura(b.className)).toEqual([h]);
    });
  }
});
