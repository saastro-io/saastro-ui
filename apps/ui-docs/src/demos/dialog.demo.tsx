'use client';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger, DialogClose } from '@ui-registry/dialog';
import { Button } from '@ui-registry/button';

export function DialogDemo() {
  return (
    <Dialog>
      <DialogTrigger render={<Button variant="outline">Abrir diálogo</Button>} />
      <DialogContent>
        <DialogHeader>
          <DialogTitle>¿Confirmas la baja?</DialogTitle>
          <DialogDescription>Se cancelará al final del periodo. No se puede deshacer.</DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <DialogClose render={<Button variant="outline">Cancelar</Button>} />
          <DialogClose render={<Button variant="destructive">Dar de baja</Button>} />
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
