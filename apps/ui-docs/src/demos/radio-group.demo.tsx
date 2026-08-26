'use client';
import { RadioGroup, RadioGroupItem } from '@ui-registry/radio-group';
import { Label } from '@ui-registry/label';

export function RadioGroupDemo() {
  return (
    <RadioGroup defaultValue="mensual" className="space-y-3">
      {[['mensual','Pago mensual'],['anual','Pago anual (2 meses gratis)']].map(([v,l]) => (
        <div key={v} className="flex items-center gap-3">
          <RadioGroupItem value={v} id={v} />
          <Label htmlFor={v}>{l}</Label>
        </div>
      ))}
    </RadioGroup>
  );
}
