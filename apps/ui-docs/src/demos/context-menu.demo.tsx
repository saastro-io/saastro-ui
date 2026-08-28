'use client';
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuSeparator,
  ContextMenuShortcut,
  ContextMenuTrigger,
} from '@ui-registry/context-menu';
import { CopyIcon, PencilIcon, Trash2Icon } from 'lucide-react';

export function ContextMenuDemo() {
  return (
    <ContextMenu>
      <ContextMenuTrigger className="flex h-36 w-72 items-center justify-center rounded-xl border border-dashed text-sm text-muted-foreground select-none">
        Botón derecho aquí
      </ContextMenuTrigger>
      <ContextMenuContent className="min-w-44">
        <ContextMenuItem>
          <PencilIcon />
          Renombrar
          <ContextMenuShortcut>F2</ContextMenuShortcut>
        </ContextMenuItem>
        <ContextMenuItem>
          <CopyIcon />
          Duplicar
        </ContextMenuItem>
        <ContextMenuSeparator />
        <ContextMenuItem variant="destructive">
          <Trash2Icon />
          Borrar
        </ContextMenuItem>
      </ContextMenuContent>
    </ContextMenu>
  );
}
