'use client';
import * as React from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@ui-registry/select';

const items = [
  { value: 'auto', label: 'Seguro de coche o moto' },
  { value: 'hogar', label: 'Seguro de hogar' },
  { value: 'otro', label: 'Otro seguro o consulta' },
];

export function SelectDemo() {
  const [value, setValue] = React.useState<string | null>(null);
  return (
    // `items` es obligatorio en Base UI: sin él el trigger pinta el value crudo.
    <Select value={value} onValueChange={setValue} items={items}>
      <SelectTrigger className="w-72"><SelectValue placeholder="Elige una opción" /></SelectTrigger>
      <SelectContent>
        {items.map((i) => <SelectItem key={i.value} value={i.value}>{i.label}</SelectItem>)}
      </SelectContent>
    </Select>
  );
}
