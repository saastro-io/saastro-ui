'use client';
import * as React from 'react';
import { Slider } from '@ui-registry/slider';

export function SliderDemo() {
  // Base UI con un solo thumb emite NÚMERO PLANO, no array.
  const [value, setValue] = React.useState<number | number[]>(35);
  return (
    <div className="w-full max-w-sm space-y-3">
      <div className="flex justify-between text-sm">
        <span>Capital asegurado</span>
        <span className="font-medium">{Array.isArray(value) ? value[0] : value}.000 €</span>
      </div>
      <Slider value={value} onValueChange={setValue} min={0} max={100} step={5} />
    </div>
  );
}
