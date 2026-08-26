'use client';
import { Switch } from '@ui-registry/switch';
import { Label } from '@ui-registry/label';

export function SwitchDemo() {
  return (
    <div className="flex items-center gap-3">
      <Switch id="anual" defaultChecked />
      <Label htmlFor="anual">Facturación anual</Label>
    </div>
  );
}
