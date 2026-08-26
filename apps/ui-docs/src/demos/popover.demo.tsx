'use client';
import { Popover, PopoverContent, PopoverTrigger } from '@ui-registry/popover';
import { Button } from '@ui-registry/button';

export function PopoverDemo() {
  return (
    <Popover>
      <PopoverTrigger render={<Button variant="outline">Ver coberturas</Button>} />
      <PopoverContent className="w-72">
        <p className="text-sm">Daños propios, responsabilidad civil, asistencia 24h y vehículo de sustitución.</p>
      </PopoverContent>
    </Popover>
  );
}
