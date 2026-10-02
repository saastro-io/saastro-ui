// @vitest-environment node
import * as React from "react"
import { renderToStaticMarkup } from "react-dom/server"
import { compile } from "@tailwindcss/node"
import puppeteer, { type Browser } from "puppeteer"
import { afterAll, beforeAll, describe, expect, it } from "vitest"

import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuIndicator,
  NavigationMenuItem,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu"

// El indicador venía de Radix con `data-[state=visible|hidden]:…`. Base UI no
// emite `data-state` nunca: NavigationMenu.Icon pone `data-popup-open` cuando
// su item está abierto y nada cuando no. Con las clases de Radix el indicador
// se veía siempre y no animaba. Se mide en Chrome con el CSS que Tailwind
// compila de verdad, como override-oscuro.test.tsx.
const CSS = `@import "tailwindcss";\n@import "tw-animate-css";`

let browser: Browser

beforeAll(async () => {
  browser = await puppeteer.launch({
    headless: "shell",
    args: process.env.CI ? ["--no-sandbox", "--disable-dev-shm-usage"] : [],
  })
}, 60_000)

afterAll(async () => {
  await browser?.close()
})

function Menu({ abierto }: { abierto: boolean }) {
  return (
    <NavigationMenu defaultValue={abierto ? "a" : null}>
      <NavigationMenuList>
        <NavigationMenuItem value="a">
          <NavigationMenuTrigger>
            Productos
            <NavigationMenuIndicator data-prueba="" />
          </NavigationMenuTrigger>
          <NavigationMenuContent>Contenido</NavigationMenuContent>
        </NavigationMenuItem>
      </NavigationMenuList>
    </NavigationMenu>
  )
}

async function medir(markup: string) {
  const clases = [...markup.matchAll(/class="([^"]*)"/g)].flatMap((m) =>
    m[1].split(/\s+/).filter(Boolean)
  )
  const compilado = await compile(CSS, { base: import.meta.dirname, onDependency: () => {} })
  const css = compilado.build(clases)
  const page = await browser.newPage()
  try {
    await page.setContent(
      `<!doctype html><html><head><style>${css}</style></head><body>${markup}</body></html>`
    )
    return await page.evaluate(() => {
      const el = document.querySelector("[data-prueba]")!
      const s = getComputedStyle(el)
      return { opacity: s.opacity, animation: s.animationName }
    })
  } finally {
    await page.close()
  }
}

describe("NavigationMenuIndicator", () => {
  it("abierto: el markup lleva data-popup-open y ningún data-state", () => {
    const markup = renderToStaticMarkup(<Menu abierto />)
    expect(markup).toMatch(/<span[^>]*\sdata-popup-open=""[^>]*data-prueba=""/)
    expect(markup).not.toContain("data-state")
  })

  it("abierto: anima la entrada (animation enter)", async () => {
    const m = await medir(renderToStaticMarkup(<Menu abierto />))
    expect(m.animation).toBe("enter")
  }, 30_000)

  it("cerrado: no se ve (opacity 0) ni anima", async () => {
    const markup = renderToStaticMarkup(<Menu abierto={false} />)
    expect(markup).not.toMatch(/<span[^>]*\sdata-popup-open=""[^>]*data-prueba=""/)
    const m = await medir(markup)
    expect(m.opacity).toBe("0")
    expect(m.animation).toBe("none")
  }, 30_000)
})
