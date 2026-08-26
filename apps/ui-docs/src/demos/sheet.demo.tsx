'use client';
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from '@ui-registry/sheet';
import { Button } from '@ui-registry/button';

export function SheetDemo() {
  return (
    <Sheet>
      <SheetTrigger render={<Button variant="outline">Abrir panel</Button>} />
      <SheetContent side="right">
        <SheetHeader>
          <SheetTitle>Cuéntanos qué quieres proteger</SheetTitle>
          <SheetDescription>Te preparamos un estudio sin compromiso.</SheetDescription>
        </SheetHeader>
      </SheetContent>
    </Sheet>
  );
}
