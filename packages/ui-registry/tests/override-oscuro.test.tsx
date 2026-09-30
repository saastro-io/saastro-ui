// @vitest-environment node
import * as React from "react"
import { renderToStaticMarkup } from "react-dom/server"
import { compile } from "@tailwindcss/node"
import puppeteer, { type Browser } from "puppeteer"
import { afterAll, beforeAll, describe, expect, it } from "vitest"

import { Checkbox } from "@/components/ui/checkbox"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Switch } from "@/components/ui/switch"
// Las copias que sirve ui-docs (sus demos las importan de aquí, no del
// registry). Su `@/lib/utils` lo resuelve el alias al `cn` del registry, que
// es el mismo twMerge(clsx()) que el de ui-docs (src/theme/lib/utils.ts).
import { Checkbox as DocsCheckbox } from "../../../apps/ui-docs/src/components/ui/checkbox"
import {
  RadioGroup as DocsRadioGroup,
  RadioGroupItem as DocsRadioGroupItem,
} from "../../../apps/ui-docs/src/components/ui/radio-group"

// Un consumidor que pinta el marcado de otro color pasa `data-checked:bg-*`.
// En claro ganaba; en oscuro lo pisaba `dark:data-checked:bg-primary` del
// primitivo: twMerge tira el `data-checked:bg-primary` base (mismo stack de
// variantes) pero no el `dark:` (stack distinto), y con
// `@custom-variant dark (&:is(.dark *))` éste tiene más especificidad.
// Se mide en Chrome con el CSS que Tailwind compila de verdad: jsdom no
// procesa @layer, color-mix ni oklch.

// El `dark` de los consumidores (ui-docs, forms-docs, theme) y los tokens
// de ui-docs que entran en juego.
const CSS = `
@import "tailwindcss";
@custom-variant dark (&:is(.dark *));
@theme inline {
  --color-background: var(--background);
  --color-foreground: var(--foreground);
  --color-primary: var(--primary);
  --color-primary-foreground: var(--primary-foreground);
  --color-input: var(--input);
  --color-ring: var(--ring);
  --color-destructive: var(--destructive);
}
:root {
  --background: hsl(0 0% 100%); --foreground: hsl(0 0% 3.9%);
  --primary: hsl(0 0% 9%); --primary-foreground: hsl(0 0% 98%);
  --input: hsl(0 0% 89.8%); --ring: hsl(0 0% 3.9%); --destructive: hsl(0 84.2% 60.2%);
}
.dark {
  --background: hsl(0 0% 3.9%); --foreground: hsl(0 0% 98%);
  --primary: hsl(0 0% 98%); --primary-foreground: hsl(0 0% 9%);
  --input: hsl(0 0% 14.9%); --ring: hsl(0 0% 83.1%); --destructive: hsl(0 62.8% 30.6%);
}
`

const OVERRIDE = "data-checked:bg-red-500"
// Referencias en la misma página: se compara color computado con color
// computado, no con una cadena oklch que Chrome puede serializar distinto.
const REFS = `<div id="ref-red" class="bg-red-500"></div><div id="ref-primary" class="bg-primary"></div><div id="ref-input30" class="bg-input/30"></div>`

let browser: Browser

beforeAll(async () => {
  // En el runner de Actions (Ubuntu 23.10+) AppArmor niega los user
  // namespaces y Chrome muere con «No usable sandbox»; como en
  // comprobar-previews-vivas, sólo se quita ahí: aquí sólo carga setContent.
  browser = await puppeteer.launch({
    headless: "shell",
    args: process.env.CI ? ["--no-sandbox", "--disable-dev-shm-usage"] : [],
  })
}, 60_000)

afterAll(async () => {
  await browser?.close()
})

async function medir(markup: string, tema: "light" | "dark") {
  const clases = [...(markup + REFS).matchAll(/class="([^"]*)"/g)].flatMap((m) =>
    m[1].split(/\s+/).filter(Boolean)
  )
  const compilado = await compile(CSS, { base: import.meta.dirname, onDependency: () => {} })
  const css = compilado.build(clases)
  const page = await browser.newPage()
  try {
    await page.setContent(
      `<!doctype html><html class="${tema === "dark" ? "dark" : ""}"><head><style>${css}</style></head><body>${markup}${REFS}</body></html>`
    )
    return await page.evaluate(() => {
      const bg = (el: Element | null) => (el ? getComputedStyle(el).backgroundColor : null)
      return {
        control: bg(document.querySelector("[data-prueba]")),
        red: bg(document.getElementById("ref-red")),
        primary: bg(document.getElementById("ref-primary")),
        input30: bg(document.getElementById("ref-input30")),
      }
    })
  } finally {
    await page.close()
  }
}

const casos: Array<[string, (props: { className?: string; checked: boolean }) => React.ReactElement]> = [
  [
    "checkbox",
    ({ className, checked }) => (
      <Checkbox data-prueba="" defaultChecked={checked} className={className} />
    ),
  ],
  [
    "radio-group",
    ({ className, checked }) => (
      <RadioGroup defaultValue={checked ? "a" : undefined}>
        <RadioGroupItem data-prueba="" value="a" className={className} />
      </RadioGroup>
    ),
  ],
  [
    "switch",
    ({ className, checked }) => (
      <Switch data-prueba="" defaultChecked={checked} className={className} />
    ),
  ],
  [
    "ui-docs/checkbox",
    ({ className, checked }) => (
      <DocsCheckbox data-prueba="" defaultChecked={checked} className={className} />
    ),
  ],
  [
    "ui-docs/radio-group",
    ({ className, checked }) => (
      <DocsRadioGroup defaultValue={checked ? "a" : undefined}>
        <DocsRadioGroupItem data-prueba="" value="a" className={className} />
      </DocsRadioGroup>
    ),
  ],
]

describe.each(casos)("%s", (nombre, Control) => {
  it("marcado: el markup lleva data-checked (si no, lo de abajo no mide nada)", () => {
    const markup = renderToStaticMarkup(<Control checked className={OVERRIDE} />)
    expect(markup).toMatch(/data-prueba=""[^>]*data-checked|data-checked[^>]*data-prueba=""/)
  })

  for (const tema of ["light", "dark"] as const) {
    it(`override ${OVERRIDE} marcado en ${tema}: gana el del consumidor, no primary`, async () => {
      const m = await medir(renderToStaticMarkup(<Control checked className={OVERRIDE} />), tema)
      expect(m.red).not.toBe(m.primary)
      expect(m.control).toBe(m.red)
    }, 30_000)

    it(`sin override marcado en ${tema}: sigue en primary`, async () => {
      const m = await medir(renderToStaticMarkup(<Control checked />), tema)
      expect(m.control).toBe(m.primary)
    }, 30_000)
  }

  if (nombre !== "switch") {
    it("sin override desmarcado en dark: sigue en input/30", async () => {
      const m = await medir(renderToStaticMarkup(<Control checked={false} />), "dark")
      expect(m.control).toBe(m.input30)
    }, 30_000)
  }
})
