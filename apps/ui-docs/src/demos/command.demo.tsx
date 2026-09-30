'use client';
import * as React from 'react';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
  CommandShortcut,
} from '@ui-registry/command';
import { CarIcon, HomeIcon, HeartPulseIcon, SettingsIcon, UserIcon } from 'lucide-react';

export function CommandDemo() {
  const [elegido, setElegido] = React.useState<string | null>(null);
  return (
    <div className="flex w-80 flex-col gap-3">
      <Command className="rounded-lg border shadow-md">
        <CommandInput placeholder="Busca un seguro o una acción…" />
        <CommandList>
          <CommandEmpty>Sin resultados.</CommandEmpty>
          <CommandGroup heading="Seguros">
            <CommandItem value="coche" keywords={['moto', 'auto']} onSelect={setElegido}>
              <CarIcon />
              Coche o moto
            </CommandItem>
            <CommandItem value="hogar" onSelect={setElegido}>
              <HomeIcon />
              Hogar
            </CommandItem>
            <CommandItem value="salud" onSelect={setElegido}>
              <HeartPulseIcon />
              Salud
            </CommandItem>
          </CommandGroup>
          <CommandSeparator />
          <CommandGroup heading="Cuenta">
            <CommandItem value="perfil" onSelect={setElegido}>
              <UserIcon />
              Perfil
              <CommandShortcut>⌘P</CommandShortcut>
            </CommandItem>
            <CommandItem value="ajustes" onSelect={setElegido}>
              <SettingsIcon />
              Ajustes
              <CommandShortcut>⌘,</CommandShortcut>
            </CommandItem>
          </CommandGroup>
        </CommandList>
      </Command>
      <p className="text-sm text-muted-foreground">
        Elegido: <span className="font-medium text-foreground">{elegido ?? '—'}</span>
      </p>
    </div>
  );
}
