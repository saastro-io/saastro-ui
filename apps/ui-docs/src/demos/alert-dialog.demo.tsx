'use client';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@ui-registry/alert-dialog';
import { Button } from '@ui-registry/button';

export function AlertDialogDemo() {
  return (
    <AlertDialog>
      <AlertDialogTrigger render={<Button variant="destructive">Anular póliza</Button>} />
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>¿Anular la ZM-10482?</AlertDialogTitle>
          <AlertDialogDescription>
            La cobertura termina hoy y el recibo de marzo no se emitirá. No se puede deshacer
            desde aquí.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Volver</AlertDialogCancel>
          <AlertDialogAction>Anular</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
