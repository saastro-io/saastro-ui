'use client';
import { Checkbox } from '@ui-registry/checkbox';
import { Label } from '@ui-registry/label';

export function CheckboxDemo() {
  return (
    <div className="space-y-3">
      <div className="flex items-start gap-3">
        <Checkbox id="privacidad" defaultChecked />
        <Label htmlFor="privacidad">Acepto la política de privacidad</Label>
      </div>
      <div className="flex items-start gap-3">
        <Checkbox id="promos" />
        <Label htmlFor="promos">Quiero recibir ofertas</Label>
      </div>
    </div>
  );
}
