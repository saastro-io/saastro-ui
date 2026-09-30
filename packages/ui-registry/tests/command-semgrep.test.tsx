import * as React from "react"
import { afterEach, describe, expect, it, vi } from "vitest"
import { cleanup, render } from "@testing-library/react"

import { CommandItem } from "@/components/ui/command"
// ?raw de Vite: el texto del fichero tal cual se sirve en /r/command.json.
import FUENTE from "../registry/default/ui/command.tsx?raw"

afterEach(cleanup)

// La regla de Semgrep javascript.lang.security.html-in-template-string salta
// con un template literal que interpola algo Y tiene un trozo literal que casa
// con `</?[a-zA-Z]`. command.tsx se copia tal cual al consumidor (shadcn add),
// así que un `// nosemgrep` allí lo borra el siguiente --overwrite: el patrón
// no puede estar en la fuente.
function templatesQueParecenHtml(src: string): string[] {
  const templates = src.match(/`(?:\\[\s\S]|[^`\\])*`/g) ?? []
  return templates.filter((t) => {
    if (!t.includes("${")) return false
    const literal = t.replace(/\$\{[^}]*\}/g, "\u0000")
    return /<\/?[a-zA-Z]/.test(literal)
  })
}

describe("command.tsx · sin HTML en template literals (Semgrep)", () => {
  it("el detector caza el patrón que había", () => {
    expect(
      templatesQueParecenHtml("throw new Error(`<${part}> tiene que ir dentro de <Command>`)"),
    ).toHaveLength(1)
  })

  it("la fuente no tiene template literals con interpolación que parezcan HTML", () => {
    expect(templatesQueParecenHtml(FUENTE)).toEqual([])
  })

  it("fuera de <Command> sigue lanzando y nombra la parte", () => {
    const spy = vi.spyOn(console, "error").mockImplementation(() => {})
    expect(() => render(<CommandItem value="x">x</CommandItem>)).toThrow(
      /CommandItem tiene que ir dentro de Command/,
    )
    spy.mockRestore()
  })
})
