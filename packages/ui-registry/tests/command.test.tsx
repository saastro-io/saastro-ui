import * as React from "react"
import { afterEach, describe, expect, it, vi } from "vitest"
import { cleanup, render, screen, waitFor } from "@testing-library/react"
import userEvent from "@testing-library/user-event"

import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"

afterEach(cleanup)

const OPTIONS = [
  { value: "madrid", label: "Madrid" },
  { value: "barcelona", label: "Barcelona" },
  { value: "valencia", label: "Valencia" },
]

// El mismo árbol que pinta el renderer de combobox de @saastro/forms
// (selectionRenderers.tsx): Command con shouldFilter, CommandInput con
// onValueChange, CommandItem con value + onSelect.
function Combo({
  shouldFilter = true,
  onSelect = () => {},
  onSearch,
  options = OPTIONS,
}: {
  shouldFilter?: boolean
  onSelect?: (v: string) => void
  onSearch?: (v: string) => void
  options?: typeof OPTIONS
}) {
  return (
    <Command shouldFilter={shouldFilter}>
      <CommandInput placeholder="Buscar…" onValueChange={onSearch} />
      <CommandList>
        <CommandEmpty>Sin resultados</CommandEmpty>
        <CommandGroup>
          {options.map((o) => (
            <CommandItem key={o.value} value={o.value} onSelect={onSelect}>
              {o.label}
            </CommandItem>
          ))}
        </CommandGroup>
      </CommandList>
    </Command>
  )
}

const itemNames = () =>
  screen.queryAllByRole("option").map((el) => el.textContent)

describe("Command · filtro", () => {
  it("filtra los items por la búsqueda", async () => {
    const user = userEvent.setup()
    render(<Combo />)
    expect(itemNames()).toEqual(["Madrid", "Barcelona", "Valencia"])

    await user.type(screen.getByPlaceholderText("Buscar…"), "bar")
    expect(itemNames()).toEqual(["Barcelona"])
    expect(screen.queryByText("Sin resultados")).toBeNull()
  })

  it("CommandEmpty sale solo cuando no casa nada", async () => {
    const user = userEvent.setup()
    render(<Combo />)
    expect(screen.queryByText("Sin resultados")).toBeNull()

    await user.type(screen.getByPlaceholderText("Buscar…"), "zzz")
    expect(itemNames()).toEqual([])
    expect(screen.getByText("Sin resultados")).toBeTruthy()
  })

  it("shouldFilter={false} pinta todos aunque haya búsqueda", async () => {
    const user = userEvent.setup()
    render(<Combo shouldFilter={false} />)

    await user.type(screen.getByPlaceholderText("Buscar…"), "zzz")
    expect(itemNames()).toEqual(["Madrid", "Barcelona", "Valencia"])
    expect(screen.queryByText("Sin resultados")).toBeNull()
  })

  it("shouldFilter={false} sin items: CommandEmpty sí sale", () => {
    render(<Combo shouldFilter={false} options={[]} />)
    expect(screen.getByText("Sin resultados")).toBeTruthy()
  })
})

describe("Command · CommandInput.onValueChange", () => {
  it("recibe lo tecleado y NO se llama al elegir un item", async () => {
    const user = userEvent.setup()
    const onSearch = vi.fn()
    const onSelect = vi.fn()
    render(<Combo shouldFilter={false} onSearch={onSearch} onSelect={onSelect} />)

    await user.type(screen.getByPlaceholderText("Buscar…"), "va")
    expect(onSearch).toHaveBeenLastCalledWith("va")
    const calls = onSearch.mock.calls.length

    await user.click(screen.getByText("Valencia"))
    expect(onSelect).toHaveBeenCalledWith("valencia")
    expect(onSearch).toHaveBeenCalledTimes(calls)
    expect((screen.getByPlaceholderText("Buscar…") as HTMLInputElement).value).toBe("va")
  })
})

describe("Command · onSelect", () => {
  it("click en un item llama a onSelect con su value tal cual", async () => {
    const user = userEvent.setup()
    const onSelect = vi.fn()
    render(<Combo onSelect={onSelect} options={[{ value: "Sevilla-ES", label: "Sevilla" }]} />)

    await user.click(screen.getByText("Sevilla"))
    expect(onSelect).toHaveBeenCalledExactlyOnceWith("Sevilla-ES")
  })

  it("ArrowDown + Enter elige el item resaltado", async () => {
    const user = userEvent.setup()
    const onSelect = vi.fn()
    render(<Combo onSelect={onSelect} />)

    await user.click(screen.getByPlaceholderText("Buscar…"))
    await user.keyboard("{ArrowDown}{Enter}")
    expect(onSelect).toHaveBeenCalledExactlyOnceWith("barcelona")
  })
})

// Así lo monta @saastro/forms: dentro del PopoverContent del registry.
function PopoverCombo({ onSelect }: { onSelect: (v: string) => void }) {
  const [open, setOpen] = React.useState(false)
  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger role="combobox">Elegir</PopoverTrigger>
      <PopoverContent className="p-0">
        <Combo
          onSelect={(v) => {
            onSelect(v)
            setOpen(false)
          }}
        />
      </PopoverContent>
    </Popover>
  )
}

describe("Command · dentro de Popover", () => {
  it("abrir, teclear, ArrowDown… Enter elige y cierra", async () => {
    const user = userEvent.setup()
    const onSelect = vi.fn()
    render(<PopoverCombo onSelect={onSelect} />)

    await user.click(screen.getByText("Elegir"))
    const input = await screen.findByPlaceholderText("Buscar…")
    await user.click(input)
    await user.type(input, "a")
    expect(itemNames()).toEqual(["Madrid", "Barcelona", "Valencia"])
    await user.type(input, "l")
    expect(itemNames()).toEqual(["Valencia"])
    await user.keyboard("{Enter}")

    expect(onSelect).toHaveBeenCalledExactlyOnceWith("valencia")
    await waitFor(() => expect(screen.queryByPlaceholderText("Buscar…")).toBeNull())
  })
})
